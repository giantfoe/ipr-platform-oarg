'use client'

import { useWallet } from "@solana/wallet-adapter-react"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Loader2 } from "lucide-react"
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface UserProfile {
  full_name: string | null
  company_name: string | null
  phone_number: string | null
  wallet_address: string
}

export default function ProfilePage() {
  const { publicKey } = useWallet()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function loadProfile() {
      if (!publicKey) return

      try {
        const supabase = createClient()
        const walletAddress = publicKey.toBase58()
        
        const { data: profiles, error: queryError } = await supabase
          .from('profiles')
          .select('*')
          .eq('wallet_address', walletAddress)

        if (queryError) throw queryError

        if (profiles && profiles.length > 0) {
          setProfile(profiles[0])
        }
      } catch (err) {
        console.error('Error in loadProfile:', err)
        setError(err instanceof Error ? err.message : 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [publicKey])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // If no profile exists, show registration prompt
  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">Profile Not Found</h2>
          <p className="text-yellow-700 mb-4">
            Please complete your profile registration to access all features.
          </p>
          <Link
            href="/onboarding"
            className="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Complete Registration
          </Link>
        </div>
      </div>
    )
  }

  // Display profile information if it exists
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Profile Information</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-500">Full Name</label>
            <p className="mt-1 text-lg font-medium">{profile.full_name}</p>
          </div>

          {profile.company_name && (
            <div>
              <label className="block text-sm font-medium text-gray-500">Company Name</label>
              <p className="mt-1 text-lg font-medium">{profile.company_name}</p>
            </div>
          )}

          {profile.phone_number && (
            <div>
              <label className="block text-sm font-medium text-gray-500">Phone Number</label>
              <p className="mt-1 text-lg font-medium">{profile.phone_number}</p>
            </div>
          )}

          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500">
              Wallet Address: <span className="font-mono">{profile.wallet_address}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 