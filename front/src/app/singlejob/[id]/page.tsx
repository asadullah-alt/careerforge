"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { IconArrowLeft, IconChartBar } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separatorInteractive'
import { Badge } from '@/components/ui/badgeTable'
import Speedometer from '@/components/ui/speedometer'
import { schema } from '@/components/data-table'
import { z } from 'zod'
import { useJobStore } from '@/store/job-store'
import { getCfAuthCookie } from '@/utils/cookie'
type Job = z.infer<typeof schema>

export default function SingleJobPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [jobData, setJobData] = React.useState<Job | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [analysisScore] = React.useState(85) // Example score

  const selectedJob = useJobStore((s) => s.selectedJob)
  const setSelectedJob = useJobStore((s) => s.setSelectedJob)

  React.useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        // If the store already has the job and the ids match, use it
        if (selectedJob && selectedJob.id.toString() === params.id) {
          if (!mounted) return
          setJobData(selectedJob)
          setLoading(false)
          return
        }
        const token = getCfAuthCookie()
        // Otherwise fetch from API and cache into the store
        const response = await fetch(`https://resume.datapsx.com/api/v1/jobs?job_id=${params.id}&token=${token}`)
        const data = await response.json()
       
        if (!mounted) return
        setJobData(data.data.processed_job)
        setSelectedJob(data.data.processed_job)
        console.log(jobData)
      } catch (error) {
        console.error('Error fetching job data:', error)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()

    return () => {
      mounted = false
      // optional: clear the cached job when leaving the page
      // keep this if you don't want stale data to persist
      // setSelectedJob(null)
    }
  }, [params.id, selectedJob, setSelectedJob])

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
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.back()}
      >
        <IconArrowLeft className="mr-2 h-4 w-4" />
        Back to Jobs
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Job Details Section */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{jobData.job_title}</h1>
            <div className="flex items-center gap-3 text-muted-foreground">
              <span className="font-medium text-lg">{jobData.company_profile?.company_name}</span>
              <span>•</span>
              <span>{[
                jobData.location.city,
                jobData.location.state,
                jobData.location.country,
                jobData.location.remote_status
              ].filter(Boolean).join(', ') || 'Remote'}</span>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-1">Status</h3>
              <Badge variant="outline" className={
                jobData.status === "Interviewing" ? "bg-green-100 text-green-800" :
                jobData.status === "Applied" ? "bg-blue-100 text-blue-800" :
                "bg-gray-100 text-gray-800"
              }>
                {jobData.status}
              </Badge>
            </div>
            <div>
              <h3 className="font-medium mb-1">Salary</h3>
              <p className="text-muted-foreground">{jobData.maxSalary}</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Date Applied</h3>
              <p className="text-muted-foreground">{jobData.dateApplied || '—'}</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Next Follow Up</h3>
              <p className="text-muted-foreground">{jobData.followUp || '—'}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="text-xl font-semibold mb-4">Company Details</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Industry</h3>
                <p className="text-muted-foreground">{jobData.company_profile?.industry || '—'}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Website</h3>
                {jobData.company_profile?.website ? (
                  <a
                    href={jobData.company_profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {jobData.company_profile.website}
                  </a>
                ) : '—'}
              </div>
              <div>
                <h3 className="font-medium mb-1">Description</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {jobData.company_profile?.description || '—'}
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
                  {jobData.job_summary || '—'}
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Employment Type</h3>
                <Badge variant="secondary">
                  {jobData.employment_type || '—'}
                </Badge>
              </div>

              <div>
                <h3 className="font-medium mb-2">Key Responsibilities</h3>
                <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                  {jobData.key_responsibilities?.map((responsibility: string, index: number) => (
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
                  {jobData.extracted_keywords?.map((skill: string, index: number) => (
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

        {/* Analysis Section */}
        <div className="space-y-6">
          <div className="bg-card rounded-lg p-6 border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Application Progress</h2>
            <div className="flex flex-col items-center mb-4">
              <Speedometer value={analysisScore} size={200} />
            </div>
            <div className="space-y-4 mt-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Skills Match</span>
                  <span className="text-sm text-muted-foreground">{50}%</span>
                </div>
                <Progress value={50} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Experience Match</span>
                  <span className="text-sm text-muted-foreground">{50}%</span>
                </div>
                <Progress value={50} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Education Match</span>
                  <span className="text-sm text-muted-foreground">{50}%</span>
                </div>
                <Progress value={50} />
              </div>
            </div>
            <Separator className="my-4" />
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-medium mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {jobData.extracted_keywords?.map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  )) || '—'}
                </div>
              </div>
             
              <div>
                <h3 className="text-sm font-medium mb-2">Education Requirements</h3>
                <p className="text-sm text-muted-foreground">{jobData.qualifications.required || '—'}</p>
              </div>
            </div>
            <Button className="w-full mt-6" size="lg">
              <IconChartBar className="mr-2 h-4 w-4" />
              View Detailed Analysis
            </Button>
          </div>

          <div className="bg-card rounded-lg p-6 border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Key Dates & Status</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium">Application Status</p>
                <Badge variant="outline" className={
                  jobData.status === "Interviewing" ? "bg-green-100 text-green-800" :
                  jobData.status === "Applied" ? "bg-blue-100 text-blue-800" :
                  "bg-gray-100 text-gray-800"
                }>
                  {jobData.status}
                </Badge>
              </div>
              
              <div>
                <p className="text-sm font-medium">Date Saved</p>
                <p className="text-muted-foreground">{jobData.dateSaved || '—'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Date Applied</p>
                <p className="text-muted-foreground">{jobData.dateApplied || '—'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Application Deadline</p>
                <p className={`font-medium ${jobData.deadline ? 'text-red-600' : 'text-muted-foreground'}`}>
                  {jobData.deadline || '—'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Next Follow Up</p>
                <p className="text-muted-foreground">{jobData.followUp || '—'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}