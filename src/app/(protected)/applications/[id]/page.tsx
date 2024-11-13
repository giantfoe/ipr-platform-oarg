'use client'

import { useWallet } from "@solana/wallet-adapter-react"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface IPApplication {
  id: string
  title: string
  description: string
  application_type: 'patent' | 'trademark' | 'copyright'
  status: 'draft' | 'pending' | 'in-review' | 'approved' | 'rejected'
  regions: string[]
  created_at: string
  updated_at: string
}

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
  'in-review': 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
}

export default function ApplicationPage({ params }: { params: { id: string } }) {
  const { publicKey } = useWallet()
  const router = useRouter()
  const [application, setApplication] = useState<IPApplication | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)

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

        if (data.wallet_address !== publicKey.toBase58()) {
          router.push('/applications')
          return
        }

        setApplication(data)
      } catch (err) {
        console.error('Error loading application:', err)
        setError('Failed to load application')
      } finally {
        setLoading(false)
      }
    }

    loadApplication()
  }, [publicKey, params.id, router])

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!publicKey || !application) return

    try {
      const formData = new FormData(e.currentTarget)
      const supabase = createClient()

      const { error: updateError } = await supabase
        .from('ip_applications')
        .update({
          title: formData.get('title'),
          description: formData.get('description'),
        })
        .eq('id', application.id)

      if (updateError) throw updateError

      // Refresh the page to show updated data
      window.location.reload()
    } catch (err) {
      console.error('Error updating application:', err)
      setError('Failed to update application')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!application) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          Application not found
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Application Details</h1>
        {application.status === 'draft' && (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
          >
            {isEditing ? 'Cancel Edit' : 'Edit Application'}
          </button>
        )}
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        {isEditing ? (
          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                defaultValue={application.title}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={4}
                defaultValue={application.description}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{application.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{application.description}</p>
            </div>

            <div className="border-t pt-4">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Application Type</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">{application.application_type}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[application.status]}`}>
                      {application.status}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Regions</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {application.regions.join(', ')}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(application.created_at).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 