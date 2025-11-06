"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/inputInteractive"
import { useRouter, useSearchParams } from 'next/navigation'

export default function VerificationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [verificationCode, setVerificationCode] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const email = searchParams.get('email')

  const handleVerify = async () => {
    if (!email || !verificationCode) {
      setError('Please enter the verification code')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('https://careerback.datapsx.com/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code: verificationCode
        })
      })

      const data = await response.json()

      if (response.ok) {
        // Store token and redirect to dashboard
        document.cookie = `cf_auth=${data.token}; path=/; max-age=86400` // 24 hours
        router.push('/dashboard')
      } else {
        setError(data.message || 'Verification failed')
      }
    } catch (error) {
      setError('An error occurred during verification')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (!email) {
      setError('Email address is required')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('https://careerback.datapsx.com/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (response.ok) {
        alert('A new verification code has been sent to your email')
      } else {
        setError(data.message || 'Failed to resend verification code')
      }
    } catch (error) {
      setError('An error occurred while resending the code')
    } finally {
      setIsLoading(false)
    }
  }

  if (!email) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <div className="w-full max-w-md space-y-8 px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">Invalid Request</h2>
            <p className="text-muted-foreground mt-2">No email address provided.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Verify Your Email</h2>
          <p className="text-muted-foreground mt-2">
            Please enter the verification code sent to<br />
            <span className="font-medium">{email}</span>
          </p>
        </div>

        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Enter verification code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="text-center text-lg tracking-widest"
            maxLength={6}
          />

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <Button
            className="w-full"
            onClick={handleVerify}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Verifying...
              </span>
            ) : (
              'Verify Email'
            )}
          </Button>

          <div className="text-center">
            <button
              onClick={handleResendCode}
              disabled={isLoading}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Didn't receive the code? Click to resend
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}