import { z } from 'zod';

// Location Schema
export const LocationSchema = z.object({
  city: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
});

export type Location = z.infer<typeof LocationSchema>;

// Personal Data Schema
export const PersonalDataSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  linkedin: z.string().url().optional().nullable(),
  portfolio: z.string().url().optional().nullable(),
  location: LocationSchema.optional().nullable(),
});

export type PersonalData = z.infer<typeof PersonalDataSchema>;

// Experience Schema
export const ExperienceSchema = z.object({
  job_title: z.string().min(1, "Job title is required"),
  company: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  description: z.array(z.string()).default([]),
  technologies_used: z.array(z.string()).optional().default([]),
});

export type Experience = z.infer<typeof ExperienceSchema>;

// Project Schema
export const ProjectSchema = z.object({
  project_name: z.string().min(1, "Project name is required"),
  description: z.string().optional().nullable(),
  technologies_used: z.array(z.string()).optional().default([]),
  link: z.string().url().optional().nullable(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
});

export type Project = z.infer<typeof ProjectSchema>;

// Skill Schema
export const SkillSchema = z.object({
  category: z.string().optional().nullable(),
  skill_name: z.string().min(1, "Skill name is required"),
});

export type Skill = z.infer<typeof SkillSchema>;

// Research Work Schema
export const ResearchWorkSchema = z.object({
  title: z.string().optional().nullable(),
  publication: z.string().optional().nullable(),
  date: z.string().optional().nullable(),
  link: z.string().url().optional().nullable(),
  description: z.string().optional().nullable(),
});

export type ResearchWork = z.infer<typeof ResearchWorkSchema>;

// Education Schema
export const EducationSchema = z.object({
  institution: z.string().optional().nullable(),
  degree: z.string().optional().nullable(),
  field_of_study: z.string().optional().nullable(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  grade: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

export type Education = z.infer<typeof EducationSchema>;

// Publication Schema
export const PublicationSchema = z.object({
  title: z.string().optional().nullable(),
  authors: z.array(z.string()).default([]),
  publication_venue: z.string().optional().nullable(),
  date: z.string().optional().nullable(),
  link: z.string().url().optional().nullable(),
  description: z.string().optional().nullable(),
});

export type Publication = z.infer<typeof PublicationSchema>;

// Conference Type Enum
export const ConferenceTypeEnum = z.enum(['conference', 'training', 'workshop']);
export type ConferenceType = z.infer<typeof ConferenceTypeEnum>;

// Conference/Training/Workshop Schema
export const ConferenceTrainingWorkshopSchema = z.object({
  type: ConferenceTypeEnum.optional().nullable(),
  name: z.string().optional().nullable(),
  organizer: z.string().optional().nullable(),
  date: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  certificate_link: z.string().url().optional().nullable(),
});

export type ConferenceTrainingWorkshop = z.infer<typeof ConferenceTrainingWorkshopSchema>;

// Award Schema
export const AwardSchema = z.object({
  title: z.string().optional().nullable(),
  issuer: z.string().optional().nullable(),
  date: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

export type Award = z.infer<typeof AwardSchema>;

// Extracurricular Activity Schema
export const ExtracurricularActivitySchema = z.object({
  activity_name: z.string().optional().nullable(),
  role: z.string().optional().nullable(),
  organization: z.string().optional().nullable(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

export type ExtracurricularActivity = z.infer<typeof ExtracurricularActivitySchema>;

// Language Schema
export const LanguageSchema = z.object({
  language: z.string().optional().nullable(),
  proficiency: z.string().optional().nullable(),
});

export type Language = z.infer<typeof LanguageSchema>;

// Main Structured Resume Schema
export const StructuredResumeSchema = z.object({
  displayName: z.string().optional().nullable(),
  personal_data: PersonalDataSchema,
  experiences: z.array(ExperienceSchema).default([]),
  projects: z.array(ProjectSchema).optional().default([]),
  skills: z.array(SkillSchema).optional().default([]),
  research_work: z.array(ResearchWorkSchema).optional().default([]),
  achievements: z.array(z.string()).optional().default([]),
  education: z.array(EducationSchema).default([]),
  publications: z.array(PublicationSchema).optional().default([]),
  conferences_trainings_workshops: z.array(ConferenceTrainingWorkshopSchema).optional().default([]),
  awards: z.array(AwardSchema).optional().default([]),
  extracurricular_activities: z.array(ExtracurricularActivitySchema).optional().default([]),
  languages: z.array(LanguageSchema).optional().default([]),
  summary: z.string().optional().nullable(),
  extracted_keywords: z.array(z.string()).default([]),
});

export type StructuredResume = z.infer<typeof StructuredResumeSchema>;

// API Request/Response schemas
export const GenerateResumeRequestSchema = z.object({
  text: z.string().min(1, "Please provide resume text"),
});

export type GenerateResumeRequest = z.infer<typeof GenerateResumeRequestSchema>;

export const GenerateResumeResponseSchema = StructuredResumeSchema;
export type GenerateResumeResponse = z.infer<typeof GenerateResumeResponseSchema>;
