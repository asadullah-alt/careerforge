"use client"

import React, { useEffect, useState } from "react"
import { useResumeStore } from "@/store/resume-store"
import AuthGuard from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Plus, Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { StructuredResume } from '@/lib/schemas/resume'
import { getCfAuthCookie } from "@/utils/cookie"

type ResumeListItem = {
  _id: string
  title: string
  resume_name: string
  createdAt: string
  updatedAt?: string
} &  StructuredResume

export default function ResumesListPage() {
  const router = useRouter()
  const initializeResume = useResumeStore((s) => s.initializeResume)
  const resetResume = useResumeStore((s) => s.resetResume)

  const [resumes, setResumes] = useState<ResumeListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [renameOpen, setRenameOpen] = useState(false)
  const [renameId, setRenameId] = useState<string | null>(null)
  const [renameTitle, setRenameTitle] = useState("")
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    // Get auth token
    const authToken = getCfAuthCookie()
    setToken(authToken)
  }, [])

  useEffect(() => {
    if (token !== null) {
      loadFromServer()
    }
  }, [token])

  async function loadFromServer() {
    setIsLoading(true)
    try {
      const res = await fetch('https://careerback.bhaikaamdo.com/api/resume/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "token":token }),
      })
      const json = await res.json()
      if (json?.success) setResumes(json.data || [])
      else setResumes([])
      console.log(resumes[0])
    } catch (e) {
      console.error('Failed to load resumes from server:', e)
      setResumes([])
    } finally {
      setIsLoading(false)
    }
  }

  function handleCreateNew() {
    // Reset the in-memory/persisted resume store to a fresh resume
    resetResume()
    // Navigate to the resume builder
    router.push("/dashboard/resume")
  }``

  async function handleEdit(item: ResumeListItem) {
    try {
        console.log("Editing resume with ID:", item);
      const res = await fetch('https://careerback.bhaikaamdo.com/api/resume/load', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item._id, token: token }),
      })
      const json = await res.json()
      if (json?.success && json.data) {
        initializeResume(json.data.data)
        router.push("/dashboard/resume")
      } else {
        toast.error('Failed to load resume')
      }
    } catch (e) {
      console.error('Edit load error', e)
      toast.error('Failed to load resume')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this resume? This cannot be undone.")) return
    try {
      const res = await fetch('https://careerback.bhaikaamdo.com/api/resume/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, token }),
      })
      const json = await res.json()
      if (json?.success) {
        toast.success('Resume deleted')
        await loadFromServer()
      } else {
        toast.error('Failed to delete')
      }
    } catch (e) {
      console.error('Delete error', e)
      toast.error('Failed to delete')
    }
  }

  function openRenameDialog(item: ResumeListItem) {
    setRenameId(item._id)
    setRenameTitle(item.title || '')
    setRenameOpen(true)
  }

  async function submitRename() {
    if (!renameId) return
    try {
      const res = await fetch('https://careerback.bhaikaamdo.com//api/resume/rename', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: renameId, title: renameTitle, token }) })
      const json = await res.json()
      if (json?.success) {
        toast.success('Renamed')
        setRenameOpen(false)
        await loadFromServer()
      } else {
        toast.error('Rename failed')
      }
    } catch (e) {
      console.error('Rename error', e)
      toast.error('Rename failed')
    }
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Your Resumes</h1>
            <p className="text-muted-foreground">Manage your resumes and create new ones.</p>
          </div>
          <div>
            <Button onClick={handleCreateNew}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Resume
            </Button>
          </div>
        </div>

        {resumes.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-12">
            <p className="text-muted-foreground">You have no saved resumes yet.</p>
            <Button variant="secondary" onClick={handleCreateNew}>
              <Plus className="mr-2 h-4 w-4" /> Create your first resume
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumes.map((r) => {
                
              const name = r?.personal_data ? `${r.personal_data.firstName || ''} ${r.personal_data.lastName || ''}`.trim() : r.title
              const initials = (name || r.title || 'U').split(' ').map((s:string) => s.charAt(0)).slice(0,2).join('').toUpperCase()
              const experiences = Array.isArray(r?.experiences) ? r.experiences.length : 0
              const skills = Array.isArray(r?.skills) ? r.skills.length : 0
              const updated = r.updatedAt || r.createdAt || ''

              return (
                <div key={r._id} className="border rounded-lg p-4 bg-card">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">{initials}</div>
                      <div>
                        <h3 className="font-semibold">{r.resume_name || name || 'Untitled Resume'}</h3>
                        <p className="text-sm text-muted-foreground">{experiences} experience(s) • {skills} skill(s)</p>
                        <p className="text-xs text-muted-foreground">Updated: {updated ? new Date(updated).toLocaleString() : '—'}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(r)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(r._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Button onClick={() => handleEdit(r)}>Open</Button>
                    <Button variant="outline" onClick={() => openRenameDialog(r)}>Rename</Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rename Resume</DialogTitle>
              <DialogDescription>Give your resume a friendly name.</DialogDescription>
            </DialogHeader>
            <div className="mt-2">
              <Input value={renameTitle} onChange={(e) => setRenameTitle(e.target.value)} placeholder="Resume title" />
            </div>
            <DialogFooter>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setRenameOpen(false)}>Cancel</Button>
                <Button onClick={submitRename}>Save</Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AuthGuard>
  )
}
