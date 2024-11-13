'use client'

import { useState } from 'react'
import { useWallet } from "@solana/wallet-adapter-react"
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function OnboardingPage() {
  const { publicKey } = useWallet()
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          wallet_address: walletAddress,
          full_name: formData.get('full_name'),
          company_name: formData.get('company_name'),
          phone_number: formData.get('phone_number'),
        })

      if (insertError) throw insertError

      router.push('/dashboard')
    } catch (err) {
      console.error('Profile creation error:', err)
      setError(err instanceof Error ? err.message : 'Error creating profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">Complete Your Profile</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            name="full_name"
            id="full_name"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
            Company Name
          </label>
          <input
            type="text"
            name="company_name"
            id="company_name"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone_number"
            id="phone_number"
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
          {loading ? 'Creating Profile...' : 'Complete Profile'}
        </button>
      </form>
    </div>
  )
} 