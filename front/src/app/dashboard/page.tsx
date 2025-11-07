"use client"

import React from "react"
import AuthGuard from '@/components/auth-guard'
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { getCfAuthCookie } from "@/utils/cookie"

interface CompanyProfile {
  companyName: string;
  industry: string | null;
  website: string | null;
  description: string | null;
}

interface Location {
  city: string | null;
  state: string | null;
  country: string | null;
  remoteStatus: string | null;
}

interface Qualifications {
  required: string[] | null;
  preferred: string[] | null;
}

interface ApplicationInfo {
  how_to_apply: string | null;
  apply_link: string | null;
  contact_email: string | null;
}

interface ProcessedJob {
  user_id: string;
  job_id: string;
  job_title: string | null;
  company_profile: CompanyProfile | string;
  location: Location;
  datePosted: string | null;
  employmentType: string | null;
  job_summary: string | null;
  key_responsibilities: string[];
  qualifications: Qualifications;
  compensation_and_benefits: string | null;
  application_info: ApplicationInfo;
  extracted_keywords: string[];
  processed_at: string;
  updated_at: string;
}

interface ApiResponse {
  success: boolean;
  jobs: ProcessedJob[];
}

interface TransformedJob {
  id: number;
  job_title: string;
  job_id: string;
  
  companyDetails: {
    companyName: string;
    industry: string | null;
    website: string | null;
    description: string | null;
  };
  maxSalary: string;
  location:Location;
  qualifications: Qualifications;
  application_info: ApplicationInfo;
  extracted_keywords: string[];
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
        const transformedJobs = data.jobs.map((job: ProcessedJob) => {
          // Parse companyProfile if it's a string
          let companyProfile: CompanyProfile | null = null
          if (typeof job.company_profile === "string") {
            try {
              companyProfile = JSON.parse(job.company_profile)
            } catch (e) {
              console.log("Error parsing companyProfile:", e)
              companyProfile = null
            }
          } else {
            companyProfile = job.company_profile as CompanyProfile
          }

          const companyName = companyProfile?.companyName || 'Unknown Company'
          // Format location as string
          const locationStr = [
            job.location.city,
            job.location.state,
            job.location.country,
            job.location.remoteStatus
          ].filter(Boolean).join(', ') || 'Remote'

          return {
            job_id: job.job_id,
            id: parseInt(job.job_id) || Math.floor(Math.random() * 1000000),
            job_title: job.job_title || 'Untitled Position',
            companyDetails: {
              companyName: companyName,
              industry: companyProfile?.industry || null,
              website: companyProfile?.website || null,
              description: companyProfile?.description || null,
            },
            qualifications: {
              required: job.qualifications?.required || [],
              preferred: job.qualifications?.preferred || []
            },
            maxSalary: job.compensation_and_benefits || 'Not specified',
            location: job.location, // Pass the full location object instead of string
            status: job.application_info.how_to_apply || 'Bookmarked',
            dateSaved: new Date(job.processed_at).toISOString().split('T')[0],
            deadline: null,
            dateApplied: null,
            followUp: null,
            // Add the missing properties
            application_info: job.application_info,
            extracted_keywords: job.extracted_keywords || []
          } satisfies TransformedJob
        })

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
