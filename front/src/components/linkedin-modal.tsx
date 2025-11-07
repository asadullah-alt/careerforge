"use client"
import React from "react"
import { Button } from "@/components/ui/buttonTable"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"

export default function LinkedinModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  
  
 


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
                <p className="text-sm">Once the extension is installed, open your LinkedIn profile in Chrome and click the extension to extract your profile.</p>
              </div>

           
            </div>

            <SheetFooter>
              <div className="flex items-center justify-between w-full">
              
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
