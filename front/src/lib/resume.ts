/**
 * Resume Builder Type Reference
 * 
 * This file exports all types used in the Resume Builder module
 * for easy importing and IDE autocomplete support
 */

export type {
  Location,
  PersonalData,
  Experience,
  Project,
  Skill,
  ResearchWork,
  Education,
  StructuredResume,
  GenerateResumeRequest,
  GenerateResumeResponse,
} from '@/lib/schemas/resume'

export {
  LocationSchema,
  PersonalDataSchema,
  ExperienceSchema,
  ProjectSchema,
  SkillSchema,
  ResearchWorkSchema,
  EducationSchema,
  StructuredResumeSchema,
  GenerateResumeRequestSchema,
  GenerateResumeResponseSchema,
} from '@/lib/schemas/resume'

// Re-export Zustand store hook for convenience
export { useResumeStore } from '@/store/resume-store'
export type { ResumeState } from '@/store/resume-store'

// Export utility functions
export {
  generateResumeHTML,
  downloadResumeAsHTML,
  downloadResumeAsJSON,
} from '@/lib/resume-pdf'

/**
 * Example usage in components:
 * 
 * import { StructuredResume, useResumeStore } from '@/lib/resume'
 * 
 * export function MyComponent() {
 *   const resume = useResumeStore((state) => state.resume)
 *   
 *   const handleUpdate = (data: Partial<PersonalData>) => {
 *     // Type-safe update
 *   }
 * }
 */
