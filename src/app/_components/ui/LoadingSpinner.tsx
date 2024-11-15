'use client'

import { Loader2 } from 'lucide-react'
import ClientOnly from '../ClientOnly'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZES = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8'
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  return (
    <ClientOnly>
      <Loader2 
        className={`animate-spin text-primary ${SIZES[size]} ${className}`}
        aria-label="Loading"
      />
    </ClientOnly>
  )
} 