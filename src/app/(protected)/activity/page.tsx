'use client'

import { useEffect, useState } from 'react'
import { useWallet } from "@solana/wallet-adapter-react"
import { createBrowserSupabaseClient } from '@/utils/supabase/client-utils'
import { LoadingSpinner } from '@/app/_components/ui/LoadingSpinner'
import { useRouter } from 'next/navigation'

interface RecentActivity {
  id: string
  title: string
  application_type: string
  status: string
  created_at: string
  updated_at: string
  status_history?: {
    status: string
    notes: string
    created_at: string
  }[]
}

export default function ActivityPage() {
  const { publicKey } = useWallet()
  const router = useRouter()
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadRecentActivity() {
      if (!publicKey) return
      
      try {
        const supabase = createBrowserSupabaseClient()
        
        const { data, error: fetchError } = await supabase
          .from('ip_applications')
          .select(`
            *,
            status_history (
              status,
              notes,
              created_at
            )
          `)
          .order('created_at', { ascending: false })
          .limit(5)

        if (fetchError) throw fetchError
        setRecentActivity(data || [])
      } catch (err) {
        console.error('Error loading recent activity:', err)
        setError(err instanceof Error ? err.message : 'Failed to load recent activity')
      } finally {
        setLoading(false)
      }
    }

    loadRecentActivity()
  }, [publicKey])

  if (!publicKey) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md">
        Please connect your wallet to view your activity.
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'in-review':
        return 'bg-blue-100 text-blue-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Recent Activity</h1>

      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        {recentActivity.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No recent activity found.
          </div>
        ) : (
          recentActivity.map((activity) => (
            <div 
              key={activity.id} 
              className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => router.push(`/applications/${activity.id}`)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    {activity.title}
                  </h3>
                  <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                    <span className="capitalize">{activity.application_type}</span>
                    <span>•</span>
                    <span>{new Date(activity.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="ml-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(activity.status)}`}>
                    {activity.status}
                  </span>
                </div>
              </div>

              {activity.status_history && activity.status_history.length > 0 && (
                <div className="mt-4 border-l-2 border-gray-200 pl-4">
                  <h4 className="text-sm font-medium text-gray-900">Latest Update</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    {activity.status_history[0].notes}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    {new Date(activity.status_history[0].created_at).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
} 