'use client'

import { useWallet } from "@solana/wallet-adapter-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

const APPLICATION_TYPES = [
  { id: 'patent', name: 'Patent' },
  { id: 'trademark', name: 'Trademark' },
  { id: 'copyright', name: 'Copyright' },
]

const REGIONS = [
  'Botswana', 'Eswatini', 'Gambia', 'Ghana', 'Kenya', 'Lesotho', 
  'Malawi', 'Mozambique', 'Namibia', 'Rwanda', 'Sierra Leone', 
  'Somalia', 'Sudan', 'Tanzania', 'Uganda', 'Zambia', 'Zimbabwe',
  'Other'
]

export default function NewApplicationPage() {
  const { publicKey } = useWallet()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!publicKey) return

    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    
    try {
      const response = await fetch('/api/ip-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': publicKey.toBase58()
        },
        body: JSON.stringify({
          title: formData.get('title'),
          description: formData.get('description'),
          application_type: formData.get('application_type'),
          region: selectedRegions
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
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title/Name of IP
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
            <option value="">Select type</option>
            {APPLICATION_TYPES.map(type => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Region Selection
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {REGIONS.map(region => (
              <label key={region} className="flex items-center space-x-2">
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
                <span className="text-sm text-gray-700">{region}</span>
              </label>
            ))}
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
            disabled={loading || !publicKey || selectedRegions.length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center">
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
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