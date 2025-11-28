"use client"

import React from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Experience, ExperienceSchema, StructuredResumeSchema } from "@/lib/schemas/resume"
import { useResumeStore } from "@/store/resume-store"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react"

export function ExperiencesForm() {
  const resume = useResumeStore((state) => state.resume)
  const addExperience = useResumeStore((state) => state.addExperience)
  const updateExperience = useResumeStore((state) => state.updateExperience)
  const removeExperience = useResumeStore((state) => state.removeExperience)
  const [currentIndex, setCurrentIndex] = React.useState(0)

  const form = useForm({
    resolver: zodResolver(
      StructuredResumeSchema.pick({ experiences: true })
    ),
    defaultValues: {
      experiences: resume?.experiences || [],
    },
  })

  // Reset experiences when resume changes (so opening a saved resume populates fields)
  React.useEffect(() => {
    if (resume?.experiences) {
      form.reset({ experiences: resume.experiences })
    }
  }, [resume?.experiences, form])

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "experiences",
  })

  function onSubmit() {
    const values = form.getValues()
    const experiencesList = values.experiences || []
    experiencesList.forEach((exp, index) => {
      const experience = {
        ...exp,
        description: exp.description || [],
        technologies_used: exp.technologies_used || [],
      }
      if (index < (resume?.experiences.length || 0)) {
        updateExperience(index, experience)
      } else {
        addExperience(experience)
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
      job_title: "",
      company: "",
      location: "",
      start_date: "",
      end_date: "",
      description: [],
      technologies_used: [],
    })
    setCurrentIndex(fields.length)
  }

  const handleRemove = () => {
    remove(currentIndex)
    removeExperience(currentIndex)
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const currentField = fields[currentIndex]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Experience</CardTitle>
        <CardDescription>Add your work experience and accomplishments</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {fields.length > 0 && currentField ? (
              <div key={currentField.id} className="border border-input rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium">
                    Experience {currentIndex + 1} of {fields.length}
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
                    name={`experiences.${currentIndex}.job_title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="Software Engineer" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`experiences.${currentIndex}.company`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input placeholder="Company Name" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`experiences.${currentIndex}.start_date`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date *</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`experiences.${currentIndex}.end_date`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date *</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`experiences.${currentIndex}.location`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="San Francisco, CA" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`experiences.${currentIndex}.technologies_used`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technologies (comma-separated)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="React, Node.js, PostgreSQL"
                          value={(field.value || []).join(", ")}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                .split(",")
                                .map((t) => t.trim())
                                .filter(Boolean)
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                No experience entries yet. Add one to get started.
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              onClick={handleAdd}
              className="w-full"
            >
              + Add Experience
            </Button>

            <Button type="submit" className="w-full">
              Save Experiences
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
