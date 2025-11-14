"use client"

import React, { useEffect, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { StructuredResume } from '@/lib/schemas/resume'
import type { PdfStyles } from '@/lib/resume-pdf'
import { Settings } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

// Bundle the pdf.js worker so it is served with the app and version-matched.
// Requires `pdfjs-dist` to be installed in the project.
// import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry'

interface PdfViewerProps {
  blobUrl: string | null
  data?: StructuredResume | null
  onTemplateChange?: (template: string) => void
  onStylesChange?: (styles: PdfStyles) => void
  currentTemplate?: string
  currentStyles?: Partial<PdfStyles>
}

// Configure PDF.js worker to use pdfjs-dist bundler entry.
// This ensures API version matches Worker version.
if (typeof window !== 'undefined' && !pdfjs.GlobalWorkerOptions.workerSrc) {
  try {
    // Use a CDN-hosted worker that matches the pdfjs API version to avoid
    // file:// paths (browsers block loading local resources) and version
    // mismatches. `react-pdf` exposes `pdfjs.version`.
    pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'
    console.warn('pdfjs worker not bundled; fallback to /pdf.worker.min.js. To bundle the worker, install `pdfjs-dist` and rebuild.')
  } catch {
    // If anything fails, react-pdf will try to use its bundled worker.
  }
}

export default function PdfViewer({ blobUrl, onTemplateChange, onStylesChange, currentTemplate = 'classic', currentStyles }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [page, setPage] = useState<number>(1)
  const [scale, setScale] = useState<number>(1.0)
  const [showThumbs, setShowThumbs] = useState<boolean>(false)
  const [fileData, setFileData] = useState<Blob | string | null>(null)
  const [template, setTemplate] = useState(currentTemplate)
  const [showStylesModal, setShowStylesModal] = useState(false)
  const [customStyles, setCustomStyles] = useState<Partial<PdfStyles>>(currentStyles || {})

  useEffect(() => {
    setTemplate(currentTemplate)
  }, [currentTemplate])

  useEffect(() => {
    if (currentStyles) {
      setCustomStyles(currentStyles)
    }
  }, [currentStyles])

  useEffect(() => {
    // reset when blob changes
    setPage(1)
    // workerSrc already set globally; nothing else to do here.
    setNumPages(0)
  }, [blobUrl])

  // When a blob URL is provided, fetch it as a Blob and pass that to react-pdf.
  useEffect(() => {
    let mounted = true
    async function load() {
      if (!blobUrl) {
        if (mounted) setFileData(null)
        return
      }

      try {
        // If it's a blob: URL, fetch the blob and pass it directly to react-pdf
        if (blobUrl.startsWith('blob:') || blobUrl.startsWith('data:')) {
          const resp = await fetch(blobUrl)
          const b = await resp.blob()
          if (mounted) setFileData(b)
        } else {
          // For absolute URLs, just pass the URL string
          if (mounted) setFileData(blobUrl)
        }
      } catch (err) {
        console.error('Failed to fetch PDF blob', err)
        if (mounted) setFileData(null)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [blobUrl])

  function onDocumentLoadSuccess({ numPages: n }: { numPages: number }) {
    // Only update if it's different to prevent re-renders
    setNumPages((prev) => (prev !== n ? n : prev))
  }

  function handleTemplateChange(newTemplate: string) {
    setTemplate(newTemplate)
    onTemplateChange?.(newTemplate)
  }

  function handleStyleUpdate(key: keyof PdfStyles, value: Record<string, number | string>) {
    const updated = { ...customStyles, [key]: value }
    setCustomStyles(updated)
    onStylesChange?.(updated)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/50 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <label htmlFor="template" className="text-xs text-muted-foreground font-medium">Template:</label>
          <select
            id="template"
            className="text-sm rounded-md border px-2 py-1 bg-card"
            value={template}
            onChange={(e) => handleTemplateChange(e.target.value)}
          >
            <option value="classic">Classic</option>
            <option value="modern">Modern</option>
            <option value="minimal">Minimal</option>
            <option value="bold">Bold</option>
            <option value="compact">Compact</option>
          </select>

          <button
            className="px-2 py-1 rounded border bg-white/80 text-sm"
            onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}
          >
            −
          </button>
          <span className="text-sm">{Math.round(scale * 100)}%</span>
          <button
            className="px-2 py-1 rounded border bg-white/80 text-sm"
            onClick={() => setScale((s) => Math.min(2.0, s + 0.1))}
          >
            +
          </button>
          <button
            className="px-2 py-1 rounded border bg-white/80 text-sm"
            onClick={() => setShowThumbs((t) => !t)}
          >
            {showThumbs ? 'Hide Thumbs' : 'Show Thumbs'}
          </button>

          <Dialog open={showStylesModal} onOpenChange={setShowStylesModal}>
            <DialogTrigger asChild>
              <button className="px-2 py-1 rounded border bg-white/80 text-sm flex items-center gap-1">
                <Settings size={14} />
                Styles
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>PDF Styles Settings</DialogTitle>
                <DialogDescription>
                  Customize the appearance of your resume PDF
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Page Padding</label>
                  <input
                    type="number"
                    value={(customStyles.page as Record<string, number | string>)?.padding || 20}
                    onChange={(e) => handleStyleUpdate('page', { ...(customStyles.page as Record<string, number | string>), padding: parseInt(e.target.value) })}
                    className="w-full px-2 py-1 rounded border text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Font Size</label>
                  <input
                    type="number"
                    value={(customStyles.page as Record<string, number | string>)?.fontSize || 11}
                    onChange={(e) => handleStyleUpdate('page', { ...(customStyles.page as Record<string, number | string>), fontSize: parseInt(e.target.value) })}
                    className="w-full px-2 py-1 rounded border text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Name Font Size</label>
                  <input
                    type="number"
                    value={(customStyles.name as Record<string, number | string>)?.fontSize || 18}
                    onChange={(e) => handleStyleUpdate('name', { ...(customStyles.name as Record<string, number | string>), fontSize: parseInt(e.target.value) })}
                    className="w-full px-2 py-1 rounded border text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Section Title Font Size</label>
                  <input
                    type="number"
                    value={(customStyles.sectionTitle as Record<string, number | string>)?.fontSize || 12}
                    onChange={(e) => handleStyleUpdate('sectionTitle', { ...(customStyles.sectionTitle as Record<string, number | string>), fontSize: parseInt(e.target.value) })}
                    className="w-full px-2 py-1 rounded border text-sm"
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <button
            className="px-2 py-1 rounded border bg-white/80 text-sm"
            onClick={() => {
              if (!fileData) return
              const url = fileData instanceof Blob ? URL.createObjectURL(fileData) : String(fileData)
              const a = document.createElement('a')
              a.href = url
              a.download = 'resume.pdf'
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
              if (fileData instanceof Blob) {
                URL.revokeObjectURL(url)
              }
            }}
            disabled={!blobUrl}
          >
            Download
          </button>
          <button
            className="px-2 py-1 rounded border bg-white/80 text-sm"
            onClick={() => {
              if (!blobUrl) return
              const w = window.open(blobUrl, '_blank')
              if (w) w.print()
            }}
            disabled={!blobUrl}
          >
            Print
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {showThumbs && (
          <div className="w-20 overflow-auto border-r bg-surface">
            <Document file={fileData} onLoadSuccess={onDocumentLoadSuccess} onLoadError={(err) => console.error('Document load error', err)} loading={<div className="p-2 text-xs">Loading…</div>}>
              {Array.from({ length: numPages || 0 }, (_, i) => (
                <div key={i} className={`p-1 cursor-pointer ${page === i + 1 ? 'ring-2 ring-primary' : ''}`} onClick={() => setPage(i + 1)}>
                  <Page pageNumber={i + 1} width={80} renderTextLayer={false} renderAnnotationLayer={false} />
                </div>
              ))}
            </Document>
          </div>
        )}

        <div className="flex-1 overflow-auto p-3">
          {fileData ? (
            <Document file={fileData} onLoadSuccess={onDocumentLoadSuccess} onLoadError={(err) => console.error('Document load error', err)} loading={<div className="text-center py-10">Loading PDF…</div>}>
              <div className="flex justify-center">
                <Page pageNumber={page} scale={scale} />
              </div>
            </Document>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">Generating PDF preview…</div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 px-3 py-2 border-t bg-muted/50">
        <button
          className="btn px-2 py-1 rounded border bg-white/80 text-sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
        >
          Prev
        </button>
        <button
          className="btn px-2 py-1 rounded border bg-white/80 text-sm"
          onClick={() => setPage((p) => Math.min(numPages || 1, p + 1))}
          disabled={page >= numPages}
        >
          Next
        </button>
        <span className="text-sm text-muted-foreground">Page</span>
        <input
          type="number"
          min={1}
          max={numPages || 1}
          value={page}
          onChange={(e) => {
            const v = Number(e.target.value || 1)
            if (!isNaN(v)) setPage(Math.max(1, Math.min(v, numPages || 1)))
          }}
          className="w-16 text-sm rounded border px-2 py-1 bg-card"
        />
        <span className="text-sm text-muted-foreground">of {numPages || '—'}</span>
      </div>
    </div>
  )
}
