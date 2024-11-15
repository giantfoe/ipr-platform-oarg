'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { LoadingSpinner } from '@/app/_components/ui/LoadingSpinner'
import { useWallet } from "@solana/wallet-adapter-react"
import Link from 'next/link'
import { ArrowLeft, Clock } from 'lucide-react'
import { StatusBadge } from '@/app/_components/ui/StatusBadge'
import ClientOnly from '@/app/_components/ClientOnly'
import { Button } from '@/app/_components/ui/button'
import { toast } from '@/components/ui/use-toast'

interface ApplicationDetail {
  id: string
  title: string
  description: string
  application_type: string
  status: string
  regions: string[]
  created_at: string
  updated_at: string
  wallet_address: string
  documents?: any[]
  nft_mint?: string
  nft_metadata_uri?: string
  nft_image_url?: string
  profiles?: {
    full_name: string
    company_name: string | null
    phone_number: string | null
    email: string | null
  }
  status_history?: {
    status: string
    notes: string
    created_at: string
    created_by: string
  }[]
}

interface PageProps {
  params: { id: string }
}

export default function ApplicationDetailPage({ params }: PageProps) {
  const { publicKey } = useWallet()
  const [application, setApplication] = useState<ApplicationDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<ApplicationDetail | null>(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    async function loadApplication() {
      if (!publicKey) {
        setLoading(false)
        setError('Please connect your wallet')
        return
      }

      try {
        console.log('Loading application:', params.id)
        const supabase = createClient()
        
        // Pull detailed data including profiles and status history
        const { data, error: fetchError } = await supabase
          .from('ip_applications')
          .select(`
            *,
            profiles (
              full_name,
              company_name,
              phone_number,
              email
            ),
            status_history (
              status,
              notes,
              created_at,
              created_by
            )
          `)
          .eq('id', params.id)
          .single()

        if (fetchError) {
          console.error('Fetch error:', fetchError)
          throw new Error('Application not found')
        }

        if (!data) {
          throw new Error('Application not found')
        }

        // Verify ownership
        if (data.wallet_address !== publicKey.toBase58()) {
          throw new Error('Unauthorized: You do not have access to this application')
        }

        console.log('Application loaded:', data)
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

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!publicKey || !application || !formData) return
    setUpdating(true)

    try {
      const supabase = createClient()
      
      if (application.status !== 'draft') {
        throw new Error('Only draft applications can be edited')
      }

      const { error: updateError } = await supabase
        .from('ip_applications')
        .update({
          title: formData.title,
          description: formData.description,
          application_type: formData.application_type,
          regions: formData.regions,
          updated_at: new Date().toISOString()
        })
        .eq('id', application.id)
        .eq('wallet_address', publicKey.toBase58())

      if (updateError) throw updateError

      // Reload application data
      const { data: updatedApp, error: fetchError } = await supabase
        .from('ip_applications')
        .select(`
          *,
          profiles (
            full_name,
            company_name,
            phone_number,
            email
          ),
          status_history (
            status,
            notes,
            created_at,
            created_by
          )
        `)
        .eq('id', params.id)
        .single()

      if (fetchError) throw fetchError

      setApplication(updatedApp)
      setIsEditing(false)
      toast({
        title: "Success",
        description: "Your application has been updated successfully.",
      })
    } catch (err) {
      console.error('Error updating application:', err)
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to update application',
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  if (!publicKey) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 text-yellow-700 p-4 rounded-md">
          <p>Please connect your wallet to view this application</p>
          <Link href="/applications" className="mt-4 inline-block text-sm underline">
            Return to Applications
          </Link>
        </div>
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
    <ClientOnly>
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
            <div className="flex items-center gap-4">
              {application.status === 'draft' && !isEditing && (
                <Button
                  onClick={() => {
                    setFormData(application)
                    setIsEditing(true)
                  }}
                  variant="outline"
                >
                  Edit Application
                </Button>
              )}
              <StatusBadge status={application.status} />
            </div>
          </div>

          {isEditing && formData ? (
            <form onSubmit={handleEdit} className="space-y-6 border-t border-gray-200 pt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900 focus:border-primary focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900 focus:border-primary focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Application Type</label>
                <select
                  value={formData.application_type}
                  onChange={(e) => setFormData({ ...formData, application_type: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900 focus:border-primary focus:ring-primary"
                  required
                >
                  <option value="patent">Patent</option>
                  <option value="trademark">Trademark</option>
                  <option value="copyright">Copyright</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Regions</label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {['Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Burundi'].map((region) => (
                    <label key={region} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.regions?.includes(region)}
                        onChange={(e) => {
                          const newRegions = e.target.checked
                            ? [...(formData.regions || []), region]
                            : formData.regions?.filter(r => r !== region) || []
                          setFormData({ ...formData, regions: newRegions })
                        }}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="ml-2 text-sm text-gray-700">{region}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  disabled={updating}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updating}>
                  {updating ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          ) : (
            <div className="border-t border-gray-200 pt-6">
              <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Application Type</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">{application.application_type}</dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">Regions</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {Array.isArray(application.regions) ? application.regions.join(', ') : 'No regions specified'}
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
          )}

          {application.status_history && application.status_history.length > 0 && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h2 className="text-lg font-medium mb-4">Status History</h2>
              <div className="space-y-4">
                {application.status_history.map((history, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">
                        Status changed to <span className="font-medium">{history.status}</span>
                      </p>
                      {history.notes && (
                        <p className="mt-1 text-sm text-gray-500">{history.notes}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-400">
                        {new Date(history.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {application.nft_mint && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h2 className="text-lg font-medium mb-4">IP Registration Certificate NFT</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                {application.nft_image_url && (
                  <img 
                    src={application.nft_image_url} 
                    alt="IP Registration Certificate" 
                    className="mb-4 rounded-lg max-w-sm mx-auto"
                  />
                )}
                <dl className="grid grid-cols-1 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">NFT Address</dt>
                    <dd className="mt-1 text-sm text-gray-900 font-mono break-all">
                      {application.nft_mint}
                    </dd>
                  </div>
                  {application.nft_metadata_uri && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Metadata</dt>
                      <dd className="mt-1">
                        <a 
                          href={application.nft_metadata_uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          View Metadata
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          )}
        </div>
      </div>
    </ClientOnly>
  )
} 