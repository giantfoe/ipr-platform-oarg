'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { StatusBadge } from '@/app/_components/ui/StatusBadge'
import { LoadingSpinner } from '@/app/_components/ui/LoadingSpinner'
import { useRouter } from 'next/navigation'

interface Application {
  id: string
  title: string
  description: string
  application_type: 'patent' | 'trademark' | 'copyright'
  status: 'draft' | 'pending' | 'in-review' | 'approved' | 'rejected'
  created_at: string
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadApplications()

    // Set up real-time subscription
    const supabase = createClient()
    const subscription = supabase
      .channel('application-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ip_applications'
        },
        (payload) => {
          console.log('Change received!', payload)
          loadApplications() // Reload applications when changes occur
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function loadApplications() {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('ip_applications')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setApplications(data || [])
      setLoading(false)
    } catch (error) {
      console.error('Error loading applications:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">IP Applications</h1>
        <Link
          href="/applications/new"
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Application
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No applications</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new IP application.
          </p>
          <div className="mt-6">
            <Link
              href="/applications/new"
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Application
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {applications.map((app) => (
              <li 
                key={app.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => router.push(`/applications/${app.id}`)}
              >
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {app.title}
                      </h3>
                      <div className="mt-2 flex items-center gap-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                          {app.application_type}
                        </span>
                        <StatusBadge status={app.status} />
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <p className="text-sm text-gray-500">
                        {new Date(app.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {app.description}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
} 