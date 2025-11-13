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
import { Trash2, GripVertical } from "lucide-react"

export function ExperiencesForm() {
  const resume = useResumeStore((state) => state.resume)
  const addExperience = useResumeStore((state) => state.addExperience)
  const updateExperience = useResumeStore((state) => state.updateExperience)
  const removeExperience = useResumeStore((state) => state.removeExperience)

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Experience</CardTitle>
        <CardDescription>Add your work experience and accomplishments</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="border border-input rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <GripVertical className="h-4 w-4" />
                    <span className="text-sm font-medium">Experience {index + 1}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      remove(index)
                      removeExperience(index)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`experiences.${index}.job_title`}
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
                    name={`experiences.${index}.company`}
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
                    name={`experiences.${index}.start_date`}
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
                    name={`experiences.${index}.end_date`}
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
                  name={`experiences.${index}.location`}
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
                  name={`experiences.${index}.technologies_used`}
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
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  job_title: "",
                  company: "",
                  location: "",
                  start_date: "",
                  end_date: "",
                  description: [],
                  technologies_used: [],
                })
              }
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
