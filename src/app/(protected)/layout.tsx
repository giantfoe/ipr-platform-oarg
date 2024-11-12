'use client'

import { useWallet } from "@solana/wallet-adapter-react"
import { redirect } from "next/navigation"
import { useEffect } from "react"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { connected } = useWallet()

  useEffect(() => {
    if (!connected) {
      redirect('/')
    }
  }, [connected])

  if (!connected) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
} 