'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useWallet } from "@solana/wallet-adapter-react"
import { createClient } from '@/utils/supabase/client'

interface AuthState {
  isAuthenticated: boolean
  hasProfile: boolean
  isAdmin: boolean
  profile: any | null
  loading: boolean
}

interface AuthContextType extends AuthState {
  refreshProfile: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { connected, publicKey, disconnect } = useWallet()
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    hasProfile: false,
    isAdmin: false,
    profile: null,
    loading: true
  })

  const supabase = createClient()

  const refreshProfile = async () => {
    if (!connected || !publicKey) {
      setState(prev => ({ ...prev, loading: false, isAuthenticated: false, profile: null }))
      return
    }

    try {
      const walletAddress = publicKey.toBase58()
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('wallet_address', walletAddress)
        .single()

      setState({
        isAuthenticated: true,
        hasProfile: !!profile,
        isAdmin: profile?.is_admin || false,
        profile,
        loading: false
      })

      // Update cookie and localStorage
      if (profile) {
        document.cookie = `wallet_address=${walletAddress}; path=/; max-age=604800; secure; samesite=strict`
        localStorage.setItem('has_profile', 'true')
        localStorage.setItem('wallet_address', walletAddress)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      setState(prev => ({ ...prev, loading: false }))
    }
  }

  const logout = async () => {
    try {
      await disconnect()
      document.cookie = 'wallet_address=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
      localStorage.removeItem('has_profile')
      localStorage.removeItem('wallet_address')
      setState({
        isAuthenticated: false,
        hasProfile: false,
        isAdmin: false,
        profile: null,
        loading: false
      })
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  useEffect(() => {
    refreshProfile()
  }, [connected, publicKey])

  return (
    <AuthContext.Provider value={{ ...state, refreshProfile, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 