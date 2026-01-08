"use client"

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Copy, FileDown, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Document, Page, Text, View, pdf } from '@react-pdf/renderer'

interface ImproveResumeModalProps {
    isOpen: boolean
    onClose: () => void
    resumeMarkdown?: string
}

export function ImproveResumeModal({ isOpen, onClose, resumeMarkdown }: ImproveResumeModalProps) {
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)

    // Convert markdown to formatted HTML for display
    const renderMarkdownAsHTML = (markdown: string) => {
        let html = markdown
            // Headers
            .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
            // Bold
            .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold">$1</strong>')
            // Italic
            .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
            // Lists
            .replace(/^\- (.*$)/gim, '<li class="ml-4">$1</li>')
            .replace(/^\* (.*$)/gim, '<li class="ml-4">$1</li>')
            // Line breaks
            .replace(/\n\n/g, '</p><p class="mb-2">')
            .replace(/\n/g, '<br/>')

        html = '<p class="mb-2">' + html + '</p>'
        html = html.replace(/(<li.*?<\/li>)/gim, '<ul class="list-disc ml-6 mb-4">$1</ul>')

        return html
    }

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

    const handleDownloadPDF = async () => {
        if (!resumeMarkdown) return

        try {
            setIsGeneratingPdf(true)

            // Parse markdown into simple sections
            const lines = resumeMarkdown.split('\n')
            const sections: { type: string; content: string }[] = []

            for (const line of lines) {
                if (line.startsWith('# ')) {
                    sections.push({ type: 'h1', content: line.replace(/^# /, '') })
                } else if (line.startsWith('## ')) {
                    sections.push({ type: 'h2', content: line.replace(/^## /, '') })
                } else if (line.startsWith('### ')) {
                    sections.push({ type: 'h3', content: line.replace(/^### /, '') })
                } else if (line.startsWith('- ') || line.startsWith('* ')) {
                    sections.push({ type: 'li', content: line.replace(/^[*-] /, '• ') })
                } else if (line.trim()) {
                    // Remove markdown formatting for plain text
                    const cleanContent = line
                        .replace(/\*\*(.*?)\*\*/g, '$1')
                        .replace(/\*(.*?)\*/g, '$1')
                    sections.push({ type: 'text', content: cleanContent })
                }
            }

            // Create PDF document
            const MyDocument = () => (
                <Document>
                    <Page size="A4" style={{ padding: 40, fontSize: 11, fontFamily: 'Helvetica' }}>
                        {sections.map((section, index) => {
                            if (section.type === 'h1') {
                                return (
                                    <Text key={index} style={{ fontSize: 20, fontWeight: 'bold', marginTop: 16, marginBottom: 8 }}>
                                        {section.content}
                                    </Text>
                                )
                            } else if (section.type === 'h2') {
                                return (
                                    <Text key={index} style={{ fontSize: 16, fontWeight: 'bold', marginTop: 12, marginBottom: 6 }}>
                                        {section.content}
                                    </Text>
                                )
                            } else if (section.type === 'h3') {
                                return (
                                    <Text key={index} style={{ fontSize: 13, fontWeight: 'bold', marginTop: 8, marginBottom: 4 }}>
                                        {section.content}
                                    </Text>
                                )
                            } else if (section.type === 'li') {
                                return (
                                    <Text key={index} style={{ fontSize: 10, marginBottom: 3, marginLeft: 12 }}>
                                        {section.content}
                                    </Text>
                                )
                            } else {
                                return (
                                    <Text key={index} style={{ fontSize: 10, marginBottom: 4 }}>
                                        {section.content}
                                    </Text>
                                )
                            }
                        })}
                    </Page>
                </Document>
            )

            const asPdf = pdf(<MyDocument />)
            const blob = await asPdf.toBlob()

            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'improved-resume.pdf'
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)

            toast.success("Downloaded as PDF")
        } catch (error) {
            console.error("Error downloading PDF:", error)
            toast.error("Failed to download PDF. Please try downloading as Markdown instead.")
        } finally {
            setIsGeneratingPdf(false)
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
                        <div className="flex-1 overflow-auto border rounded-md bg-white dark:bg-slate-950 p-8">
                            <div
                                className="prose prose-sm dark:prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: renderMarkdownAsHTML(resumeMarkdown) }}
                            />
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
                        variant="secondary"
                        onClick={handleDownloadMarkdown}
                        disabled={!resumeMarkdown}
                    >
                        <FileDown className="mr-2 h-4 w-4" />
                        Download Markdown
                    </Button>
                    <Button
                        onClick={handleDownloadPDF}
                        disabled={!resumeMarkdown || isGeneratingPdf}
                    >
                        {isGeneratingPdf ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating PDF...
                            </>
                        ) : (
                            <>
                                <FileDown className="mr-2 h-4 w-4" />
                                Download PDF
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
