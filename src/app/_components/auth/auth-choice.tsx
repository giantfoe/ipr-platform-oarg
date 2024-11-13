'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletButton } from '../wallet/WalletButton'

export function AuthChoice() {
  const router = useRouter()
  const { connected } = useWallet()
  const [showWalletButton, setShowWalletButton] = useState(false)

  const handleChoice = (isNewUser: boolean) => {
    if (isNewUser) {
      setShowWalletButton(true)
    } else {
      router.push('/login')
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {showWalletButton ? (
        <div className="flex flex-col items-center gap-4">
          <WalletButton />
          <p className="text-sm text-gray-600">
            Connect your wallet to continue registration
          </p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => handleChoice(true)}
            className="group relative inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark transition-all duration-200 ease-in-out"
          >
            <span className="relative flex items-center">
              Create Account
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
          <button
            onClick={() => handleChoice(false)}
            className="group relative inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary border border-primary shadow-sm hover:bg-gray-50 transition-all duration-200 ease-in-out"
          >
            <span className="relative flex items-center">
              Sign In
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
        </div>
      )}
    </div>
  )
} 