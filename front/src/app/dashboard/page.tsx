"use client"

import React from "react"
import AuthGuard from '@/components/auth-guard'
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { getCfAuthCookie } from "@/utils/cookie"

interface ProcessedJob {
  user_id: string;
  job_id: string;
  job_title: string | null;
  company_profile: string | null;
  location: string | null;
  date_posted: string | null;
  employment_type: string | null;
  job_summary: string | null;
  key_responsibilities: string | null;
  qualifications: string | null;
  compensation_and_benfits: string | null;
  application_info: string | null;
  extracted_keywords: string | null;
  processed_at: string;
}

interface ApiResponse {
  success: boolean;
  jobs: ProcessedJob[];
}

interface TransformedJob {
  id: number;
  jobPosition: string;
  company: string;
  maxSalary: string;
  location: string;
  status: string;
  dateSaved: string;
  deadline: string | null;
  dateApplied: string | null;
  followUp: string | null;
}

export default function Page() {
  const [isLoading, setIsLoading] = React.useState(true)
  const [jobs, setJobs] = React.useState<TransformedJob[]>([])
  const [error, setError] = React.useState("")

  React.useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = getCfAuthCookie()
        if (!token) {
          setError("Authentication token not found")
          setIsLoading(false)
          return
        }

        const response = await fetch('https://careerback.datapsx.com/api/allJobs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token })
        })

        if (!response.ok) {
          throw new Error('Failed to fetch jobs')
        }

        const data = await response.json() as ApiResponse
        
        // Transform the API response to match the DataTable schema
        const transformedJobs = data.jobs.map((job: ProcessedJob) => ({
          id: parseInt(job.job_id) || Math.random() * 1000000, // Fallback to random ID if job_id is not a number
          jobPosition: job.job_title || 'Untitled Position',
          company: job.company_profile || 'Unknown Company',
          maxSalary: job.compensation_and_benfits || 'Not specified',
          location: job.location || 'Remote',
          status: job.application_info || 'Bookmarked',
          dateSaved: new Date(job.processed_at).toISOString().split('T')[0],
          deadline: null,
          dateApplied: null,
          followUp: null
        }))

        setJobs(transformedJobs)
        setError("")
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobs()
  }, [])

  return (
    <AuthGuard>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center min-h-[200px] text-red-500">
              {error}
            </div>
          ) : jobs.length === 0 ? (
            <div className="flex items-center justify-center min-h-[200px] text-muted-foreground">
              No Jobs saved yet.
            </div>
          ) : (
            <DataTable data={jobs} />
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
