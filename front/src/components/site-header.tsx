"use client"

import React, { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/buttonTable"
import { Separator } from "@/components/ui/separatorInteractive"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet"
import { UploadCloud, Linkedin, Mail, Download, Trash } from "lucide-react"
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/context/theme-context'
import LinkedinModal from "@/components/linkedin-modal"

type CVItem = {
  id: string
  name: string
  data: string // base64
  uploadedAt: string
}

const STORAGE_KEY = 'careerforge_cvs'

function loadCvs(): CVItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) as CVItem[] : []
  } catch {
    return []
  }
}

function saveCvs(items: CVItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch (err) {
    console.error('Failed to save CVs', err)
  }
}

export function SiteHeader() {
  const pathname = usePathname() || "/"
  const isLifecycle = pathname.startsWith("/lifecycle")
  const title = isLifecycle ? "Lifecycle" : "Dashboard"
  const buttonText = isLifecycle ? "Create Lifecycle" : "Create New Job Application"

  const [sheetOpen, setSheetOpen] = useState(false)
  const [linkedinOpen, setLinkedinOpen] = useState(false)
  const [cvs, setCvs] = useState<CVItem[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setCvs(loadCvs())
  }, [])

  const onUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFile = (file?: File) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // result is base64 data URL
      const id = Date.now().toString(36)
      const item: CVItem = {
        id,
        name: file.name,
        data: result,
        uploadedAt: new Date().toISOString(),
      }
      const next = [item, ...cvs]
      setCvs(next)
      saveCvs(next)
    }
    reader.readAsDataURL(file)
  }

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0]
    handleFile(file)
    // reset input
    e.currentTarget.value = ''
  }

  const handleDelete = (id: string) => {
    const next = cvs.filter(c => c.id !== id)
    setCvs(next)
    saveCvs(next)
  }

  const handleDownload = (item: CVItem) => {
    try {
      const res = item.data
      const arr = res.split(',')
      const mime = arr[0].match(/:(.*?);/)?.[1] || 'application/octet-stream'
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) u8arr[n] = bstr.charCodeAt(n)
      const blob = new Blob([u8arr], { type: mime })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = item.name
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('download failed', err)
    }
  }

  const { theme, toggle } = useTheme()
  // Log theme changes only (avoids logging on every render)
  useEffect(() => {
    console.log('[SiteHeader] theme:', theme)
  }, [theme])

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>

        <div className="ml-4 hidden sm:flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLinkedinOpen(true)}
            className="border border-gray-200 dark:border-gray-700 rounded-md px-2"
          >
            <Linkedin className="size-4 mr-2" />
            <span className="hidden md:inline">Connect to LinkedIn</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSheetOpen(true)}
            className="border border-gray-200 dark:border-gray-700 rounded-md px-2"
          >
            <UploadCloud className="size-4 mr-2" />
            <span className="hidden md:inline">Upload Base CV</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open('mailto:hello@careerforge.com')}
            className="border border-gray-200 dark:border-gray-700 rounded-md px-2"
          >
            <Mail className="size-4 mr-2" />
            <span className="hidden md:inline">Connect with Email</span>
          </Button>
        </div>
  <LinkedinModal open={linkedinOpen} onOpenChange={setLinkedinOpen} />

        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => { console.log('[SiteHeader] toggle clicked'); toggle() }} className="border border-gray-200 dark:border-gray-700 rounded-md px-2">
            {theme === 'dark' ? <Sun className="size-4 mr-2" /> : <Moon className="size-4 mr-2" />}
           
          </Button>
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://careerforge.datapsx.com"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              {buttonText}
            </a>
          </Button>
        </div>

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
    <SheetContent side="right" className="data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right data-[state=open]:duration-500">
            <SheetHeader>
              <SheetTitle>Upload Base CV</SheetTitle>
              <SheetDescription>Upload a CV to use as your base. You can upload multiple and manage them here.</SheetDescription>
            </SheetHeader>

            <div className="p-4">
              <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.txt" onChange={onFileChange} className="hidden" />
              <div className="flex gap-2">
                <Button onClick={onUploadClick} size="sm">
                  <UploadCloud className="size-4 mr-2" /> Upload CV
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSheetOpen(false)}>
                  Close
                </Button>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium">Your CVs</h3>
                {cvs.length === 0 ? (
                  <p className="text-sm text-muted-foreground mt-2">No CVs uploaded yet.</p>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {cvs.map((cv) => (
                      <li key={cv.id} className="flex items-center justify-between gap-2 p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <FileName className="size-4 text-muted-foreground" />
                          <div>
                            <div className="text-sm font-medium">{cv.name}</div>
                            <div className="text-xs text-muted-foreground">{new Date(cv.uploadedAt).toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleDownload(cv)}>
                            <Download className="size-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(cv.id)}>
                            <Trash className="size-4" />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <SheetFooter>
              <div className="text-xs text-muted-foreground">Files are stored locally in your browser for this demo.</div>
            </SheetFooter>

            <SheetClose />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

function FileName(props: React.SVGProps<SVGSVGElement>) {
  // small fallback file icon
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 3v6h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
