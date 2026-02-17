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
import TextareaAutosize from "react-textarea-autosize"

export function EducationForm() {
  const resume = useResumeStore((state) => state.resume)
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
    name: "education",
    control: form.control,
  })

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

  const handleRemove = (index: number) => {
    remove(index)
    if (currentIndex >= fields.length - 1 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const onSubmit = (data: unknown) => {
    console.log(data)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle>Education</CardTitle>
          <CardDescription>
            Add your educational background
          </CardDescription>
        </div>
        <Button onClick={handleAdd} variant="outline" size="sm">
          Add New
        </Button>
      </CardHeader>
      <CardContent>
        {fields.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <p>No education entries added yet.</p>
            <Button onClick={handleAdd} variant="link">Add your first education entry</Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">
                  Entry {currentIndex + 1} of {fields.length}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNext}
                  disabled={currentIndex === fields.length - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => handleRemove(currentIndex)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`education.${currentIndex}.institution`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>School / University</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Stanford University" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`education.${currentIndex}.degree`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Degree / Certification</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Bachelor of Science" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`education.${currentIndex}.field_of_study`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Field of Study</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Computer Science" {...field} value={field.value || ""} />
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
                        <FormLabel>Grade / GPA</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 3.8/4.0" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`education.${currentIndex}.start_date`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Sep 2018" {...field} value={field.value || ""} />
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
                          <Input placeholder="e.g. Jun 2022" {...field} value={field.value || ""} />
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
                      <FormLabel>Description / Achievements</FormLabel>
                      <FormControl>
                        <TextareaAutosize
                          className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                          placeholder="List key achievements or courses..."
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
