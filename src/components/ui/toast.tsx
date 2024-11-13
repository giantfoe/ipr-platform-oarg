'use client'

import * as React from "react"

interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'success' | 'error' | 'loading'
}

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all ${className}`}
        {...props}
      />
    )
  }
)
Toast.displayName = "Toast" 