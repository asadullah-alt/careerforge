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
import { Download, FileJson } from "lucide-react"
import { toast } from "sonner"
import { downloadResumeAsHTML, downloadResumeAsJSON } from "@/lib/resume-pdf"

interface ExportResumeDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ExportResumeDialog({ open: controlledOpen, onOpenChange }: ExportResumeDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const resume = useResumeStore((state) => state.resume)

  const openState = controlledOpen ?? isOpen
  const setOpenState = onOpenChange ?? setIsOpen

  function handleExportHTML() {
    if (!resume) {
      toast.error("No resume data to export")
      return
    }

    try {
      downloadResumeAsHTML(resume)
      toast.success("Resume exported as HTML! You can print it to PDF using your browser.")
      setOpenState(false)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to export resume"
      toast.error(errorMessage)
    }
  }

  function handleExportJSON() {
    if (!resume) {
      toast.error("No resume data to export")
      return
    }

    try {
      downloadResumeAsJSON(resume)
      toast.success("Resume exported as JSON")
      setOpenState(false)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to export resume"
      toast.error(errorMessage)
    }
  }

  return (
    <Dialog open={openState} onOpenChange={setOpenState}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={!resume}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Resume</DialogTitle>
          <DialogDescription>
            Choose a format to export your resume
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-3 py-4">
          <Button
            variant="outline"
            className="justify-start h-auto py-3"
            onClick={handleExportHTML}
          >
            <div className="flex flex-col text-left">
              <span className="font-semibold">HTML (Printable)</span>
              <span className="text-xs text-muted-foreground">
                Download as HTML file and print to PDF using your browser
              </span>
            </div>
          </Button>

          <Button
            variant="outline"
            className="justify-start h-auto py-3"
            onClick={handleExportJSON}
          >
            <FileJson className="mr-2 h-4 w-4" />
            <div className="flex flex-col text-left">
              <span className="font-semibold">JSON</span>
              <span className="text-xs text-muted-foreground">
                Export as JSON for backup or import into other tools
              </span>
            </div>
          </Button>

          <Button
            variant="outline"
            className="justify-start h-auto py-3 opacity-50 cursor-not-allowed"
            disabled
          >
            <Download className="mr-2 h-4 w-4" />
            <div className="flex flex-col text-left">
              <span className="font-semibold">PDF (Coming Soon)</span>
              <span className="text-xs text-muted-foreground">
                Install @react-pdf/renderer to enable PDF export
              </span>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
