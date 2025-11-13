import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises'
import path from 'path'
import { StructuredResume } from '@/lib/schemas/resume'

const DATA_PATH = path.join(process.cwd(), 'front', '.data')
const FILE_PATH = path.join(DATA_PATH, 'resumes.json')

type ResumeItem = {
  id: string
  title: string
  createdAt: string
  updatedAt?: string
  data: StructuredResume
}

async function readStore(): Promise<ResumeItem[]> {
  try {
    const raw = await fs.readFile(FILE_PATH, 'utf-8')
    return JSON.parse(raw) as ResumeItem[]
  } catch {
    return []
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token')
    
    // If token provided, try backend first
    if (token) {
      try {
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
      } catch (err) {
        console.warn('[Resume List API] Backend list error (fallback to local):', err)
      }
    }

    // Fallback to local store
    const list = await readStore()
    return NextResponse.json({ success: true, data: list }, { status: 200 })
  } catch (error) {
    console.error('[Resume List API] Error:', error)
    return NextResponse.json({ success: false, error: 'Failed to read resumes' }, { status: 500 })
  }
}

