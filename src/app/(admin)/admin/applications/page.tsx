'use client'

import { useEffect, useState } from 'react'
import { useWallet } from "@solana/wallet-adapter-react"
import { useRouter } from 'next/navigation'
import { createBrowserSupabaseClient } from '@/utils/supabase/client-utils'
import { LoadingSpinner } from '@/app/_components/ui/LoadingSpinner'
import { StatusBadge } from '@/app/_components/ui/StatusBadge'

type ApplicationStatus = 'draft' | 'pending' | 'in-review' | 'approved' | 'rejected'

interface Application {
  id: string
  title: string
  description: string
  application_type: string
  status: ApplicationStatus
  applicant_name: string
  company_name: string
  created_at: string
  wallet_address: string
}

interface StatusHistory {
  id: string;
  application_id: string;
  status: string;
  created_by: string;
  notes: string;
  created_at: string;
}

export default function AdminApplicationsPage() {
  const { publicKey } = useWallet()
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    async function loadApplications() {
      if (!publicKey) {
        setError('Please connect your wallet')
        setLoading(false)
        return
      }

      try {
        const supabase = createBrowserSupabaseClient()

        // First verify admin status
        const { data: adminCheck, error: adminError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('wallet_address', publicKey.toBase58())
          .single()

        if (adminError || !adminCheck?.is_admin) {
          throw new Error('Unauthorized: Admin access required')
        }

        // Simple query to get all applications
        const { data, error: fetchError } = await supabase
          .from('ip_applications')
          .select('*')
          .order('created_at', { ascending: false })

        if (fetchError) throw fetchError

        setApplications(data || [])
      } catch (err) {
        console.error('Error loading applications:', err)
        setError(err instanceof Error ? err.message : 'Failed to load applications')
      } finally {
        setLoading(false)
      }
    }

    loadApplications()
  }, [publicKey])

  const handleStatusChange = async (applicationId: string, newStatus: ApplicationStatus) => {
    setUpdating(applicationId)
    try {
      const supabase = createBrowserSupabaseClient()

      // First update the application status
      const { error: updateError } = await supabase
        .from('ip_applications')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId)

      if (updateError) throw updateError

      // Then create a status history entry
      const { error: historyError } = await supabase
        .from('status_history')
        .insert({
          application_id: applicationId,
          status: newStatus,
          created_by: publicKey?.toBase58(),
          notes: `Status changed to ${newStatus}`
        })

      if (historyError) throw historyError

      // Refresh the applications list
      const { data } = await supabase
        .from('ip_applications')
        .select('*')
        .order('created_at', { ascending: false })

      setApplications(data || [])
    } catch (err) {
      console.error('Error updating status:', err)
    } finally {
      setUpdating(null)
    }
  }

  if (!publicKey) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md">
        Please connect your wallet to access the admin panel.
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Applications</h1>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {applications.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No applications found
          </div>
        ) : (
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
                <tr 
                  key={app.id}
                  onClick={() => router.push(`/admin/applications/${app.id}`)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{app.title}</div>
                    <div className="text-sm text-gray-500">{app.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{app.applicant_name}</div>
                    <div className="text-sm text-gray-500">{app.company_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">{app.application_type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                      disabled={updating === app.id}
                      className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm disabled:opacity-50 bg-white text-gray-900"
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
} 