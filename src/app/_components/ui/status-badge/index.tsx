'use client'

import { Badge } from '../badge'

type StatusType = 
  | 'pending'
  | 'in-review'
  | 'approved'
  | 'rejected'
  | 'draft'
  | 'expired'

interface StatusBadgeProps {
  status: StatusType
  className?: string
}

const statusConfig = {
  'pending': { variant: 'warning' as const, label: 'Pending' },
  'in-review': { variant: 'secondary' as const, label: 'In Review' },
  'approved': { variant: 'success' as const, label: 'Approved' },
  'rejected': { variant: 'danger' as const, label: 'Rejected' },
  'draft': { variant: 'outline' as const, label: 'Draft' },
  'expired': { variant: 'danger' as const, label: 'Expired' }
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]
  
  return (
    <Badge 
      variant={config.variant}
      className={className}
    >
      {config.label}
    </Badge>
  )
} 