'use client'

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string
}

export function SearchInput({ 
  className, 
  containerClassName,
  ...props 
}: SearchInputProps) {
  return (
    <div className={cn("relative", containerClassName)}>
      <input
        type="text"
        className={cn(
          "w-full pl-10 pr-4 py-2 bg-white text-gray-900",
          "border border-gray-300 rounded-lg",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
          "placeholder:text-gray-500",
          className
        )}
        {...props}
      />
      <MagnifyingGlassIcon 
        className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" 
      />
    </div>
  )
} 