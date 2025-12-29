import React, { Suspense } from 'react'
import VerifyClient from './VerifyClient'

export default async function Page({ searchParams }: { searchParams: Promise<{ email?: string }> }) {
  const email = (await searchParams).email || null

  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <VerifyClient email={email} />
    </Suspense>
  )
}