import { cache } from 'react'
import { redirect } from 'next/navigation'
import { getResumeById } from '@/lib/resume-actions'
import { ResumeEditorClient } from '@/components/resume/editor/resume-editor-client'
import { Resume } from '@/lib/types'

const getResumePageData = cache(async (resumeId: string) => {
  return getResumeById(resumeId)
})

function normalizeResumeData(resume: Resume): Resume {
  return {
    ...resume,
    work_experience: resume.work_experience?.map(exp => ({ ...exp, date: exp.date || '' })) || [],
    education: resume.education?.map(edu => ({ ...edu, date: edu.date || '' })) || [],
    projects: resume.projects?.map(project => ({ ...project, date: project.date || '' })) || [],
    document_settings: resume.document_settings || {
      document_font_size: 10,
      document_line_height: 1.5,
      document_margin_vertical: 36,
      document_margin_horizontal: 36,
      header_name_size: 24,
      header_name_bottom_spacing: 24,
      skills_margin_top: 2,
      skills_margin_bottom: 2,
      skills_margin_horizontal: 0,
      skills_item_spacing: 2,
      experience_margin_top: 2,
      experience_margin_bottom: 2,
      experience_margin_horizontal: 0,
      experience_item_spacing: 4,
      projects_margin_top: 2,
      projects_margin_bottom: 2,
      projects_margin_horizontal: 0,
      projects_item_spacing: 4,
      education_margin_top: 2,
      education_margin_bottom: 2,
      education_margin_horizontal: 0,
      education_item_spacing: 4
    }
  }
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { resume: rawResume, profile, job } = await getResumePageData(id)
    const normalizedResume = normalizeResumeData(rawResume)

    return (
      <div className="h-full flex flex-col" data-page-title={normalizedResume.name} data-resume-type={normalizedResume.is_base_resume ? 'Base Resume' : 'Tailored Resume'}>
        <ResumeEditorClient initialResume={normalizedResume} profile={profile} initialJob={job} />
      </div>
    )
  } catch (error) {
    console.error('❌ [Error]:', error)
    if (error instanceof Error && error.message === 'User not authenticated') {
      redirect('/')
    }
    redirect('/')
  }
}
