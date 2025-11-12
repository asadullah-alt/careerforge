import { createContext, useContext, Dispatch } from 'react'
import { Resume } from '@/lib/types'

interface ResumeState {
  resume: Resume
  isSaving: boolean
  isDeleting: boolean
  hasUnsavedChanges: boolean
}

type ResumeAction = 
  | { type: 'UPDATE_FIELD'; field: keyof Resume; value: unknown }
  | { type: 'SET_SAVING'; value: boolean }
  | { type: 'SET_DELETING'; value: boolean }
  | { type: 'SET_HAS_CHANGES'; value: boolean }

const ResumeContext = createContext<{
  state: ResumeState
  dispatch: Dispatch<ResumeAction>
} | null>(null)

function resumeReducer(state: ResumeState, action: ResumeAction): ResumeState {
  switch (action.type) {
    case 'UPDATE_FIELD':
      const newState = {
        ...state,
        resume: {
          ...state.resume,
          // Cast to Resume field value to allow dynamic updates from the editor.
          // The editor ensures values conform to Resume shape at runtime.
          [action.field]: action.value as Resume[keyof Resume]
        }
      }
      return newState

    case 'SET_SAVING':
      return { ...state, isSaving: action.value }
    case 'SET_DELETING':
      return { ...state, isDeleting: action.value }
    case 'SET_HAS_CHANGES':
      return { ...state, hasUnsavedChanges: action.value }
    default:
      return state
  }
}

export function useResumeContext() {
  const context = useContext(ResumeContext)
  if (!context) {
    throw new Error('useResumeContext must be used within a ResumeProvider')
  }
  return context
}

export { ResumeContext, resumeReducer }
