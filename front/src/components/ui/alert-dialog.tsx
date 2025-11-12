'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

// Lightweight dialog implementation without external dependencies

interface AlertDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

const AlertDialog = ({ open = false, onOpenChange, children }: AlertDialogProps) => {
  const [isOpen, setIsOpen] = React.useState(open)

  React.useEffect(() => {
    if (onOpenChange) {
      onOpenChange(isOpen)
    }
  }, [isOpen, onOpenChange])

  React.useEffect(() => {
    setIsOpen(open)
  }, [open])

  return (
    <AlertDialogContext.Provider value={{ isOpen, setIsOpen }}>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/80" onClick={() => setIsOpen(false)} />
          <div className="relative z-50 bg-background border rounded-lg shadow-lg p-6 max-w-lg">{children}</div>
        </div>
      )}
    </AlertDialogContext.Provider>
  )
}

const AlertDialogContext = React.createContext<{ isOpen: boolean; setIsOpen: (open: boolean) => void } | undefined>(undefined)

const AlertDialogTrigger = ({ children, ...props }: React.HTMLAttributes<HTMLButtonElement>) => {
  const context = React.useContext(AlertDialogContext)
  return (
    <button {...props} onClick={() => context?.setIsOpen(true)}>
      {children}
    </button>
  )
}

const AlertDialogPortal = ({ children }: { children: React.ReactNode }) => <>{children}</>

const AlertDialogOverlay = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('fixed inset-0 z-50 bg-black/80', className)} {...props} />
)

const AlertDialogContent = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('grid gap-4 p-6', className)} {...props}>
    {children}
  </div>
)

const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-2', className)} {...props} />
)

const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />
)

const AlertDialogTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className={cn('text-lg font-semibold', className)} {...props} />
)

const AlertDialogDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn('text-sm text-muted-foreground', className)} {...props} />
)

const AlertDialogAction = ({ className, onClick, ...props }: React.HTMLAttributes<HTMLButtonElement>) => {
  const context = React.useContext(AlertDialogContext)
  return (
    <Button
      className={cn('bg-destructive text-destructive-foreground hover:bg-destructive/90', className)}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e as unknown as React.MouseEvent<HTMLButtonElement>)
        context?.setIsOpen(false)
      }}
      {...props}
    />
  )
}

const AlertDialogCancel = ({ className, onClick, ...props }: React.HTMLAttributes<HTMLButtonElement>) => {
  const context = React.useContext(AlertDialogContext)
  return (
    <Button
      variant="outline"
      className={cn('mt-2 sm:mt-0', className)}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e as unknown as React.MouseEvent<HTMLButtonElement>)
        context?.setIsOpen(false)
      }}
      {...props}
    />
  )
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel
}
