'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Loader2 } from 'lucide-react'

interface Application {
  id: string
  title: string
  status: string
  // ... other fields
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
  params: { id: string }
}) {
  const [application, setApplication] = useState<Application | null>(null)
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadApplication() {
      const supabase = createClient()
      
      // Fetch application details
      const { data: appData, error: appError } = await supabase
        .from('ip_applications')
        .select('*')
        .eq('id', params.id)
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
        .eq('application_id', params.id)
        .order('created_at', { ascending: false })

      if (historyError) throw historyError
      setStatusHistory(historyData)
      setLoading(false)
    }

    loadApplication()

    // Set up real-time subscriptions
    const supabase = createClient()
    
    // Subscribe to application changes
    const applicationSubscription = supabase
      .channel('application-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ip_applications',
          filter: `id=eq.${params.id}`
        },
        (payload) => {
          setApplication(payload.new as Application)
        }
      )
      .subscribe()

    // Subscribe to status history changes
    const historySubscription = supabase
      .channel('status-history-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'status_history',
          filter: `application_id=eq.${params.id}`
        },
        async (payload) => {
          // Fetch the new status history with profile information
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

          if (data) {
            setStatusHistory(prev => [data, ...prev])
          }
        }
      )
      .subscribe()

    return () => {
      applicationSubscription.unsubscribe()
      historySubscription.unsubscribe()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Application Details */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h1 className="text-2xl font-bold mb-4">{application?.title}</h1>
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm font-medium">Status:</span>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            application?.status === 'approved' ? 'bg-green-100 text-green-800' :
            application?.status === 'rejected' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {application?.status}
          </span>
        </div>
        {/* ... other application details ... */}
      </div>

      {/* Status History */}
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