import { Resume, Profile, Job } from '@/lib/types'
import { Label } from '@/components/ui/labelInteractive'
import { Input } from '@/components/ui/inputInteractive'

interface EditorPanelProps {
  resume: Resume
  profile: Profile | null
  job: Job | null
  isLoadingJob: boolean
  onResumeChange?: (field: keyof Resume, value: unknown) => void
}

export function EditorPanel({ resume, onResumeChange }: EditorPanelProps) {
  const handleChange = (field: keyof Resume) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onResumeChange) onResumeChange(field, e.target.value)
  }

  return (
    <div className="flex flex-col h-full mr-4 space-y-4">
      <div className="sticky top-0 z-20 space-y-4 backdrop-blur-sm bg-purple-50/80 p-4 rounded-t-lg border-b border-purple-200/50">
        <h2 className="text-lg font-semibold text-purple-900">Resume Editor</h2>
        <p className="text-sm text-muted-foreground">Edit your resume details below</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 px-2">
        <div className="space-y-4 bg-purple-50/30 p-4 rounded-lg border border-purple-200/30">
          <h3 className="font-semibold text-sm text-purple-900">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label>First name</Label>
              <Input value={resume.first_name || ''} onChange={handleChange('first_name')} />
            </div>
            <div>
              <Label>Last name</Label>
              <Input value={resume.last_name || ''} onChange={handleChange('last_name')} />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={resume.email || ''} onChange={handleChange('email')} />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={resume.phone_number || ''} onChange={handleChange('phone_number')} />
            </div>
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
