'use client'

import React from 'react'
import { Skill } from './types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/cardInteractive'
import { Input } from '@/components/ui/inputInteractive'
import { Label } from '@/components/ui/labelInteractive'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface SkillsFormProps {
  skills: Skill[]
  onChange: (skills: Skill[]) => void
}

const emptySkill: Skill = {
  category: '',
  skillName: '',
}

export function SkillsForm({ skills, onChange }: SkillsFormProps) {
  const handleAddSkill = () => {
    onChange([...skills, { ...emptySkill }])
  }

  const handleRemoveSkill = (index: number) => {
    onChange(skills.filter((_, i) => i !== index))
  }

  const handleUpdateSkill = (index: number, field: keyof Skill, value: string) => {
    const updated = [...skills]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Skills</CardTitle>
          <CardDescription>Add your technical and professional skills</CardDescription>
        </div>
        <Button onClick={handleAddSkill} size="sm">
          Add Skill
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {skills.map((skill, index) => (
          <div key={index} className="flex gap-2 items-end">
            <div className="flex-1">
              <Label>Skill Name *</Label>
              <Input
                value={skill.skillName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleUpdateSkill(index, 'skillName', e.target.value)
                }
                placeholder="e.g., React, Python, Project Management"
              />
            </div>
            <div className="flex-1">
              <Label>Category</Label>
              <Input
                value={skill.category || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleUpdateSkill(index, 'category', e.target.value)
                }
                placeholder="e.g., Technical, Leadership"
              />
            </div>
            <Button
              onClick={() => handleRemoveSkill(index)}
              size="sm"
              variant="destructive"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}

        {skills.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No skills added yet. Click &quot;Add Skill&quot; to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
