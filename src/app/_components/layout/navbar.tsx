'use client'

import Link from 'next/link'
import { WalletButton } from "../WalletButton"
import { useWallet } from "@solana/wallet-adapter-react"

export default function Navbar() {
  const { connected } = useWallet()

  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-semibold">IPR Platform</span>
          </Link>
          
          <div className="hidden sm:flex items-center space-x-8">
            <Link 
              href="/about" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {/* About */}
            </Link>
            <Link 
              href="/pricing" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {/* Pricing */}
            </Link>
            {connected && (
              <Link
                href="/dashboard"
                className="text-sm font-medium text-primary-foreground bg-primary px-4 py-2 rounded-md hover:bg-primary/90"
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