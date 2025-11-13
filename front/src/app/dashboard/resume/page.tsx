"use client"

import React, { useState } from "react"
import { useResumeStore } from "@/store/resume-store"
import { PersonalDataForm } from "@/components/resume/personal-data-form"
import { ExperiencesForm } from "@/components/resume/experiences-form"
import { ProjectsForm } from "@/components/resume/projects-form"
import { SkillsForm } from "@/components/resume/skills-form"
import { EducationForm } from "@/components/resume/education-form"
import { ResumePreview } from "@/components/resume/resume-preview"
import { GenerateResumeDialog } from "@/components/resume/generate-resume-dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Save, Trash2 } from "lucide-react"
import { toast } from "sonner"
import AuthGuard from "@/components/auth-guard"
import { ExportResumeDialog } from "@/components/resume/export-resume-dialog"
import { getCfAuthCookie } from "@/utils/cookie"

export default function ResumePage() {
  const resume = useResumeStore((state) => state.resume)
  const resetResume = useResumeStore((state) => state.resetResume)
  const [activeTab, setActiveTab] = useState("personal")
  const [isSaving, setIsSaving] = useState(false)

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
    console.log("💾 [Resume Page] Starting save process with resume:", resume)
    try {
      const token = getCfAuthCookie()
      const title = `${resume.personal_data?.firstName || ""} ${resume.personal_data?.lastName || ""}`.trim() || "Untitled Resume"
      console.log("📤 [Resume Page] Sending save request with title:", title)
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
      console.log("✅ [Resume Page] Save response received:", json)
      if (json?.success) {
        console.log("🎉 [Resume Page] Resume saved successfully!")
        toast.success("Resume saved successfully!")
      } else {
        throw new Error(json?.error || 'Failed to save resume')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save resume"
      console.error("❌ [Resume Page] Save error:", errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  function handleClearResume() {
    if (confirm("Are you sure you want to clear all resume data? This cannot be undone.")) {
      resetResume()
      toast.success("Resume cleared")
    }
  }

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
            onClick={handleSaveResume}
            disabled={!resume || isSaving}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <ExportResumeDialog />
          <Button
            variant="destructive"
            onClick={handleClearResume}
            disabled={!resume}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>

        {/* Main Layout - Two Column */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
          {/* Left Panel - Forms (70%) */}
          <div className="lg:col-span-2 overflow-y-auto">
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

          {/* Right Panel - Preview (30%) */}
          <div className="lg:col-span-1 border border-input rounded-lg overflow-hidden bg-card">
            <div className="h-full flex flex-col">
              <div className="border-b border-input px-4 py-3 bg-muted/50 sticky top-0">
                <h2 className="font-semibold text-sm">Resume Preview</h2>
              </div>
              <ResumePreview data={resume} />
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
