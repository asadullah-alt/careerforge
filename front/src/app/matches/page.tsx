"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import AuthGuard from "@/components/auth-guard"
import { getAuthToken, jobsApi, userApi, resumesApi } from "@/lib/api"
import { EnrichedMatch } from "@/lib/types"
import { JobMatchCard } from "@/components/job-match-card"
import {
    IconSearch,
    IconAdjustmentsHorizontal,
    IconTarget,
    IconBuilding,
    IconMapPin,
    IconCalendar,
    IconRosette,
    IconBriefcase,
    IconCloudUpload
} from "@tabler/icons-react"
import { Badge } from "@/components/ui/badgeTable"
import { UserPreferences } from "@/lib/api/user"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from '@/components/ui/separatorInteractive'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet"
import FileUpload from "@/components/file-upload"
import { toast } from "sonner"
import { setCookie } from "@/utils/cookie"
import { useResumeStore } from "@/store/resume-store"


export default function MatchesPage() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [matches, setMatches] = useState<EnrichedMatch[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [preferences, setPreferences] = useState<UserPreferences | null>(null)
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [sheetOpen, setSheetOpen] = useState(false)
    const { selectedResumeId, setSelectedResumeId } = useResumeStore()

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const token = getAuthToken()
                if (!token) {
                    setError("Session expired. Please log in again.")
                    setLoading(false)
                    return
                }

                const data = await jobsApi.getEnrichedMatches(token) as EnrichedMatch[]

                // Backend already filters > 30, but let's ensure sorting by percentage desc
                const sorted = [...data].sort((a, b) =>
                    b.match.percentage_match - a.match.percentage_match
                )

                setMatches(sorted)
                if (sorted.length > 0) {
                    setSelectedId(sorted[0].job_details.job_id)
                }
            } catch (err: unknown) {
                console.error("Error fetching matches:", err)
                setError(err instanceof Error ? err.message : "Failed to load matches. Please try again later.")
            } finally {
                setLoading(false)
            }
        }

        const fetchPreferences = async () => {
            try {
                const token = getAuthToken()
                if (!token) return
                const data = await userApi.getUserPreferences(token)
                setPreferences(data)
            } catch (err) {
                console.error("Error fetching preferences:", err)
            }
        }

        const handlePrefsUpdated = () => {
            fetchPreferences()
        }

        fetchMatches()
        fetchPreferences()

        window.addEventListener('preferences-updated', handlePrefsUpdated)
        return () => {
            window.removeEventListener('preferences-updated', handlePrefsUpdated)
        }
    }, [])

    const handleUploadSuccess = async (resume_id: string) => {
        try {
            const token = getAuthToken()
            if (token) {
                await resumesApi.setDefaultResume(resume_id, token)
                setSelectedResumeId(resume_id)
                setCookie('bhaikaamdo_defaultresume', resume_id)
            }
        } catch (e) {
            console.error('Error setting default resume:', e)
        }
        toast.success("Resume uploaded successfully!", {
            description: "Your file has been processed. Refreshing matches…",
        })
        setSheetOpen(false)
    }

    const filteredMatches = matches.filter(m => {
        const title = m.job_details.jobTitle?.toLowerCase() || ""
        const company = m.job_details.companyProfile?.companyName?.toLowerCase() || ""
        const query = searchQuery.toLowerCase()
        return title.includes(query) || company.includes(query)
    })

    const selectedMatch = matches.find(m => m.job_details.job_id === selectedId)

    return (
        <AuthGuard>
            <div className="h-[calc(100vh-4rem)] flex flex-col bg-background/50">
                {/* Fixed Header */}
                <header className="px-6 py-4 border-b bg-background shadow-sm space-y-4">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                Recommended Matches
                            </h1>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="relative w-full md:w-80">
                                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                <Input
                                    placeholder="Search jobs..."
                                    className="pl-10 h-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-grow flex overflow-hidden">
                    {/* Left: Master List */}
                    <aside className="w-full md:w-[350px] lg:w-[380px] border-r overflow-y-auto bg-muted/20 p-3 space-y-3">
                        {/* Compact Preferences Summary at the top of the list */}
                        {preferences && (
                            <div className="p-3 rounded-lg bg-background border shadow-sm space-y-2 mb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-wider">
                                        <IconTarget size={12} />
                                        <span>Target Preferences</span>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => window.dispatchEvent(new CustomEvent('open-preferences'))}>
                                        <IconAdjustmentsHorizontal size={12} />
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {preferences.country && (
                                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 rounded h-4 bg-primary/10 text-primary border-none">
                                            {preferences.country}
                                        </Badge>
                                    )}
                                    {preferences.salary_min && (
                                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 rounded h-4 bg-green-500/10 text-green-700 border-none">
                                            ${preferences.salary_min / 1000}k+
                                        </Badge>
                                    )}
                                    {preferences.remote_friendly && (
                                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 rounded h-4 bg-blue-500/10 text-blue-700 border-none">
                                            Remote
                                        </Badge>
                                    )}
                                    {preferences.visa_sponsorship && (
                                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 rounded h-4 bg-orange-500/10 text-orange-700 border-none">
                                            Visa
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        )}

                        {loading ? (
                            [...Array(8)].map((_, i) => (
                                <div key={i} className="h-20 rounded-lg border bg-card animate-pulse" />
                            ))
                        ) : error ? (
                            <div className="p-4 text-center text-destructive text-sm font-medium">{error}</div>
                        ) : filteredMatches.length === 0 ? (
                            selectedResumeId ? (
                                // Resume exists — matching is in progress
                                <div className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-5">
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                                        <IconBriefcase size={32} className="text-primary" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <p className="text-base font-semibold text-foreground">Matching in progress</p>
                                        <p className="text-sm text-muted-foreground max-w-[240px]">
                                            We&apos;re processing your resume against thousands of job postings.
                                            You&apos;ll receive an email as soon as your personalized matches are ready.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                // No resume — prompt to upload
                                <div className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-5">
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                        <IconCloudUpload size={32} className="text-primary" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <p className="text-base font-semibold text-foreground">No matches yet</p>
                                        <p className="text-sm text-muted-foreground max-w-[220px]">
                                            Upload your CV so we can find the best job matches for you.
                                        </p>
                                    </div>
                                    <Button
                                        size="sm"
                                        className="gap-2"
                                        onClick={() => setSheetOpen(true)}
                                    >
                                        <IconCloudUpload size={16} />
                                        Upload your CV
                                    </Button>
                                </div>
                            )
                        ) : (
                            filteredMatches.map((match) => (
                                <JobMatchCard
                                    key={match.job_details.job_id}
                                    match={match}
                                    isActive={selectedId === match.job_details.job_id}
                                    onClick={() => setSelectedId(match.job_details.job_id)}
                                />
                            ))
                        )}
                    </aside>

                    {/* Right: Detailed View */}
                    <main className="hidden md:block flex-grow overflow-y-auto bg-background p-8">
                        {selectedMatch ? (
                            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                <header className="space-y-4">
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="secondary" className="px-3 py-1">
                                            {selectedMatch.job_details.employmentType}
                                        </Badge>
                                        {selectedMatch.job_details.isRemote && (
                                            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200">
                                                Remote
                                            </Badge>
                                        )}
                                        {selectedMatch.job_details.isVisaSponsored && (
                                            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200">
                                                Visa Sponsored
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="flex justify-between items-start gap-4">
                                        <h1 className="text-4xl font-bold tracking-tight">{selectedMatch.job_details.jobTitle}</h1>
                                        <div className="bg-primary/5 p-4 rounded-2xl border border-primary/20 text-center min-w-[120px]">
                                            <div className="text-xs font-bold text-muted-foreground uppercase mb-1">Match Score</div>
                                            <div className="text-4xl font-black text-primary">{Math.round(selectedMatch.match.percentage_match)}%</div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <IconBuilding size={20} className="text-primary" />
                                            <span className="font-semibold text-foreground text-lg">
                                                {selectedMatch.job_details.companyProfile?.companyName}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <IconMapPin size={20} />
                                            <span>
                                                {[
                                                    selectedMatch.job_details.location?.city,
                                                    selectedMatch.job_details.location?.state,
                                                    selectedMatch.job_details.location?.country
                                                ].filter(Boolean).join(", ") || selectedMatch.job_details.location?.remoteStatus}
                                            </span>
                                        </div>
                                        {selectedMatch.job_details.datePosted && (
                                            <div className="flex items-center gap-2">
                                                <IconCalendar size={20} />
                                                <span>Posted {selectedMatch.job_details.datePosted}</span>
                                            </div>
                                        )}
                                    </div>
                                </header>

                                <div className="flex gap-4">
                                    <Button className="h-11 px-8 font-bold" asChild>
                                        <a href={selectedMatch.job_details.job_url} target="_blank" rel="noopener noreferrer">
                                            Apply Now
                                        </a>
                                    </Button>
                                    <Button variant="outline" className="h-11 px-8" asChild>
                                        <Link href={`/matches/${selectedMatch.job_details.job_id}`}>Full Page Mode</Link>
                                    </Button>
                                </div>

                                <Separator />

                                <section className="space-y-4">
                                    <h2 className="text-2xl font-bold">Job Summary</h2>
                                    <p className="text-muted-foreground leading-relaxed text-lg italic bg-primary/5 p-4 rounded-xl border-l-4 border-primary">
                                        {selectedMatch.job_details.jobSummary || "No summary available."}
                                    </p>
                                </section>

                                {selectedMatch.job_details.keyResponsibilities && (
                                    <section className="space-y-4">
                                        <h2 className="text-2xl font-bold">Key Responsibilities</h2>
                                        <ul className="grid gap-3">
                                            {selectedMatch.job_details.keyResponsibilities.map((item, i) => (
                                                <li key={i} className="flex gap-3">
                                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold mt-0.5">{i + 1}</span>
                                                    <span className="text-muted-foreground leading-relaxed">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </section>
                                )}

                                {selectedMatch.job_details.qualifications && (
                                    <section className="space-y-6">
                                        <h2 className="text-2xl font-bold">Qualifications</h2>
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold flex items-center gap-2"><IconRosette className="text-primary" />Required</h3>
                                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                                {selectedMatch.job_details.qualifications.required.map((q, i) => <li key={i}>{q}</li>)}
                                            </ul>
                                        </div>
                                    </section>
                                )}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center gap-10 px-8">
                                <style>{`
                                    @keyframes cf-orbit {
                                        from { transform: rotate(0deg) translateX(72px) rotate(0deg); }
                                        to   { transform: rotate(360deg) translateX(72px) rotate(-360deg); }
                                    }
                                    @keyframes cf-orbit2 {
                                        from { transform: rotate(120deg) translateX(72px) rotate(-120deg); }
                                        to   { transform: rotate(480deg)  translateX(72px) rotate(-480deg); }
                                    }
                                    @keyframes cf-orbit3 {
                                        from { transform: rotate(240deg) translateX(72px) rotate(-240deg); }
                                        to   { transform: rotate(600deg)  translateX(72px) rotate(-600deg); }
                                    }
                                    @keyframes cf-float {
                                        0%,100% { transform: translateY(0); }
                                        50%      { transform: translateY(-10px); }
                                    }
                                    @keyframes cf-arrow {
                                        0%   { transform: translateY(6px);  opacity: 0; }
                                        50%  { transform: translateY(0);    opacity: 1; }
                                        100% { transform: translateY(-6px); opacity: 0; }
                                    }
                                    @keyframes cf-dot {
                                        0%,100% { opacity: 0.25; transform: scale(0.8); }
                                        50%      { opacity: 1;    transform: scale(1.2); }
                                    }
                                    @keyframes cf-ping-slow {
                                        0%   { transform: scale(1);   opacity: 0.5; }
                                        100% { transform: scale(1.9); opacity: 0; }
                                    }
                                `}</style>

                                {selectedResumeId ? (
                                    /* ── Resume exists – matching in progress ── */
                                    <>
                                        <div className="relative w-44 h-44 flex items-center justify-center">
                                            {/* slow ping ring */}
                                            <span className="absolute inset-0 rounded-full border border-primary/30"
                                                style={{ animation: 'cf-ping-slow 2.4s ease-out infinite' }} />
                                            <span className="absolute inset-0 rounded-full border border-primary/20"
                                                style={{ animation: 'cf-ping-slow 2.4s ease-out 1.2s infinite' }} />

                                            {/* centre icon */}
                                            <div className="z-10 w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center shadow-lg"
                                                style={{ animation: 'cf-float 3s ease-in-out infinite' }}>
                                                <IconBriefcase size={38} className="text-primary" />
                                            </div>

                                            {/* 3 orbiting pills */}
                                            {[
                                                { anim: 'cf-orbit  3.6s linear infinite', color: 'bg-primary', size: 'w-3   h-3' },
                                                { anim: 'cf-orbit2 3.6s linear infinite', color: 'bg-primary/60', size: 'w-2.5 h-2.5' },
                                                { anim: 'cf-orbit3 3.6s linear infinite', color: 'bg-primary/80', size: 'w-2   h-2' },
                                            ].map((o, i) => (
                                                <span key={i}
                                                    className={`absolute rounded-full ${o.color} ${o.size} top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
                                                    style={{ animation: o.anim }} />
                                            ))}
                                        </div>

                                        <div className="text-center space-y-3 max-w-sm">
                                            <p className="text-xl font-bold text-foreground">Matching in progress</p>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                We&apos;re processing your resume against thousands of job postings.
                                                You&apos;ll get an <span className="font-medium text-foreground">email</span> the moment your personalised matches are ready.
                                            </p>
                                            {/* animated loading dots */}
                                            <div className="flex items-center justify-center gap-1.5 pt-1">
                                                {[0, 0.4, 0.8].map((delay, i) => (
                                                    <span key={i}
                                                        className="w-2 h-2 rounded-full bg-primary/50"
                                                        style={{ animation: `cf-dot 1.2s ease-in-out ${delay}s infinite` }} />
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    /* ── No resume – upload prompt ── */
                                    <>
                                        <div style={{ animation: 'cf-float 3s ease-in-out infinite' }}>
                                            <svg width="140" height="110" viewBox="0 0 140 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                {/* cloud body */}
                                                <path d="M105 70 Q112 70 116 63 Q124 62 124 53 Q124 43 115 40
                                                         Q113 28 102 25 Q96 12 80 14 Q70 8 58 15
                                                         Q44 15 40 27 Q28 30 26 42 Q18 45 18 55
                                                         Q18 64 26 66 Q30 71 36 71 Z"
                                                    fill="currentColor" className="text-primary/10"
                                                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />

                                                {/* animated arrow group */}
                                                <g style={{ animation: 'cf-arrow 1.6s ease-in-out infinite' }}>
                                                    <line x1="70" y1="95" x2="70" y2="57" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-primary" />
                                                    <polyline points="56,68 70,55 84,68" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary" fill="none" />
                                                </g>

                                                {/* small sparkles */}
                                                <circle cx="28" cy="30" r="3" fill="currentColor" className="text-primary/30" style={{ animation: 'cf-dot 2s ease-in-out 0s infinite' }} />
                                                <circle cx="112" cy="26" r="2.5" fill="currentColor" className="text-primary/30" style={{ animation: 'cf-dot 2s ease-in-out 0.7s infinite' }} />
                                                <circle cx="120" cy="72" r="2" fill="currentColor" className="text-primary/20" style={{ animation: 'cf-dot 2s ease-in-out 1.3s infinite' }} />
                                            </svg>
                                        </div>

                                        <div className="text-center space-y-3 max-w-sm">
                                            <p className="text-xl font-bold text-foreground">Ready to find your dream job?</p>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                Upload your CV and we&apos;ll match you against thousands of relevant job openings automatically.
                                            </p>
                                            <Button size="sm" className="gap-2 mt-1" onClick={() => setSheetOpen(true)}>
                                                <IconCloudUpload size={16} />
                                                Upload your CV
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* CV Upload Sheet */}
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetContent side="right" className="data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right data-[state=open]:duration-500">
                    <SheetHeader>
                        <SheetTitle>Upload Resume</SheetTitle>
                        <SheetDescription>Upload your resume to start matching with jobs. Supports PDF and DOCX formats.</SheetDescription>
                    </SheetHeader>
                    <div className="p-4">
                        <FileUpload onUploadComplete={handleUploadSuccess} />
                    </div>
                    <SheetFooter>
                        <div className="text-xs text-muted-foreground">Resume will be uploaded and processed by our AI.</div>
                    </SheetFooter>
                    <SheetClose />
                </SheetContent>
            </Sheet>
        </AuthGuard>
    )
}
