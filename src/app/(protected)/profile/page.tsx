'use client'

import { useWallet } from "@solana/wallet-adapter-react"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Loader2, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/app/_components/ui/button"

interface UserProfile {
  full_name: string | null
  company_name: string | null
  phone_number: string | null
  wallet_address: string
  is_admin: boolean
}

export default function ProfilePage() {
  const { publicKey } = useWallet()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProfile() {
      if (!publicKey) {
        setLoading(false)
        return
      }

      try {
        const supabase = createClient()
        const walletAddress = publicKey.toBase58()
        
        console.log('Fetching profile for wallet:', walletAddress)

        // First check if profile exists
        const { data: existingProfile, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('wallet_address', walletAddress)
          .single()

        if (fetchError) {
          if (fetchError.code === 'PGRST116') { // No profile found
            console.log('No profile found, creating one...')
            // Create a new profile
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert([
                { 
                  wallet_address: walletAddress,
                  full_name: null,
                  company_name: null,
                  phone_number: null,
                  is_admin: false
                }
              ])
              .select()
              .single()

            if (createError) throw createError
            setProfile(newProfile)
          } else {
            throw fetchError
          }
        } else {
          setProfile(existingProfile)
        }

      } catch (err: any) {
        console.error('Error loading profile:', err.message || err)
        setError(err.message || 'Failed to load profile')
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

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          {error}
          <button 
            onClick={() => window.location.reload()}
            className="ml-4 text-sm underline"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Profile Information</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="space-y-6">
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

          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500">
              Wallet Address: <span className="font-mono">{profile?.wallet_address}</span>
            </p>
          </div>

          {/* Admin Panel Access */}
          {profile?.is_admin && (
            <div className="mt-8 p-4 bg-primary/5 rounded-lg border-2 border-primary/10">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Admin Access
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    You have administrator privileges
                  </p>
                </div>
                <Button
                  onClick={() => router.push('/admin')}
                  className="bg-primary hover:bg-primary/90"
                >
                  Access Admin Panel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 