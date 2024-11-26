import { useEffect, useState } from 'react'
import { createBrowserSupabaseClient } from '@/utils/supabase/client-utils'
import type { Database } from '@/types/supabase'

type ApplicationStatus = Database['public']['Tables']['ip_applications']['Row']['status']

export function useApplicationStatus(applicationId: string) {
  const [status, setStatus] = useState<ApplicationStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const supabase = createBrowserSupabaseClient()

    // Initial fetch
    async function fetchStatus() {
      try {
        const { data, error } = await supabase
          .from('ip_applications')
          .select('status')
          .eq('id', applicationId)
          .single()

        if (error) throw error
        setStatus(data.status)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch status'))
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()

    // Set up real-time subscription
    const subscription = supabase
      .channel('application_status_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'ip_applications',
          filter: `id=eq.${applicationId}`
        },
        (payload) => {
          setStatus((payload.new as any).status)
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [applicationId])

  return { status, loading, error }
} 