'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { LoadingSpinner } from '@/app/_components/ui/LoadingSpinner'
import { StatusBadge } from '@/app/_components/ui/StatusBadge'
import { use } from 'react'

interface Application {
  id: string
  title: string
  description: string
  application_type: string
  status: string
  created_at: string
  wallet_address: string
}

interface StatusHistory {
  id: string
  status: string
  notes: string
  created_at: string
  created_by: string
  profiles: {
    full_name: string
  }
}

export default function ApplicationDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  // Properly unwrap the params using React.use()
  const { id } = use(params)
  const [application, setApplication] = useState<Application | null>(null)
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadApplication = useCallback(async () => {
    if (!id) return

    try {
      const supabase = createClient()
      
      // Fetch application details
      const { data: appData, error: appError } = await supabase
        .from('ip_applications')
        .select('*')
        .eq('id', id)
        .single()

      if (appError) throw appError
      setApplication(appData)

      // Fetch status history
      const { data: historyData, error: historyError } = await supabase
        .from('status_history')
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .eq('application_id', id)
        .order('created_at', { ascending: false })

      if (historyError) throw historyError
      setStatusHistory(historyData || [])
    } catch (err) {
      console.error('Error loading application:', err)
      setError('Failed to load application details')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    let mounted = true
    const supabase = createClient()

    // Load initial data
    loadApplication()

    // Set up real-time subscriptions
    const applicationChannel = supabase
      .channel(`application-${id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ip_applications',
          filter: `id=eq.${id}`
        },
        async (payload) => {
          if (!mounted) return
          console.log('Application update received:', payload)
          
          if (payload.eventType === 'UPDATE') {
            setApplication((prev) => ({
              ...prev,
              ...payload.new,
            } as Application))
          }
        }
      )
      .subscribe()

    const historyChannel = supabase
      .channel(`history-${id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'status_history',
          filter: `application_id=eq.${id}`
        },
        async (payload) => {
          if (!mounted) return
          console.log('Status history update received:', payload)

          const { data } = await supabase
            .from('status_history')
            .select(`
              *,
              profiles (
                full_name
              )
            `)
            .eq('id', payload.new.id)
            .single()

          if (data && mounted) {
            setStatusHistory(prev => [data, ...prev])
          }
        }
      )
      .subscribe()

    // Cleanup function
    return () => {
      mounted = false
      applicationChannel.unsubscribe()
      historyChannel.unsubscribe()
    }
  }, [id, loadApplication])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !application) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          {error || 'Application not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h1 className="text-2xl font-bold mb-4">{application.title}</h1>
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm font-medium">Status:</span>
          <StatusBadge status={application.status as any} />
        </div>
        <div className="prose prose-sm max-w-none">
          <p>{application.description}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Status History</h2>
        <div className="space-y-4">
          {statusHistory.map((history) => (
            <div key={history.id} className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="text-sm font-medium">
                  Status changed to: <span className="font-semibold">{history.status}</span>
                </p>
                <p className="text-sm text-gray-500">
                  By {history.profiles.full_name}
                </p>
                {history.notes && (
                  <p className="text-sm text-gray-600 mt-1">{history.notes}</p>
                )}
              </div>
              <span className="text-sm text-gray-500">
                {new Date(history.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 