'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'success' | 'error' | 'loading'
}

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
          {
            "bg-white text-foreground": !type,
            "bg-green-50 text-green-900 border-green-200": type === "success",
            "bg-red-50 text-red-900 border-red-200": type === "error",
            "bg-blue-50 text-blue-900 border-blue-200": type === "loading",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Toast.displayName = "Toast" 