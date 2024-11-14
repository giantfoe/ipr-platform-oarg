'use client'

import { useEffect } from 'react'
import { useWallet } from "@solana/wallet-adapter-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "./ui/button"
import { Shield } from "lucide-react"

export function AdminDetector() {
  const { publicKey } = useWallet()
  const router = useRouter()

  useEffect(() => {
    async function checkAdminStatus() {
      if (!publicKey) return

      try {
        const supabase = createClient()
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('wallet_address', publicKey.toBase58())
          .single()

        if (profile?.is_admin) {
          // Show admin notification
          const notification = document.getElementById('admin-notification')
          if (notification) {
            notification.classList.remove('hidden')
          }
        }
      } catch (error) {
        console.error('Error checking admin status:', error)
      }
    }

    checkAdminStatus()
  }, [publicKey])

  return (
    <div 
      id="admin-notification" 
      className="hidden fixed bottom-4 right-4 bg-card p-4 rounded-lg shadow-lg border border-primary/10 z-50"
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">Admin Access Available</span>
        </div>
        <Button
          onClick={() => router.push('/admin')}
          variant="default"
          size="sm"
        >
          Go to Admin Panel
        </Button>
      </div>
    </div>
  )
} 