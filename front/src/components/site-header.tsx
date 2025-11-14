"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/buttonTable"
import { Separator } from "@/components/ui/separatorInteractive"
import { SidebarTrigger } from "@/components/ui/sidebar"
import FileUpload from "@/components/file-upload"
import { usePathname, useRouter } from "next/navigation"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet"
import { UploadCloud, Linkedin, Mail, ChevronDown,BookOpenCheck  } from "lucide-react"
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/context/theme-context'
import LinkedinModal from "@/components/linkedin-modal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { getCfAuthCookie } from "@/utils/cookie"

// Add button blink animation styles
const buttonAnimationStyle = `
  @keyframes double-blink {
    0%, 100% { opacity: 1; }
    25% { opacity: 0.3; }
    50% { opacity: 1; }
    75% { opacity: 0.3; }
  }
  .animate-double-blink {
    animation: double-blink 0.6s ease-in-out;
  }
`

export function SiteHeader() {
  const pathname = usePathname() || "/"
  const isLifecycle = pathname.startsWith("/lifecycle")
  const title = isLifecycle ? "Lifecycle" : "Dashboard"

  const [sheetOpen, setSheetOpen] = useState(false)
  const [linkedinOpen, setLinkedinOpen] = useState(false)
  const [resumes, setResumes] = useState<Array<{ id: string; resume_name?: string }>>([])
  const [activeResume, setActiveResume] = useState<string | null>(null)
  const [loadingResumes, setLoadingResumes] = useState(false)
  const [blinkingButton, setBlinkingButton] = useState<string | null>(null)

  // Inject animation styles
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = buttonAnimationStyle
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // Preload PDF worker when user is authenticated
  useEffect(() => {
    const token = getCfAuthCookie()
    if (token && typeof window !== 'undefined') {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'script'
      link.href = 'https://bhaikaamdo.com/pdf.worker.min.mjs'
      document.head.appendChild(link)
    }
  }, [])

  const handleButtonClick = (buttonId: string) => {
    setBlinkingButton(buttonId)
    setTimeout(() => setBlinkingButton(null), 600)
  }

  const { theme, toggle } = useTheme()
  // Log theme changes only (avoids logging on every render)
  useEffect(() => {
    console.log('[SiteHeader] theme:', theme)
  }, [theme])

  // Fetch resumes on mount
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setLoadingResumes(true)
        const token = getCfAuthCookie()
        if (!token) return

        const response = await fetch(
          `https://resume.bhaikaamdo.com/api/v1/resumes/getAllUserResumes?token=${token}`
        )
        const data = await response.json()
        if (data.data && Array.isArray(data.data)) {
          setResumes(data.data)
          // Set first resume as active by default
          if (data.data.length > 0) {
            setActiveResume(data.data[0].id)
          }
        }
      } catch (error) {
        console.error('Error fetching resumes:', error)
      } finally {
        setLoadingResumes(false)
      }
    }

    void fetchResumes()
  }, [])

  const router = useRouter()

  function handleLogout() {
    // Clear cf_auth cookie by setting it to expired
    document.cookie = 'cf_auth=; path=/; max-age=0; SameSite=Lax'
    router.replace('/')
  }

  const getResumeDisplayName = (resume: { id: string; resume_name?: string }): string => {
    return resume.resume_name || resume.id || 'Resume'
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1
          className={`text-base font-medium ${title === 'Dashboard' ? 'cursor-pointer' : ''}`}
          role={title === 'Dashboard' ? 'button' : undefined}
          tabIndex={title === 'Dashboard' ? 0 : undefined}
          onClick={() => {
            if (title === 'Dashboard') router.push('/dashboard')
          }}
          onKeyDown={(e) => {
            if ((e as React.KeyboardEvent).key === 'Enter' && title === 'Dashboard') router.push('/dashboard')
          }}
        >
          {title}
        </h1>

        <div className="ml-4 hidden sm:flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              handleButtonClick('linkedin')
              setLinkedinOpen(true)
            }}
            className={`border border-gray-200 dark:border-gray-700 rounded-md px-2 cursor-pointer transition-all duration-200 hover:bg-primary/10 hover:border-primary dark:hover:border-primary ${blinkingButton === 'linkedin' ? 'animate-double-blink' : ''}`}
          >
            <Linkedin className="size-4 mr-2" />
            <span className="hidden md:inline">Connect to LinkedIn</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              handleButtonClick('upload')
              setSheetOpen(true)
            }}
            className={`border border-gray-200 dark:border-gray-700 rounded-md px-2 cursor-pointer transition-all duration-200 hover:bg-primary/10 hover:border-primary dark:hover:border-primary ${blinkingButton === 'upload' ? 'animate-double-blink' : ''}`}
          >
            <UploadCloud className="size-4 mr-2" />
            <span className="hidden md:inline">Upload Base CV</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
           
            className={`border border-gray-200 dark:border-gray-700 rounded-md px-2 cursor-pointer transition-all duration-200 hover:bg-primary/10 hover:border-primary dark:hover:border-primary ${blinkingButton === 'email' ? 'animate-double-blink' : ''}`}
            onClick={() => handleButtonClick('email')}
          >
            <Mail className="size-4 mr-2" />
            <span className="hidden md:inline">Connect with Email</span>
          </Button>
           <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              handleButtonClick('resumebuilder')
              router.push('/dashboard/resumes')
            }}
            className={`border border-gray-200 dark:border-gray-700 rounded-md px-2 cursor-pointer transition-all duration-200 hover:bg-primary/10 hover:border-primary dark:hover:border-primary ${blinkingButton === 'resumebuilder' ? 'animate-double-blink' : ''}`}
          >
            <BookOpenCheck className="size-4 mr-2" />
            <span className="hidden md:inline">Resume Builder</span>
          </Button>
        </div>
  <LinkedinModal open={linkedinOpen} onOpenChange={setLinkedinOpen} />

        <div className="ml-auto flex items-center gap-2">
          {/* Resume Selector Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="border border-gray-200 dark:border-gray-700 rounded-md px-2 hidden sm:flex items-center gap-1"
                disabled={loadingResumes || resumes.length === 0}
              >
                <span className="text-xs truncate max-w-[150px]">
                  {loadingResumes ? 'Loading...' : activeResume ? getResumeDisplayName(resumes.find(r => r.id === activeResume) || { id: activeResume }) : 'Select Resume'}
                </span>
                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Active Resume</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {resumes.length > 0 ? (
                resumes.map((resume) => (
                  <DropdownMenuItem
                    key={resume.id}
                    onClick={() => setActiveResume(resume.id)}
                    className={activeResume === resume.id ? 'bg-accent' : ''}
                  >
                    <span className="text-sm">{getResumeDisplayName(resume)}</span>
                    {activeResume === resume.id && <span className="ml-2">✓</span>}
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="px-2 py-1.5 text-xs text-muted-foreground">
                  No resumes found
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="sm" onClick={() => { console.log('[SiteHeader] toggle clicked'); handleButtonClick('theme'); toggle() }} className={`border border-gray-200 dark:border-gray-700 rounded-md px-2 transition-all duration-200 hover:bg-primary/10 hover:border-primary dark:hover:border-primary ${blinkingButton === 'theme' ? 'animate-double-blink' : ''}`}>
            {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
           
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              handleButtonClick('logout')
              handleLogout()
            }}
            className={`hidden sm:flex border border-gray-200 dark:border-gray-700 rounded-md px-2 transition-all duration-200 hover:bg-primary/10 hover:border-primary dark:hover:border-primary ${blinkingButton === 'logout' ? 'animate-double-blink' : ''}`}
          >
            Logout
          </Button>
        </div>

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
    <SheetContent side="right" className="data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right data-[state=open]:duration-500">
            <SheetHeader>
              <SheetTitle>Upload Resume</SheetTitle>
              <SheetDescription>Upload your resume to start matching with jobs. Supports PDF and DOCX formats.</SheetDescription>
            </SheetHeader>

            <div className="p-4">
              <FileUpload />
            </div>

            <SheetFooter>
              <div className="text-xs text-muted-foreground">Resume will be uploaded and processed by our AI.</div>
            </SheetFooter>

            <SheetClose />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}


