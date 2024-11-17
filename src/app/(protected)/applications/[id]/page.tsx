'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { LoadingSpinner } from '@/app/_components/ui/LoadingSpinner'
import { useWallet } from "@solana/wallet-adapter-react"
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { StatusBadge } from '@/app/_components/ui/StatusBadge'
import ClientOnly from '@/app/_components/ClientOnly'

export default function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const { publicKey } = useWallet()
  const [application, setApplication] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Render the page structure immediately
  const pageContent = (
    <ClientOnly>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/applications" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Applications
        </Link>

        <div className="bg-white shadow rounded-lg p-6">
          {loading ? (
            // Show skeleton loader while data loads
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-3 pt-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          ) : error ? (
            <div className="text-red-600">
              {error}
            </div>
          ) : application && (
            <>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{application.title}</h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Submitted on {new Date(application.created_at).toLocaleDateString()}
                  </p>
                </div>
                <StatusBadge status={application.status} />
              </div>

              {/* Application details */}
              <div className="border-t border-gray-200 pt-6">
                <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* ... rest of your application details ... */}
                </dl>
              </div>
            </>
          )}
        </div>
      </div>
    </ClientOnly>
  )

  // Load data after component mounts
  useEffect(() => {
    async function loadApplication() {
      if (!publicKey) return

      try {
        const supabase = createClient()
        const { data, error: fetchError } = await supabase
          .from('ip_applications')
          .select('*')
          .eq('id', params.id)
          .single()

        if (fetchError) throw fetchError
        setApplication(data)
      } catch (err) {
        console.error('Error loading application:', err)
        setError('Failed to load application')
      } finally {
        setLoading(false)
      }
    }

    loadApplication()
  }, [publicKey, params.id])

  return pageContent
} 