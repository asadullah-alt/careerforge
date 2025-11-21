import { NextRequest, NextResponse } from 'next/server';



export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { id?: string; title?: string; token?: string }
    const { id, title, token } = body
    if (!id || !title) {
      return NextResponse.json({ success: false, error: 'id and title are required' }, { status: 400 })
    }

    if (!token) {
      return NextResponse.json({ success: false, error: 'Token is required' }, { status: 400 })
    }

    const backendUrl = process.env.BACKEND_URL || 'https://careerback.bhaikaamdo.com'
    await fetch(`${backendUrl}/api/resume/rename`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, title, token })
    })

    return NextResponse.json({ success: true, message: 'Renamed' }, { status: 200 })
  } catch (e) {
    console.error('[Resume Rename API] Error:', e)
    return NextResponse.json({ success: false, error: 'Failed to rename' }, { status: 500 })
  }
}

