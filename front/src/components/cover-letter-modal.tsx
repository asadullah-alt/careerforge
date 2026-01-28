"use client"

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useResumeStore } from '@/store/resume-store'
import { getCfAuthCookie } from '@/utils/cookie'
import { QuillEditor } from './quill-editor'
import { FileDown, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface CoverLetterModalProps {
    isOpen: boolean
    onClose: () => void
    jobId: string
}

export function CoverLetterModal({ isOpen, onClose, jobId }: CoverLetterModalProps) {
    const { selectedResumeId } = useResumeStore()
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)
    const [generating, setGenerating] = useState(false)

    useEffect(() => {
        if (isOpen && selectedResumeId) {
            generateCoverLetter()
        }
    }, [isOpen, selectedResumeId])

    const generateCoverLetter = async () => {
        if (!selectedResumeId) {
            toast.error("Please select a resume first")
            return
        }

        try {
            setLoading(true)
            setGenerating(true)
            const token = getCfAuthCookie()

            const response = await fetch('https://resume.bhaikaamdo.com/api/v1/cover-letters/getCoverletter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    job_id: jobId,
                    resume_id: selectedResumeId,
                    token: token
                })
            })

            const data = await response.json()

            if (data.cover_letter) {
                setContent(data.cover_letter)
            } else {
                toast.error("Failed to generate cover letter")
            }
        } catch (error) {
            console.error("Error generating cover letter:", error)
            toast.error("An error occurred while generating the cover letter")
        } finally {
            setLoading(false)
            setGenerating(false)
        }
    }



    const handleDownloadPdf = async () => {
        try {
            const html2canvas = (await import('html2canvas')).default
            const jsPDF = (await import('jspdf')).default

            // Create a temporary element to render the content
            const element = document.createElement('div')
            element.innerHTML = content
            element.className = 'canvas-capture' // Add a class for scoped styling if needed
            element.style.width = '800px'
            element.style.padding = '40px'
            element.style.background = 'white'
            element.style.color = 'black'
            element.style.position = 'absolute'
            element.style.left = '-9999px'
            element.style.top = '0'

            // Critical fix: override modern color functions that html2canvas doesn't support
            element.style.setProperty('--background', '255 255 255')
            element.style.setProperty('--foreground', '0 0 0')
            element.style.setProperty('color-scheme', 'light')

            document.body.appendChild(element)

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff'
            })
            const imgData = canvas.toDataURL('image/png')

            const pdf = new jsPDF('p', 'mm', 'a4')
            const pdfWidth = pdf.internal.pageSize.getWidth()
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
            pdf.save('cover-letter.pdf')

            document.body.removeChild(element)
            toast.success("Downloaded as PDF")
        } catch (error) {
            console.error("Error downloading PDF:", error)
            toast.error("Failed to download PDF")
        }
    }

    const handleDownloadDocx = async () => {
        try {
            const HTMLToDOCX = (await import('html-to-docx')).default

            // Prepare HTML content for DOCX
            // Wrap in basic HTML structure for better conversion
            const fullHtml = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: 'Arial', sans-serif; line-height: 1.6; }
                    </style>
                </head>
                <body>
                    ${content}
                </body>
                </html>
            `

            const fileBuffer = await HTMLToDOCX(fullHtml, null, {
                table: { row: { canSplit: true } },
                footer: true,
                pageNumber: true,
            })

            const url = window.URL.createObjectURL(fileBuffer)
            const link = document.createElement('a')
            link.href = url
            link.download = 'cover-letter.docx'
            link.click()
            window.URL.revokeObjectURL(url)

            toast.success("Downloaded as DOCX")
        } catch (error) {
            console.error("Error downloading DOCX:", error)
            toast.error("Failed to download DOCX")
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl h-[95vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Cover Letter Generator</DialogTitle>
                    <DialogDescription>
                        Review and edit your AI-generated cover letter below.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-hidden flex flex-col gap-4">
                    {loading ? (
                        <div className="flex-1 flex items-center justify-center flex-col gap-4">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-muted-foreground">Generating your cover letter...</p>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-auto border rounded-md">
                            <QuillEditor
                                value={content}
                                onChange={setContent}
                                className="h-full"
                            />
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleDownloadPdf} disabled={loading || !content} variant="secondary">
                        <FileDown className="mr-2 h-4 w-4" />
                        Download PDF
                    </Button>
                    <Button onClick={handleDownloadDocx} disabled={loading || !content}>
                        <FileDown className="mr-2 h-4 w-4" />
                        Download DOCX
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
