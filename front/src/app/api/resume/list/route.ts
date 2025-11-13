import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises'
import path from 'path'

const DATA_PATH = path.join(process.cwd(), 'front', '.data')
const FILE_PATH = path.join(DATA_PATH, 'resumes.json')

async function readStore() {
  try {
    const raw = await fs.readFile(FILE_PATH, 'utf-8')
    return JSON.parse(raw)
  } catch (e) {
    return []
  }
}

export async function GET(request: NextRequest) {
  try {
    const list = await readStore()
    return NextResponse.json({ success: true, data: list }, { status: 200 })
  } catch (error) {
    console.error('[Resume List API] Error:', error)
    return NextResponse.json({ success: false, error: 'Failed to read resumes' }, { status: 500 })
  }
}
