'use client'

import { useWallet } from "@solana/wallet-adapter-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { AdminSidebar } from "@/app/_components/layout/AdminSidebar"
import { LoadingSpinner } from "@/app/_components/ui/LoadingSpinner"
import ClientOnly from "@/app/_components/ClientOnly"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { publicKey } = useWallet()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAdminStatus() {
      if (!publicKey) {
        router.replace('/')
        return
      }

      try {
        const supabase = createClient()
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('wallet_address', publicKey.toBase58())
          .single()

        if (!profile?.is_admin) {
          router.replace('/dashboard')
          return
        }

        setIsAdmin(true)
      } catch (error) {
        console.error('Error checking admin status:', error)
        router.replace('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    checkAdminStatus()
  }, [publicKey, router])

  if (loading) {
    return (
      <ClientOnly>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      </ClientOnly>
    )
  }

  if (!isAdmin) return null

  return (
    <ClientOnly>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </ClientOnly>
  )
} 