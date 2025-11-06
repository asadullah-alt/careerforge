"use client"
import React, { useState, useEffect } from "react"
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Toaster } from '@/components/ui/sonner'
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/'
  const hidePaths = ['/', '/signup', '/features', '/about', '/pricing']
  
  const [isMainHost, setIsMainHost] = useState<boolean | null>(null)
  
  useEffect(() => {
    setIsMainHost(window.location.hostname === 'careerforge.datapsx.com')
  }, [])

  // Check path immediately - it's available from Next.js router
  const isHidePath = hidePaths.some((p) => pathname === p || pathname.startsWith(p + '/'))
  
  // Only hide if we've confirmed it's the main host AND it's a hide path
  // During loading (isMainHost === null), assume we should show the shell
  const hideShell = isMainHost === true && isHidePath

  if (hideShell) {
    return <div className="min-h-screen">{children}</div>
  }

  // Show loading state or shell while checking hostname
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <Toaster />
        <div className="flex flex-1 flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.24 }}
              className="flex-1"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}