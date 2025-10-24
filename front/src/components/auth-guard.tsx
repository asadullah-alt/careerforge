"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TextShimmer } from '@/components/ui/text-shimmer'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const params = new URLSearchParams(window.location.search)
      const token = params.get('token')

      if (token) {
        const maxAge = 60 * 60 * 24 * 7 // 7 days
        const isSecure = window.location.protocol === 'https:'
        let cookie = `cf_auth=${encodeURIComponent(token)};path=/;max-age=${maxAge};SameSite=Lax`
        if (isSecure) cookie += '; Secure'
        document.cookie = cookie

        const url = new URL(window.location.href)
        url.searchParams.delete('token')
        window.history.replaceState({}, document.title, url.pathname + url.search)

        setLoading(false)
        return
      }

      const hasCookie = document.cookie.split(';').some((c) => c.trim().startsWith('cf_auth='))
      if (!hasCookie) {
        router.replace('/signup')
        return
      }

      setLoading(false)
    } catch (err) {
      console.error('Auth guard error:', err)
      router.replace('/signup')
    }
  }, [router])

  if (loading) {
    return (
      <TextShimmer className='font-mono text-sm min-h-screen flex items-center justify-center' duration={1}>
        Checking authentication...
      </TextShimmer>
    )
  }

  return <>{children}</>
}
