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
    const body = await request.json()
    const { id, title } = body as { id?: string; title?: string }
    if (!id || !title) {
      return NextResponse.json({ success: false, error: 'id and title are required' }, { status: 400 })
    }

    const list = await readStore()
    const idx = list.findIndex((r) => r.id === id)
    if (idx === -1) {
      return NextResponse.json({ success: false, error: 'Resume not found' }, { status: 404 })
    }

    list[idx].title = title
    list[idx].updatedAt = new Date().toISOString()
    await writeStore(list)

    return NextResponse.json({ success: true, message: 'Renamed' }, { status: 200 })
  } catch (err) {
    console.error('[Resume Rename API] Error:', err)
    return NextResponse.json({ success: false, error: 'Failed to rename' }, { status: 500 })
  }
}
