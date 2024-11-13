'use client'

import Link from 'next/link'
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletButton } from "../WalletButton"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const { connected } = useWallet()

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-semibold text-[#0A2540]">
              IPR Platform
            </span>
          </Link>
          
          <div className="hidden sm:flex items-center space-x-8">
            <Link 
              href="/about" 
              className={cn(
                "text-sm text-[#425466] hover:text-[#0A2540] transition-colors"
              )}
            >
              About
            </Link>
            <Link 
              href="/pricing" 
              className={cn(
                "text-sm text-[#425466] hover:text-[#0A2540] transition-colors"
              )}
            >
              Pricing
            </Link>
            {connected && (
              <Link
                href="/dashboard"
                className={cn(
                  "text-sm font-medium text-white bg-primary",
                  "px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                )}
              >
                Dashboard
              </Link>
            )}
            <WalletButton />
          </div>
        </div>
      </div>
    </nav>
  )
} 