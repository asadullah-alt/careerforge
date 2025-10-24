"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/buttonTable"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"

// small helper to copy text
async function copyToClipboard(text: string) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text)
  }
  // fallback
  const ta = document.createElement('textarea')
  ta.value = text
  document.body.appendChild(ta)
  ta.select()
  try { document.execCommand('copy') } catch { /* ignore */ }
  document.body.removeChild(ta)
}

export default function LinkedinModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!open) return
    // try to fetch existing token when modal opens
    const fetchToken = async () => {
      setLoading(true)
      try {
        const res = await fetch('https://careerback.datapsx.com/api/extension-token', { credentials: 'include' })
        const data = await res.json()
        if (data && data.success && data.token) setToken(data.token)
      } catch { 
        // ignore
      } finally { setLoading(false) }
    }
    fetchToken()
  }, [open])

  const createToken = async () => {
    setLoading(true)
    try {
      const res = await fetch('https://careerback.datapsx.com/api/extension-token', { method: 'POST', credentials: 'include' })
      const data = await res.json()
      if (data && data.success && data.token) setToken(data.token)
    } catch (err) {
      console.error(err)
    } finally { setLoading(false) }
  }

  const handleCopy = async () => {
    if (!token) return
    try {
      await copyToClipboard(token)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      console.error('copy failed', e)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {/* explicit top-down animation: slide-in-from-top */}
      <SheetContent side="top" className="max-w-none w-full h-screen p-0 overflow-hidden data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top data-[state=open]:duration-500">
        <div className="h-full w-full flex flex-col md:flex-row">
          {/* left image removed per request - full attention to instructions on the right */}

          <div className="flex-1 p-8 overflow-auto">
            <SheetHeader>
              <SheetTitle>Connect to LinkedIn</SheetTitle>
              <SheetDescription>To connect, first download our Google Chrome extension. Then open your LinkedIn profile in Chrome and use the extension to extract your profile directly into this site.</SheetDescription>
            </SheetHeader>

            <div className="mt-6 max-w-2xl">
              <div className="mt-8 p-4 border rounded">
                <h3 className="font-medium">Download extension (Google Chrome)</h3>
                <p className="text-sm text-muted-foreground mt-2">You must install the extension in Google Chrome. After install, visit your LinkedIn profile and use the extension&apos;s &quot;Extract from LinkedIn&quot; action to send your profile data to this site.</p>

                <div className="mt-4 flex gap-2">
                  <a href="#" className="inline-flex items-center gap-2 text-sm underline text-primary">Download extension for Chrome</a>
                  <a href="https://support.google.com/chrome/answer/95346" target="_blank" rel="noreferrer" className="text-sm text-muted-foreground">How to install extensions</a>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm">Once the extension is installed, open your LinkedIn profile in Chrome and click the extension to extract your profile. Then return here to continue.</p>
              </div>

              <div className="mt-6 p-4 border rounded">
                <h3 className="font-medium">Extension token</h3>
                <p className="text-sm text-muted-foreground mt-2">Your extension token lets the Chrome extension identify you. Create one if you don&apos;t have it, then copy it into the extension.</p>
                <div className="mt-4 flex gap-2 items-center">
                  <input readOnly value={token ?? ''} placeholder={loading ? 'Loading...' : 'No token yet'} className="flex-1 p-2 border rounded bg-muted/10" />
                  <Button size="sm" onClick={createToken} disabled={loading}>{token ? 'Refresh' : 'Create'}</Button>
                  <Button size="sm" onClick={handleCopy} disabled={!token}>{copied ? 'Copied' : 'Copy'}</Button>
                </div>
              </div>
            </div>

            <SheetFooter>
              <div className="flex items-center justify-between w-full">
                <div className="text-xs text-muted-foreground">We don&apos;t store anything on the server in this demo.</div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
                </div>
              </div>
            </SheetFooter>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
