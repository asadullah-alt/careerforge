import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { StructuredResume, PersonalData, Experience, Project, Skill, Education, ResearchWork } from '@/lib/schemas/resume';

export interface ResumeState {
  resume: StructuredResume | null;
  isLoading: boolean;
  error: string | null;
  
  // Initialization
  initializeResume: (resume: StructuredResume) => void;
  resetResume: () => void;
  
  // Personal Data
  updatePersonalData: (data: Partial<PersonalData>) => void;
  
  // Experiences
  addExperience: (experience: Experience) => void;
  updateExperience: (index: number, experience: Experience) => void;
  removeExperience: (index: number) => void;
  reorderExperiences: (fromIndex: number, toIndex: number) => void;
  
  // Projects
  addProject: (project: Project) => void;
  updateProject: (index: number, project: Project) => void;
  removeProject: (index: number) => void;
  reorderProjects: (fromIndex: number, toIndex: number) => void;
  
  // Skills
  addSkill: (skill: Skill) => void;
  updateSkill: (index: number, skill: Skill) => void;
  removeSkill: (index: number) => void;
  
  // Education
  addEducation: (education: Education) => void;
  updateEducation: (index: number, education: Education) => void;
  removeEducation: (index: number) => void;
  
  // Research Work
  addResearchWork: (research: ResearchWork) => void;
  updateResearchWork: (index: number, research: ResearchWork) => void;
  removeResearchWork: (index: number) => void;
  
  // Achievements
  addAchievement: (achievement: string) => void;
  removeAchievement: (index: number) => void;
  
  // Keywords
  setKeywords: (keywords: string[]) => void;
  addKeyword: (keyword: string) => void;
  removeKeyword: (index: number) => void;
  
  // Loading and error states
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const defaultResume: StructuredResume = {
  personal_data: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    linkedin: '',
    portfolio: '',
    location: {
      city: '',
      country: '',
    },
  },
  experiences: [],
  projects: [],
  skills: [],
  research_work: [],
  achievements: [],
  education: [],
  extracted_keywords: [],
};

