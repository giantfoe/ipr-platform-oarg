'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRealtimeStatus } from '@/hooks/useRealtimeStatus'
import { StatusBadge } from '@/app/_components/ui/StatusBadge'
import { LoadingSpinner } from '@/app/_components/ui/LoadingSpinner'
import { useWallet } from "@solana/wallet-adapter-react"
import ClientOnly from '@/app/_components/ClientOnly'

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

    const supabase = createClient()

    try {
      const { data, error } = await supabase
        .rpc('handle_application_status_update', {
          p_application_id: applicationId,
          p_new_status: newStatus,
          p_admin_wallet: publicKey.toBase58()
        })

      if (error) {
        console.error('Status update failed:', error)
        throw error
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
    <ClientOnly>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
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
                        <option value="draft">Draft</option>
                        <option value="pending">Pending</option>
                        <option value="in-review">In Review</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
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
    </ClientOnly>
  )
} 