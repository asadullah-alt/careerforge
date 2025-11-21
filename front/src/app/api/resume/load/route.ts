import { NextRequest, NextResponse } from 'next/server';



/**
 * Load resume by id from local store or backend
 * GET /api/resume/load?id=resume_id&token=...
 */
export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    const token = request.nextUrl.searchParams.get('token');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Resume ID is required' }, { status: 400 })
    }

    if (!token) {
      return NextResponse.json({ success: false, error: 'Token is required' }, { status: 400 })
    }

    const backendUrl = process.env.BACKEND_URL || 'https://careerback.bhaikaamdo.com'
    const backendRes = await fetch(`${backendUrl}/api/resume/load`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, token })
    })

    if (backendRes.ok) {
      const backendData = await backendRes.json()
      if (backendData.success) {
        return NextResponse.json({ success: true, message: 'Resume loaded from backend', data: backendData.data }, { status: 200 })
      }
    }

    return NextResponse.json({ success: false, error: 'Failed to load resume from backend' }, { status: 500 })
  } catch (error) {
    console.error('[Resume Load API] Error:', error);
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: 'Failed to load resume' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    const token = request.nextUrl.searchParams.get('token');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Resume ID is required' }, { status: 400 })
    }

    if (!token) {
      return NextResponse.json({ success: false, error: 'Token is required' }, { status: 400 })
    }

    const backendUrl = process.env.BACKEND_URL || 'https://careerback.bhaikaamdo.com'
    await fetch(`${backendUrl}/api/resume/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, token })
    })

    console.log('[Resume Load API] Deleting resume:', id);

    return NextResponse.json({ success: true, message: 'Resume deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('[Resume Load API] Error:', error);
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: 'Failed to delete resume' }, { status: 500 })
  }
}
