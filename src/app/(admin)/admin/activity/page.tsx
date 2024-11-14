'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { LoadingSpinner } from '@/app/_components/ui/LoadingSpinner'
import { useWallet } from "@solana/wallet-adapter-react"
import ClientOnly from '@/app/_components/ClientOnly'

interface ActivityLog {
  id: string
  application_id: string
  status: string
  notes: string
  created_at: string
  created_by: string
  ip_applications: {
    title: string
  }
  profiles: {
    full_name: string
  }
}

export default function AdminActivityPage() {
  const { publicKey } = useWallet()
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadActivities() {
      try {
        const supabase = createClient()
        const { data, error: fetchError } = await supabase
          .from('status_history')
          .select(`
            *,
            ip_applications (
              title
            ),
            profiles (
              full_name
            )
          `)
          .order('created_at', { ascending: false })

        if (fetchError) throw fetchError
        setActivities(data || [])
      } catch (err) {
        console.error('Error loading activities:', err)
        setError('Failed to load activity log')
      } finally {
        setLoading(false)
      }
    }

    loadActivities()

    // Set up real-time subscription
    const supabase = createClient()
    const subscription = supabase
      .channel('activity-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'status_history'
        },
        async (payload) => {
          // Fetch the complete activity data with relations
          const { data } = await supabase
            .from('status_history')
            .select(`
              *,
              ip_applications (
                title
              ),
              profiles (
                full_name
              )
            `)
            .eq('id', payload.new.id)
            .single()

          if (data) {
            setActivities(prev => [data, ...prev])
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

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
        <h1 className="text-2xl font-bold">Activity Log</h1>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {activities.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">No activity recorded yet.</p>
              <p className="text-sm text-gray-400 mt-1">
                Activity will appear here when application statuses are changed.
              </p>
            </div>
          ) : (
            <div className="flow-root">
              <ul role="list" className="divide-y divide-gray-200">
                {activities.map((activity) => (
                  <li key={activity.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-gray-900">
                          Application: {activity.ip_applications?.title || 'Unknown Application'}
                        </p>
                        <p className="text-sm text-gray-500">
                          Status changed to{' '}
                          <span className={`font-medium ${
                            activity.status === 'approved' ? 'text-green-600' :
                            activity.status === 'rejected' ? 'text-red-600' :
                            activity.status === 'in-review' ? 'text-blue-600' :
                            'text-yellow-600'
                          }`}>
                            {activity.status}
                          </span>
                          {' '}by {activity.profiles?.full_name || 'Unknown User'}
                        </p>
                        {activity.notes && (
                          <p className="mt-1 text-sm text-gray-600">
                            Note: {activity.notes}
                          </p>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(activity.created_at).toLocaleString()}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </ClientOnly>
  )
} 