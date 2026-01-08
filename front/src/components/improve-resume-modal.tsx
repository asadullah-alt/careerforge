"use client"

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Copy, FileDown, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface ImproveResumeModalProps {
    isOpen: boolean
    onClose: () => void
    resumeMarkdown?: string
}

export function ImproveResumeModal({ isOpen, onClose, resumeMarkdown }: ImproveResumeModalProps) {
    const handleCopyToClipboard = async () => {
        if (!resumeMarkdown) return

        try {
            await navigator.clipboard.writeText(resumeMarkdown)
            toast.success("Copied to clipboard!")
        } catch (error) {
            console.error("Error copying to clipboard:", error)
            toast.error("Failed to copy to clipboard")
        }
    }

    const handleDownloadMarkdown = () => {
        if (!resumeMarkdown) return

        try {
            const blob = new Blob([resumeMarkdown], { type: 'text/markdown' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'improved-resume.md'
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
            toast.success("Downloaded as Markdown")
        } catch (error) {
            console.error("Error downloading markdown:", error)
            toast.error("Failed to download markdown")
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Improved Resume</DialogTitle>
                    <DialogDescription>
                        Review your improved resume with AI-suggested enhancements.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-hidden flex flex-col gap-4">
                    {!resumeMarkdown ? (
                        <div className="flex-1 flex items-center justify-center flex-col gap-4">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-muted-foreground">Loading improved resume...</p>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-auto border rounded-md bg-muted/20">
                            <pre className="whitespace-pre-wrap font-mono text-sm p-6 leading-relaxed">
                                {resumeMarkdown}
                            </pre>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={onClose}>Close</Button>
                    <Button
                        variant="secondary"
                        onClick={handleCopyToClipboard}
                        disabled={!resumeMarkdown}
                    >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy to Clipboard
                    </Button>
                    <Button
                        onClick={handleDownloadMarkdown}
                        disabled={!resumeMarkdown}
                    >
                        <FileDown className="mr-2 h-4 w-4" />
                        Download Markdown
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
