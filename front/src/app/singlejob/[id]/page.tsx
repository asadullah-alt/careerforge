"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { IconArrowLeft, IconChartBar } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separatorInteractive'
import { Badge } from '@/components/ui/badgeTable'
import { schema } from '@/components/data-table'
import { z } from 'zod'

type Job = z.infer<typeof schema>

export default function SingleJobPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [jobData, setJobData] = React.useState<Job | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [analysisScore] = React.useState(85) // Example score

  React.useEffect(() => {
    // TODO: Replace with actual API call
    const fetchJobData = async () => {
      try {
        const response = await fetch(`https://careerback.datapsx.com/jobs/${params.id}`)
        const data = await response.json()
        setJobData(data)
      } catch (error) {
        console.error('Error fetching job data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobData()
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
            <h1 className="text-3xl font-bold mb-2">{jobData.jobPosition}</h1>
            <div className="flex items-center gap-3 text-muted-foreground">
              <span className="font-medium text-lg">{jobData.company}</span>
              <span>•</span>
              <span>{jobData.location}</span>
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
                <p className="text-muted-foreground">{jobData.companyDetails?.industry || '—'}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Website</h3>
                {jobData.companyDetails?.website ? (
                  <a
                    href={jobData.companyDetails.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {jobData.companyDetails.website}
                  </a>
                ) : '—'}
              </div>
              <div>
                <h3 className="font-medium mb-1">Description</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {jobData.companyDetails?.description || '—'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Section */}
        <div className="space-y-6">
          <div className="bg-card rounded-lg p-6 border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Application Progress</h2>
            <Progress value={analysisScore} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              Overall application strength: {analysisScore}%
            </p>
            <Button className="w-full mt-4" size="lg">
              <IconChartBar className="mr-2 h-4 w-4" />
              View Analysis
            </Button>
          </div>

          <div className="bg-card rounded-lg p-6 border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Key Dates</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium">Saved</p>
                <p className="text-muted-foreground">{jobData.dateSaved || '—'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Deadline</p>
                <p className={`font-medium ${jobData.deadline ? 'text-red-600' : 'text-muted-foreground'}`}>
                  {jobData.deadline || '—'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}