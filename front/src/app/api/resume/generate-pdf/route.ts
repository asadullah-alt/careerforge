import { NextRequest } from 'next/server'
import { generateResumePDF } from '@/lib/resume-pdf'
import type { StructuredResume } from '@/lib/schemas/resume'
import type { PdfStyles } from '@/lib/resume-pdf'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { resume, styles, template } = body as {
      resume: StructuredResume
      styles?: Partial<PdfStyles>
      template?: string
    }

    if (!resume) {
      return new Response(JSON.stringify({ error: 'Missing resume' }), { status: 400 })
    }

    const blob = await generateResumePDF(resume, styles, template)
    const arrayBuffer = await blob.arrayBuffer()

    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': String(arrayBuffer.byteLength),
        'Content-Disposition': 'attachment; filename="resume.pdf"',
      },
    })
  } catch (err) {
    console.error('Server PDF generation failed', err)
    return new Response(JSON.stringify({ error: 'PDF generation failed' }), { status: 500 })
  }
}
