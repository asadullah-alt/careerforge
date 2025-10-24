"use client"

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { HeroSection } from '@/components/hero-section-1'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    try {
      const cookies = document.cookie.split(';').map(c => c.trim())
      const hasToken = cookies.some(c => c.startsWith('cf_auth='))
      if (hasToken) {
        router.replace('/loading-page')
      }
    } catch {
      // ignore
    }
  }, [router])

  return <HeroSection />
}
