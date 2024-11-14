'use client'

import { useEffect, useState } from 'react'
import { useWallet } from "@solana/wallet-adapter-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "./ui/button"
import { Shield } from "lucide-react"

export function AdminDetector() {
  const { publicKey } = useWallet()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAdminStatus() {
      if (!publicKey) {
        setLoading(false)
        return
      }

      try {
        const supabase = createClient()
        const walletAddress = publicKey.toBase58()
        
        console.log('Checking admin status for wallet:', walletAddress)

        // First, ensure the profile exists
        const { data: existingProfile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('wallet_address', walletAddress)
          .single()

        if (profileError) {
          console.log('No profile found, creating one...')
          // Create profile if it doesn't exist
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([
              { 
                wallet_address: walletAddress,
                is_admin: false // Default to non-admin
              }
            ])
            .select()
            .single()

          if (createError) {
            throw createError
          }
        }

        // Now check admin status
        const { data: adminCheck, error: adminError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('wallet_address', walletAddress)
          .single()

        if (adminError) {
          throw adminError
        }

        console.log('Admin status result:', adminCheck)
        setIsAdmin(!!adminCheck?.is_admin)

      } catch (error) {
        console.error('Error checking admin status:', error)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    checkAdminStatus()
  }, [publicKey])

  if (loading || !isAdmin) return null

  return (
    <>
      {/* Fixed Position Admin Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => router.push('/admin')}
          className="flex items-center gap-2 bg-primary text-white shadow-lg hover:bg-primary/90"
        >
          <Shield className="h-5 w-5" />
          Admin Panel
        </Button>
      </div>

      {/* Admin Status Indicator */}
      <div className="fixed top-20 right-4 z-50">
        <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Admin Access
        </div>
      </div>
    </>
  )
} 