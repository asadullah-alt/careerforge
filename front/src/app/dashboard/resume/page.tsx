"use client"

import React, { useState, useEffect, useCallback } from "react"
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
    let mounted = true
    let url: string | null = null
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    async function buildPdf() {
      if (!resume) return
      try {
        const mod = await import('@/lib/resume-pdf')
        const blob = await mod.generateResumePDF(resume, pdfStyles, template)
        url = URL.createObjectURL(blob)
        if (mounted) setPdfUrl(url)
      } catch (err) {
        console.error('PDF generation failed', err)
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
      const title = `${resume.personal_data?.firstName || ""} ${resume.personal_data?.lastName || ""}`.trim() || "Untitled Resume"
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
            <div className="h-full flex flex-col">
              <PdfViewer 
                blobUrl={pdfUrl} 
                data={resume}
                currentTemplate={template}
                currentStyles={pdfStyles}
                onTemplateChange={setTemplate}
                onStylesChange={setPdfStyles}
              />
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
