"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import AuthGuard from "@/components/auth-guard"
import { getAuthToken, jobsApi, userApi } from "@/lib/api"
import { EnrichedMatch } from "@/lib/types"
import { JobMatchCard } from "@/components/job-match-card"
import { EmptyJobsState } from "@/components/empty-state"
import {
    IconSearch,
    IconAdjustmentsHorizontal,
    IconTarget,
    IconBuilding,
    IconMapPin,
    IconCalendar,
    IconRosette,
    IconBriefcase
} from "@tabler/icons-react"
import { Badge } from "@/components/ui/badgeTable"
import { UserPreferences } from "@/lib/api/user"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from '@/components/ui/separatorInteractive'


export default function MatchesPage() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [matches, setMatches] = useState<EnrichedMatch[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [preferences, setPreferences] = useState<UserPreferences | null>(null)
    const [selectedId, setSelectedId] = useState<string | null>(null)

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
                            <div className="text-center py-20 px-4">
                                <EmptyJobsState />
                                <p className="mt-4 text-xs text-muted-foreground font-medium">No matches found.</p>
                            </div>
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
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                                <IconBriefcase size={64} className="opacity-20 mb-4" />
                                <p>Select a job from the list to see details</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </AuthGuard>
    )
}
