'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { LoadingSpinner } from '@/app/_components/ui/LoadingSpinner'
import { useWallet } from "@solana/wallet-adapter-react"
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { StatusBadge } from '@/app/_components/ui/StatusBadge'

interface ApplicationDetail {
  id: string
  title: string
  description: string
  application_type: string
  status: string
  regions: string[]
  created_at: string
  wallet_address: string
  documents?: any[]
}

interface PageProps {
  params: { id: string }
}

export default function ApplicationDetailPage({ params }: PageProps) {
  const { publicKey } = useWallet()
  const [application, setApplication] = useState<ApplicationDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadApplication() {
      if (!publicKey || !params.id) {
        setLoading(false)
        return
      }

      try {
        const supabase = createClient()
        const { data, error: fetchError } = await supabase
          .from('ip_applications')
          .select(`
            id,
            title,
            description,
            application_type,
            status,
            regions,
            created_at,
            wallet_address,
            documents
          `)
          .eq('id', params.id)
          .single()

        if (fetchError) throw fetchError

        // Verify ownership
        if (data.wallet_address !== publicKey.toBase58()) {
          throw new Error('Unauthorized')
        }

        setApplication(data)
      } catch (err) {
        console.error('Error loading application:', err)
        setError(err instanceof Error ? err.message : 'Failed to load application')
      } finally {
        setLoading(false)
      }
    }

    loadApplication()
  }, [publicKey, params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !application) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          <p>{error || 'Application not found'}</p>
          <Link href="/applications" className="mt-4 inline-block text-sm underline">
            Return to Applications
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/applications" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Applications
      </Link>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{application.title}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Submitted on {new Date(application.created_at).toLocaleDateString()}
            </p>
          </div>
          <StatusBadge status={application.status} />
        </div>

        <div className="border-t border-gray-200 pt-6">
          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Application Type</dt>
              <dd className="mt-1 text-sm text-gray-900 capitalize">{application.application_type}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Regions</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {application.regions?.join(', ') || 'No regions specified'}
              </dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                {application.description}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
} 