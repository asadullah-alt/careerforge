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
    console.error('[Resume Load API] Write store error', err)
    throw err
  }
}

/**
 * Load resume by id
 * GET /api/resume/load?id=resume_id
 */
export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Resume ID is required' }, { status: 400 })
    }

    const list = await readStore()
    const item = list.find((r) => r.id === id) || null

    return NextResponse.json({ success: true, message: 'Resume loaded successfully', data: item }, { status: 200 })
  } catch (error) {
    console.error('[Resume Load API] Error:', error);
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: 'Failed to load resume' }, { status: 500 })
  }
}

/**
 * Delete resume by id
 * DELETE /api/resume/load?id=resume_id
 */
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Resume ID is required' }, { status: 400 })
    }

    const list = await readStore()
    const next = list.filter((r) => r.id !== id)
    await writeStore(next)

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
