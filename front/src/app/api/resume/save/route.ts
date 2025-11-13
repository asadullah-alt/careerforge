import { NextRequest, NextResponse } from 'next/server';
import { StructuredResumeSchema, StructuredResume } from '@/lib/schemas/resume';
import fs from 'fs/promises'
import path from 'path'

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
    console.error('[Resume Save API] Write store error', err)
    throw err
  }
}

/**
 * Save resume to persistent JSON store
 * POST /api/resume/save
 * Accepts body: { id?: string, title?: string, data: StructuredResume }
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { id?: string; title?: string; data?: StructuredResume };

    // Validate the resume data against the schema
    const validatedResume = StructuredResumeSchema.parse(body.data || body);

    const list = await readStore()

    // If id provided, update existing entry
    const id = body.id || `resume_${Date.now()}`
    const title = body.title || `${validatedResume.personal_data?.firstName || ''} ${validatedResume.personal_data?.lastName || ''}`.trim() || 'Untitled Resume'

    const existingIndex = list.findIndex((r) => r.id === id)
    const item: ResumeItem = { id, title, createdAt: existingIndex === -1 ? new Date().toISOString() : list[existingIndex].createdAt, updatedAt: new Date().toISOString(), data: validatedResume }

    if (existingIndex === -1) {
      list.unshift(item)
    } else {
      list[existingIndex] = item
    }

    await writeStore(list)

    return NextResponse.json(
      {
        success: true,
        message: 'Resume saved successfully',
        id,
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
