'use client'

import { useWallet } from "@solana/wallet-adapter-react"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"

interface UserProfile {
  full_name: string
  company_name?: string
  phone_number?: string
}

export default function ProfilePage() {
  const { publicKey } = useWallet()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      if (!publicKey) return

      try {
        const supabase = createClient()
        const walletAddress = publicKey.toBase58()
        
        // Debug log
        console.log('Fetching profile for wallet:', walletAddress)

        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, company_name, phone_number')
          .eq('wallet_address', walletAddress)
          .single()

        // Debug logs
        console.log('Query result:', { data, error })

        if (error) {
          console.error('Supabase error:', error)
          return
        }

        if (data) {
          console.log('Setting profile:', data)
          setProfile(data)
        } else {
          console.log('No profile found')
        }
      } catch (error) {
        console.error('Error loading profile:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [publicKey])

  // Debug log
  console.log('Current profile state:', profile)

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-500">Full Name</label>
            <p className="font-medium">{profile?.full_name || 'Not set'}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500">Company Name</label>
            <p className="font-medium">{profile?.company_name || 'Not set'}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500">Phone Number</label>
            <p className="font-medium">{profile?.phone_number || 'Not set'}</p>
          </div>

          {/* Debug info */}
          <div className="mt-4 p-4 bg-gray-50 rounded text-sm">
            <p>Wallet Address: {publicKey?.toBase58()}</p>
            <p>Profile Data: {JSON.stringify(profile, null, 2)}</p>
          </div>
        </div>
      </div>
    </div>
  )
} 