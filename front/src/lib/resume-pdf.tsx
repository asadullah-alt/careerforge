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
  styles?: PdfStyles,
  template: string = 'classic'
): Promise<Blob> {
  let PdfDocument: React.FC

  switch (template) {
    case 'modern': {
      const ModernDoc = () => <ModernTemplate resume={resume} styles={styles} />
      ModernDoc.displayName = 'ModernDocument'
      PdfDocument = ModernDoc
      break
    }
    case 'novo': {
      const NovoDoc = () => <NovoTemplate resume={resume} styles={styles} />
      NovoDoc.displayName = 'NovoDocument'
      PdfDocument = NovoDoc
      break
    }
    case 'executive': {
      const ExecutiveDoc = () => <ExecutiveTemplate resume={resume} styles={styles} />
      ExecutiveDoc.displayName = 'ExecutiveDocument'
      PdfDocument = ExecutiveDoc
      break
    }
    case 'bold': {
      const BoldDoc = () => <BoldTemplate resume={resume} styles={styles} />
      BoldDoc.displayName = 'BoldDocument'
      PdfDocument = BoldDoc
      break
    }
    case 'classic':
    default: {
      const ClassicDoc = () => <ClassicTemplate resume={resume} styles={styles} />
      ClassicDoc.displayName = 'ClassicDocument'
      PdfDocument = ClassicDoc
      break
    }
  }

  const asPdf = pdf(<PdfDocument />)
  const blob = await asPdf.toBlob()
  return blob
}

