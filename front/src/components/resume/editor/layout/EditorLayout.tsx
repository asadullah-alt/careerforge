'use client'

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'
import { ResizablePanels } from './ResizablePanels'

interface EditorLayoutProps {
  isBaseResume: boolean
  editorPanel: ReactNode
  previewPanel: (width: number) => ReactNode
}

export function EditorLayout({ isBaseResume, editorPanel, previewPanel }: EditorLayoutProps) {
  return (
    <main className={cn('flex h-full')}>
      <div className="mx-auto max-w-7xl w-full p-6">
        <div className="relative rounded-2xl overflow-hidden backdrop-blur-xl bg-white/40 dark:bg-zinc-900/40 border border-purple-200/50 dark:border-zinc-800/40 shadow-xl p-4 md:p-6 h-[calc(100vh-6rem)]">
          <div className="mb-4">
            <h1 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Resume Builder</h1>
            <p className="text-sm text-muted-foreground">Edit and preview your resume in real time</p>
          </div>
          <ResizablePanels isBaseResume={isBaseResume} editorPanel={editorPanel} previewPanel={previewPanel} />
        </div>
      </div>
    </main>
  )
}
