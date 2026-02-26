"use client"

import React from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badgeTable"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { EnrichedMatch } from "@/lib/types"
import { IconMapPin, IconBuilding } from "@tabler/icons-react"
import Link from "next/link"

interface JobMatchCardProps {
    match: EnrichedMatch
}

export function JobMatchCard({ match }: JobMatchCardProps) {
    const { job_details, match: matchInfo } = match
    const percentage = Math.round(matchInfo.percentage_match)

    // Color based on match percentage
    const getMatchColor = (p: number) => {
        if (p >= 80) return "text-green-600 dark:text-green-400"
        if (p >= 60) return "text-blue-600 dark:text-blue-400"
        return "text-orange-600 dark:text-orange-400"
    }

    const getProgressColor = (p: number) => {
        if (p >= 80) return "bg-green-600"
        if (p >= 60) return "bg-blue-600"
        return "bg-orange-600"
    }

    return (
        <Card className="hover:shadow-lg transition-all duration-300 border-primary/10 overflow-hidden flex flex-col h-full">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                        {job_details.employmentType || "Full-time"}
                    </Badge>
                    <div className={`text-xl font-bold ${getMatchColor(percentage)}`}>
                        {percentage}% Match
                    </div>
                </div>
                <CardTitle className="text-xl line-clamp-2 min-h-[3.5rem]">
                    {job_details.jobTitle || "Untitled Position"}
                </CardTitle>
            </CardHeader>

            <CardContent className="flex-grow space-y-4">
                <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <IconBuilding size={16} />
                        <span className="font-medium text-foreground">
                            {job_details.companyProfile?.companyName || "Unknown Company"}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <IconMapPin size={16} />
                        <span>
                            {[
                                job_details.location?.city,
                                job_details.location?.state
                            ].filter(Boolean).join(", ") || job_details.location?.remoteStatus || "Remote"}
                        </span>
                    </div>
                </div>

                <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                        <span>Match Progress</span>
                        <span>{percentage}%</span>
                    </div>
                    <Progress value={percentage} className="h-2" indicatorClassName={getProgressColor(percentage)} />
                </div>

                {job_details.jobSummary && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                        {job_details.jobSummary}
                    </p>
                )}
            </CardContent>

            <CardFooter className="pt-2">
                <Link href={`/matches/${job_details.job_id}`} className="w-full">
                    <Button variant="outline" className="w-full group">
                        View Details
                        <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    )
}