export const useResumeStore = create<ResumeState>()(
  devtools(
    persist(
      (set) => ({
        resume: defaultResume,
        isLoading: false,
        error: null,
        
        initializeResume: (resume) => {
          console.log("📥 [Store] initializeResume called with:", resume)
          set({ resume })
          console.log("✅ [Store] Resume initialized in store")
        },
        resetResume: () => {
          console.log("🔄 [Store] resetResume called")
          set({ resume: defaultResume, error: null })
          console.log("✅ [Store] Resume reset to default")
        },
        
        updatePersonalData: (data) =>
          set((state) => ({
            resume: state.resume
              ? { ...state.resume, personal_data: { ...state.resume.personal_data, ...data } }
              : null,
          })),
        
        addExperience: (experience) =>
          set((state) => ({
            resume: state.resume
              ? { ...state.resume, experiences: [...state.resume.experiences, experience] }
              : null,
          })),
        
        updateExperience: (index, experience) =>
          set((state) => ({
            resume: state.resume
              ? {
                  ...state.resume,
                  experiences: state.resume.experiences.map((e, i) =>
                    i === index ? experience : e
                  ),
                }
              : null,
          })),
        
        removeExperience: (index) =>
          set((state) => ({
            resume: state.resume
              ? {
                  ...state.resume,
                  experiences: state.resume.experiences.filter((_, i) => i !== index),
                }
              : null,
          })),
        
        reorderExperiences: (fromIndex, toIndex) =>
          set((state) => {
            if (!state.resume) return state;
            const newExperiences = [...state.resume.experiences];
            const [removed] = newExperiences.splice(fromIndex, 1);
            newExperiences.splice(toIndex, 0, removed);
            return {
              resume: { ...state.resume, experiences: newExperiences },
            };
          }),
        
        addProject: (project) =>
          set((state) => ({
            resume: state.resume
              ? { ...state.resume, projects: [...state.resume.projects, project] }
              : null,
          })),
        
        updateProject: (index, project) =>
          set((state) => ({
            resume: state.resume
              ? {
                  ...state.resume,
                  projects: state.resume.projects.map((p, i) =>
                    i === index ? project : p
                  ),
                }
              : null,
          })),
        
        removeProject: (index) =>
          set((state) => ({
            resume: state.resume
              ? {
                  ...state.resume,
                  projects: state.resume.projects.filter((_, i) => i !== index),
                }
              : null,
          })),
        
        reorderProjects: (fromIndex, toIndex) =>
          set((state) => {
            if (!state.resume) return state;
            const newProjects = [...state.resume.projects];
            const [removed] = newProjects.splice(fromIndex, 1);
            newProjects.splice(toIndex, 0, removed);
            return {
              resume: { ...state.resume, projects: newProjects },
            };
          }),
        
        addSkill: (skill) =>
          set((state) => ({
            resume: state.resume
              ? { ...state.resume, skills: [...state.resume.skills, skill] }
              : null,
          })),
        
        updateSkill: (index, skill) =>
          set((state) => ({
            resume: state.resume
              ? {
                  ...state.resume,
                  skills: state.resume.skills.map((s, i) =>
                    i === index ? skill : s
                  ),
                }
              : null,
          })),
        
        removeSkill: (index) =>
          set((state) => ({
            resume: state.resume
              ? {
                  ...state.resume,
                  skills: state.resume.skills.filter((_, i) => i !== index),
                }
              : null,
          })),
        
        addEducation: (education) =>
          set((state) => ({
            resume: state.resume
              ? { ...state.resume, education: [...state.resume.education, education] }
              : null,
          })),
        
        updateEducation: (index, education) =>
          set((state) => ({
            resume: state.resume
              ? {
                  ...state.resume,
                  education: state.resume.education.map((e, i) =>
                    i === index ? education : e
                  ),
                }
              : null,
          })),
        
        removeEducation: (index) =>
          set((state) => ({
            resume: state.resume
              ? {
                  ...state.resume,
                  education: state.resume.education.filter((_, i) => i !== index),
                }
              : null,
          })),
        
        addResearchWork: (research) =>
          set((state) => ({
            resume: state.resume
              ? { ...state.resume, research_work: [...state.resume.research_work, research] }
              : null,
          })),
        
        updateResearchWork: (index, research) =>
          set((state) => ({
            resume: state.resume
              ? {
                  ...state.resume,
                  research_work: state.resume.research_work.map((r, i) =>
                    i === index ? research : r
                  ),
                }
              : null,
          })),
        
        removeResearchWork: (index) =>
          set((state) => ({
            resume: state.resume
              ? {
                  ...state.resume,
                  research_work: state.resume.research_work.filter((_, i) => i !== index),
                }
              : null,
          })),
        
        addAchievement: (achievement) =>
          set((state) => ({
            resume: state.resume
              ? { ...state.resume, achievements: [...state.resume.achievements, achievement] }
              : null,
          })),
        
        removeAchievement: (index) =>
          set((state) => ({
            resume: state.resume
              ? {
                  ...state.resume,
                  achievements: state.resume.achievements.filter((_, i) => i !== index),
                }
              : null,
          })),
        
        setKeywords: (keywords) =>
          set((state) => ({
            resume: state.resume
              ? { ...state.resume, extracted_keywords: keywords }
              : null,
          })),
        
        addKeyword: (keyword) =>
          set((state) => ({
            resume: state.resume
              ? {
                  ...state.resume,
                  extracted_keywords: [...state.resume.extracted_keywords, keyword],
                }
              : null,
          })),
        
        removeKeyword: (index) =>
          set((state) => ({
            resume: state.resume
              ? {
                  ...state.resume,
                  extracted_keywords: state.resume.extracted_keywords.filter(
                    (_, i) => i !== index
                  ),
                }
              : null,
          })),
        
        setLoading: (loading) => set({ isLoading: loading }),
        setError: (error) => set({ error }),
      }),
      {
        name: 'resume-store',
      }
    )
  )
);
