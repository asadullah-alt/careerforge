"use client"

import React from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Education, StructuredResumeSchema } from "@/lib/schemas/resume"
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

export function EducationForm() {
  const resume = useResumeStore((state) => state.resume)
  const addEducation = useResumeStore((state) => state.addEducation)
  const updateEducation = useResumeStore((state) => state.updateEducation)
  const removeEducation = useResumeStore((state) => state.removeEducation)
  const [currentIndex, setCurrentIndex] = React.useState(0)

  const form = useForm({
    resolver: zodResolver(StructuredResumeSchema.pick({ education: true })),
    defaultValues: {
      education: resume?.education || [],
    },
  })

  // Reset education when resume changes
  React.useEffect(() => {
    if (resume?.education) {
      form.reset({ education: resume.education })
    }
  }, [resume?.education, form])

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "education",
  })

  function onSubmit() {
    const values = form.getValues()
    const educationList = values.education || []
    educationList.forEach((edu, index) => {
      if (index < (resume?.education.length || 0)) {
        updateEducation(index, edu)
      } else {
        addEducation(edu)
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
      institution: "",
      degree: "",
      field_of_study: "",
      start_date: "",
      end_date: "",
      grade: "",
      description: "",
    })
    setCurrentIndex(fields.length)
  }

  const handleRemove = () => {
    remove(currentIndex)
    removeEducation(currentIndex)
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const currentField = fields[currentIndex]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Education</CardTitle>
        <CardDescription>Add your educational background</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {fields.length > 0 && currentField ? (
              <div key={currentField.id} className="border border-input rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium">
                    Education {currentIndex + 1} of {fields.length}
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
                  name={`education.${currentIndex}.institution`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="University of California, Berkeley"
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
                    name={`education.${currentIndex}.degree`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Degree</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Bachelor of Science"
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
                    name={`education.${currentIndex}.field_of_study`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Field of Study</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Computer Science"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name={`education.${currentIndex}.start_date`}
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
                    name={`education.${currentIndex}.end_date`}
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
                  <FormField
                    control={form.control}
                    name={`education.${currentIndex}.grade`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GPA/Grade</FormLabel>
                        <FormControl>
                          <Input placeholder="3.8" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`education.${currentIndex}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <TextareaAutosize
                          placeholder="Additional details about your education"
                          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                No education entries yet. Add one to get started.
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              onClick={handleAdd}
              className="w-full"
            >
              + Add Education
            </Button>

            <Button type="submit" className="w-full">
              Save Education
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
