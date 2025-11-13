import { Resume, Profile, Job, WorkExperience, Education, Skill, Project } from '@/lib/types'
import { Label } from '@/components/ui/labelInteractive'
import { Input } from '@/components/ui/inputInteractive'
import { Button } from '@/components/ui/buttonTable'

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

  const updateArrayField = <T,>(field: keyof Resume, newArr: T[]) => {
    if (onResumeChange) onResumeChange(field, newArr as unknown)
  }

  // Work experience handlers
  const addWork = () => {
    const newWork: WorkExperience = { company: '', position: '', location: '', date: '', description: [], technologies: [] }
    updateArrayField('work_experience', [...(resume.work_experience || []), newWork])
  }

  const updateWorkAt = (idx: number, patch: Partial<WorkExperience>) => {
    const arr = [...(resume.work_experience || [])]
    arr[idx] = { ...arr[idx], ...patch }
    updateArrayField('work_experience', arr)
  }

  const removeWorkAt = (idx: number) => {
    const arr = [...(resume.work_experience || [])]
    arr.splice(idx, 1)
    updateArrayField('work_experience', arr)
  }

  // Education handlers
  const addEducation = () => {
    const newEdu: Education = { school: '', degree: '', field: '', location: '', date: '', gpa: undefined, achievements: [] }
    updateArrayField('education', [...(resume.education || []), newEdu])
  }

  const updateEducationAt = (idx: number, patch: Partial<Education>) => {
    const arr = [...(resume.education || [])]
    arr[idx] = { ...arr[idx], ...patch }
    updateArrayField('education', arr)
  }

  const removeEducationAt = (idx: number) => {
    const arr = [...(resume.education || [])]
    arr.splice(idx, 1)
    updateArrayField('education', arr)
  }

  // Skills handlers
  const addSkill = () => {
    const newSkill: Skill = { category: '', items: [] }
    updateArrayField('skills', [...(resume.skills || []), newSkill])
  }

  const updateSkillAt = (idx: number, patch: Partial<Skill>) => {
    const arr = [...(resume.skills || [])]
    arr[idx] = { ...arr[idx], ...patch }
    updateArrayField('skills', arr)
  }

  const removeSkillAt = (idx: number) => {
    const arr = [...(resume.skills || [])]
    arr.splice(idx, 1)
    updateArrayField('skills', arr)
  }

  // Projects handlers
  const addProject = () => {
    const newProject: Project = { name: '', description: [], date: '', technologies: [], url: '', github_url: '' }
    updateArrayField('projects', [...(resume.projects || []), newProject])
  }

  const updateProjectAt = (idx: number, patch: Partial<Project>) => {
    const arr = [...(resume.projects || [])]
    arr[idx] = { ...arr[idx], ...patch }
    updateArrayField('projects', arr)
  }

  const removeProjectAt = (idx: number) => {
    const arr = [...(resume.projects || [])]
    arr.splice(idx, 1)
    updateArrayField('projects', arr)
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
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-purple-900">Work Experience</h3>
            <Button variant="ghost" size="sm" onClick={addWork}>Add Experience</Button>
          </div>
          <p className="text-xs text-muted-foreground">{resume.work_experience?.length || 0} entries</p>
          <div className="space-y-3">
            {(resume.work_experience || []).map((we, i) => (
              <div key={i} className="p-3 bg-white rounded-md border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <Label>Company</Label>
                    <Input value={we.company || ''} onChange={(e) => updateWorkAt(i, { company: e.target.value })} />
                  </div>
                  <div>
                    <Label>Position</Label>
                    <Input value={we.position || ''} onChange={(e) => updateWorkAt(i, { position: e.target.value })} />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input value={we.location || ''} onChange={(e) => updateWorkAt(i, { location: e.target.value })} />
                  </div>
                  <div>
                    <Label>Date</Label>
                    <Input value={we.date || ''} onChange={(e) => updateWorkAt(i, { date: e.target.value })} />
                  </div>
                </div>
                <div className="mt-2">
                  <Label>Description (comma separated)</Label>
                  <Input value={(we.description || []).join(', ')} onChange={(e) => updateWorkAt(i, { description: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
                </div>
                <div className="mt-2">
                  <Label>Technologies (comma separated)</Label>
                  <Input value={(we.technologies || []).join(', ')} onChange={(e) => updateWorkAt(i, { technologies: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
                </div>
                <div className="mt-2 flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => removeWorkAt(i)}>Remove</Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 bg-purple-50/30 p-4 rounded-lg border border-purple-200/30">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-purple-900">Education</h3>
            <Button variant="ghost" size="sm" onClick={addEducation}>Add Education</Button>
          </div>
          <p className="text-xs text-muted-foreground">{resume.education?.length || 0} entries</p>
          <div className="space-y-3">
            {(resume.education || []).map((ed, i) => (
              <div key={i} className="p-3 bg-white rounded-md border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <Label>School</Label>
                    <Input value={ed.school || ''} onChange={(e) => updateEducationAt(i, { school: e.target.value })} />
                  </div>
                  <div>
                    <Label>Degree</Label>
                    <Input value={ed.degree || ''} onChange={(e) => updateEducationAt(i, { degree: e.target.value })} />
                  </div>
                  <div>
                    <Label>Field</Label>
                    <Input value={ed.field || ''} onChange={(e) => updateEducationAt(i, { field: e.target.value })} />
                  </div>
                  <div>
                    <Label>Date</Label>
                    <Input value={ed.date || ''} onChange={(e) => updateEducationAt(i, { date: e.target.value })} />
                  </div>
                </div>
                <div className="mt-2">
                  <Label>Location</Label>
                  <Input value={ed.location || ''} onChange={(e) => updateEducationAt(i, { location: e.target.value })} />
                </div>
                <div className="mt-2 flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => removeEducationAt(i)}>Remove</Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 bg-purple-50/30 p-4 rounded-lg border border-purple-200/30">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-purple-900">Skills</h3>
            <Button variant="ghost" size="sm" onClick={addSkill}>Add Skill Category</Button>
          </div>
          <p className="text-xs text-muted-foreground">{resume.skills?.length || 0} skill categories</p>
          <div className="space-y-3">
            {(resume.skills || []).map((sk, i) => (
              <div key={i} className="p-3 bg-white rounded-md border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <Label>Category</Label>
                    <Input value={sk.category || ''} onChange={(e) => updateSkillAt(i, { category: e.target.value })} />
                  </div>
                  <div>
                    <Label>Items (comma separated)</Label>
                    <Input value={(sk.items || []).join(', ')} onChange={(e) => updateSkillAt(i, { items: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
                  </div>
                </div>
                <div className="mt-2 flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => removeSkillAt(i)}>Remove</Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 bg-purple-50/30 p-4 rounded-lg border border-purple-200/30">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-purple-900">Projects</h3>
            <Button variant="ghost" size="sm" onClick={addProject}>Add Project</Button>
          </div>
          <p className="text-xs text-muted-foreground">{resume.projects?.length || 0} projects</p>
          <div className="space-y-3">
            {(resume.projects || []).map((pr, i) => (
              <div key={i} className="p-3 bg-white rounded-md border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <Label>Name</Label>
                    <Input value={pr.name || ''} onChange={(e) => updateProjectAt(i, { name: e.target.value })} />
                  </div>
                  <div>
                    <Label>Date</Label>
                    <Input value={pr.date || ''} onChange={(e) => updateProjectAt(i, { date: e.target.value })} />
                  </div>
                </div>
                <div className="mt-2">
                  <Label>Description (comma separated)</Label>
                  <Input value={(pr.description || []).join(', ')} onChange={(e) => updateProjectAt(i, { description: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
                </div>
                <div className="mt-2">
                  <Label>Technologies (comma separated)</Label>
                  <Input value={(pr.technologies || []).join(', ')} onChange={(e) => updateProjectAt(i, { technologies: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
                </div>
                <div className="mt-2 flex justify-between">
                  <div className="w-1/2 pr-2">
                    <Label>URL</Label>
                    <Input value={pr.url || ''} onChange={(e) => updateProjectAt(i, { url: e.target.value })} />
                  </div>
                  <div className="w-1/2 pl-2">
                    <Label>Github URL</Label>
                    <Input value={pr.github_url || ''} onChange={(e) => updateProjectAt(i, { github_url: e.target.value })} />
                  </div>
                </div>
                <div className="mt-2 flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => removeProjectAt(i)}>Remove</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
