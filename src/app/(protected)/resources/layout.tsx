'use client'

import { useWallet } from "@solana/wallet-adapter-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import ReadAloudButton from '@/components/ReadAloudButton';

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

  const textToRead = "Welcome to the OARG website. Here you can register your intellectual property.";

  return (
    <div>
      {children}
      <ReadAloudButton text={textToRead} />
    </div>
  );
} 