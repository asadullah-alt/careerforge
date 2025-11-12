export interface Location {
  city?: string
  country?: string
}

export interface PersonalData {
  firstName: string
  lastName?: string
  email?: string
  phone?: string
  linkedin?: string
  portfolio?: string
  location?: Location
}

export interface Experience {
  jobTitle: string
  company?: string
  location?: string
  startDate: string
  endDate: string
  description: string[]
  technologiesUsed?: string[]
}

export interface Project {
  projectName: string
  description?: string
  technologiesUsed: string[]
  link?: string
  startDate?: string
  endDate?: string
}

export interface Skill {
  category?: string
  skillName: string
}

export interface ResearchWork {
  title?: string
  publication?: string
  date?: string
  link?: string
  description?: string
}

export interface Education {
  institution?: string
  degree?: string
  fieldOfStudy?: string
  startDate?: string
  endDate?: string
  grade?: string
  description?: string
}

export interface StructuredResume {
  personalData: PersonalData
  experiences: Experience[]
  projects: Project[]
  skills: Skill[]
  researchWork?: ResearchWork[]
  achievements?: string[]
  education?: Education[]
  extractedKeywords?: string[]
}
