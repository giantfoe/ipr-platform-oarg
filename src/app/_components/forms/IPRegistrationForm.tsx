'use client'

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export function IPRegistrationForm() {
  const { publicKey } = useWallet()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])

  const regions = [
    'United States',
    'European Union',
    'United Kingdom',
    'China',
    'Japan',
    'Other'
  ]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!publicKey) {
      setError('Wallet not connected')
      setLoading(false)
      return
    }

    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const applicationType = formData.get('application_type') as string

    try {
      const response = await fetch('/api/ip-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': publicKey.toBase58(),
        },
        body: JSON.stringify({
          title,
          description,
          application_type: applicationType,
          region: selectedRegions,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create application')
      }

      router.push('/applications')
    } catch (err) {
      console.error('Application creation error:', err)
      setError(err instanceof Error ? err.message : 'Error creating application')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-md rounded-lg p-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label htmlFor="application_type" className="block text-sm font-medium text-gray-700">
          Application Type
        </label>
        <select
          name="application_type"
          id="application_type"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">Select type...</option>
          <option value="patent">Patent</option>
          <option value="trademark">Trademark</option>
          <option value="copyright">Copyright</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Regions
        </label>
        <div className="mt-2 space-y-2">
          {regions.map((region) => (
            <label key={region} className="inline-flex items-center mr-4">
              <input
                type="checkbox"
                value={region}
                checked={selectedRegions.includes(region)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedRegions([...selectedRegions, region])
                  } else {
                    setSelectedRegions(selectedRegions.filter(r => r !== region))
                  }
                }}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-700">{region}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          rows={4}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !publicKey}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
      >
        {loading ? 'Creating Application...' : 'Create Application'}
      </button>
    </form>
  )
} 