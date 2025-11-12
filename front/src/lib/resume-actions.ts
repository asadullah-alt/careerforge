// Lightweight stubbed resume actions for the front project.
// These mirror the small data shape expected by the imported pages.

import { Resume, Profile, Job } from '@/lib/types'

export async function getDashboardData(): Promise<{ baseResumes: Resume[]; tailoredResumes: Resume[] }> {
  // TODO: Replace with actual server action/api call to fetch user resumes.
  return {
    baseResumes: [] as Resume[],
    tailoredResumes: [] as Resume[],
  }
}

export async function getResumeById(id: string): Promise<{ resume: Resume; profile: Profile | null; job: Job | null }>{
  // Minimal mocked resume object to allow the detail page to render.
  const now = new Date().toISOString()
  const resume: Resume = {
    id,
    user_id: 'user-unknown',
    name: 'Untitled Resume',
    target_role: '',
    is_base_resume: true,
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    location: '',
    website: '',
    linkedin_url: '',
    github_url: '',
    work_experience: [],
    education: [],
    skills: [],
    projects: [],
    created_at: now,
    updated_at: now,
    has_cover_letter: false,
  }

  return {
    resume,
    profile: null,
    job: null,
  }
}