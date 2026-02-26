"use client"

import React, { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconArrowLeft, IconMapPin, IconBuilding, IconCalendar, IconBriefcase, IconRosette } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separatorInteractive'
import { Badge } from '@/components/ui/badgeTable'
import { getAuthToken, jobsApi } from '@/lib/api'
import { EnrichedMatch } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function MatchDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
    const params = use(paramsPromise)
    const router = useRouter()
    const [matchData, setMatchData] = useState<EnrichedMatch | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const token = getAuthToken()
                if (!token) {
                    setError("Session expired")
                    setLoading(false)
                    return
                }

                // We fetch all enriched matches and find the specific one. 
                // In a real production app, there might be a dedicated /matches/enriched/{id} endpoint
                // but based on the provided backend code, we have /matches/enriched.
                const data = await jobsApi.getEnrichedMatches(token) as EnrichedMatch[]
                const found = data.find(m => m.job_details.job_id === params.id)

                if (found) {
                    setMatchData(found)
                    console.log("Job details:", found.job_details)
                } else {
                    setError("Job match not found.")
                }
            } catch (err: unknown) {
                setError("Failed to load job details.")
            } finally {
                setLoading(false)
            }
        }

        fetchDetail()
    }, [params.id])

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="text-muted-foreground animate-pulse">Loading job details...</p>
                </div>
            </div>
        )
    }

    if (error || !matchData) {
        return (
            <div className="flex min-h-screen items-center justify-center p-4">
                <Card className="max-w-md w-full text-center p-6">
                    <CardHeader>
                        <CardTitle className="text-red-500">Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-6">{error || "Could not find job details."}</p>
                        <Button onClick={() => router.push('/matches')} className="w-full">
                            Back to Matches
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const { job_details, match } = matchData

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <Button
                    variant="ghost"
                    className="mb-8 hover:bg-primary/5 -ml-4"
                    onClick={() => router.back()}
                >
                    <IconArrowLeft className="mr-2 h-4 w-4" />
                    Back to Matches
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Info Column */}
                    <div className="lg:col-span-2 space-y-8">
                        <header className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary" className="px-3 py-1">
                                    {job_details.employmentType}
                                </Badge>
                                {job_details.isRemote && (
                                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200">
                                        Remote
                                    </Badge>
                                )}
                                {job_details.isVisaSponsored && (
                                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200">
                                        Visa Sponsored
                                    </Badge>
                                )}
                            </div>

                            <h1 className="text-4xl font-bold tracking-tight">{job_details.jobTitle}</h1>

                            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <IconBuilding size={20} className="text-primary" />
                                    <span className="font-semibold text-foreground text-lg">
                                        {job_details.companyProfile?.companyName}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <IconMapPin size={20} />
                                    <span>
                                        {[
                                            job_details.location?.city,
                                            job_details.location?.state,
                                            job_details.location?.country
                                        ].filter(Boolean).join(", ") || job_details.location?.remoteStatus}
                                    </span>
                                </div>
                                {job_details.datePosted && (
                                    <div className="flex items-center gap-2">
                                        <IconCalendar size={20} />
                                        <span>Posted {job_details.datePosted}</span>
                                    </div>
                                )}
                            </div>
                        </header>

                        <Separator />

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold">Job Summary</h2>
                            <p className="text-muted-foreground leading-relaxed text-lg italic bg-primary/5 p-4 rounded-xl border-l-4 border-primary">
                                {job_details.jobSummary || "No summary available."}
                            </p>
                        </section>

                        {job_details.keyResponsibilities && job_details.keyResponsibilities.length > 0 && (
                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold">Key Responsibilities</h2>
                                <ul className="grid gap-3">
                                    {job_details.keyResponsibilities.map((item, i) => (
                                        <li key={i} className="flex gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold mt-0.5">
                                                {i + 1}
                                            </span>
                                            <span className="text-muted-foreground leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {job_details.qualifications && (
                            <section className="space-y-6">
                                <h2 className="text-2xl font-bold">Qualifications</h2>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <IconRosette className="text-primary" />
                                        Required
                                    </h3>
                                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                        {job_details.qualifications.required.map((q, i) => (
                                            <li key={i}>{q}</li>
                                        ))}
                                    </ul>
                                </div>

                                {job_details.qualifications.preferred && job_details.qualifications.preferred.length > 0 && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-muted-foreground">Preferred</h3>
                                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground/80">
                                            {job_details.qualifications.preferred.map((q, i) => (
                                                <li key={i}>{q}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </section>
                        )}

                        {job_details.extractedKeywords && job_details.extractedKeywords.length > 0 && (
                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold">Skills & Keywords</h2>
                                <div className="flex flex-wrap gap-2">
                                    {job_details.extractedKeywords.map((skill, i) => (
                                        <Badge key={i} variant="outline" className="px-3 py-1 bg-background">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar Column */}
                    <div className="space-y-6">
                        <Card className="sticky top-8 border-primary/20 shadow-xl overflow-hidden">
                            <div className="h-2 bg-gradient-to-r from-primary to-primary/40" />
                            <CardHeader className="pb-0">
                                <CardTitle className="text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
                                    Match Score
                                </CardTitle>
                                <div className="text-center py-6">
                                    <span className="text-6xl font-black text-primary">
                                        {Math.round(match.percentage_match)}%
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4 p-4 rounded-xl bg-muted/30">
                                    <h4 className="font-bold flex items-center gap-2 text-sm">
                                        <IconBriefcase size={18} />
                                        Job Quick Facts
                                    </h4>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Type</span>
                                            <span className="font-medium">{job_details.employmentType}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Salary</span>
                                            <span className="font-medium">
                                                {job_details.compensationAndBenefits?.salaryRange || "Not Specified"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Industry</span>
                                            <span className="font-medium">
                                                {job_details.companyProfile?.industry || "Not Specified"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Button className="w-full h-12 text-lg font-bold" size="lg" asChild>
                                        <a href={job_details.job_url} target="_blank" rel="noopener noreferrer">
                                            Apply Now
                                        </a>
                                    </Button>
                                    {(() => {
                                        try {
                                            if (!job_details.applicationInfo?.applyLink) return null;
                                            const hostname = new URL(job_details.applicationInfo.applyLink).hostname;
                                            return (
                                                <p className="text-center text-xs text-muted-foreground">
                                                    Opens {hostname} in a new tab
                                                </p>
                                            );
                                        } catch {
                                            return null;
                                        }
                                    })()}
                                </div>
                            </CardContent>
                        </Card>

                        {job_details.companyProfile?.description && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">About the Company</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {job_details.companyProfile.description}
                                    </p>
                                    {job_details.companyProfile.website && (
                                        <Button variant="link" className="px-0 mt-2 h-auto text-primary" asChild>
                                            <a href={job_details.companyProfile.website} target="_blank" rel="noopener noreferrer">
                                                Visit Website
                                            </a>
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
