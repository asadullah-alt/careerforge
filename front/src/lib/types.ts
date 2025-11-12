// Resume and related types for the front project
// These are minimal type definitions needed for resume functionality

export interface WorkExperience {
  company: string
  position: string
  location?: string
  date: string
  description: string[]
  technologies?: string[]
}

export interface Education {
  school: string
  degree: string
  field: string
  location?: string
  date: string
  gpa?: number | string
  achievements?: string[]
}

export interface Project {
  name: string
  description: string[]
  date?: string
  technologies?: string[]
  url?: string
  github_url?: string
}

export interface Skill {
  category: string
  items: string[]
}

export interface DocumentSettings {
  document_font_size: number
  document_line_height: number
  document_margin_vertical: number
  document_margin_horizontal: number
  header_name_size: number
  header_name_bottom_spacing: number
  skills_margin_top: number
  skills_margin_bottom: number
  skills_margin_horizontal: number
  skills_item_spacing: number
  experience_margin_top: number
  experience_margin_bottom: number
  experience_margin_horizontal: number
  experience_item_spacing: number
  projects_margin_top: number
  projects_margin_bottom: number
  projects_margin_horizontal: number
  projects_item_spacing: number
  education_margin_top: number
  education_margin_bottom: number
  education_margin_horizontal: number
  education_item_spacing: number
  show_ubc_footer?: boolean
  footer_width?: number
}

export interface Resume {
  id: string
  user_id: string
  job_id?: string | null
  name: string
  target_role: string
  is_base_resume: boolean
  first_name: string
  last_name: string
  email: string
  phone_number?: string
  location?: string
  website?: string
  linkedin_url?: string
  github_url?: string
  work_experience: WorkExperience[]
  education: Education[]
  skills: Skill[]
  projects: Project[]
  created_at: string
  updated_at: string
  document_settings?: DocumentSettings
  section_order?: string[]
  section_configs?: {
    [key: string]: { visible: boolean }
  }
  has_cover_letter: boolean
  cover_letter?: Record<string, unknown> | null
}

export interface Profile {
  id: string
  user_id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  phone_number: string | null
  location: string | null
  website: string | null
  linkedin_url: string | null
  github_url: string | null
  work_experience: WorkExperience[]
  education: Education[]
  skills: Skill[]
  projects: Project[]
  created_at: string
  updated_at: string
}

export interface Job {
  id: string
  user_id: string
  company_name: string
  position_title: string
  job_url: string | null
  description: string | null
  location: string | null
  salary_range: string | null
  keywords: string[]
  work_location: 'remote' | 'in_person' | 'hybrid' | null
  employment_type: 'full_time' | 'part_time' | 'co_op' | 'internship' | 'contract' | null
  created_at: string
  updated_at: string
  is_active: boolean
}
