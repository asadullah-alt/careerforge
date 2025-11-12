'use client'

import React, { useState, useEffect } from 'react'
import { StructuredResume, PersonalData } from './types'
import { PersonalDataForm } from './personal-data-form'
import { ExperienceForm } from './experience-form'
import { EducationForm } from './education-form'
import { ProjectsForm } from './projects-form'
import { SkillsForm } from './skills-form'
import { ResumeViewer } from './resume-viewer'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getCfAuthCookie } from '@/utils/cookie'
import { toast } from 'sonner'

const defaultResume: StructuredResume = {
  personalData: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    linkedin: 'https://linkedin.com/in/johndoe',
    portfolio: '',
    location: {
      city: 'San Francisco',
      country: 'USA',
    },
  },
  experiences: [],
  projects: [],
  skills: [],
  researchWork: [],
  achievements: [],
  education: [],
  extractedKeywords: [],
}

export default function ResumeBuilderPage() {
  const [resume, setResume] = useState<StructuredResume>(defaultResume)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Fetch existing resume on mount
  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true)
        const token = getCfAuthCookie()
        if (!token) return

        const response = await fetch(
          `https://resume.bhaikaamdo.com/api/v1/resumes/getAllUserResumes?token=${token}`
        )
        const data = await response.json()

        if (data.data && data.data.length > 0) {
          // Try to get structured data from the first resume
          const resumeId = data.data[0].id
          const structuredResponse = await fetch(
            `https://resume.bhaikaamdo.com/api/v1/resumes/${resumeId}?token=${token}`
          )
          const structuredData = await structuredResponse.json()

          if (structuredData.data) {
            // Map API response to our StructuredResume format
            const mappedResume = mapApiResponseToResume(structuredData.data)
            setResume(mappedResume)
          }
        }
      } catch (error) {
        console.error('Error fetching resume:', error)
      } finally {
        setLoading(false)
      }
    }

    void fetchResume()
  }, [])

  const mapApiResponseToResume = (data: unknown): StructuredResume => {
    const apiData = data as Record<string, unknown>
    return {
      personalData: (apiData['Personal Data'] as PersonalData) || defaultResume.personalData,
      experiences: ((apiData['Experiences'] as unknown[]) || []) as never[],
      projects: ((apiData['Projects'] as unknown[]) || []) as never[],
      skills: ((apiData['Skills'] as unknown[]) || []) as never[],
      researchWork: ((apiData['Research Work'] as unknown[]) || []) as never[],
      achievements: ((apiData['Achievements'] as unknown[]) || []) as never[],
      education: ((apiData['Education'] as unknown[]) || []) as never[],
      extractedKeywords: ((apiData['Extracted Keywords'] as unknown[]) || []) as never[],
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const token = getCfAuthCookie()
      if (!token) {
        toast.error('Please login first')
        return
      }

      // Convert resume to API format
      const payload = {
        'Personal Data': resume.personalData,
        Experiences: resume.experiences,
        Projects: resume.projects,
        Skills: resume.skills,
        'Research Work': resume.researchWork,
        Achievements: resume.achievements,
        Education: resume.education,
        'Extracted Keywords': resume.extractedKeywords,
      }

      const response = await fetch(
        'https://resume.bhaikaamdo.com/api/v1/resumes/update',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            token,
            ...payload,
          }),
        }
      )

      if (response.ok) {
        toast.success('Resume saved successfully!')
      } else {
        toast.error('Failed to save resume')
      }
    } catch (error) {
      console.error('Error saving resume:', error)
      toast.error('Error saving resume')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading resume...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Resume Builder</h1>
          <p className="text-muted-foreground">
            Build and customize your professional resume
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left side - Forms */}
          <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
              </TabsList>
              <TabsList className="grid w-full grid-cols-2 mt-2">
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <PersonalDataForm
                  data={resume.personalData}
                  onChange={(personalData) =>
                    setResume({ ...resume, personalData })
                  }
                />
              </TabsContent>

              <TabsContent value="experience" className="space-y-4">
                <ExperienceForm
                  experiences={resume.experiences}
                  onChange={(experiences) => setResume({ ...resume, experiences })}
                />
              </TabsContent>

              <TabsContent value="education" className="space-y-4">
                <EducationForm
                  education={resume.education || []}
                  onChange={(education) => setResume({ ...resume, education })}
                />
              </TabsContent>

              <TabsContent value="projects" className="space-y-4">
                <ProjectsForm
                  projects={resume.projects}
                  onChange={(projects) => setResume({ ...resume, projects })}
                />
              </TabsContent>

              <TabsContent value="skills" className="space-y-4">
                <SkillsForm
                  skills={resume.skills}
                  onChange={(skills) => setResume({ ...resume, skills })}
                />
              </TabsContent>
            </Tabs>

            <div className="flex gap-4 sticky bottom-0 bg-background py-4">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex-1"
              >
                {saving ? 'Saving...' : 'Save Resume'}
              </Button>
              <Button
                onClick={() => setResume(defaultResume)}
                variant="outline"
                className="flex-1"
              >
                Reset
              </Button>
            </div>
          </div>

          {/* Right side - Preview */}
          <div className="sticky top-0 h-[calc(100vh-100px)] overflow-y-auto bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Preview</h2>
            <ResumeViewer resume={resume} />
          </div>
        </div>
      </div>
    </div>
  )
}
