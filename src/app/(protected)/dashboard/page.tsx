'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useWallet } from "@solana/wallet-adapter-react"
import { StatusBadge } from '@/app/_components/ui/StatusBadge'
import { LoadingSpinner } from '@/app/_components/ui/LoadingSpinner'
import Link from 'next/link'
import ClientOnly from '@/app/_components/ClientOnly'

interface Application {
  id: string
  title: string
  description: string
  application_type: string
  status: 'draft' | 'pending' | 'in-review' | 'approved' | 'rejected'
  created_at: string
}

interface DashboardStats {
  total: number
  pending: number
  approved: number
  rejected: number
}

export default function DashboardPage() {
  const { publicKey } = useWallet()
  const [applications, setApplications] = useState<Application[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  })
  const [loading, setLoading] = useState(true)

  const updateStats = (apps: Application[]) => {
    const total = apps.length
    const pending = apps.filter(app => app.status === 'pending').length
    const approved = apps.filter(app => app.status === 'approved').length
    const rejected = apps.filter(app => app.status === 'rejected').length
    setStats({ total, pending, approved, rejected })
  }

  useEffect(() => {
    if (!publicKey) return

    const supabase = createClient()
    let mounted = true

    // Initial load of applications
    async function loadApplications() {
      try {
        const { data, error } = await supabase
          .from('ip_applications')
          .select('*')
          .eq('wallet_address', publicKey.toBase58())
          .order('created_at', { ascending: false })

        if (error) throw error

        if (mounted) {
          const apps = data || []
          setApplications(apps)
          updateStats(apps)
        }
      } catch (error) {
        console.error('Error loading applications:', error)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadApplications()

    // Set up real-time subscription for status updates
    const subscription = supabase
      .channel('application-updates')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all changes
          schema: 'public',
          table: 'ip_applications',
          filter: `wallet_address=eq.${publicKey.toBase58()}`
        },
        (payload) => {
          if (!mounted) return

          console.log('Received real-time update:', payload)

          if (payload.eventType === 'UPDATE') {
            setApplications(prevApps => {
              const newApps = prevApps.map(app =>
                app.id === payload.new.id ? { ...app, ...payload.new } : app
              )
              updateStats(newApps)
              return newApps
            })
          }
        }
      )
      .subscribe()

    // Cleanup
    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [publicKey])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <ClientOnly>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Applications</h3>
            <p className="mt-2 text-3xl font-semibold">{stats.total}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Pending Review</h3>
            <p className="mt-2 text-3xl font-semibold text-yellow-600">{stats.pending}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Approved</h3>
            <p className="mt-2 text-3xl font-semibold text-green-600">{stats.approved}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Rejected</h3>
            <p className="mt-2 text-3xl font-semibold text-red-600">{stats.rejected}</p>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-medium">Recent Applications</h2>
          </div>
          
          {applications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No applications found
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {applications.map((app) => (
                <Link 
                  key={app.id}
                  href={`/applications/${app.id}`}
                  className="block hover:bg-gray-50"
                >
                  <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{app.title}</h3>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                          {app.description}
                        </p>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Submitted on {new Date(app.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </ClientOnly>
  )
} 