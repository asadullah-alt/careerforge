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

async function writeStore(list: ResumeItem[]) {
  try {
    await fs.mkdir(DATA_PATH, { recursive: true })
    await fs.writeFile(FILE_PATH, JSON.stringify(list, null, 2), 'utf-8')
  } catch (err) {
    console.error('[Resume Rename API] Write store error', err)
    throw err
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { id?: string; title?: string; token?: string }
    const { id, title, token } = body
    if (!id || !title) {
      return NextResponse.json({ success: false, error: 'id and title are required' }, { status: 400 })
    }

    // Rename in local store
    const list = await readStore()
    const idx = list.findIndex((r) => r.id === id)
    if (idx !== -1) {
      list[idx].title = title
      list[idx].updatedAt = new Date().toISOString()
      await writeStore(list)
    }

    // Rename in backend if token provided
    if (token) {
      try {
        const backendUrl = process.env.BACKEND_URL || 'https://careerback.bhaikaamdo.com'
        await fetch(`${backendUrl}/api/resume/rename`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, title, token })
        })
      } catch (err) {
        console.warn('[Resume Rename API] Backend rename error (non-fatal):', err)
      }
    }

    return NextResponse.json({ success: true, message: 'Renamed' }, { status: 200 })
  } catch (e) {
    console.error('[Resume Rename API] Error:', e)
    return NextResponse.json({ success: false, error: 'Failed to rename' }, { status: 500 })
  }
}

