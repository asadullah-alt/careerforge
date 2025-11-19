"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import { useResumeStore } from "@/store/resume-store"
import { PersonalDataForm } from "@/components/resume/personal-data-form"
import { ExperiencesForm } from "@/components/resume/experiences-form"
import { ProjectsForm } from "@/components/resume/projects-form"
import { SkillsForm } from "@/components/resume/skills-form"
import { EducationForm } from "@/components/resume/education-form"
import { GenerateResumeDialog } from "@/components/resume/generate-resume-dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Save, Trash2 } from "lucide-react"
import { toast } from "sonner"
import AuthGuard from "@/components/auth-guard"
import { ExportResumeDialog } from "@/components/resume/export-resume-dialog"
import { getCfAuthCookie } from "@/utils/cookie"
import PdfViewer from "@/components/resume/pdf-viewer"
import type { PdfStyles } from "@/lib/resume-pdf"

export default function ResumePage() {
  const resume = useResumeStore((state) => state.resume)
  const resetResume = useResumeStore((state) => state.resetResume)
  const [activeTab, setActiveTab] = useState("personal")
  const [isSaving, setIsSaving] = useState(false)
  const [template, setTemplate] = useState('classic')
  const [pdfStyles, setPdfStyles] = useState<Partial<PdfStyles>>({})
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isLoadingPdfWorker, setIsLoadingPdfWorker] = useState(false)

  // Generate PDF when resume, template, or styles change
  useEffect(() => {
    // Worker ref for offloading network + (optionally) client generation
    // We create a blob-based worker that will call the server API to generate a PDF
    // and return the ArrayBuffer back to the main thread as a transferable.
    const workerRef = { current: null as Worker | null }
    const workerCode = `self.onmessage = async (e) => {
  const { id, resume, pdfStyles, template } = e.data || {}
  try {
    const url = self.location.origin + '/api/resume/generate-pdf'
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resume, styles: pdfStyles, template }),
    })
    if (!resp.ok) {
      self.postMessage({ id, success: false, error: 'Server returned ' + resp.status })
      return
    }
    const ab = await resp.arrayBuffer()
    // Transfer the ArrayBuffer back to the main thread to avoid copy
    self.postMessage({ id, success: true, buffer: ab }, [ab])
  } catch (err) {
    self.postMessage({ id, success: false, error: String(err) })
  }
}`

    const workerBlob = new Blob([workerCode], { type: 'application/javascript' })
    const workerUrl = URL.createObjectURL(workerBlob)
    workerRef.current = new Worker(workerUrl)
    // clean up the temporary object URL when effect tears down
    const cleanupWorker = () => {
      if (workerRef.current) workerRef.current.terminate()
      URL.revokeObjectURL(workerUrl)
      workerRef.current = null
    }
    let mounted = true
    let url: string | null = null
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    // message id generator for worker replies
    const nextIdRef = { current: 1 }
    // expose worker for buildPdf usage via closure
    const worker = workerRef.current

    async function buildPdf() {
      if (!resume) return
      // indicate worker/pdf generation is in progress
      setIsLoadingPdfWorker(true)
      // Prefer using the worker which calls the server API and returns an ArrayBuffer
      if (worker) {
        const id = nextIdRef.current++
        try {
          const result: { id?: number; success: boolean; buffer?: ArrayBuffer; error?: string } = await new Promise((resolve) => {
            const onMessage = (ev: MessageEvent) => {
              const data = ev.data || {}
              if (data.id !== id) return
              worker.removeEventListener('message', onMessage)
              resolve(data)
            }
            worker.addEventListener('message', onMessage)
            worker.postMessage({ id, resume, pdfStyles, template })
          })

          if (result.success && result.buffer) {
            const blob = new Blob([result.buffer], { type: 'application/pdf' })
            url = URL.createObjectURL(blob)
            if (mounted) setPdfUrl(url)
            setIsLoadingPdfWorker(false)
            return
          }
          throw new Error(result.error || 'Worker failed to generate PDF')
        } catch (err) {
          console.error('PDF generation (worker) failed', err)
          // fallback to client-side generation below
          setIsLoadingPdfWorker(false)
        }
      }

      // Fallback: client-side generation (may be CPU intensive)
      try {
        setIsLoadingPdfWorker(true)
        const mod = await import('@/lib/resume-pdf')
        const blob = await mod.generateResumePDF(resume, pdfStyles, template)
        url = URL.createObjectURL(blob)
        if (mounted) setPdfUrl(url)
        setIsLoadingPdfWorker(false)
      } catch (err) {
        console.error('PDF generation failed', err)
        setIsLoadingPdfWorker(false)
        if (mounted) setPdfUrl(null)
      }
    }

    if (resume) {
      // Debounce PDF generation to prevent double triggers
      timeoutId = setTimeout(() => {
        if (mounted) {
          buildPdf()
        }
      }, 100)
    }

    return () => {
      mounted = false
      if (timeoutId) clearTimeout(timeoutId)
      if (url) {
        URL.revokeObjectURL(url)
      }
      setPdfUrl(null)
      // terminate worker and revoke its blob URL
      try {
        cleanupWorker()
      } catch {
        /* ignore */
      }
      // ensure loading state is cleared
      setIsLoadingPdfWorker(false)
    }
  }, [resume, template, pdfStyles])

  // Ensure the page reflects any resume loaded into the store (e.g. via initializeResume)
  React.useEffect(() => {
    console.log("Resume effect triggered. Resume state:", resume)
    if (resume) {
      console.log("✅ Resume detected in store:", resume)
      // Reset to the personal tab when a resume is loaded
      setActiveTab("personal")
      // Scroll to top so the user sees the form
      if (typeof window !== "undefined") window.scrollTo(0, 0)
    } else {
      console.log("❌ Resume is null or undefined in store")
    }
  }, [resume])

  async function handleSaveResume() {
    if (!resume) return

    setIsSaving(true)
    try {
      const token = getCfAuthCookie()
      const title = `${resume.personal_data?.first_name || ""} ${resume.personal_data?.last_name || ""}`.trim() || "Untitled Resume"
      const response = await fetch("/api/resume/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: resume, title, token }),
      })

      if (!response.ok) {
        throw new Error("Failed to save resume")
      }

      const json = await response.json()
      if (json?.success) {
        toast.success("Resume saved successfully!")
      } else {
        throw new Error(json?.error || 'Failed to save resume')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save resume"
      toast.error(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  const memoizedHandleSaveResume = useCallback(handleSaveResume, [resume])

  function handleClearResume() {
    if (confirm("Are you sure you want to clear all resume data? This cannot be undone.")) {
      resetResume()
      toast.success("Resume cleared")
    }
  }

  const memoizedHandleClearResume = useCallback(handleClearResume, [resetResume])

  return (
    <AuthGuard>
      <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Resume Builder</h1>
          <p className="text-muted-foreground">
            Create, edit, and export your professional resume with AI-powered parsing
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap gap-2">
          <GenerateResumeDialog />
          <Button
            variant="outline"
            onClick={memoizedHandleSaveResume}
            disabled={!resume || isSaving}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <ExportResumeDialog />
          <Button
            variant="outline"
            onClick={memoizedHandleClearResume}
            disabled={!resume}
            className="text-gray-600 hover:bg-gray-100"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>

        {/* Main Layout - Two Column (50/50 on large screens) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
          {/* Left Panel - Forms (70%) */}
          <div className="lg:col-span-1 overflow-y-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-4">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
              </TabsList>

              <div className="space-y-6">
                <TabsContent value="personal" className="space-y-6">
                  <PersonalDataForm />
                </TabsContent>

                <TabsContent value="experience" className="space-y-6">
                  <ExperiencesForm />
                </TabsContent>

                <TabsContent value="projects" className="space-y-6">
                  <ProjectsForm />
                </TabsContent>

                <TabsContent value="skills" className="space-y-6">
                  <SkillsForm />
                </TabsContent>

                <TabsContent value="education" className="space-y-6">
                  <EducationForm />
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Right Panel - PDF Viewer */}
          <div className="lg:col-span-1 border border-input rounded-lg overflow-hidden bg-card">
            <div className="h-full flex flex-col relative">
              <PdfViewer 
                blobUrl={pdfUrl} 
                data={resume}
                currentTemplate={template}
                currentStyles={pdfStyles}
                onTemplateChange={setTemplate}
                onStylesChange={setPdfStyles}
              />
              {isLoadingPdfWorker && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 dark:bg-black/50">
                  <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
                    <div className="text-sm text-muted-foreground">Generating PDF preview…</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
