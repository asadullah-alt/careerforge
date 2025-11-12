"use client"

import { cn } from '@/lib/utils'
import React from 'react'

// Lightweight fallback stubs for resizable panels. These intentionally avoid
// external dependencies so the component tree compiles and can be iterated on.
const ResizablePanelGroup: React.FC<
  React.HTMLAttributes<HTMLDivElement> & {
    direction?: 'horizontal' | 'vertical'
  }
> = ({ children, className, direction, ...props }) => (
  <div className={cn('flex h-full w-full', direction === 'vertical' && 'flex-col', className)} {...props}>
    {children}
  </div>
)

const ResizablePanel: React.FC<
  React.HTMLAttributes<HTMLDivElement> & {
    defaultSize?: number
    minSize?: number
    maxSize?: number
    onResize?: (size: number) => void
  }
> = ({ children, className, ...props }) => (
  <div className={cn('flex-1', className)} {...props}>
    {children}
  </div>
)

const ResizableHandle: React.FC<
  React.HTMLAttributes<HTMLDivElement> & {
    withHandle?: boolean
  }
> = ({ withHandle, className, ...props }) => (
  <div className={cn('flex items-center justify-center', className)} {...props}>
    {withHandle && <div className="h-6 w-1 rounded bg-border/40" />}
  </div>
)

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
