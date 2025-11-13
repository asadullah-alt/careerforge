import React from 'react'
import { StructuredResume } from '@/lib/schemas/resume'
import {
  Document,
  Page,
  Text,
  View,
  pdf,
} from '@react-pdf/renderer'
import type { Style } from '@react-pdf/types'
import type { Experience, Project, Education } from '@/lib/schemas/resume'

export type PdfStyles = {
  page?: Style | Style[]
  header?: Style | Style[]
  name?: Style | Style[]
  sectionTitle?: Style | Style[]
  entryTitle?: Style | Style[]
  text?: Style | Style[]
  row?: Style | Style[]
}

export const defaultPdfStyles: Required<PdfStyles> = {
  page: { padding: 20, fontSize: 11, fontFamily: 'Helvetica' },
  header: { marginBottom: 8 },
  name: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', marginTop: 8, marginBottom: 4 },
  entryTitle: { fontSize: 11, fontWeight: 'bold' },
  text: { fontSize: 10, marginBottom: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
}

/**
 * Generates a PDF Blob from resume data using @react-pdf/renderer
 * Requires: npm install @react-pdf/renderer
 */
export async function generateResumePDF(
  resume: StructuredResume,
  styles?: PdfStyles
): Promise<Blob> {
  const merged = { ...defaultPdfStyles, ...(styles || {}) } as Required<PdfStyles>

  const PdfDocument = () => (
    <Document>
      <Page size="A4" style={merged.page}>
        <View style={merged.header}>
          <Text style={merged.name}>
            {resume.personal_data.firstName} {resume.personal_data.lastName}
          </Text>
          {resume.personal_data.email && (
            <Text style={merged.text}>
              {resume.personal_data.email}
              {resume.personal_data.phone ? ` | ${resume.personal_data.phone}` : ''}
            </Text>
          )}
        </View>

        {resume.experiences && resume.experiences.length > 0 && (
          <View>
            <Text style={merged.sectionTitle}>Professional Experience</Text>
            {resume.experiences.map((exp: Experience, i: number) => (
              <View key={i} style={{ marginBottom: 6 }}>
                <View style={merged.row}>
                  <Text style={merged.entryTitle}>{exp.job_title}</Text>
                  <Text style={merged.text}>{exp.start_date} - {exp.end_date}</Text>
                </View>
                {exp.company && <Text style={merged.text}>{exp.company}{exp.location ? ` • ${exp.location}` : ''}</Text>}
                {exp.description && exp.description.length > 0 && (
                  <View>
                    {exp.description.map((d: string, idx: number) => (<Text key={idx} style={merged.text}>• {d}</Text>))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {resume.projects && resume.projects.length > 0 && (
          <View>
            <Text style={merged.sectionTitle}>Projects</Text>
            {resume.projects.map((p: Project, i: number) => (
              <View key={i} style={{ marginBottom: 6 }}>
                <Text style={merged.entryTitle}>{p.project_name}</Text>
                {p.description && <Text style={merged.text}>{p.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {resume.education && resume.education.length > 0 && (
          <View>
            <Text style={merged.sectionTitle}>Education</Text>
            {resume.education.map((e: Education, i: number) => (
              <View key={i} style={{ marginBottom: 6 }}>
                <Text style={merged.entryTitle}>{e.degree}</Text>
                <Text style={merged.text}>{e.institution}</Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  )

  const asPdf = pdf(<PdfDocument />)
  const blob = await asPdf.toBlob()
  return blob
}

/**
 * Alternative: Generate a downloadable HTML string that can be printed to PDF
 */
export function generateResumeHTML(resume: StructuredResume): string {
  const { personal_data, experiences, projects, skills, education, achievements, extracted_keywords } = resume

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${personal_data.firstName} ${personal_data.lastName} - Resume</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          max-width: 8.5in;
          margin: 0;
          padding: 0.5in;
          background: white;
          color: #333;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #333;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .contact-info {
          text-align: center;
          font-size: 12px;
          margin-top: 5px;
        }
        .section-title {
          font-size: 14px;
          font-weight: bold;
          background: #f0f0f0;
          padding: 5px 10px;
          margin-top: 15px;
          margin-bottom: 10px;
          border-left: 3px solid #333;
        }
        .entry {
          margin-bottom: 15px;
        }
        .entry-title {
          font-weight: bold;
          font-size: 12px;
        }
        .entry-subtitle {
          font-style: italic;
          font-size: 11px;
          color: #666;
        }
        .entry-date {
          float: right;
          font-size: 11px;
          color: #666;
        }
        .tags {
          margin-top: 5px;
          font-size: 10px;
        }
        .tag {
          display: inline-block;
          background: #e0e0e0;
          padding: 2px 6px;
          margin-right: 5px;
          border-radius: 3px;
        }
        ul {
          margin: 5px 0;
          padding-left: 20px;
          font-size: 11px;
        }
        li {
          margin-bottom: 3px;
        }
        .keywords {
          font-size: 10px;
          margin-top: 10px;
        }
        @media print {
          body {
            padding: 0;
            margin: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${personal_data.firstName} ${personal_data.lastName}</h1>
        <div class="contact-info">
          ${personal_data.email ? `${personal_data.email}` : ''}
          ${personal_data.phone ? `| ${personal_data.phone}` : ''}
          ${personal_data.location?.city ? `| ${personal_data.location.city}, ${personal_data.location.country}` : ''}
        </div>
      </div>

      ${experiences.length > 0 ? `
        <div class="section-title">Professional Experience</div>
        ${experiences.map(exp => `
          <div class="entry">
            <div class="entry-title">${exp.job_title}</div>
            <div class="entry-subtitle">${exp.company}${exp.location ? ` | ${exp.location}` : ''}</div>
            <div class="entry-date">${exp.start_date} - ${exp.end_date}</div>
            <div style="clear: both;"></div>
            ${exp.description.length > 0 ? `
              <ul>
                ${exp.description.map(desc => `<li>${desc}</li>`).join('')}
              </ul>
            ` : ''}
            ${exp.technologies_used && exp.technologies_used.length > 0 ? `
              <div class="tags">
                ${exp.technologies_used.map(tech => `<span class="tag">${tech}</span>`).join('')}
              </div>
            ` : ''}
          </div>
        `).join('')}
      ` : ''}

      ${projects.length > 0 ? `
        <div class="section-title">Projects</div>
        ${projects.map(proj => `
          <div class="entry">
            <div class="entry-title">${proj.project_name}</div>
            ${proj.description ? `<div style="font-size: 11px;">${proj.description}</div>` : ''}
            ${proj.technologies_used && proj.technologies_used.length > 0 ? `
              <div class="tags">
                ${proj.technologies_used.map(tech => `<span class="tag">${tech}</span>`).join('')}
              </div>
            ` : ''}
          </div>
        `).join('')}
      ` : ''}

      ${education.length > 0 ? `
        <div class="section-title">Education</div>
        ${education.map(edu => `
          <div class="entry">
            <div class="entry-title">${edu.degree}</div>
            <div class="entry-subtitle">${edu.institution}</div>
            ${edu.field_of_study ? `<div style="font-size: 11px;">${edu.field_of_study}</div>` : ''}
          </div>
        `).join('')}
      ` : ''}

      ${skills.length > 0 ? `
        <div class="section-title">Skills</div>
        <div class="tags">
          ${skills.map(skill => `<span class="tag">${skill.skill_name}</span>`).join('')}
        </div>
      ` : ''}

      ${achievements.length > 0 ? `
        <div class="section-title">Achievements</div>
        <ul>
          ${achievements.map(ach => `<li>${ach}</li>`).join('')}
        </ul>
      ` : ''}

      ${extracted_keywords && extracted_keywords.length > 0 ? `
        <div class="section-title">Keywords</div>
        <div class="keywords">
          ${extracted_keywords.map(k => `<span class="tag">${k}</span>`).join('')}
        </div>
      ` : ''}
    </body>
    </html>
  `
}

export function downloadResumeAsHTML(resume: StructuredResume) {
  const html = generateResumeHTML(resume)
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${resume.personal_data.firstName}_${resume.personal_data.lastName}_Resume.html`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function downloadResumeAsJSON(resume: StructuredResume) {
  const json = JSON.stringify(resume, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${resume.personal_data.firstName}_${resume.personal_data.lastName}_Resume.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
