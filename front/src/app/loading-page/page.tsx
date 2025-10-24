'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BackgroundPaths } from '@/components/ui/loading-screen'

export default function LoadingPage() {
  const router = useRouter()

  useEffect(() => {
    // check for cf_token cookie
    const cookies = document.cookie.split(';').map(c => c.trim())
    const hasToken = cookies.some(c => c.startsWith('cf_auth='))

    if (!hasToken) {
      // if no token, go back to home
      router.replace('/')
      return
    }

    const t = setTimeout(() => {
      router.replace('/dashboard')
    }, 2000)

    return () => clearTimeout(t)
  }, [router])

  return <BackgroundPaths />
}
