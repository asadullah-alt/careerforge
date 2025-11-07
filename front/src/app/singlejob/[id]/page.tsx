"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { IconArrowLeft, IconChartBar, IconChevronDown } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separatorInteractive'
import { Badge } from '@/components/ui/badgeTable'
import Speedometer from '@/components/ui/speedometer'
import { schema } from '@/components/data-table'
import { z } from 'zod'
import { useJobStore } from '@/store/job-store'
import { getCfAuthCookie } from '@/utils/cookie'
import dynamic from "next/dynamic";
const GaugeComponent = dynamic(() => import('react-gauge-component'), { ssr: false });
type Job = z.infer<typeof schema>

export default function SingleJobPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [jobData, setJobData] = React.useState<Job | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [analysisScore] = React.useState(85) // Example score
  const [isCompanyExpanded, setIsCompanyExpanded] = React.useState(false)
  const [analyzing, setAnalyzing] = React.useState(false)
  const [analysisResult, setAnalysisResult] = React.useState<{
    original_score: number;
    new_score: number;
    skill_comparison: Array<{
      skill: string;
      resume_mentions: number;
      job_mentions: number;
    }>;
    improvements: Array<{
      suggestion: string;
      lineNumber: string;
    }>;
  } | null>(null)

  const selectedJob = useJobStore((s) => s.selectedJob)
  const setSelectedJob = useJobStore((s) => s.setSelectedJob)

  const analyzeResume = async () => {
    try {
      setAnalyzing(true)
      const token = getCfAuthCookie()
      
      // First get all user resumes
      const resumesResponse = await fetch(
        `https://resume.datapsx.com/api/v1/resumes/getAllUserResumes?token=${token}`
      )
      const resumesData = await resumesResponse.json()
      
      if (!resumesData.data || resumesData.data.length === 0) {
        console.error('No resumes found')
        return
      }

      // Use the first resume for analysis
      const resumeId = resumesData.data[0]
      
      // Send analysis request
      const analysisResponse = await fetch('https://resume.datapsx.com/api/v1/resumes/improve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_id: params.id,
          resume_id: resumeId
        })
      })
      
      const analysisData = await analysisResponse.json()
      console.log('Analysis Result:', analysisData.data)
      setAnalysisResult(analysisData.data)
    } catch (error) {
      console.error('Error analyzing resume:', error)
    } finally {
      setAnalyzing(false)
    }
  }

  React.useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const token = getCfAuthCookie()
        // Otherwise fetch from API and cache into the store
        const response = await fetch(`https://resume.datapsx.com/api/v1/jobs?job_id=${params.id}&token=${token}`)
        const data = await response.json()
       
        if (!mounted) return
        setJobData(data.data.processed_job)
        setSelectedJob(data.data.processed_job)
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
            <h1 className="text-3xl font-bold mb-2">{jobData.jobTitle}</h1>
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

          {/* <div className="grid grid-cols-2 gap-4">
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

          <Separator /> */}

          <div>
            <button
              onClick={() => setIsCompanyExpanded(!isCompanyExpanded)}
              className="w-full flex items-center justify-between text-xl font-semibold mb-4 hover:text-primary transition-colors"
            >
              <span>Company Details</span>
              <IconChevronDown
                className={`transform transition-transform duration-200 ${
                  isCompanyExpanded ? 'rotate-180' : ''
                }`}
                size={24}
              />
            </button>
            <div className={`space-y-4 overflow-hidden transition-all duration-200 ${
              isCompanyExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
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

        {/* Analysis Section */}
        <div className="space-y-6">
          <div className="bg-card rounded-lg p-6 border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Application Progress</h2>
            <div className="flex flex-col">
              {analyzing ? (
                <div className="space-y-4">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                    <p className="text-sm text-muted-foreground text-center">
                      Analyzing your resume against this job posting...
                    </p>
                  </div>
                </div>
              ) : analysisResult && (
                <div className="space-y-6">
                  <div className="flex flex-col items-center">
                    <GaugeComponent
                      type="semicircle"
                      arc={{
                        colorArray: ['#FF2121', '#FFA500', '#00FF15'],
                        padding: 0.02,
                        width: 0.2,
                        subArcs: [
                          { limit: 40 },
                          { limit: 60 },
                          { limit: 100 }
                        ]
                      }}
                      pointer={{type: "blob", animationDelay: 0}}
                      value={Math.round(analysisResult.original_score * 100)}
                    />
                    <div className="text-center mt-4">
                      <p className="text-sm font-medium">Match Score</p>
                      <p className="text-2xl font-bold">{Math.round(analysisResult.original_score * 100)}%</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-muted/20 rounded-lg p-4">
                      <h4 className="font-medium mb-2">Skill Analysis</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {analysisResult.skill_comparison.map((skill, index) => (
                          skill.resume_mentions > 0 && (
                            <Badge key={index} variant="secondary" className="justify-between">
                              {skill.skill}
                              <span className="ml-2 text-xs">{skill.resume_mentions}✓</span>
                            </Badge>
                          )
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Missing Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.skill_comparison.map((skill, index) => (
                          skill.resume_mentions === 0 && (
                            <Badge key={index} variant="outline" className="border-red-200 text-red-500">
                              {skill.skill}
                            </Badge>
                          )
                        ))}
                      </div>
                    </div>

                    {analysisResult.improvements && (
                      <div>
                        <h4 className="font-medium mb-2">Suggested Improvements</h4>
                        <ul className="list-disc pl-4 space-y-1 text-sm text-muted-foreground">
                          {analysisResult.improvements.slice(0, 3).map((imp, index) => (
                            <li key={index}>{imp.suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <Button 
              className="w-full mt-6" 
              size="lg"
              onClick={analyzeResume}
              disabled={analyzing}
            >
              {analyzing ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <IconChartBar className="mr-2 h-4 w-4" />
                  {analysisResult ? 'Analyze Again' : 'Analyze Resume'}
                </>
              )}
            </Button>
          </div>

          {/* <div className="bg-card rounded-lg p-6 border shadow-sm">
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
          </div> */}
        </div>
      </div>
    </div>
  )
}