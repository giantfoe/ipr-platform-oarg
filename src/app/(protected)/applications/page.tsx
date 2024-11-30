'use client'

import { useEffect, useState } from 'react'
import { useWallet } from "@solana/wallet-adapter-react"
import { useRouter } from 'next/navigation'
import { LoadingSpinner } from '@/app/_components/ui/LoadingSpinner'
import { StatusBadge } from '@/app/_components/ui/StatusBadge'
import { db } from '@/lib/database'
import { Application } from '@/types/database'
import { toast } from '@/components/ui/use-toast'
import { createClient } from '@/utils/supabase/client'
import { SearchInput } from '@/components/ui/SearchInput'

export default function ApplicationsPage() {
  const { publicKey } = useWallet()
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!publicKey) {
      setLoading(false)
      return
    }

    const walletAddress = publicKey.toBase58()
    const supabase = createClient()

    // Initial fetch
    async function loadApplications() {
      try {
        const data = await db.getApplicationsByWallet(walletAddress)
        setApplications(data)
      } catch (err) {
        console.error('Error loading applications:', err)
        setError('Failed to load applications')
        toast({
          title: 'Error',
          description: 'Failed to load applications',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    loadApplications()

    // Set up real-time subscription
    const subscription = supabase
      .channel('applications-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ip_applications',
          filter: `wallet_address=eq.${walletAddress}`
        },
        async (payload) => {
          console.log('Real-time update received:', payload)
          // Reload applications when changes occur
          const data = await db.getApplicationsByWallet(walletAddress)
          setApplications(data)
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [publicKey])

  // Security check - ensure users can only see their own applications
  const userApplications = applications.filter(
    app => app.wallet_address === publicKey?.toBase58()
  )

  if (!publicKey) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md">
        Please connect your wallet to view your applications.
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
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Applications</h1>
        <div className="flex items-center space-x-4">
          <SearchInput
            placeholder="Search applications..."
            onChange={(e) => handleSearch(e.target.value)}
            containerClassName="w-80"
          />
          <button
            onClick={() => router.push('/applications/new')}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            New Application
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {userApplications.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No applications found. Create your first application to get started.
          </div>
        ) : (
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
              {userApplications.map((app) => (
                <tr 
                  key={app.id}
                  onClick={() => router.push(`/applications/${app.id}`)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{app.title}</div>
                    <div className="text-sm text-gray-500">{app.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">{app.application_type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge applicationId={app.id} initialStatus={app.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(app.created_at).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
} 