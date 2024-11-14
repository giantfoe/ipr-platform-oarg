'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRealtimeStatus } from '@/hooks/useRealtimeStatus'
import { StatusBadge } from '@/app/_components/ui/StatusBadge'
import { LoadingSpinner } from '@/app/_components/ui/LoadingSpinner'
import { useWallet } from "@solana/wallet-adapter-react"

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'pending', label: 'Pending Review' },
  { value: 'in-review', label: 'In Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' }
]

export default function AdminApplicationsPage() {
  const { publicKey } = useWallet()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  const loadApplications = useCallback(async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('ip_applications')
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setApplications(data || [])
    } catch (error) {
      console.error('Error loading applications:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useRealtimeStatus(useCallback((payload) => {
    if (payload.eventType === 'UPDATE') {
      setApplications(prev => 
        prev.map(app => 
          app.id === payload.new.id 
            ? { ...app, ...payload.new }
            : app
        )
      )
    }
  }, []))

  useEffect(() => {
    loadApplications()
  }, [loadApplications])

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    if (!publicKey) return
    setUpdating(applicationId)

    try {
      const supabase = createClient()
      
      // Get the current application to compare status
      const { data: currentApp } = await supabase
        .from('ip_applications')
        .select('status')
        .eq('id', applicationId)
        .single()

      if (!currentApp) {
        throw new Error('Application not found')
      }

      const oldStatus = currentApp.status

      // Update application status
      const { error: updateError } = await supabase
        .from('ip_applications')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId)

      if (updateError) {
        console.error('Update error:', updateError)
        throw updateError
      }

      // Add status history entry
      const { error: historyError } = await supabase
        .from('status_history')
        .insert({
          application_id: applicationId,
          status: newStatus,
          created_by: publicKey.toBase58(),
          notes: `Status changed from ${oldStatus} to ${newStatus}`
        })

      if (historyError) {
        console.error('History error:', historyError)
        // Don't throw here, just log the error
        // This way the status update still works even if history fails
      }

      // Update local state
      setApplications(prev =>
        prev.map(app =>
          app.id === applicationId
            ? { ...app, status: newStatus }
            : app
        )
      )

    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Applications</h1>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Change Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {applications.map((app) => (
              <tr key={app.id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{app.title}</div>
                  <div className="text-sm text-gray-500">{app.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{app.profiles?.full_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 capitalize">{app.application_type}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={app.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      disabled={updating === app.id}
                      className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                    {updating === app.id && (
                      <LoadingSpinner size="sm" />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 