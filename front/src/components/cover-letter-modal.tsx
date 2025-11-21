"use client"

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useResumeStore } from '@/store/resume-store'
import { getCfAuthCookie } from '@/utils/cookie'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'
import { FileDown, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

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

            const response = await fetch('https://resume.bhaikaamdo.com/api/v1/getCoverletter', {
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

    const handleDownloadDocx = async () => {
        try {
            const { asBlob } = await import('html-to-docx')
            const { saveAs } = await import('file-saver')

            const blob = await asBlob(content)
            saveAs(blob, 'cover-letter.docx')
            toast.success("Downloaded as DOCX")
        } catch (error) {
            console.error("Error downloading DOCX:", error)
            toast.error("Failed to download DOCX")
        }
    }

    const handleDownloadPdf = async () => {
        try {
            const html2canvas = (await import('html2canvas')).default
            const jsPDF = (await import('jspdf')).default

            // Create a temporary element to render the content
            const element = document.createElement('div')
            element.innerHTML = content
            element.style.width = '800px'
            element.style.padding = '40px'
            element.style.background = 'white'
            element.style.color = 'black'
            document.body.appendChild(element)

            const canvas = await html2canvas(element)
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

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
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
                            <ReactQuill
                                theme="snow"
                                value={content}
                                onChange={setContent}
                                className="h-full"
                                modules={{
                                    toolbar: [
                                        [{ 'header': [1, 2, false] }],
                                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                                        ['link', 'image'],
                                        ['clean']
                                    ],
                                }}
                            />
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button variant="outline" onClick={handleDownloadDocx} disabled={loading || !content}>
                        <FileDown className="mr-2 h-4 w-4" />
                        Download DOCX
                    </Button>
                    <Button onClick={handleDownloadPdf} disabled={loading || !content}>
                        <FileDown className="mr-2 h-4 w-4" />
                        Download PDF
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
