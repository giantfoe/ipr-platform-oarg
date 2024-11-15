'use client'

import { useWallet } from "@solana/wallet-adapter-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ResourcesLayout({
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

  return children
} 