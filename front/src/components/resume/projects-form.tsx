"use client"

import React from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Project, ProjectSchema, StructuredResumeSchema } from "@/lib/schemas/resume"
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
import TextareaAutosize from "react-textarea-autosize"

export function ProjectsForm() {
  const resume = useResumeStore((state) => state.resume)
  const addProject = useResumeStore((state) => state.addProject)
  const updateProject = useResumeStore((state) => state.updateProject)
  const removeProject = useResumeStore((state) => state.removeProject)
  const [currentIndex, setCurrentIndex] = React.useState(0)

  const form = useForm({
    resolver: zodResolver(StructuredResumeSchema.pick({ projects: true })),
    defaultValues: {
      projects: resume?.projects || [],
    },
  })

  // Reset projects when resume changes
  React.useEffect(() => {
    if (resume?.projects) {
      form.reset({ projects: resume.projects })
    }
  }, [resume?.projects, form])

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "projects",
  })

  function onSubmit() {
    const values = form.getValues()
    const projectsList = values.projects || []
    projectsList.forEach((proj, index) => {
      const project = {
        ...proj,
        technologies_used: proj.technologies_used || [],
      }
      if (index < (resume?.projects.length || 0)) {
        updateProject(index, project)
      } else {
        addProject(project)
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
      project_name: "",
      description: "",
      technologies_used: [],
      link: "",
      start_date: "",
      end_date: "",
    })
    setCurrentIndex(fields.length)
  }

  const handleRemove = () => {
    remove(currentIndex)
    removeProject(currentIndex)
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const currentField = fields[currentIndex]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects</CardTitle>
        <CardDescription>Showcase your key projects and achievements</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {fields.length > 0 && currentField ? (
              <div key={currentField.id} className="border border-input rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium">
                    Project {currentIndex + 1} of {fields.length}
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

                <FormField
                  control={form.control}
                  name={`projects.${currentIndex}.project_name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Project title" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`projects.${currentIndex}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <TextareaAutosize
                          placeholder="Brief description of the project"
                          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                  name={`projects.${currentIndex}.technologies_used`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technologies *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="React, TypeScript, Tailwind CSS"
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

                <FormField
                  control={form.control}
                  name={`projects.${currentIndex}.link`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Link</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://github.com/username/project"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`projects.${currentIndex}.start_date`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`projects.${currentIndex}.end_date`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                No projects yet. Add one to showcase your work.
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              onClick={handleAdd}
              className="w-full"
            >
              + Add Project
            </Button>

            <Button type="submit" className="w-full">
              Save Projects
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
