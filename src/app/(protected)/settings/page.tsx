'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon, Monitor, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useWallet } from "@solana/wallet-adapter-react"
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { publicKey } = useWallet()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

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

        setIsAdmin(!!profile?.is_admin)
      } catch (error) {
        console.error('Error checking admin status:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAdminStatus()
  }, [publicKey])

  const handleAdminAccess = () => {
    router.push('/admin')
  }

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Settings</h1>

      {/* Theme Settings Section */}
      <div className="bg-card rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Theme</h2>
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => setTheme('light')}
            className={`p-4 rounded-lg border flex flex-col items-center gap-2 ${
              theme === 'light' ? 'border-primary bg-primary/5' : 'border-border'
            }`}
          >
            <Sun className="h-6 w-6" />
            <span>Light</span>
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-lg border flex flex-col items-center gap-2 ${
              theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border'
            }`}
          >
            <Moon className="h-6 w-6" />
            <span>Dark</span>
          </button>
          <button
            onClick={() => setTheme('system')}
            className={`p-4 rounded-lg border flex flex-col items-center gap-2 ${
              theme === 'system' ? 'border-primary bg-primary/5' : 'border-border'
            }`}
          >
            <Monitor className="h-6 w-6" />
            <span>System</span>
          </button>
        </div>
      </div>

      {/* Admin Access Section */}
      {isAdmin && (
        <div className="bg-card rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium mb-4">Admin Access</h2>
          <button
            onClick={handleAdminAccess}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
          >
            Access Admin Dashboard
          </button>
        </div>
      )}
    </div>
  )
} 