'use client'

import React from 'react'
import { Project } from './types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/cardInteractive'
import { Input } from '@/components/ui/inputInteractive'
import { Label } from '@/components/ui/labelInteractive'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface ProjectsFormProps {
  projects: Project[]
  onChange: (projects: Project[]) => void
}

const emptyProject: Project = {
  projectName: '',
  description: '',
  technologiesUsed: [],
  link: '',
  startDate: '',
  endDate: '',
}

export function ProjectsForm({ projects, onChange }: ProjectsFormProps) {
  const handleAddProject = () => {
    onChange([...projects, { ...emptyProject }])
  }

  const handleRemoveProject = (index: number) => {
    onChange(projects.filter((_, i) => i !== index))
  }

  const handleUpdateProject = (index: number, field: keyof Project, value: unknown) => {
    const updated = [...projects]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Projects</CardTitle>
          <CardDescription>Showcase your projects and work</CardDescription>
        </div>
        <Button onClick={handleAddProject} size="sm">
          Add Project
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {projects.map((project, index) => (
          <div key={index} className="space-y-4 p-4 border rounded-lg relative">
            <button
              onClick={() => handleRemoveProject(index)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Project Name *</Label>
                <Input
                  value={project.projectName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleUpdateProject(index, 'projectName', e.target.value)
                  }
                  placeholder="Project Title"
                />
              </div>
              <div>
                <Label>Link</Label>
                <Input
                  value={project.link || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleUpdateProject(index, 'link', e.target.value)
                  }
                  placeholder="https://github.com/user/project"
                />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Input
                value={project.description || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleUpdateProject(index, 'description', e.target.value)
                }
                placeholder="Brief description of the project"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input
                  value={project.startDate || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleUpdateProject(index, 'startDate', e.target.value)
                  }
                  placeholder="Jan 2023"
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  value={project.endDate || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleUpdateProject(index, 'endDate', e.target.value)
                  }
                  placeholder="Jun 2023"
                />
              </div>
            </div>

            <div>
              <Label>Technologies Used (comma-separated)</Label>
              <Input
                value={(project.technologiesUsed || []).join(', ')}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleUpdateProject(
                    index,
                    'technologiesUsed',
                    e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                  )
                }
                placeholder="React, Node.js, MongoDB"
              />
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No projects added yet. Click &quot;Add Project&quot; to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
