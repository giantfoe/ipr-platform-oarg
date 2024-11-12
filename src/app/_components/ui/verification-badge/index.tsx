'use client'

import { Badge } from '../badge'
import { CheckCircle2, XCircle, Clock } from 'lucide-react'

type VerificationStatus = 'verified' | 'unverified' | 'pending'

interface VerificationBadgeProps {
  status: VerificationStatus
  className?: string
}

const statusConfig = {
  'verified': {
    variant: 'success' as const,
    icon: CheckCircle2,
    label: 'Verified'
  },
  'unverified': {
    variant: 'danger' as const,
    icon: XCircle,
    label: 'Unverified'
  },
  'pending': {
    variant: 'warning' as const,
    icon: Clock,
    label: 'Pending Verification'
  }
}

export function VerificationBadge({ status, className }: VerificationBadgeProps) {
  const config = statusConfig[status]
  const Icon = config.icon
  
  return (
    <Badge 
      variant={config.variant}
      className={className}
    >
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  )
} 