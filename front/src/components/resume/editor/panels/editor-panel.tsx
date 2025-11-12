import { Resume, Profile, Job } from '@/lib/types'

interface EditorPanelProps {
  resume: Resume
  profile: Profile | null
  job: Job | null
  isLoadingJob: boolean
  onResumeChange?: (field: keyof Resume, value: unknown) => void
}

export function EditorPanel({ resume, onResumeChange }: EditorPanelProps) {
  return (
    <div className="flex flex-col h-full mr-4 space-y-4">
      <div className="sticky top-0 z-20 space-y-4 backdrop-blur-sm bg-purple-50/80 p-4 rounded-t-lg border-b border-purple-200/50">
        <h2 className="text-lg font-semibold text-purple-900">Resume Editor</h2>
        <p className="text-sm text-muted-foreground">Edit your resume details below</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 px-2">
        <div className="space-y-4 bg-purple-50/30 p-4 rounded-lg border border-purple-200/30">
          <h3 className="font-semibold text-sm text-purple-900">Basic Information</h3>
          <p className="text-xs text-muted-foreground">Resume editing forms will be implemented here.</p>
          <div className="space-y-2 text-xs text-gray-600">
            <p>Name: {resume.first_name} {resume.last_name}</p>
            <p>Email: {resume.email}</p>
            <p>Phone: {resume.phone_number}</p>
          </div>
        </div>

        <div className="space-y-4 bg-purple-50/30 p-4 rounded-lg border border-purple-200/30">
          <h3 className="font-semibold text-sm text-purple-900">Work Experience</h3>
          <p className="text-xs text-muted-foreground">{resume.work_experience?.length || 0} entries</p>
        </div>

        <div className="space-y-4 bg-purple-50/30 p-4 rounded-lg border border-purple-200/30">
          <h3 className="font-semibold text-sm text-purple-900">Education</h3>
          <p className="text-xs text-muted-foreground">{resume.education?.length || 0} entries</p>
        </div>

        <div className="space-y-4 bg-purple-50/30 p-4 rounded-lg border border-purple-200/30">
          <h3 className="font-semibold text-sm text-purple-900">Skills</h3>
          <p className="text-xs text-muted-foreground">{resume.skills?.length || 0} skill categories</p>
        </div>
      </div>
    </div>
  )
}
