'use client'

import { useEffect, useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { createClient } from "@/utils/supabase/client"
import { Loader2, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/app/_components/ui/button"

export default function SettingsPage() {
  const { publicKey } = useWallet()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

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

  if (loading) {
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

      {/* Admin Access Section - Only shown to admin users */}
      {isAdmin && (
        <div className="bg-card rounded-lg shadow-sm p-6 border-2 border-primary/10">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Admin Access
              </h2>
              <p className="text-sm text-muted-foreground">
                Access the admin dashboard to manage applications and users
              </p>
            </div>
            <Button
              onClick={handleAdminAccess}
              className="bg-primary hover:bg-primary/90"
            >
              Access Admin Panel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 