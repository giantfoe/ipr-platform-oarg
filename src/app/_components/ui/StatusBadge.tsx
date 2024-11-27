'use client'

import { useState, useEffect } from 'react'
import { createBrowserSupabaseClient } from '@/utils/supabase/client-utils'
import { useToast } from "@/components/ui/use-toast"

interface StatusBadgeProps {
  applicationId: string
  initialStatus: string
  isAdmin?: boolean
  onStatusChange?: (newStatus: string) => void
}

export function StatusBadge({ applicationId, initialStatus, isAdmin = false, onStatusChange }: StatusBadgeProps) {
  const [status, setStatus] = useState(initialStatus)
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setStatus(initialStatus)
  }, [initialStatus])

  const getStatusStyles = (currentStatus: string) => {
    const baseStyles = "px-3 py-1 text-sm font-medium rounded-full"
    
    switch (currentStatus) {
      case 'approved':
        return `${baseStyles} bg-green-100 text-green-800 border border-green-200`
      case 'pending':
        return `${baseStyles} bg-yellow-100 text-yellow-800 border border-yellow-200`
      case 'in-review':
        return `${baseStyles} bg-blue-100 text-blue-800 border border-blue-200`
      case 'rejected':
        return `${baseStyles} bg-red-100 text-red-800 border border-red-200`
      case 'draft':
        return `${baseStyles} bg-gray-100 text-gray-800 border border-gray-200`
      default:
        return `${baseStyles} bg-gray-100 text-gray-800 border border-gray-200`
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true)
    try {
      const supabase = createBrowserSupabaseClient()
      
      const { error: updateError } = await supabase
        .from('ip_applications')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId)

      if (updateError) throw updateError

      setStatus(newStatus)
      if (onStatusChange) {
        onStatusChange(newStatus)
      }

      toast({
        title: 'Status Updated',
        description: `Application status changed to ${newStatus}`,
      })
    } catch (err) {
      console.error('Error updating status:', err)
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive'
      })
    } finally {
      setIsUpdating(false)
    }
  }

  if (isAdmin) {
    return (
      <select
        value={status}
        onChange={(e) => handleStatusChange(e.target.value)}
        disabled={isUpdating}
        className={`${getStatusStyles(status)} cursor-pointer appearance-none pr-8 relative transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.5rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.5em 1.5em',
        }}
      >
        <option value="draft" className="bg-gray-100 text-gray-800">Draft</option>
        <option value="pending" className="bg-yellow-100 text-yellow-800">Pending</option>
        <option value="in-review" className="bg-blue-100 text-blue-800">In Review</option>
        <option value="approved" className="bg-green-100 text-green-800">Approved</option>
        <option value="rejected" className="bg-red-100 text-red-800">Rejected</option>
      </select>
    )
  }

  return (
    <span className={getStatusStyles(status)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
} 