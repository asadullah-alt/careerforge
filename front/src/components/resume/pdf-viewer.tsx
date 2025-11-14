"use client"

import React, { useEffect, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

interface PdfViewerProps {
  blobUrl: string | null
}

// Configure PDF.js worker. Use CDN fallback to avoid build-time dependency issues.
if (typeof window !== 'undefined') {
  try {
    // prefer local worker if available (bundlers often provide this)
    // otherwise fallback to a CDN copy
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    pdfjs.GlobalWorkerOptions.workerSrc = (pdfjs.GlobalWorkerOptions && pdfjs.GlobalWorkerOptions.workerSrc) || 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js'
  } catch (e) {
    // ignore
  }
}

export default function PdfViewer({ blobUrl }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [page, setPage] = useState<number>(1)
  const [scale, setScale] = useState<number>(1.0)
  const [showThumbs, setShowThumbs] = useState<boolean>(true)

  useEffect(() => {
    // reset when blob changes
    setPage(1)
    setNumPages(0)
  }, [blobUrl])

  function onDocumentLoadSuccess({ numPages: n }: { numPages: number }) {
    setNumPages(n)
    setPage(1)
  }

  function download() {
    if (!blobUrl) return
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = 'resume.pdf'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
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
            <Document file={blobUrl} onLoadSuccess={onDocumentLoadSuccess} loading={<div className="p-2 text-xs">Loading…</div>}>
              {Array.from({ length: numPages || 0 }, (_, i) => (
                <div key={i} className={`p-1 cursor-pointer ${page === i + 1 ? 'ring-2 ring-primary' : ''}`} onClick={() => setPage(i + 1)}>
                  <Page pageNumber={i + 1} width={80} renderTextLayer={false} renderAnnotationLayer={false} />
                </div>
              ))}
            </Document>
          </div>
        )}

        <div className="flex-1 overflow-auto p-3">
          {blobUrl ? (
            <Document file={blobUrl} onLoadSuccess={onDocumentLoadSuccess} loading={<div className="text-center py-10">Loading PDF…</div>}>
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
