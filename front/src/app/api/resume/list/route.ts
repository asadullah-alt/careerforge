import { NextRequest, NextResponse } from 'next/server';



export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token')

    if (!token) {
      return NextResponse.json({ success: false, error: 'Token is required' }, { status: 400 })
    }

    const backendUrl = process.env.BACKEND_URL || 'https://careerback.bhaikaamdo.com'
    const backendRes = await fetch(`${backendUrl}/api/resume/list`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    })

    if (backendRes.ok) {
      const backendData = await backendRes.json()
      if (backendData.success) {
        return NextResponse.json({ success: true, data: backendData.data }, { status: 200 })
      }
    }

    return NextResponse.json({ success: false, error: 'Failed to fetch resumes from backend' }, { status: 500 })
  } catch (error) {
    console.error('[Resume List API] Error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

