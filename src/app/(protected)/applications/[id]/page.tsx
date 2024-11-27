'use client'

import { useEffect, useState } from 'react'
import { useWallet } from "@solana/wallet-adapter-react"
import { useRouter } from 'next/navigation'
import { createBrowserSupabaseClient } from '@/utils/supabase/client-utils'
import { LoadingSpinner } from '@/app/_components/ui/LoadingSpinner'
import { StatusBadge } from '@/app/_components/ui/StatusBadge'
import { DownloadCertificate } from '@/app/_components/DownloadCertificate'
import { useToast } from "@/components/ui/use-toast"

interface ApplicationDetails {
  id: string
  title: string
  description: string
  application_type: string
  status: string
  applicant_name: string
  company_name: string
  created_at: string
  updated_at: string
  wallet_address: string
  status_history: Array<{
    id: string
    status: string
    notes: string
    created_at: string
    created_by: string
  }>
  documents: Array<{
    id: string
    file_name: string
    file_type: string
    public_url: string
    created_at: string
  }>
}

export default function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const { publicKey } = useWallet()
  const router = useRouter()
  const { toast } = useToast()
  const [application, setApplication] = useState<ApplicationDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadApplication() {
      if (!publicKey) return
      
      try {
        const supabase = createBrowserSupabaseClient()

        const { data, error: fetchError } = await supabase
          .from('ip_applications')
          .select(`
            *,
            status_history (
              id,
              status,
              notes,
              created_at,
              created_by
            ),
            documents (
              id,
              file_name,
              file_type,
              public_url,
              created_at
            )
          `)
          .eq('id', params.id)
          .eq('wallet_address', publicKey.toBase58())
          .single()

        if (fetchError) throw fetchError
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

  if (!publicKey) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md">
        Please connect your wallet to view your application.
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

  if (error || !application) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        {error || 'Application not found'}
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Application Details</h1>
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-900"
        >
          Back to Applications
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium mb-4">Basic Information</h2>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Title</dt>
                  <dd className="mt-1 text-sm text-gray-900">{application.title}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="mt-1 text-sm text-gray-900">{application.description}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Type</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">{application.application_type}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1">
                    <StatusBadge applicationId={application.id} initialStatus={application.status} />
                  </dd>
                </div>
              </dl>

              {/* Show Download Certificate button for approved applications */}
              {application.status === 'approved' && (
                <div className="mt-6">
                  <DownloadCertificate 
                    applicationData={{
                      id: application.id,
                      title: application.title,
                      applicant_name: application.applicant_name,
                      company_name: application.company_name,
                      application_type: application.application_type,
                      created_at: application.created_at,
                      approved_at: application.updated_at
                    }} 
                  />
                </div>
              )}
            </div>

            <div>
              <h2 className="text-lg font-medium mb-4">Status History</h2>
              <div className="space-y-4">
                {application.status_history?.map((history) => (
                  <div key={history.id} className="border-l-4 border-gray-200 pl-4">
                    <div className="text-sm font-medium text-gray-900 capitalize">
                      {history.status}
                    </div>
                    <div className="text-sm text-gray-500">
                      {history.notes}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(history.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="mt-8">
            <h2 className="text-lg font-medium mb-4">Documents</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {application.documents?.map((doc) => (
                <div key={doc.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-900">{doc.file_name}</div>
                    <a
                      href={doc.public_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 text-sm"
                    >
                      View
                    </a>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {new Date(doc.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 