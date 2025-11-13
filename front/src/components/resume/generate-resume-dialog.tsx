"use client"

import React, { useState } from "react"
import { useResumeStore } from "@/store/resume-store"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface GenerateResumeDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function GenerateResumeDialog({ open: controlledOpen, onOpenChange }: GenerateResumeDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [resumeText, setResumeText] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const initializeResume = useResumeStore((state) => state.initializeResume)
  const setError = useResumeStore((state) => state.setError)

  const open = controlledOpen ?? isOpen
  const setOpen = onOpenChange ?? setIsOpen

  async function handleGenerate() {
    if (!resumeText.trim()) {
      toast.error("Please enter resume text")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/resume/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: resumeText,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate resume")
      }

      const data = await response.json()

      if (data.success) {
        initializeResume(data.data)
        setResumeText("")
        setOpen(false)
        toast.success("Resume generated successfully!")
      } else {
        throw new Error(data.error || "Failed to generate resume")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          Generate with AI
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>AI Resume Generator</DialogTitle>
          <DialogDescription>
            Paste your resume text or description below, and our AI will parse and structure it for you.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Resume Text</label>
            <Textarea
              placeholder="Paste your resume text here. Include your experience, education, skills, and any other relevant information..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="min-h-[300px] mt-2"
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setResumeText("")
                setOpen(false)
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleGenerate} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Generating..." : "Generate Resume"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
