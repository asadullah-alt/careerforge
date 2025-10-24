"use client"

import React from 'react'
import { useTheme } from '@/context/theme-context'
import { Button } from '@/components/ui/buttonTable'
import { Sun, Moon } from 'lucide-react'

export default function Page() {
  const { theme, setTheme, toggle } = useTheme()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-4">
          <div>
            <div className="text-sm font-medium">Theme</div>
            <div className="text-xs text-muted-foreground">Current: {theme}</div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" onClick={() => { console.log('[Settings] setTheme -> light'); setTheme('light') }}>
              <Sun className="size-4 mr-2" /> 
            </Button>
            <Button size="sm" onClick={() => { console.log('[Settings] setTheme -> dark'); setTheme('dark') }}>
              <Moon className="size-4 mr-2" /> 
            </Button>
            <Button size="sm" variant="outline" onClick={() => { console.log('[Settings] toggle'); toggle() }}>
              Toggle
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
