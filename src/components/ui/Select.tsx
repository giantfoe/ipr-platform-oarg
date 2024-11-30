'use client'

import { cn } from '@/lib/utils'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  containerClassName?: string
}

export function Select({ 
  className, 
  containerClassName,
  children,
  ...props 
}: SelectProps) {
  return (
    <select
      className={cn(
        "bg-white text-gray-900",
        "border border-gray-300 rounded-lg",
        "px-4 py-2",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
        "cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
} 