'use client'

import React from 'react'
import { Experience } from './types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/cardInteractive'
import { Input } from '@/components/ui/inputInteractive'
import { Label } from '@/components/ui/labelInteractive'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface ExperienceFormProps {
  experiences: Experience[]
  onChange: (experiences: Experience[]) => void
}

const emptyExperience: Experience = {
  jobTitle: '',
  company: '',
  location: '',
  startDate: '',
  endDate: '',
  description: [],
  technologiesUsed: [],
}

export function ExperienceForm({ experiences, onChange }: ExperienceFormProps) {
  const handleAddExperience = () => {
    onChange([...experiences, { ...emptyExperience }])
  }

  const handleRemoveExperience = (index: number) => {
    onChange(experiences.filter((_, i) => i !== index))
  }

  const handleUpdateExperience = (index: number, field: keyof Experience, value: unknown) => {
    const updated = [...experiences]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const handleAddDescription = (index: number) => {
    const updated = [...experiences]
    updated[index].description.push('')
    onChange(updated)
  }

  const handleUpdateDescription = (expIndex: number, descIndex: number, value: string) => {
    const updated = [...experiences]
    updated[expIndex].description[descIndex] = value
    onChange(updated)
  }

  const handleRemoveDescription = (expIndex: number, descIndex: number) => {
    const updated = [...experiences]
    updated[expIndex].description = updated[expIndex].description.filter((_, i) => i !== descIndex)
    onChange(updated)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Experience</CardTitle>
          <CardDescription>Add your work experience</CardDescription>
        </div>
        <Button onClick={handleAddExperience} size="sm">
          Add Experience
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {experiences.map((exp, expIndex) => (
          <div key={expIndex} className="space-y-4 p-4 border rounded-lg relative">
            <button
              onClick={() => handleRemoveExperience(expIndex)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Job Title *</Label>
                <Input
                  value={exp.jobTitle}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleUpdateExperience(expIndex, 'jobTitle', e.target.value)
                  }
                  placeholder="Senior Developer"
                />
              </div>
              <div>
                <Label>Company</Label>
                <Input
                  value={exp.company || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleUpdateExperience(expIndex, 'company', e.target.value)
                  }
                  placeholder="Tech Company"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Location</Label>
                <Input
                  value={exp.location || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleUpdateExperience(expIndex, 'location', e.target.value)
                  }
                  placeholder="San Francisco, CA"
                />
              </div>
              <div>
                <Label>Start Date</Label>
                <Input
                  value={exp.startDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleUpdateExperience(expIndex, 'startDate', e.target.value)
                  }
                  placeholder="Jan 2020"
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  value={exp.endDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleUpdateExperience(expIndex, 'endDate', e.target.value)
                  }
                  placeholder="Present"
                />
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Description Points</Label>
              <div className="space-y-2">
                {exp.description.map((desc, descIndex) => (
                  <div key={descIndex} className="flex gap-2">
                    <Input
                      value={desc}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleUpdateDescription(expIndex, descIndex, e.target.value)
                      }
                      placeholder="Add responsibility or achievement"
                      className="flex-1"
                    />
                    <Button
                      onClick={() => handleRemoveDescription(expIndex, descIndex)}
                      size="sm"
                      variant="destructive"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => handleAddDescription(expIndex)}
                size="sm"
                variant="outline"
                className="mt-2"
              >
                Add Point
              </Button>
            </div>

            <div>
              <Label>Technologies Used (comma-separated)</Label>
              <Input
                value={(exp.technologiesUsed || []).join(', ')}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleUpdateExperience(
                    expIndex,
                    'technologiesUsed',
                    e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                  )
                }
                placeholder="React, TypeScript, Node.js"
              />
            </div>
          </div>
        ))}

        {experiences.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No experience added yet. Click &quot;Add Experience&quot; to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
