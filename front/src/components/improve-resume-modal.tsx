"use client"

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Copy, FileDown, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { StructuredResume } from '@/lib/schemas/resume'

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

    // Parse markdown into StructuredResume format
    const parseMarkdownToResume = (markdown: string): StructuredResume => {
        const lines = markdown.split('\n')
        const resume: StructuredResume = {
            personal_data: {
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
                linkedin: '',
                portfolio: '',
                location: { city: '', country: '' }
            },
            experiences: [],
            projects: [],
            skills: [],
            research_work: [],
            achievements: [],
            education: [],
            extracted_keywords: []
        }

        let currentSection = ''
        let currentExperience: any = null
        let currentEducation: any = null
        let currentProject: any = null

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim()

            // Detect sections
            if (line.startsWith('# ')) {
                const name = line.replace('# ', '').trim()
                const nameParts = name.split(' ')
                resume.personal_data.first_name = nameParts[0] || ''
                resume.personal_data.last_name = nameParts.slice(1).join(' ') || ''
                continue
            }

            if (line.startsWith('## ')) {
                currentSection = line.replace('## ', '').toLowerCase()
                continue
            }

            // Parse contact info
            if (line.includes('@') && line.includes('.')) {
                const emailMatch = line.match(/[\w.-]+@[\w.-]+\.\w+/)
                if (emailMatch) resume.personal_data.email = emailMatch[0]
            }
            if (line.match(/\+?\d[\d\s-()]+/)) {
                const phoneMatch = line.match(/\+?\d[\d\s-()]+/)
                if (phoneMatch) resume.personal_data.phone = phoneMatch[0].trim()
            }
            if (line.includes('linkedin.com')) {
                resume.personal_data.linkedin = line.match(/https?:\/\/[^\s]+/)?.[0] || ''
            }

            // Parse sections
            if (currentSection.includes('experience') || currentSection.includes('work')) {
                if (line.startsWith('### ') || line.startsWith('**')) {
                    if (currentExperience) {
                        resume.experiences.push(currentExperience)
                    }
                    currentExperience = {
                        job_title: line.replace(/^###\s*|\*\*/g, '').trim(),
                        company: '',
                        location: '',
                        start_date: '',
                        end_date: '',
                        description: [],
                        technologies_used: []
                    }
                } else if (currentExperience) {
                    if (line.includes('|') || line.match(/\d{4}/)) {
                        const parts = line.split('|').map(p => p.trim())
                        if (parts.length >= 2) {
                            currentExperience.company = parts[0].replace(/\*\*/g, '')
                            const datePart = parts[parts.length - 1]
                            const dates = datePart.split('-').map(d => d.trim())
                            currentExperience.start_date = dates[0] || ''
                            currentExperience.end_date = dates[1] || dates[0] || ''
                        }
                    } else if (line.startsWith('- ') || line.startsWith('* ')) {
                        currentExperience.description.push(line.replace(/^[-*]\s*/, ''))
                    }
                }
            }

            if (currentSection.includes('education')) {
                if (line.startsWith('### ') || line.startsWith('**')) {
                    if (currentEducation) {
                        resume.education.push(currentEducation)
                    }
                    currentEducation = {
                        degree: line.replace(/^###\s*|\*\*/g, '').trim(),
                        institution: '',
                        field_of_study: '',
                        start_date: '',
                        end_date: '',
                        grade: '',
                        description: ''
                    }
                } else if (currentEducation) {
                    if (line.includes('|')) {
                        const parts = line.split('|').map(p => p.trim())
                        currentEducation.institution = parts[0].replace(/\*\*/g, '')
                        if (parts.length > 1) {
                            const datePart = parts[parts.length - 1]
                            currentEducation.end_date = datePart
                        }
                    }
                }
            }

            if (currentSection.includes('skill')) {
                if (line.startsWith('- ') || line.startsWith('* ')) {
                    const skillName = line.replace(/^[-*]\s*/, '').replace(/\*\*/g, '').trim()
                    if (skillName) {
                        resume.skills.push({ skill_name: skillName, category: 'Technical' })
                    }
                }
            }

            if (currentSection.includes('project')) {
                if (line.startsWith('### ') || line.startsWith('**')) {
                    if (currentProject) {
                        resume.projects.push(currentProject)
                    }
                    currentProject = {
                        project_name: line.replace(/^###\s*|\*\*/g, '').trim(),
                        description: '',
                        technologies_used: [],
                        link: '',
                        start_date: '',
                        end_date: ''
                    }
                } else if (currentProject && line && !line.startsWith('#')) {
                    if (!currentProject.description) {
                        currentProject.description = line
                    }
                }
            }
        }

        // Push last items
        if (currentExperience) resume.experiences.push(currentExperience)
        if (currentEducation) resume.education.push(currentEducation)
        if (currentProject) resume.projects.push(currentProject)

        return resume
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

            // Parse markdown to structured resume
            const resumeData = parseMarkdownToResume(resumeMarkdown)

            // Use the existing PDF generator with Modern template
            const { generateResumePDF } = await import('@/lib/resume-pdf')
            const blob = await generateResumePDF(resumeData, {}, 'modern')

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
