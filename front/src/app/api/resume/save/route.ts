import { NextRequest, NextResponse } from 'next/server';
import { StructuredResumeSchema } from '@/lib/schemas/resume';

/**
 * Save resume to database
 * POST /api/resume/save
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the resume data against the schema
    const validatedResume = StructuredResumeSchema.parse(body);

    // TODO: Save to your database
    // const token = request.headers.get('authorization');
    // const userId = await getUserIdFromToken(token);
    // await db.resumes.create({ userId, data: validatedResume });

    // Mock implementation - just echo back the data
    console.log('[Resume Save API] Saving resume:', validatedResume);

    return NextResponse.json(
      {
        success: true,
        message: 'Resume saved successfully',
        id: `resume_${Date.now()}`,
      },
      { status: 200 }
    );
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
