'use client'

interface StatusBadgeProps {
  status: 'draft' | 'pending' | 'in-review' | 'approved' | 'rejected'
  size?: 'sm' | 'md' | 'lg'
}

const STATUS_STYLES = {
  draft: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200',
  },
  pending: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
  },
  'in-review': {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
  },
  approved: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
  },
  rejected: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
  },
}

const SIZE_STYLES = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-2.5 py-1.5 text-sm',
  lg: 'px-3 py-2 text-base'
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const styles = STATUS_STYLES[status]
  
  return (
    <span className={`
      inline-flex items-center rounded-full
      ${styles.bg} ${styles.text} ${styles.border}
      ${SIZE_STYLES[size]}
      font-medium border
      transition-colors duration-200
    `}>
      <span className={`
        w-1.5 h-1.5 rounded-full
        ${status === 'approved' ? 'bg-green-500' : 
          status === 'rejected' ? 'bg-red-500' :
          status === 'in-review' ? 'bg-blue-500' :
          status === 'pending' ? 'bg-yellow-500' :
          'bg-gray-500'}
        mr-1.5
      `} />
      {status}
    </span>
  )
} 