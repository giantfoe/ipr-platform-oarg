'use client'

import { useWallet } from "@solana/wallet-adapter-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Sidebar } from "@/app/_components/layout/Sidebar"
import { LoadingSpinner } from "@/app/_components/ui/LoadingSpinner"
import ClientOnly from "@/app/_components/ClientOnly"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { publicKey } = useWallet()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!publicKey) {
      router.push('/')
      return
    }
    setIsLoading(false)
  }, [publicKey, router])

  if (isLoading) {
    return (
      <ClientOnly>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      </ClientOnly>
    )
  }

  return (
    <ClientOnly>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </ClientOnly>
  )
} 