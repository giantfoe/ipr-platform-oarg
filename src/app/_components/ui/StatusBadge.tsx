'use client'

import { useApplicationStatus } from '@/hooks/useApplicationStatus'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  applicationId: string
  initialStatus?: string
  className?: string
}

export function StatusBadge({ applicationId, initialStatus, className }: StatusBadgeProps) {
  const { status, loading } = useApplicationStatus(applicationId)

  const displayStatus = status || initialStatus

  if (loading && !initialStatus) {
    return <div className="animate-pulse h-6 w-20 bg-gray-200 rounded" />
  }

  const statusStyles = {
    draft: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    'in-review': 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  }

  return (
    <span className={cn(
      'px-2 py-1 text-sm font-medium rounded-full capitalize',
      statusStyles[displayStatus as keyof typeof statusStyles],
      className
    )}>
      {displayStatus?.replace('-', ' ')}
    </span>
  )
} 