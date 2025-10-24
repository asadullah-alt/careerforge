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
  // If the app is hosted on the main public URL and the user is on one of the
  // public marketing routes, hide the sidebar and header so the marketing
  // pages (signup, features, about-us, pricing, root) render without the app chrome.
  const hidePaths = ['/', '/signup', '/features', '/about', '/pricing']
  // Compute host-dependent UI only after client mount to avoid hydration
  // mismatches between server and client renders.
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const hideShellOnMain =
    mounted &&
    window.location.hostname === 'careerforge.datapsx.com' &&
    hidePaths.some((p) => pathname === p || pathname.startsWith(p + '/'))

  if (hideShellOnMain) {
    // Render children without the persistent sidebar/header
    return <div className="min-h-screen">{children}</div>
  }

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
