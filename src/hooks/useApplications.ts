import { useState, useEffect } from 'react'
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore'
import { db } from '@/lib/firebase/config'

export function useApplications(walletAddress: string | null) {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!walletAddress) {
      setApplications([])
      setLoading(false)
      return
    }

    const q = query(
      collection(db, 'applications'),
      where('wallet_address', '==', walletAddress),
      orderBy('created_at', 'desc')
    )

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const apps = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setApplications(apps)
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching applications:', err)
        setError('Failed to load applications')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [walletAddress])

  return { applications, loading, error }
} 