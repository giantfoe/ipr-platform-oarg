'use client'

import { useState, useEffect } from 'react'
import { useWallet } from "@solana/wallet-adapter-react"
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

const APPLICATION_TYPES = [
  { id: 'patent', name: 'Patent' },
  { id: 'trademark', name: 'Trademark' },
  { id: 'copyright', name: 'Copyright' },
]

const ARIPO_MEMBER_STATES = [
  'Botswana', 'Eswatini', 'Gambia', 'Ghana', 'Kenya', 'Lesotho', 'Liberia', 
  'Malawi', 'Mozambique', 'Namibia', 'Rwanda', 'São Tomé and Príncipe', 
  'Sierra Leone', 'Somalia', 'Sudan', 'Tanzania', 'Uganda', 'Zambia', 'Zimbabwe'
]

export function IPRegistrationForm() {
  const { publicKey } = useWallet()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [needsProfile, setNeedsProfile] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function checkProfile() {
      if (publicKey) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('wallet_address', publicKey.toBase58())
          .single()

        setNeedsProfile(!profile)
      }
    }
    checkProfile()
  }, [publicKey, supabase])

  if (needsProfile) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <h2 className="text-xl font-semibold mb-4">Complete Your Profile</h2>
        <p className="mb-4 text-gray-600">Please complete your profile before submitting an IP application.</p>
        {/* Profile form here */}
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!publicKey) {
      setError('Wallet not connected')
      setLoading(false)
      return
    }

    const walletAddress = publicKey.toBase58()
    const formData = new FormData(e.currentTarget)
    
    try {
      const applicationData = {
        title: formData.get('title'),
        description: formData.get('description'),
        application_type: formData.get('application_type'),
        region: selectedRegions,
        wallet_address: walletAddress,
        status: 'draft',
        fee_status: 'unpaid',
        documents: {}
      }

      const { error: insertError } = await supabase
        .from('ip_applications')
        .insert([applicationData])

      if (insertError) throw insertError

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
          {ARIPO_MEMBER_STATES.map(state => (
            <label key={state} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={state}
                checked={selectedRegions.includes(state)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedRegions([...selectedRegions, state])
                  } else {
                    setSelectedRegions(selectedRegions.filter(r => r !== state))
                  }
                }}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">{state}</span>
            </label>
          ))}
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !publicKey || selectedRegions.length === 0}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
      >
        {loading ? 'Creating Application...' : 'Submit Application'}
      </button>
    </form>
  )
} 