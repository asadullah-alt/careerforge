/**
 * Resume Builder - Integration Examples
 * 
 * This file shows common patterns for using the Resume Builder
 * in your application
 */

// ============================================================================
// EXAMPLE 1: Access Resume Data in Any Component
// ============================================================================

import { useResumeStore } from '@/store/resume-store'

export function MyComponent() {
  // Access the complete resume
  const resume = useResumeStore((state) => state.resume)
  
  // Access specific parts
  const firstName = resume?.personal_data.firstName
  const experiences = resume?.experiences || []
  
  // Use in your component
  return (
    <div>
      <h1>Hello, {firstName}</h1>
      <p>You have {experiences.length} experiences</p>
    </div>
  )
}

// ============================================================================
// EXAMPLE 2: Update Resume Data
// ============================================================================

export function UpdateResumeExample() {
  const updatePersonalData = useResumeStore((state) => state.updatePersonalData)
  const addExperience = useResumeStore((state) => state.addExperience)
  
  const handleNameChange = (firstName: string) => {
    updatePersonalData({ firstName })
  }
  
  const handleAddExperience = () => {
    addExperience({
      job_title: 'Software Engineer',
      company: 'ACME Corp',
      location: 'San Francisco',
      start_date: '2024-01-01',
      end_date: '2024-12-31',
      description: ['Built features', 'Fixed bugs'],
      technologies_used: ['TypeScript', 'React'],
    })
  }
  
  return (
    <div>
      <input
        onChange={(e) => handleNameChange(e.target.value)}
        placeholder="Enter first name"
      />
      <button onClick={handleAddExperience}>Add Experience</button>
    </div>
  )
}

// ============================================================================
// EXAMPLE 3: Display Resume Summary Anywhere
// ============================================================================

import { ResumePreview } from '@/components/resume/resume-preview'

export function ResumeSummaryWidget() {
  const resume = useResumeStore((state) => state.resume)
  
  return (
    <div className="border rounded-lg overflow-hidden max-h-96">
      <ResumePreview data={resume} />
    </div>
  )
}

// ============================================================================
// EXAMPLE 4: Export Resume from Another Component
// ============================================================================

import { downloadResumeAsHTML, downloadResumeAsJSON } from '@/lib/resume-pdf'

export function ExportButton() {
  const resume = useResumeStore((state) => state.resume)
  
  const handleExportHTML = () => {
    if (resume) {
      downloadResumeAsHTML(resume)
    }
  }
  
  const handleExportJSON = () => {
    if (resume) {
      downloadResumeAsJSON(resume)
    }
  }
  
  return (
    <div className="flex gap-2">
      <button onClick={handleExportHTML}>Export as HTML</button>
      <button onClick={handleExportJSON}>Export as JSON</button>
    </div>
  )
}

// ============================================================================
// EXAMPLE 5: Validate Resume Before Submission
// ============================================================================

import { StructuredResumeSchema } from '@/lib/schemas/resume'
import { ZodError } from 'zod'

export function ValidateResume() {
  const resume = useResumeStore((state) => state.resume)
  
  const handleValidate = async () => {
    if (!resume) {
      alert('No resume data')
      return
    }
    
    try {
      const validatedResume = StructuredResumeSchema.parse(resume)
      console.log('Resume is valid:', validatedResume)
      // Submit to server
      await fetch('/api/resume/submit', {
        method: 'POST',
        body: JSON.stringify(validatedResume),
      })
    } catch (error) {
      if (error instanceof ZodError) {
        // Handle validation errors
        const errors = error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
        alert('Validation errors:\n' + errors.join('\n'))
      }
    }
  }
  
  return <button onClick={handleValidate}>Validate & Submit</button>
}

// ============================================================================
// EXAMPLE 6: Reset/Clear Resume
// ============================================================================

export function ClearResumeButton() {
  const resetResume = useResumeStore((state) => state.resetResume)
  
  return (
    <button
      onClick={() => {
        if (confirm('Are you sure?')) {
          resetResume()
        }
      }}
    >
      Clear Resume
    </button>
  )
}

// ============================================================================
// EXAMPLE 7: Initialize Resume with Data
// ============================================================================

import type { StructuredResume } from '@/lib/schemas/resume'

export function LoadResumeExample() {
  const initializeResume = useResumeStore((state) => state.initializeResume)
  
  const handleLoadFromDatabase = async (resumeId: string) => {
    const response = await fetch(`/api/resume/load?id=${resumeId}`)
    const data = await response.json()
    
    if (data.success && data.data) {
      initializeResume(data.data as StructuredResume)
    }
  }
  
  return (
    <button onClick={() => handleLoadFromDatabase('resume_123')}>
      Load Resume
    </button>
  )
}

// ============================================================================
// EXAMPLE 8: Form Component with Resume Integration
// ============================================================================

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PersonalDataSchema, PersonalData } from '@/lib/schemas/resume'

