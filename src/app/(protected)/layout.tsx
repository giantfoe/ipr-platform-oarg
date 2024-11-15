'use client'

import { useWallet } from "@solana/wallet-adapter-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Sidebar } from "@/app/_components/layout/Sidebar"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { publicKey } = useWallet()
  const router = useRouter()

  useEffect(() => {
    if (!publicKey) {
      router.push('/')
    }
  }, [publicKey, router])

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
} 