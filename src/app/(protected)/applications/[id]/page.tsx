'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserSupabaseClient } from '@/utils/supabase/client-utils'
import { LoadingSpinner } from '@/app/_components/ui/LoadingSpinner'
import { StatusBadge } from '@/app/_components/ui/StatusBadge'

interface PageProps {
  params: {
    id: string
  }
}

interface Application {
  id: string
  title: string
  description: string
  application_type: string
  status: string
  applicant_name: string
  company_name: string
  created_at: string
  wallet_address: string
  technical_field?: string
  mark_type?: string
  // Add other type-specific fields
}

export default function ApplicationDetailPage({ params }: PageProps) {
  const router = useRouter()
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadApplication() {
      try {
        const supabase = createBrowserSupabaseClient()
        
        const { data, error: fetchError } = await supabase
          .from('ip_applications')
          .select('*')
          .eq('id', params.id)
          .single()

        if (fetchError) throw fetchError

        if (!data) {
          throw new Error('Application not found')
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
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !application) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        {error || 'Application not found'}
      </div>
    )
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{application.title}</h1>
            <p className="mt-1 text-sm text-gray-500">
              Submitted on {new Date(application.created_at).toLocaleDateString()}
            </p>
          </div>
          <StatusBadge applicationId={params.id} initialStatus={application.status} />
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium">Application Details</h3>
            <dl className="mt-4 space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Type</dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">{application.application_type}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900">{application.description}</dd>
              </div>
              {/* Type-specific fields */}
              {application.application_type === 'patent' && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Technical Field</dt>
                  <dd className="mt-1 text-sm text-gray-900">{application.technical_field}</dd>
                </div>
              )}
              {application.application_type === 'trademark' && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Mark Type</dt>
                  <dd className="mt-1 text-sm text-gray-900">{application.mark_type}</dd>
                </div>
              )}
            </dl>
          </div>

          <div>
            <h3 className="text-lg font-medium">Applicant Information</h3>
            <dl className="mt-4 space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{application.applicant_name}</dd>
              </div>
              {application.company_name && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Company</dt>
                  <dd className="mt-1 text-sm text-gray-900">{application.company_name}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-gray-500">Wallet Address</dt>
                <dd className="mt-1 text-sm text-gray-900 font-mono">{application.wallet_address}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
} 