export function ProfileForm() {
  const resume = useResumeStore((state) => state.resume)
  const updatePersonalData = useResumeStore((state) => state.updatePersonalData)
  
  const form = useForm<PersonalData>({
    resolver: zodResolver(PersonalDataSchema),
    defaultValues: resume?.personal_data,
  })
  
  const onSubmit = (data: PersonalData) => {
    updatePersonalData(data)
    // Also save to server
    fetch('/api/resume/save', {
      method: 'POST',
      body: JSON.stringify(resume),
    })
  }
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields here */}
      <button type="submit">Save</button>
    </form>
  )
}

// ============================================================================
// EXAMPLE 9: Job Matching Based on Resume
// ============================================================================

interface JobMatch {
  matchScore: number
  missingSkills: string[]
}

export function CalculateJobMatch(jobRequiredSkills: string[]): JobMatch {
  const resume = useResumeStore((state) => state.resume)
  
  if (!resume) {
    return { matchScore: 0, missingSkills: jobRequiredSkills }
  }
  
  const resumeSkills = resume.skills.map(s => s.skill_name.toLowerCase())
  const matchedSkills = jobRequiredSkills.filter(req =>
    resumeSkills.some(resumeSkill => resumeSkill.includes(req.toLowerCase()))
  )
  
  const matchScore = (matchedSkills.length / jobRequiredSkills.length) * 100
  const missingSkills = jobRequiredSkills.filter(req => !matchedSkills.includes(req))
  
  return { matchScore: Math.round(matchScore), missingSkills }
}

// Usage in a component:
export function JobCard({ job }: { job: { requiredSkills: string[] } }) {
  const { matchScore, missingSkills } = CalculateJobMatch(job.requiredSkills)
  
  return (
    <div>
      <p>Match Score: {matchScore}%</p>
      {missingSkills.length > 0 && (
        <p>Missing: {missingSkills.join(', ')}</p>
      )}
    </div>
  )
}

// ============================================================================
// EXAMPLE 10: Subscribe to Resume Changes
// ============================================================================

export function ResumeObserver() {
  React.useEffect(() => {
    // Subscribe to resume store changes
    const unsubscribe = useResumeStore.subscribe(
      (state) => state.resume,
      (resume) => {
        console.log('Resume updated:', resume)
        // Perform side effects here
        // e.g., Auto-save, trigger analytics, etc.
      }
    )
    
    return unsubscribe
  }, [])
  
  return <div>Observing resume changes...</div>
}

// ============================================================================
// EXAMPLE 11: Type-Safe Resume Store Usage
// ============================================================================

import type {
  StructuredResume,
  PersonalData,
  Experience,
  Project,
  Skill,
  Education,
} from '@/lib/schemas/resume'

export function TypeSafeExample() {
  const resume: StructuredResume | null = useResumeStore((state) => state.resume)
  
  if (!resume) return null
  
  // All of these are type-safe
  const firstName: string = resume.personal_data.firstName
  const experiences: Experience[] = resume.experiences
  const projects: Project[] = resume.projects
  const skills: Skill[] = resume.skills
  const education: Education[] = resume.education
  
  return (
    <div>
      {/* Use the data with full type safety */}
      <h1>{firstName}</h1>
    </div>
  )
}

// ============================================================================
// EXAMPLE 12: Custom Hook for Resume
// ============================================================================

/**
 * Custom hook to work with resume data
 * Makes it easier to use the resume store in components
 */
export function useResume() {
  const resume = useResumeStore((state) => state.resume)
  const updatePersonalData = useResumeStore((state) => state.updatePersonalData)
  const addExperience = useResumeStore((state) => state.addExperience)
  const addProject = useResumeStore((state) => state.addProject)
  const addSkill = useResumeStore((state) => state.addSkill)
  const resetResume = useResumeStore((state) => state.resetResume)
  
  return {
    resume,
    updatePersonalData,
    addExperience,
    addProject,
    addSkill,
    resetResume,
    
    // Helper methods
    isEmpty: () => !resume || !resume.personal_data.firstName,
    getFullName: () =>
      resume
        ? `${resume.personal_data.firstName} ${resume.personal_data.lastName || ''}`
        : '',
    getTotalExperience: () => resume?.experiences.length || 0,
    getSkillsCount: () => resume?.skills.length || 0,
  }
}

// Usage:
export function MyComponentWithCustomHook() {
  const { resume, getFullName, getTotalExperience } = useResume()
  
  return (
    <div>
      <h1>{getFullName()}</h1>
      <p>Experiences: {getTotalExperience()}</p>
    </div>
  )
}

/**
 * Integration Checklist
 * 
 * ✅ Access resume data from any component
 * ✅ Update resume data from any component
 * ✅ Validate resume before submission
 * ✅ Export resume in multiple formats
 * ✅ Initialize resume from database
 * ✅ Subscribe to resume changes
 * ✅ Type-safe throughout
 * ✅ Ready for production
 */
