"use client"

import React, { useEffect, useState } from "react"
import AuthGuard from "@/components/auth-guard"
import { getAuthToken, jobsApi } from "@/lib/api"
import { EnrichedMatch } from "@/lib/types"
import { JobMatchCard } from "@/components/job-match-card"
import { EmptyJobsState } from "@/components/empty-state"
import { IconSearch, IconAdjustmentsHorizontal } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function MatchesPage() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [matches, setMatches] = useState<EnrichedMatch[]>([])
    const [searchQuery, setSearchQuery] = useState("")

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

                // Backend already filters > 30, but let's ensure sorting by percentage desk
                const sorted = [...data].sort((a, b) =>
                    b.match.percentage_match - a.match.percentage_match
                )

                setMatches(sorted)
            } catch (err: unknown) {
                console.error("Error fetching matches:", err)
                setError(err instanceof Error ? err.message : "Failed to load matches. Please try again later.")
            } finally {
                setLoading(false)
            }
        }

        fetchMatches()
    }, [])

    const filteredMatches = matches.filter(m => {
        const title = m.job_details.jobTitle?.toLowerCase() || ""
        const company = m.job_details.companyProfile?.companyName?.toLowerCase() || ""
        const query = searchQuery.toLowerCase()
        return title.includes(query) || company.includes(query)
    })

    return (
        <AuthGuard>
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <header className="mb-10 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                Recommended Matches
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                We&apos;ve found these opportunities based on your profile and preferences.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="relative w-full md:w-80">
                                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                <Input
                                    placeholder="Search jobs or companies..."
                                    className="pl-10 h-11"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" size="icon" className="h-11 w-11">
                                <IconAdjustmentsHorizontal size={20} />
                            </Button>
                        </div>
                    </div>
                </header>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-[400px] rounded-xl border bg-card animate-pulse shadow-sm" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 border-2 border-dashed rounded-3xl bg-red-50/50 dark:bg-red-950/10">
                        <div className="text-red-500 mb-4 text-xl font-medium">Something went wrong</div>
                        <p className="text-muted-foreground max-w-md mb-6">{error}</p>
                        <Button onClick={() => window.location.reload()}>Try Again</Button>
                    </div>
                ) : filteredMatches.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[400px]">
                        <EmptyJobsState />
                        {searchQuery && (
                            <p className="mt-4 text-muted-foreground">
                                No matches found for &quot;{searchQuery}&quot;
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {filteredMatches.map((match) => (
                            <JobMatchCard key={match.match.job_id} match={match} />
                        ))}
                    </div>
                )}
            </div>
        </AuthGuard>
    )
}
