import React, { Suspense } from 'react'
import VerifyClient from './VerifyClient'

export default function Page({ searchParams }: { searchParams?: { email?: string } }) {
  const email = searchParams?.email || null

  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <VerifyClient email={email} />
    </Suspense>
  )
}