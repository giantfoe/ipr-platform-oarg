'use client'

import { useEffect, useState } from 'react'
import { useWallet } from "@solana/wallet-adapter-react"
import { createBrowserSupabaseClient } from '@/utils/supabase/client-utils'
import { LoadingSpinner } from '@/app/_components/ui/LoadingSpinner'

interface DashboardStats {
  total_applications: number
  pending_review: number
  approved: number
  rejected: number
  recent_applications: any[]
  applications_by_type: {
    patent: number
    trademark: number
    copyright: number
  }
}

export default function AdminDashboard() {
  const { publicKey } = useWallet()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadDashboardStats() {
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
          throw new Error('Unauthorized access')
        }

        // Get application stats
        const { data: applications, error: statsError } = await supabase
          .from('ip_applications')
          .select('*')

        if (statsError) throw statsError

        const stats: DashboardStats = {
          total_applications: applications.length,
          pending_review: applications.filter(app => app.status === 'pending').length,
          approved: applications.filter(app => app.status === 'approved').length,
          rejected: applications.filter(app => app.status === 'rejected').length,
          recent_applications: applications.slice(0, 5),
          applications_by_type: {
            patent: applications.filter(app => app.application_type === 'patent').length,
            trademark: applications.filter(app => app.application_type === 'trademark').length,
            copyright: applications.filter(app => app.application_type === 'copyright').length
          }
        }

        setStats(stats)
      } catch (err) {
        console.error('Error loading dashboard stats:', err)
        setError(err instanceof Error ? err.message : 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }

    loadDashboardStats()
  }, [publicKey])

  if (!publicKey) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md">
        Please connect your wallet to access the admin dashboard.
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
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Applications</h3>
          <p className="mt-2 text-3xl font-semibold">{stats?.total_applications}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500">Pending Review</h3>
          <p className="mt-2 text-3xl font-semibold text-yellow-600">{stats?.pending_review}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500">Approved</h3>
          <p className="mt-2 text-3xl font-semibold text-green-600">{stats?.approved}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500">Rejected</h3>
          <p className="mt-2 text-3xl font-semibold text-red-600">{stats?.rejected}</p>
        </div>
      </div>

      {/* Applications by Type */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Applications by Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Patents</h4>
            <p className="mt-2 text-2xl font-semibold">{stats?.applications_by_type.patent}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Trademarks</h4>
            <p className="mt-2 text-2xl font-semibold">{stats?.applications_by_type.trademark}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Copyrights</h4>
            <p className="mt-2 text-2xl font-semibold">{stats?.applications_by_type.copyright}</p>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Recent Applications</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats?.recent_applications.map((app) => (
                <tr key={app.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{app.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">{app.application_type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${app.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                      ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${app.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                      ${app.status === 'draft' ? 'bg-gray-100 text-gray-800' : ''}
                    `}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(app.created_at).toLocaleDateString()}
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