// Classic Template - Traditional with left-aligned sections
function ClassicTemplate({ resume, styles }: { resume: StructuredResume; styles?: PdfStyles }) {
  const pdfStyles = { ...defaultPdfStyles, ...styles } as Required<PdfStyles>

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        {/* Header */}
        <View style={pdfStyles.header}>
          <Text style={pdfStyles.name}>
            {resume.personal_data.first_name} {resume.personal_data.last_name}
          </Text>
            {resume.personal_data.email && (
            <Text style={pdfStyles.text}>
              {resume.personal_data.email}
              {resume.personal_data.phone ? ` | ${resume.personal_data.phone}` : ''}
            </Text>
          )}
        </View>

        {/* Professional Experience */}
        {resume.experiences && resume.experiences.length > 0 && (
          <View>
            <Text style={pdfStyles.sectionTitle}>PROFESSIONAL EXPERIENCE</Text>
            {resume.experiences.map((exp: Experience, i: number) => (
              <View key={i} style={{ marginBottom: 8 }}>
                <View style={pdfStyles.row}>
                  <Text style={pdfStyles.entryTitle}>{exp.job_title}</Text>
                  <Text style={pdfStyles.text}>{exp.start_date} - {exp.end_date}</Text>
                </View>
                {exp.company && <Text style={pdfStyles.text}>{exp.company}{exp.location ? ` • ${exp.location}` : ''}</Text>}
                {exp.description && exp.description.length > 0 && (
                  <View style={{ marginTop: 3 }}>
                    {exp.description.map((d: string, idx: number) => (
                      <Text key={idx} style={pdfStyles.text}>• {d}</Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {resume.education && resume.education.length > 0 && (
          <View>
            <Text style={pdfStyles.sectionTitle}>EDUCATION</Text>
            {resume.education.map((e: Education, i: number) => (
              <View key={i} style={{ marginBottom: 6 }}>
                <Text style={pdfStyles.entryTitle}>{e.degree}</Text>
                <Text style={pdfStyles.text}>{e.institution}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {resume.skills && resume.skills.length > 0 && (
          <View>
            <Text style={pdfStyles.sectionTitle}>SKILLS</Text>
            <Text style={pdfStyles.text}>
              {resume.skills.map((s: { skill_name: string }) => s.skill_name).join(', ')}
            </Text>
          </View>
        )}

        {/* Projects */}
        {resume.projects && resume.projects.length > 0 && (
          <View>
            <Text style={pdfStyles.sectionTitle}>PROJECTS</Text>
            {resume.projects.map((p: Project, i: number) => (
              <View key={i} style={{ marginBottom: 6 }}>
                <Text style={pdfStyles.entryTitle}>{p.project_name}</Text>
                {p.description && <Text style={pdfStyles.text}>{p.description}</Text>}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  )
}
ClassicTemplate.displayName = 'ClassicTemplate'

// Modern Template - Sidebar layout with color accents
function ModernTemplate({ resume, styles }: { resume: StructuredResume; styles?: PdfStyles }) {
  const accentColor = '#2563eb'

  return (
    <Document>
      <Page size="A4" style={{ padding: 0 }}>
        <View style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
          {/* Sidebar */}
          <View style={{ width: '30%', backgroundColor: accentColor, padding: 20, color: '#fff' }}>
            {/* Name in sidebar */}
            <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 15, color: '#fff' }}>
              {resume.personal_data.first_name} {resume.personal_data.last_name}
            </Text>

            {/* Contact Info */}
            {resume.personal_data.email && (
              <View style={{ marginBottom: 15 }}>
                <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 2, color: '#fff' }}>EMAIL</Text>
                <Text style={{ fontSize: 8, color: '#fff' }}>{resume.personal_data.email}</Text>
              </View>
            )}
            {resume.personal_data.phone && (
              <View style={{ marginBottom: 15 }}>
                <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 2, color: '#fff' }}>PHONE</Text>
                <Text style={{ fontSize: 8, color: '#fff' }}>{resume.personal_data.phone}</Text>
              </View>
            )}
            {resume.personal_data.location && (
              <View style={{ marginBottom: 15 }}>
                <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 2, color: '#fff' }}>LOCATION</Text>
                <Text style={{ fontSize: 8, color: '#fff' }}>
                  {resume.personal_data.location.city}
                  {resume.personal_data.location.country ? `, ${resume.personal_data.location.country}` : ''}
                </Text>
              </View>
            )}

            {/* Skills in sidebar */}
            {resume.skills && resume.skills.length > 0 && (
              <View>
                <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 8, color: '#fff' }}>SKILLS</Text>
                {resume.skills.map((s: { skill_name: string }, i: number) => (
                  <Text key={i} style={{ fontSize: 8, marginBottom: 3, color: '#fff' }}>
                    • {s.skill_name}
                  </Text>
                ))}
              </View>
            )}
          </View>

          {/* Main Content */}
          <View style={{ width: '70%', padding: 20, fontSize: 10 }}>
            {/* Experience */}
            {resume.experiences && resume.experiences.length > 0 && (
              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold', borderBottomWidth: 1, borderBottomColor: accentColor, paddingBottom: 4, marginBottom: 8 }}>
                  EXPERIENCE
                </Text>
                {resume.experiences.map((exp: Experience, i: number) => (
                  <View key={i} style={{ marginBottom: 8 }}>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ fontWeight: 'bold', fontSize: 10 }}>{exp.job_title}</Text>
                      <Text style={{ fontSize: 9, color: '#666' }}>{exp.start_date} - {exp.end_date}</Text>
                    </View>
                    {exp.company && <Text style={{ fontSize: 9, color: '#666', marginBottom: 2 }}>{exp.company}{exp.location ? ` • ${exp.location}` : ''}</Text>}
                    {exp.description && exp.description.length > 0 && (
                      <View style={{ marginTop: 2 }}>
                        {exp.description.slice(0, 2).map((d: string, idx: number) => (
                          <Text key={idx} style={{ fontSize: 9, marginBottom: 1 }}>• {d}</Text>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Education */}
            {resume.education && resume.education.length > 0 && (
              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold', borderBottomWidth: 1, borderBottomColor: accentColor, paddingBottom: 4, marginBottom: 8 }}>
                  EDUCATION
                </Text>
                {resume.education.map((e: Education, i: number) => (
                  <View key={i} style={{ marginBottom: 6 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 10 }}>{e.degree}</Text>
                    <Text style={{ fontSize: 9, color: '#666' }}>{e.institution}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Projects */}
            {resume.projects && resume.projects.length > 0 && (
              <View>
                <Text style={{ fontSize: 12, fontWeight: 'bold', borderBottomWidth: 1, borderBottomColor: accentColor, paddingBottom: 4, marginBottom: 8 }}>
                  PROJECTS
                </Text>
                {resume.projects.slice(0, 4).map((p: Project, i: number) => (
                  <View key={i} style={{ marginBottom: 6 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 10 }}>{p.project_name}</Text>
                    {p.description && <Text style={{ fontSize: 9 }}>{p.description.substring(0, 100)}...</Text>}
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  )
}

// Novo Template - Modern professional design with accent colors
function NovoTemplate({ resume, styles }: { resume: StructuredResume; styles?: PdfStyles }) {
  const accentRed = '#e74c3c'
  const darkBg = '#1a1a1a'
  const borderColor = '#eee'

  return (
    <Document>
      <Page size="A4" style={{ padding: 0, fontSize: 11, fontFamily: 'Helvetica' }}>
        {/* Header Section */}
        <View style={{ padding: '40px 40px 20px 40px', borderBottomWidth: 2, borderBottomColor: borderColor }}>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            {/* Left: Name and Summary */}
            <View style={{ flex: 2, paddingRight: 20 }}>
              <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {resume.personal_data.first_name} {resume.personal_data.last_name}
              </Text>
              {resume.achievements && resume.achievements.length > 0 && (
                <Text style={{ fontSize: 11, color: '#666', textAlign: 'justify', lineHeight: 1.4 }}>
                  {resume.achievements[0]}
                </Text>
              )}
            </View>

            {/* Right: Contact Info */}
            <View style={{ flex: 1.5, textAlign: 'right', fontSize: 10 }}>
              {resume.personal_data.email && (
                <Text style={{ marginBottom: 8, color: '#333' }}>
                  ✉ {resume.personal_data.email}
                </Text>
              )}
              {resume.personal_data.phone && (
                <Text style={{ marginBottom: 8, color: '#333' }}>
                  📱 {resume.personal_data.phone}
                </Text>
              )}
              {resume.personal_data.location?.city && (
                <Text style={{ marginBottom: 8, color: '#333' }}>
                  📍 {resume.personal_data.location.city}
                  {resume.personal_data.location.country ? `, ${resume.personal_data.location.country}` : ''}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Main Content */}
        <View style={{ padding: '30px 40px' }}>
          {/* Skills Section */}
          {resume.skills && resume.skills.length > 0 && (
            <View style={{ marginBottom: 25 }}>
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>
                  Skills
                </Text>
              </View>
              <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {resume.skills.map((s: { skill_name: string }, i: number) => (
                  <View
                    key={i}
                    style={{
                      backgroundColor: darkBg,
                      padding: '5px 10px',
                      borderRadius: 4,
                      marginBottom: 8,
                      marginRight: 8,
                    }}
                  >
                    <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>
                      {s.skill_name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Experience Section */}
          {resume.experiences && resume.experiences.length > 0 && (
            <View style={{ marginBottom: 25 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 15, letterSpacing: 1 }}>
                Work Experience
              </Text>
              {resume.experiences.map((exp: Experience, i: number) => (
                <View key={i} style={{ borderLeftWidth: 5, borderLeftColor: '#222', paddingLeft: 15, marginBottom: 20 }}>
                  <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                    <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{exp.job_title}</Text>
                  </View>
                  <Text style={{ fontSize: 13, color: '#444', marginBottom: 5 }}>
                    {exp.company}
                    {exp.location ? ` • ${exp.location}` : ''}
                  </Text>
                  <Text style={{ fontSize: 10, color: '#888', marginBottom: 5, fontStyle: 'italic' }}>
                    {exp.start_date} - {exp.end_date}
                  </Text>
                  {exp.description && exp.description.length > 0 && (
                    <View style={{ marginTop: 5 }}>
                      {exp.description.map((desc: string, idx: number) => (
                        <Text key={idx} style={{ fontSize: 11, marginBottom: 3, color: '#444' }}>
                          • {desc}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Education Section */}
          {resume.education && resume.education.length > 0 && (
            <View style={{ marginBottom: 25 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 15, letterSpacing: 1 }}>
                Education
              </Text>
              {resume.education.map((edu: Education, i: number) => (
                <View key={i} style={{ borderLeftWidth: 5, borderLeftColor: '#222', paddingLeft: 15, marginBottom: 15 }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 2 }}>{edu.degree}</Text>
                  <Text style={{ fontSize: 12, color: '#444', marginBottom: 3 }}>{edu.institution}</Text>
                  {edu.field_of_study && (
                    <Text style={{ fontSize: 10, color: '#666', marginBottom: 2 }}>Field: {edu.field_of_study}</Text>
                  )}
                  {edu.end_date && (
                    <Text style={{ fontSize: 10, color: '#888', fontStyle: 'italic' }}>
                      {edu.end_date}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Projects Section */}
          {resume.projects && resume.projects.length > 0 && (
            <View style={{ marginBottom: 25 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 15, letterSpacing: 1 }}>
                Projects
              </Text>
              {resume.projects.map((proj: Project, i: number) => (
                <View key={i} style={{ marginBottom: 15 }}>
                  <Text style={{ fontSize: 13, fontWeight: 'bold', marginBottom: 3 }}>
                    {proj.project_name}
                  </Text>
                  {proj.description && (
                    <Text style={{ fontSize: 11, color: '#555', marginBottom: 5 }}>
                      {proj.description}
                    </Text>
                  )}
                  {proj.technologies_used && proj.technologies_used.length > 0 && (
                    <Text style={{ fontSize: 10, color: '#777', marginBottom: 2 }}>
                      Technologies: {proj.technologies_used.join(', ')}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  )
}
NovoTemplate.displayName = 'NovoTemplate'

// Bold Template - High contrast, strong typography
function BoldTemplate({ resume, styles }: { resume: StructuredResume; styles?: PdfStyles }) {
  const darkColor = '#1a1a1a'

  return (
    <Document>
      <Page size="A4" style={{ padding: 28, fontSize: 11, fontFamily: 'Helvetica' }}>
        {/* Large Name Header */}
        <View style={{ marginBottom: 24, borderBottomWidth: 3, borderBottomColor: darkColor, paddingBottom: 12 }}>
          <Text style={{ fontSize: 28, fontWeight: '900', color: darkColor, lineHeight: 1.2 }}>
            {resume.personal_data.first_name}
          </Text>
          <Text style={{ fontSize: 28, fontWeight: '900', color: darkColor }}>
            {resume.personal_data.last_name}
          </Text>
          {resume.personal_data.email && (
            <Text style={{ fontSize: 10, marginTop: 8, color: '#555' }}>
              {resume.personal_data.email} | {resume.personal_data.phone || 'No phone'}
            </Text>
          )}
        </View>

        {/* Professional Summary - Optional intro */}
        {resume.experiences && resume.experiences.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <View style={{ backgroundColor: darkColor, padding: 12, marginBottom: 12 }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff' }}>PROFESSIONAL EXPERIENCE</Text>
            </View>
            {resume.experiences.map((exp: Experience, i: number) => (
              <View key={i} style={{ marginBottom: 14 }}>
                <Text style={{ fontSize: 12, fontWeight: '800', color: darkColor }}>{exp.job_title}</Text>
                <Text style={{ fontSize: 11, color: '#333', marginBottom: 4 }}>
                  {exp.company} — {exp.start_date} to {exp.end_date}
                </Text>
                {exp.description && exp.description.length > 0 && (
                  <View style={{ marginTop: 4 }}>
                    {exp.description.slice(0, 3).map((d: string, idx: number) => (
                      <Text key={idx} style={{ fontSize: 10, marginBottom: 2 }}>▸ {d}</Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {resume.education && resume.education.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <View style={{ backgroundColor: darkColor, padding: 12, marginBottom: 12 }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff' }}>EDUCATION</Text>
            </View>
            {resume.education.map((e: Education, i: number) => (
              <View key={i} style={{ marginBottom: 8 }}>
                <Text style={{ fontSize: 11, fontWeight: '700' }}>{e.degree}</Text>
                <Text style={{ fontSize: 10, color: '#555' }}>{e.institution}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {resume.skills && resume.skills.length > 0 && (
          <View>
            <View style={{ backgroundColor: darkColor, padding: 12, marginBottom: 12 }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff' }}>TECHNICAL SKILLS</Text>
            </View>
            <Text style={{ fontSize: 10, lineHeight: 1.8 }}>
              {resume.skills.map((s: { skill_name: string }) => s.skill_name).join(' • ')}
            </Text>
          </View>
        )}
      </Page>
    </Document>
  )
}
BoldTemplate.displayName = 'BoldTemplate'

// Executive Template - Professional one-page layout
function ExecutiveTemplate({ resume, styles }: { resume: StructuredResume; styles?: PdfStyles }) {
  return (
    <Document>
      <Page size="A4" style={{ padding: 20, fontSize: 10, fontFamily: 'Helvetica' }}>
        {/* Compact Header */}
        <View style={{ marginBottom: 12, paddingBottom: 8, borderBottomWidth: 2, borderBottomColor: '#2563eb' }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 4 }}>
            {resume.personal_data.first_name} {resume.personal_data.last_name}
          </Text>
          <View style={{ display: 'flex', flexDirection: 'row', gap: 15, fontSize: 9 }}>
            {resume.personal_data.email && <Text>{resume.personal_data.email}</Text>}
            {resume.personal_data.phone && <Text>{resume.personal_data.phone}</Text>}
            {resume.personal_data.location?.city && (
              <Text>
                {resume.personal_data.location.city}
                {resume.personal_data.location.country ? `, ${resume.personal_data.location.country}` : ''}
              </Text>
            )}
          </View>
        </View>

        {/* Professional Summary */}
        {resume.achievements && resume.achievements.length > 0 && (
          <View style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 10, lineHeight: 1.4, color: '#444' }}>
              {resume.achievements[0]}
            </Text>
          </View>
        )}

        {/* Two Column Layout */}
        <View style={{ display: 'flex', flexDirection: 'row', gap: 15 }}>
          {/* Left Column */}
          <View style={{ flex: 1 }}>
            {/* Skills */}
            {resume.skills && resume.skills.length > 0 && (
              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 6, color: '#2563eb', textTransform: 'uppercase' }}>
                  Skills
                </Text>
                {resume.skills.slice(0, 10).map((s: { skill_name: string }, i: number) => (
                  <Text key={i} style={{ fontSize: 9, marginBottom: 2, color: '#555' }}>
                    • {s.skill_name}
                  </Text>
                ))}
              </View>
            )}

            {/* Education */}
            {resume.education && resume.education.length > 0 && (
              <View>
                <Text style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 6, color: '#2563eb', textTransform: 'uppercase' }}>
                  Education
                </Text>
                {resume.education.map((edu: Education, i: number) => (
                  <View key={i} style={{ marginBottom: 8 }}>
                    <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 1 }}>
                      {edu.degree}
                    </Text>
                    <Text style={{ fontSize: 9, color: '#666' }}>{edu.institution}</Text>
                    {edu.end_date && (
                      <Text style={{ fontSize: 8, color: '#999', marginTop: 1 }}>{edu.end_date}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Right Column */}
          <View style={{ flex: 1.5 }}>
            {/* Experience */}
            {resume.experiences && resume.experiences.length > 0 && (
              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 6, color: '#2563eb', textTransform: 'uppercase' }}>
                  Experience
                </Text>
                {resume.experiences.slice(0, 4).map((exp: Experience, i: number) => (
                  <View key={i} style={{ marginBottom: 8 }}>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: 10, fontWeight: 'bold' }}>{exp.job_title}</Text>
                      <Text style={{ fontSize: 8, color: '#999' }}>{exp.start_date}</Text>
                    </View>
                    <Text style={{ fontSize: 9, color: '#666', marginBottom: 2 }}>
                      {exp.company}
                      {exp.location ? `, ${exp.location}` : ''}
                    </Text>
                    {exp.description && exp.description.length > 0 && (
                      <Text style={{ fontSize: 8, color: '#555', marginBottom: 1 }}>
                        {exp.description[0]}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Projects */}
            {resume.projects && resume.projects.length > 0 && (
              <View>
                <Text style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 6, color: '#2563eb', textTransform: 'uppercase' }}>
                  Projects
                </Text>
                {resume.projects.slice(0, 5).map((proj: Project, i: number) => (
                  <View key={i} style={{ marginBottom: 6 }}>
                    <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 1 }}>
                      {proj.project_name}
                    </Text>
                    {proj.description && (
                      <Text style={{ fontSize: 8, color: '#555' }}>
                        {proj.description.substring(0, 80)}...
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  )
}
ExecutiveTemplate.displayName = 'ExecutiveTemplate'

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
      <title>${personal_data.first_name} ${personal_data.last_name} - Resume</title>
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
        <h1>${personal_data.first_name} ${personal_data.last_name}</h1>
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
  a.download = `${resume.personal_data.first_name}_${resume.personal_data.last_name}_Resume.html`
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
  a.download = `${resume.personal_data.first_name}_${resume.personal_data.last_name}_Resume.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
