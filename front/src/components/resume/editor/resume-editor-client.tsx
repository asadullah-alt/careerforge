'use client'

import React from 'react'
import { Resume, Profile, Job } from '@/lib/types'
import { useState, useEffect, useReducer } from 'react'
import { useRouter } from 'next/navigation'
import { ResumeContext, resumeReducer } from './resume-editor-context'
import { EditorLayout } from './layout/EditorLayout'
import { EditorPanel } from './panels/editor-panel'
import { PreviewPanel } from './panels/preview-panel'
import { UnsavedChangesDialog } from './dialogs/unsaved-changes-dialog'

interface ResumeEditorClientProps {
  initialResume: Resume
  profile: Profile | null
  initialJob?: Job | null
}

export function ResumeEditorClient({
  initialResume,
  profile = null,
  initialJob
}: ResumeEditorClientProps) {
  const router = useRouter()
  const [state, dispatch] = useReducer(resumeReducer, {
    resume: initialResume,
    isSaving: false,
    isDeleting: false,
    hasUnsavedChanges: false
  })

  const [showExitDialog, setShowExitDialog] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)

    // Job state preserved for future extension - currently initialized but not updated
    const job = initialJob ?? null

    const updateField = (field: keyof Resume, value: unknown) => {
    dispatch({ type: 'UPDATE_FIELD', field, value })
  }

  // Track changes
  useEffect(() => {
    const hasChanges = JSON.stringify(state.resume) !== JSON.stringify(initialResume)
    dispatch({ type: 'SET_HAS_CHANGES', value: hasChanges })
  }, [state.resume, initialResume])

  // Handle beforeunload event
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (state.hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
        return ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [state.hasUnsavedChanges])

  const editorPanel = (
    <EditorPanel resume={state.resume} profile={profile} job={job} isLoadingJob={false} onResumeChange={updateField} />
  )

  const previewPanel = (width: number) => <PreviewPanel resume={state.resume} onResumeChange={updateField} width={width} />

  return (
    <ResumeContext.Provider value={{ state, dispatch }}>
      <UnsavedChangesDialog
        isOpen={showExitDialog}
        onOpenChange={setShowExitDialog}
        onConfirm={() => {
          if (pendingNavigation) {
            router.push(pendingNavigation)
          }
          setShowExitDialog(false)
          setPendingNavigation(null)
        }}
      />

      <EditorLayout isBaseResume={state.resume.is_base_resume} editorPanel={editorPanel} previewPanel={previewPanel} />
    </ResumeContext.Provider>
  )
}
