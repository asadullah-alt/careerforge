import { StructuredResume } from '@/lib/schemas/resume';

/**
 * Generates a PDF from resume data using @react-pdf/renderer
 * Install with: npm install @react-pdf/renderer
 * 
 * For now, this is a mock implementation.
 * Once you install @react-pdf/renderer, uncomment the code below.
 */

export async function generateResumePDF(resume: StructuredResume): Promise<Blob> {
  // Mock implementation - returns a simple text-based PDF
  // In production, use @react-pdf/renderer:

  /*
  import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#FFFFFF',
      padding: 40,
    },
    section: {
      marginBottom: 10,
      padding: 10,
      flexGrow: 0,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    heading: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 5,
      marginTop: 10,
    },
    text: {
      fontSize: 10,
      marginBottom: 3,
    },
    bulletPoint: {
      marginLeft: 10,
      fontSize: 10,
      marginBottom: 3,
    },
  });

  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>
            {resume.personal_data.firstName} {resume.personal_data.lastName}
          </Text>
          <Text style={styles.text}>{resume.personal_data.email}</Text>
          <Text style={styles.text}>{resume.personal_data.phone}</Text>
        </View>

        {resume.experiences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.heading}>Professional Experience</Text>
            {resume.experiences.map((exp, idx) => (
              <View key={idx} style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: 'bold' }}>{exp.job_title}</Text>
                <Text style={styles.text}>{exp.company}</Text>
                <Text style={styles.text}>{exp.start_date} - {exp.end_date}</Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
  */

  // For now, return a simple blob
  throw new Error(
    'PDF export requires @react-pdf/renderer. Install it with: npm install @react-pdf/renderer'
  );
}

/**
 * Alternative: Generate a downloadable HTML string that can be printed to PDF
 */
export function generateResumeHTML(resume: StructuredResume): string {
  const { personal_data, experiences, projects, skills, education, achievements } = resume;

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
    </body>
    </html>
  `;
}

/**
 * Download resume as HTML file (can be printed to PDF)
 */
export function downloadResumeAsHTML(resume: StructuredResume) {
  const html = generateResumeHTML(resume);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${resume.personal_data.firstName}_${resume.personal_data.lastName}_Resume.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Download resume as JSON
 */
export function downloadResumeAsJSON(resume: StructuredResume) {
  const json = JSON.stringify(resume, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${resume.personal_data.firstName}_${resume.personal_data.lastName}_Resume.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
