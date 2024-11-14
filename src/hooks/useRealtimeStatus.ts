import { useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export function useRealtimeStatus(callback: (payload: any) => void) {
  useEffect(() => {
    const supabase = createClient()

    // Subscribe to status changes
    const statusSubscription = supabase
      .channel('application-status-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'ip_applications',
          filter: 'status=neq.previous_status'
        },
        (payload) => {
          console.log('Status change detected:', payload)
          callback(payload)
        }
      )
      .subscribe()

    return () => {
      statusSubscription.unsubscribe()
    }
  }, [callback])
} 