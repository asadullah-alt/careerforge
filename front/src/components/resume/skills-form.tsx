"use client"

import React from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { StructuredResumeSchema } from "@/lib/schemas/resume"
import { useResumeStore } from "@/store/resume-store"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react"

export function SkillsForm() {
  const resume = useResumeStore((state) => state.resume)
  const addSkill = useResumeStore((state) => state.addSkill)
  const updateSkill = useResumeStore((state) => state.updateSkill)
  const removeSkill = useResumeStore((state) => state.removeSkill)
  const [currentIndex, setCurrentIndex] = React.useState(0)

  const form = useForm({
    resolver: zodResolver(StructuredResumeSchema.pick({ skills: true })),
    defaultValues: {
      skills: resume?.skills || [],
    },
  })

  // Reset skills when resume changes
  React.useEffect(() => {
    if (resume?.skills) {
      form.reset({ skills: resume.skills })
    }
  }, [resume?.skills, form])

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "skills",
  })

  function onSubmit() {
    const values = form.getValues()
    const skillsList = values.skills || []
    skillsList.forEach((skill, index) => {
      if (index < (resume?.skills.length || 0)) {
        updateSkill(index, skill)
      } else {
        addSkill(skill)
      }
    })
  }

  const handleNext = () => {
    if (currentIndex < fields.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleAdd = () => {
    append({
      category: "",
      skill_name: "",
    })
    setCurrentIndex(fields.length)
  }

  const handleRemove = () => {
    remove(currentIndex)
    removeSkill(currentIndex)
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const currentField = fields[currentIndex]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
        <CardDescription>Add technical and professional skills</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {fields.length > 0 && currentField ? (
              <div key={currentField.id} className="border border-input rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium">
                    Skill {currentIndex + 1} of {fields.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handlePrevious}
                      disabled={currentIndex === 0}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleNext}
                      disabled={currentIndex === fields.length - 1}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemove}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`skills.${currentIndex}.category`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input placeholder="Frontend, Backend, DevOps" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`skills.${currentIndex}.skill_name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Skill Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="React, TypeScript, etc." {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                No skills added yet. Add one to get started.
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              onClick={handleAdd}
              className="w-full"
            >
              + Add Skill
            </Button>

            <Button type="submit" className="w-full">
              Save Skills
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
