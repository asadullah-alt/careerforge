'use client'

import React from 'react'
import { Education } from './types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/cardInteractive'
import { Input } from '@/components/ui/inputInteractive'
import { Label } from '@/components/ui/labelInteractive'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface EducationFormProps {
  education: Education[]
  onChange: (education: Education[]) => void
}

const emptyEducation: Education = {
  institution: '',
  degree: '',
  fieldOfStudy: '',
  startDate: '',
  endDate: '',
  grade: '',
  description: '',
}

export function EducationForm({ education, onChange }: EducationFormProps) {
  const handleAddEducation = () => {
    onChange([...education, { ...emptyEducation }])
  }

  const handleRemoveEducation = (index: number) => {
    onChange(education.filter((_, i) => i !== index))
  }

  const handleUpdateEducation = (index: number, field: keyof Education, value: string) => {
    const updated = [...education]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Education</CardTitle>
          <CardDescription>Add your educational background</CardDescription>
        </div>
        <Button onClick={handleAddEducation} size="sm">
          Add Education
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {education.map((edu, index) => (
          <div key={index} className="space-y-4 p-4 border rounded-lg relative">
            <button
              onClick={() => handleRemoveEducation(index)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Institution</Label>
                <Input
                  value={edu.institution || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleUpdateEducation(index, 'institution', e.target.value)
                  }
                  placeholder="University Name"
                />
              </div>
              <div>
                <Label>Degree</Label>
                <Input
                  value={edu.degree || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleUpdateEducation(index, 'degree', e.target.value)
                  }
                  placeholder="Bachelor of Science"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Field of Study</Label>
                <Input
                  value={edu.fieldOfStudy || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleUpdateEducation(index, 'fieldOfStudy', e.target.value)
                  }
                  placeholder="Computer Science"
                />
              </div>
              <div>
                <Label>Grade/GPA</Label>
                <Input
                  value={edu.grade || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleUpdateEducation(index, 'grade', e.target.value)
                  }
                  placeholder="3.8/4.0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input
                  value={edu.startDate || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleUpdateEducation(index, 'startDate', e.target.value)
                  }
                  placeholder="Sep 2016"
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  value={edu.endDate || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleUpdateEducation(index, 'endDate', e.target.value)
                  }
                  placeholder="May 2020"
                />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Input
                value={edu.description || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleUpdateEducation(index, 'description', e.target.value)
                }
                placeholder="Relevant coursework, honors, activities"
              />
            </div>
          </div>
        ))}

        {education.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No education added yet. Click &quot;Add Education&quot; to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
