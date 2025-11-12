import { Resume } from '@/lib/types'

interface PreviewPanelProps {
  resume: Resume
  onResumeChange?: (field: keyof Resume, value: unknown) => void
  width: number
}

export function PreviewPanel({ resume, width }: PreviewPanelProps) {
  return (
    <div className="h-full pr-4 flex flex-col">
      <div className="flex-1 rounded-lg bg-white border border-gray-200 p-6 shadow-sm overflow-hidden flex flex-col items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-xl font-semibold text-gray-900">{resume.first_name} {resume.last_name}</h2>
          <p className="text-sm text-gray-600">{resume.target_role}</p>

          <div className="pt-4 space-y-2 text-xs text-gray-500">
            {resume.email && <p>📧 {resume.email}</p>}
            {resume.phone_number && <p>📱 {resume.phone_number}</p>}
            {resume.location && <p>📍 {resume.location}</p>}
          </div>

          <div className="pt-6 border-t border-gray-200 space-y-3 text-xs text-gray-600">
            <div>
              <p className="font-semibold text-gray-900">Work Experience</p>
              <p>{resume.work_experience?.length || 0} entries</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Education</p>
              <p>{resume.education?.length || 0} entries</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Skills</p>
              <p>{resume.skills?.length || 0} categories</p>
            </div>
          </div>

          <p className="text-[10px] text-gray-400 pt-4">
            Resume preview will render here. Preview width: {Math.round(width)}px
          </p>
        </div>
      </div>
    </div>
  )
}
