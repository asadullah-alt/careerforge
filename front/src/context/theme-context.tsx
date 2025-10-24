"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

type ThemeContextValue = {
  theme: Theme
  setTheme: (t: Theme) => void
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

const STORAGE_KEY = 'cf_theme'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system')

  useEffect(() => {
    try {
      console.log('[ThemeProvider] reading stored theme')
      const raw = localStorage.getItem(STORAGE_KEY)
      console.log('[ThemeProvider] raw stored value:', raw)
      if (raw === 'light' || raw === 'dark' || raw === 'system') {
        setThemeState(raw)
      } else {
        setThemeState('system')
      }
    } catch (err) {
      console.error('[ThemeProvider] error reading stored theme', err)
      setThemeState('system')
    }
  }, [])

  useEffect(() => {
    // apply theme to document element using the 'dark' class (Tailwind expects this)
    const apply = (t: Theme) => {
      const root = document.documentElement
      const setDark = (isDark: boolean) => {
        if (isDark) {
          root.classList.add('dark')
          console.log('[ThemeProvider] added class dark on root')
        } else {
          root.classList.remove('dark')
          console.log('[ThemeProvider] removed class dark from root')
        }
      }

      if (t === 'system') {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        console.log('[ThemeProvider] applying system theme ->', prefersDark ? 'dark' : 'light')
        setDark(prefersDark)
      } else {
        console.log('[ThemeProvider] applying theme ->', t)
        setDark(t === 'dark')
      }
    }
    apply(theme)
    try {
      console.log('[ThemeProvider] persisting theme to localStorage:', theme)
      localStorage.setItem(STORAGE_KEY, theme)
    } catch (err) {
      console.error('[ThemeProvider] failed to persist theme', err)
    }
  }, [theme])

  const setTheme = (t: Theme) => {
    console.log('[ThemeProvider] setTheme called ->', t)
    setThemeState(t)
  }
  const toggle = () => {
    setThemeState((s) => {
      const next = s === 'dark' ? 'light' : 'dark'
      console.log('[ThemeProvider] toggle called, current ->', s, 'next ->', next)
      return next
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
