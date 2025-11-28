"use client"

import React, { useState, useEffect } from "react"
import { StructuredResume } from "@/lib/schemas/resume"
import type { PdfStyles } from "@/lib/resume-pdf"
import PdfViewer from "@/components/resume/pdf-viewer"

declare global {
  interface GlobalThis {
    requestIdleCallback?: (callback: (deadline: { didTimeout: boolean; timeRemaining: () => number }) => void, options?: { timeout?: number }) => number
    cancelIdleCallback?: (handle: number) => void
  }
}

interface ResumePreviewProps {
  data: StructuredResume | null
  pdfStyles?: Partial<PdfStyles>
  template?: string
}

export function ResumePreview({ data, pdfStyles, template = 'classic' }: ResumePreviewProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  // Generate PDF blob URL when data/template changes, but do it lazily so
  // route navigation and initial render are not blocked by heavy PDF work.
  useEffect(() => {
    let mounted = true
    let url: string | null = null
    let idleHandle: number | null = null
    let timeoutHandle: ReturnType<typeof setTimeout> | null = null

    async function build() {
      if (!data) return
      try {
        // Dynamically import the PDF generator to avoid bundling heavy code
        // into the initial route bundle.
        const mod = await import('@/lib/resume-pdf')
        const blob = await mod.generateResumePDF(data, pdfStyles, template)
        url = URL.createObjectURL(blob)
        if (mounted) setPdfUrl(url)
      } catch (err) {
        console.error('PDF preview generation failed', err)
        if (mounted) setPdfUrl(null)
      }
    }

    // Schedule build using requestIdleCallback if available so it runs when
    // the main thread is idle. Fallback to setTimeout to avoid blocking.
    const schedule = () => {
      // Use globalThis so TypeScript picks up the correct global timer types
      if (typeof globalThis !== 'undefined' && typeof globalThis.requestIdleCallback === 'function') {
        idleHandle = globalThis.requestIdleCallback(() => { build().catch(() => { }) }, { timeout: 2000 })
      } else {
        timeoutHandle = globalThis.setTimeout(() => { build().catch(() => { }) }, 200)
      }
    }

    // Only schedule generation if there's resume data.
    if (data) schedule()

    return () => {
      mounted = false
      if (idleHandle != null && typeof globalThis !== 'undefined' && typeof globalThis.cancelIdleCallback === 'function') {
        globalThis.cancelIdleCallback!(idleHandle)
      }
      if (timeoutHandle != null) globalThis.clearTimeout(timeoutHandle)
      if (url) {
        URL.revokeObjectURL(url)
      }
      setPdfUrl(null)
    }
  }, [data, pdfStyles, template])

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No resume data to display
      </div>
    )
  }

  const { personal_data, experiences, projects, skills, education, achievements, extracted_keywords } = data

  return (
    <div className="bg-white dark:bg-slate-950 text-black dark:text-white p-8 min-h-screen overflow-y-auto print:p-0 space-y-4">
      <div className="mb-4 flex gap-2">
        {/* PDF preview is shown automatically; no toggle button */}
      </div>

      <div className="w-full h-[800px] border">
        {/* Generate a blob URL preview and show in PdfViewer */}
        <PdfViewer blobUrl={pdfUrl} />
      </div>
      {/* Header */}
      <div className="border-b border-gray-300 dark:border-gray-700 pb-4">
        <h1 className="text-3xl font-bold">
          {personal_data.first_name} {personal_data.last_name}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mt-2">
          {personal_data.email && <span>{personal_data.email}</span>}
          {personal_data.phone && <span>{personal_data.phone}</span>}
          {personal_data.location?.city && (
            <span>{personal_data.location.city}, {personal_data.location.country}</span>
          )}
        </div>
        <div className="flex flex-wrap gap-4 text-sm mt-2">
          {personal_data.linkedin && (
            <a
              href={personal_data.linkedin}
              className="text-blue-600 dark:text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          )}
          {personal_data.portfolio && (
            <a
              href={personal_data.portfolio}
              className="text-blue-600 dark:text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Portfolio
            </a>
          )}
        </div>
      </div>

      {/* Professional Experience */}
      {experiences.length > 0 && (
        <section>
          <h2 className="text-xl font-bold border-b border-gray-300 dark:border-gray-700 pb-2 mb-3">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {experiences.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{exp.job_title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{exp.company}</p>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {exp.start_date} - {exp.end_date}
                  </div>
                </div>
                {exp.location && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">{exp.location}</p>
                )}
                {exp.description.length > 0 && (
                  <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                    {exp.description.map((desc, idx) => (
                      <li key={idx}>{desc}</li>
                    ))}
                  </ul>
                )}
                {exp.technologies_used && exp.technologies_used.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {exp.technologies_used.map((tech, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section>
          <h2 className="text-xl font-bold border-b border-gray-300 dark:border-gray-700 pb-2 mb-3">
            Projects
          </h2>
          <div className="space-y-4">
            {projects.map((proj, index) => (
              <div key={index}>
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-bold text-lg">{proj.project_name}</h3>
                    {proj.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">{proj.description}</p>
                    )}
                  </div>
                  {proj.start_date && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {proj.start_date} - {proj.end_date}
                    </div>
                  )}
                </div>
                {proj.technologies_used && proj.technologies_used.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {proj.technologies_used.map((tech, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                {proj.link && (
                  <a
                    href={proj.link}
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm mt-2 inline-block"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Project
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section>
          <h2 className="text-xl font-bold border-b border-gray-300 dark:border-gray-700 pb-2 mb-3">
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{edu.degree}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{edu.institution}</p>
                    {edu.field_of_study && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">{edu.field_of_study}</p>
                    )}
                  </div>
                  {edu.start_date && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {edu.start_date} - {edu.end_date}
                    </div>
                  )}
                </div>
                {edu.grade && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">GPA: {edu.grade}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section>
          <h2 className="text-xl font-bold border-b border-gray-300 dark:border-gray-700 pb-2 mb-3">
            Skills
          </h2>
          <div className="space-y-2">
            {/* Group skills by category */}
            {Array.from(
              new Map(
                skills.map((skill) => [
                  skill.category || "Other",
                  skills.filter((s) => s.category === skill.category || (!s.category && !skill.category)),
                ])
              ).entries()
            ).map(([category, categorySkills]) => (
              <div key={category}>
                <h3 className="font-semibold text-sm">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {categorySkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded text-sm"
                    >
                      {skill.skill_name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <section>
          <h2 className="text-xl font-bold border-b border-gray-300 dark:border-gray-700 pb-2 mb-3">
            Achievements
          </h2>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {achievements.map((achievement, index) => (
              <li key={index}>{achievement}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Keywords */}
      {extracted_keywords.length > 0 && (
        <section>
          <h2 className="text-xl font-bold border-b border-gray-300 dark:border-gray-700 pb-2 mb-3">
            Key Keywords
          </h2>
          <div className="flex flex-wrap gap-2">
            {extracted_keywords.map((keyword, index) => (
              <span
                key={index}
                className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded text-xs"
              >
                {keyword}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
