'use client'

import { useEffect, useState } from 'react'
import { useWallet } from "@solana/wallet-adapter-react"
import { useRouter } from 'next/navigation'
import { createBrowserSupabaseClient } from '@/utils/supabase/client-utils'
import { LoadingSpinner } from '@/app/_components/ui/LoadingSpinner'
import { StatusBadge } from '@/app/_components/ui/StatusBadge'
import { useToast } from "@/components/ui/use-toast"

interface Application {
  id: string
  title: string
  description: string
  application_type: string
  status: string
  applicant_name: string
  company_name: string
  created_at: string
  wallet_address: string
}

export default function AdminApplicationsPage() {
  const { publicKey } = useWallet()
  const router = useRouter()
  const { toast } = useToast()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    async function loadApplications() {
      if (!publicKey) return
      
      try {
        const supabase = createBrowserSupabaseClient()

        // Verify admin status
        const { data: adminCheck, error: adminError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('wallet_address', publicKey.toBase58())
          .single()

        if (adminError || !adminCheck?.is_admin) {
          throw new Error('Unauthorized: Admin access required')
        }

        // Get all applications
        const { data, error: fetchError } = await supabase
          .from('ip_applications')
          .select(`
            *,
            profiles (
              full_name,
              company_name,
              email
            )
          `)
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

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    if (!publicKey) return
    setUpdating(applicationId)

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

      // Add status history
      const { error: historyError } = await supabase
        .from('status_history')
        .insert({
          application_id: applicationId,
          status: newStatus,
          created_by: publicKey.toBase58(),
          notes: `Status updated to ${newStatus} by admin`
        })

      if (historyError) throw historyError

      // Refresh applications
      const { data: refreshedData, error: refreshError } = await supabase
        .from('ip_applications')
        .select('*')
        .order('created_at', { ascending: false })

      if (refreshError) throw refreshError
      setApplications(refreshedData || [])

      toast({
        title: 'Status Updated',
        description: `Application status changed to ${newStatus}`
      })
    } catch (err) {
      console.error('Error updating status:', err)
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive'
      })
    } finally {
      setUpdating(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'in-review':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
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
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Applications Management</h1>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{app.title}</div>
                    <div className="text-sm text-gray-500">{app.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{app.applicant_name}</div>
                    <div className="text-sm text-gray-500">{app.company_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">{app.application_type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge 
                      applicationId={app.id} 
                      initialStatus={app.status} 
                      isAdmin={true}
                      onStatusChange={(newStatus) => {
                        const updatedApps = applications.map(a => 
                          a.id === app.id ? { ...a, status: newStatus } : a
                        )
                        setApplications(updatedApps)
                      }}
                    />
                    {updating === app.id && (
                      <div className="mt-2 flex justify-center">
                        <LoadingSpinner size="sm" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(app.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => router.push(`/admin/applications/${app.id}`)}
                      className="text-primary hover:text-primary/80 px-3 py-1 rounded-md hover:bg-gray-100"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 