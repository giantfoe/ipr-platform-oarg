'use client'

import { useEffect, useState } from 'react'
import { useWallet } from "@solana/wallet-adapter-react"
import { useRouter } from 'next/navigation'
import { createBrowserSupabaseClient } from '@/utils/supabase/client-utils'
import { LoadingSpinner } from '@/app/_components/ui/LoadingSpinner'
import { StatusBadge } from '@/app/_components/ui/StatusBadge'

interface ApplicationStats {
  total: number
  draft: number
  pending: number
  in_review: number
  approved: number
  rejected: number
}

interface Application {
  id: string
  title: string
  description: string
  application_type: string
  status: 'draft' | 'pending' | 'in-review' | 'approved' | 'rejected'
  applicant_name: string
  company_name: string
  created_at: string
  wallet_address: string
}

export default function AdminApplicationsPage() {
  const { publicKey } = useWallet()
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [stats, setStats] = useState<ApplicationStats>({
    total: 0,
    draft: 0,
    pending: 0,
    in_review: 0,
    approved: 0,
    rejected: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadApplications() {
      if (!publicKey) return
      
      try {
        console.log('Loading admin applications...')
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

        // Get all applications with their latest status
        const { data, error: fetchError } = await supabase
          .from('ip_applications')
          .select(`
            *,
            status_history (
              status,
              created_at,
              notes
            )
          `)
          .order('created_at', { ascending: false })

        if (fetchError) {
          console.error('Error fetching applications:', fetchError)
          throw fetchError
        }

        console.log('Applications loaded:', data?.length)
        setApplications(data || [])

        // Calculate stats
        const newStats = {
          total: data?.length || 0,
          draft: 0,
          pending: 0,
          in_review: 0,
          approved: 0,
          rejected: 0
        }

        // Count current status
        data?.forEach(app => {
          // Get the latest status from history or use the application status
          const currentStatus = app.status || 'draft'
          
          switch (currentStatus) {
            case 'draft':
              newStats.draft++
              break
            case 'pending':
              newStats.pending++
              break
            case 'in-review':
              newStats.in_review++
              break
            case 'approved':
              newStats.approved++
              break
            case 'rejected':
              newStats.rejected++
              break
          }
        })

        console.log('Stats calculated:', newStats)
        setStats(newStats)
      } catch (err) {
        console.error('Error loading applications:', err)
        setError(err instanceof Error ? err.message : 'Failed to load applications')
      } finally {
        setLoading(false)
      }
    }

    loadApplications()
  }, [publicKey])

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
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Applications</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Draft</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.draft}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Pending</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">In Review</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.in_review}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Approved</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.approved}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Rejected</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.rejected}</p>
        </div>
      </div>

      {/* Rest of your existing table code */}
    </div>
  )
} 