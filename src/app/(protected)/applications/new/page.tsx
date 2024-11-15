'use client'

import { useState } from 'react'
import { useWallet } from "@solana/wallet-adapter-react"
import { useRouter } from 'next/navigation'
import { LoadingSpinner } from '@/app/_components/ui/LoadingSpinner'

const APPLICATION_TYPES = [
  { id: 'patent', name: 'Patent' },
  { id: 'trademark', name: 'Trademark' },
  { id: 'copyright', name: 'Copyright' }
]

interface ApplicationFormData {
  title: string
  description: string
  application_type: string
  applicant_name: string
  company_name: string
  national_id: string
  phone_number: string
}

export default function NewApplicationPage() {
  const { publicKey } = useWallet()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<ApplicationFormData>({
    title: '',
    description: '',
    application_type: '',
    applicant_name: '',
    company_name: '',
    national_id: '',
    phone_number: ''
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!publicKey) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ip-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': publicKey.toBase58()
        },
        body: JSON.stringify({
          ...formData,
          regions: ['Sierra Leone'] // Default to Sierra Leone
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create application')
      }

      router.push('/applications')
    } catch (err) {
      console.error('Error creating application:', err)
      setError(err instanceof Error ? err.message : 'Failed to create application')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">New IP Application</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-lg p-6">
        {/* Applicant Information Section */}
        <div className="border-b border-gray-200 pb-6">
          <h2 className="text-lg font-medium mb-4">Applicant Information</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="applicant_name" className="block text-sm font-medium text-gray-700 required">
                Full Name
              </label>
              <input
                type="text"
                id="applicant_name"
                value={formData.applicant_name}
                onChange={(e) => setFormData({ ...formData, applicant_name: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 required">
                Company Name
              </label>
              <input
                type="text"
                id="company_name"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="national_id" className="block text-sm font-medium text-gray-700 required">
                National ID Number
              </label>
              <input
                type="text"
                id="national_id"
                value={formData.national_id}
                onChange={(e) => setFormData({ ...formData, national_id: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 required">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone_number"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                required
                placeholder="+232..."
              />
            </div>
          </div>
        </div>

        {/* IP Application Details Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium mb-4">IP Details</h2>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 required">
              Title/Name of IP
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 required">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label htmlFor="application_type" className="block text-sm font-medium text-gray-700 required">
              Application Type
            </label>
            <select
              id="application_type"
              value={formData.application_type}
              onChange={(e) => setFormData({ ...formData, application_type: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              required
            >
              <option value="">Select type</option>
              {APPLICATION_TYPES.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !publicKey}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center">
                <LoadingSpinner size="sm" className="-ml-1 mr-2" />
                Creating...
              </span>
            ) : (
              'Create Application'
            )}
          </button>
        </div>
      </form>
    </div>
  )
} 