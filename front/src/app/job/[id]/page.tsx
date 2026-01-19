"use client"

import React, { use } from 'react'
import { useRouter } from 'next/navigation'
import { IconArrowLeft, IconChevronDown, IconLogin, IconUserPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separatorInteractive'
import { Badge } from '@/components/ui/badgeTable'
import dynamic from "next/dynamic";
import { Link, Share2 } from "lucide-react";

import { ExtendedJob } from '@/store/job-store'

export default function PublicJobPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
    const params = use(paramsPromise)
    const router = useRouter()
    const [jobData, setJobData] = React.useState<ExtendedJob | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [isCompanyExpanded, setIsCompanyExpanded] = React.useState(false)
    const [copied, setCopied] = React.useState(false)

    React.useEffect(() => {
        if (copied) {
            const timer = setTimeout(() => setCopied(false), 2000)
            return () => clearTimeout(timer)
        }
    }, [copied])

    const handleShareClick = async () => {
        if (!jobData) return
        const url = (jobData.job_url ?? jobData.jobUrl ?? jobData.src ?? jobData.applicationInfo?.applyLink) as string | undefined
        if (!url) return

        try {
            if (navigator.share) {
                await navigator.share({
                    title: jobData.jobPosition || jobData.jobTitle || 'Job',
                    url,
                })
                return
            }

            if (navigator.clipboard) {
                await navigator.clipboard.writeText(url)
                setCopied(true)
                return
            }

            window.open(url, '_blank', 'noopener,noreferrer')
        } catch {
            try {
                if (navigator.clipboard) {
                    await navigator.clipboard.writeText(url)
                    setCopied(true)
                }
            } catch { }
        }
    }

    React.useEffect(() => {
        let mounted = true

        const load = async () => {
            try {
                const response = await fetch(`https://resume.bhaikaamdo.com/api/v1/jobs/openjob?job_id=${params.id}`)
                const data = await response.json()

                if (!mounted) return

                if (data.data && data.data.processed_job) {
                    const processedJob = data.data.processed_job
                    const fetched: ExtendedJob = {
                        ...processedJob,
                        job_id: String(params.id),
                        id: processedJob.id || params.id
                    }
                    setJobData(fetched)
                }
            } catch (error) {
                console.error('Error fetching job data:', error)
            } finally {
                if (mounted) setLoading(false)
            }
        }

        void load()

        return () => {
            mounted = false
        }
    }, [params.id])

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!jobData) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
                    <Button onClick={() => window.location.href = 'https://bhaikaamdo.com'}>Go Back</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Button
                variant="ghost"
                className="mb-6"
                onClick={() => window.location.href = 'https://bhaikaamdo.com'}
            >
                <IconArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Job Details Section */}
                <div className="md:col-span-2 space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <h1 className="text-3xl font-bold">{jobData.jobPosition || jobData.jobTitle}</h1>
                            {(() => {
                                const jobUrl = (jobData.job_url ?? jobData.jobUrl ?? jobData.src ?? jobData.applicationInfo?.applyLink) as string | undefined
                                if (!jobUrl) return null
                                return (
                                    <div className="inline-flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={handleShareClick}
                                            title={copied ? 'Copied!' : 'Share'}
                                            className="inline-flex items-center justify-center hover:bg-muted rounded-lg p-2 transition-colors"
                                            aria-label="Share job posting"
                                        >
                                            <Share2 className="h-5 w-5 text-muted-foreground" />
                                        </button>

                                        {copied && (
                                            <span className="text-sm font-medium text-green-600 dark:text-green-400">Copied!</span>
                                        )}

                                        <a
                                            href={jobUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center hover:bg-muted rounded-lg p-2 transition-colors"
                                            aria-label="Open job posting"
                                        >
                                            <Link className="h-6 w-6 text-primary" aria-hidden />
                                        </a>
                                    </div>
                                )
                            })()}
                        </div>

                        <div className="flex items-center gap-3 text-muted-foreground">
                            <span className="font-medium text-lg">{jobData.companyProfile?.companyName}</span>
                            <span>•</span>
                            <span>{[
                                jobData.location.city,
                                jobData.location.state,
                                jobData.location.country,
                                jobData.location.remoteStatus
                            ].filter(Boolean).join(', ') || 'Remote'}</span>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <button
                            onClick={() => setIsCompanyExpanded(!isCompanyExpanded)}
                            className="w-full flex items-center justify-between text-xl font-semibold mb-4 hover:text-primary transition-colors"
                        >
                            <span>Company Details</span>
                            <IconChevronDown
                                className={`transform transition-transform duration-200 ${isCompanyExpanded ? 'rotate-180' : ''
                                    }`}
                                size={24}
                            />
                        </button>
                        <div className={`space-y-4 overflow-hidden transition-all duration-200 ${isCompanyExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                            }`}>
                            <div>
                                <h3 className="font-medium mb-1">Industry</h3>
                                <p className="text-muted-foreground">{jobData.companyProfile?.industry || '—'}</p>
                            </div>
                            <div>
                                <h3 className="font-medium mb-1">Website</h3>
                                {jobData.companyProfile?.website ? (
                                    <a
                                        href={jobData.companyProfile.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline"
                                    >
                                        {jobData.companyProfile.website}
                                    </a>
                                ) : '—'}
                            </div>
                            <div>
                                <h3 className="font-medium mb-1">Description</h3>
                                <p className="text-muted-foreground whitespace-pre-line">
                                    {jobData.companyProfile?.description || '—'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h2 className="text-xl font-semibold mb-4">Job Details</h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-medium mb-2">Job Summary</h3>
                                <p className="text-muted-foreground whitespace-pre-line">
                                    {jobData.jobSummary || '—'}
                                </p>
                            </div>

                            <div>
                                <h3 className="font-medium mb-2">Employment Type</h3>
                                <Badge variant="secondary">
                                    {jobData.employmentType || '—'}
                                </Badge>
                            </div>

                            <div>
                                <h3 className="font-medium mb-2">Key Responsibilities</h3>
                                <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                                    {jobData.keyResponsibilities?.map((responsibility: string, index: number) => (
                                        <li key={index}>{responsibility}</li>
                                    )) || <li>—</li>}
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-medium mb-2">Required Qualifications</h3>
                                <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                                    {jobData.qualifications?.required?.map((qual: string, index: number) => (
                                        <li key={index}>{qual}</li>
                                    )) || <li>—</li>}
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-medium mb-2">Preferred Qualifications</h3>
                                <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                                    {jobData.qualifications?.preferred?.map((qual: string, index: number) => (
                                        <li key={index}>{qual}</li>
                                    )) || <li>—</li>}
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-medium mb-2">Required Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {jobData.extractedKeywords?.map((skill: string, index: number) => (
                                        <Badge key={index} variant="secondary">{skill}</Badge>
                                    )) || '—'}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium mb-2">Preferred Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {jobData.qualifications.preferred?.map((skill: string, index: number) => (
                                        <Badge key={index} variant="secondary">{skill}</Badge>
                                    )) || '—'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="space-y-6">
                    <div className="bg-card rounded-lg p-6 border shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/50">
                        <h2 className="text-xl font-semibold mb-4 text-center">Land this job with Bhaikaamdo</h2>
                        <p className="text-muted-foreground text-center mb-6">
                            Sign up now to analyze your resume against this job, get AI-powered improvements, and generate tailored cover letters!
                        </p>

                        <div className="space-y-4">
                            <Button
                                className="w-full"
                                size="lg"
                                onClick={() => router.push('/signup')}
                            >
                                <IconUserPlus className="mr-2 h-5 w-5" />
                                Sign Up Now
                            </Button>

                            <Button
                                className="w-full"
                                variant="outline"
                                size="lg"
                                onClick={() => router.push('/signin')}
                            >
                                <IconLogin className="mr-2 h-5 w-5" />
                                Sign In
                            </Button>
                        </div>

                        <div className="mt-8 space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="bg-primary/10 p-2 rounded-lg">
                                    <Badge variant="outline" className="h-5 w-5 rounded-full p-0 flex items-center justify-center border-primary text-primary">1</Badge>
                                </div>
                                <div>
                                    <p className="font-medium text-sm">Resume Analysis</p>
                                    <p className="text-xs text-muted-foreground">See how well your resume matches the job requirements.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="bg-primary/10 p-2 rounded-lg">
                                    <Badge variant="outline" className="h-5 w-5 rounded-full p-0 flex items-center justify-center border-primary text-primary">2</Badge>
                                </div>
                                <div>
                                    <p className="font-medium text-sm">AI Improvements</p>
                                    <p className="text-xs text-muted-foreground">Get specific suggestions to improve your resume score.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="bg-primary/10 p-2 rounded-lg">
                                    <Badge variant="outline" className="h-5 w-5 rounded-full p-0 flex items-center justify-center border-primary text-primary">3</Badge>
                                </div>
                                <div>
                                    <p className="font-medium text-sm">Tailored Cover Letter</p>
                                    <p className="text-xs text-muted-foreground">Generate a professional cover letter in seconds.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

