"use client"

import React, { useEffect, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
// Bundle the pdf.js worker so it is served with the app and version-matched.
// Requires `pdfjs-dist` to be installed in the project.
// import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry'

interface PdfViewerProps {
  blobUrl: string | null
}

// Configure PDF.js worker to use pdfjs-dist bundler entry.
// This ensures API version matches Worker version.
if (typeof window !== 'undefined' && !pdfjs.GlobalWorkerOptions.workerSrc) {
  try {
    // Use a CDN-hosted worker that matches the pdfjs API version to avoid
    // file:// paths (browsers block loading local resources) and version
    // mismatches. `react-pdf` exposes `pdfjs.version`.
    const pdfjsTyped = pdfjs as unknown as { version?: string }
    const ver = pdfjsTyped.version ?? '5.4.296'
    // Prefer serving the worker from our app's `public/` directory to avoid CORS
    // and file:// issues. After installing `pdfjs-dist` (matching react-pdf)
    // copy `node_modules/pdfjs-dist/build/pdf.worker.min.js` to `public/pdf.worker.min.js`.
    // The worker will then be served same-origin at `/pdf.worker.min.js`.
    pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'
    // eslint-disable-next-line no-console
    console.warn('pdfjs worker not bundled; fallback to /pdf.worker.min.js. To bundle the worker, install `pdfjs-dist` and rebuild.')
  } catch {
    // If anything fails, react-pdf will try to use its bundled worker.
  }
}

export default function PdfViewer({ blobUrl }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [page, setPage] = useState<number>(1)
  const [scale, setScale] = useState<number>(1.0)
    const [showThumbs, setShowThumbs] = useState<boolean>(true)
  const [fileData, setFileData] = useState<Blob | string | null>(null)

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
    setNumPages(n)
    setPage(1)
  }

  function download() {
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
  }

  function printPdf() {
    if (!blobUrl) return
    const w = window.open(blobUrl, '_blank')
    if (w) w.print()
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/50">
        <div className="flex items-center gap-2">
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

        <div className="flex items-center gap-2">
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
          <button
            className="px-2 py-1 rounded border bg-white/80 text-sm"
            onClick={download}
            disabled={!blobUrl}
          >
            Download
          </button>
          <button
            className="px-2 py-1 rounded border bg-white/80 text-sm"
            onClick={printPdf}
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
    </div>
  )
}
