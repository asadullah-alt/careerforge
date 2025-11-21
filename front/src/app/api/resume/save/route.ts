import { NextRequest, NextResponse } from 'next/server';
import { StructuredResumeSchema, StructuredResume } from '@/lib/schemas/resume';



/**
 * Save resume to persistent JSON store AND backend MongoDB
 * POST /api/resume/save
 * Accepts body: { id?: string, title?: string, data: StructuredResume, token?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { id?: string; title?: string; data?: StructuredResume; token?: string };

    if (!body.token) {
      return NextResponse.json({ success: false, error: 'Token is required' }, { status: 400 })
    }

    // Validate the resume data against the schema
    const validatedResume = StructuredResumeSchema.parse(body.data || body);

    // If id provided, update existing entry
    const id = body.id || `resume_${Date.now()}`
    const title = body.title || `${validatedResume.personal_data?.first_name || ''} ${validatedResume.personal_data?.last_name || ''}`.trim() || 'Untitled Resume'

    const backendUrl = process.env.BACKEND_URL || 'https://careerback.bhaikaamdo.com'
    const backendRes = await fetch(`${backendUrl}/api/resume/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, title, data: validatedResume, token: body.token })
    })

    if (backendRes.ok) {
      const backendData = await backendRes.json()
      console.log('[Resume Save API] Backend sync success:', backendData)
      return NextResponse.json(
        {
          success: true,
          message: 'Resume saved successfully',
          id,
        },
        { status: 200 }
      );
    } else {
      console.warn('[Resume Save API] Backend sync failed:', backendRes.status)
      return NextResponse.json({ success: false, error: 'Failed to save resume to backend' }, { status: 500 })
    }

  } catch (error) {
    console.error('[Resume Save API] Error:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to save resume',
      },
      { status: 500 }
    );
  }
}
