'use client'

import { useEffect, useState } from 'react'
import { useWallet } from "@solana/wallet-adapter-react"
import { createBrowserSupabaseClient } from '@/utils/supabase/client-utils'
import { LoadingSpinner } from '@/app/_components/ui/LoadingSpinner'
import { useToast } from "@/components/ui/use-toast"

interface Profile {
  wallet_address: string
  full_name: string
  company_name: string
  email: string
  is_admin: boolean
  created_at: string
}

export default function AdminUsersPage() {
  const { publicKey } = useWallet()
  const { toast } = useToast()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProfiles()
  }, [publicKey])

  async function loadProfiles() {
    if (!publicKey) return
    
    try {
      const supabase = createBrowserSupabaseClient()

      // Verify admin status
      const { data: adminCheck, error: adminError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('wallet_address', publicKey.toBase58())
        .single()

      if (adminError || !adminCheck?.is_admin) {
        throw new Error('Unauthorized: Admin access required')
      }

      // Get all profiles
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setProfiles(data || [])
    } catch (err) {
      console.error('Error loading profiles:', err)
      setError(err instanceof Error ? err.message : 'Failed to load profiles')
    } finally {
      setLoading(false)
    }
  }

  const toggleAdminStatus = async (walletAddress: string, currentStatus: boolean) => {
    if (!publicKey) return
    setUpdating(walletAddress)

    try {
      const supabase = createBrowserSupabaseClient()

      // Update admin status
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          is_admin: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('wallet_address', walletAddress)

      if (updateError) throw updateError

      // Refresh profiles
      await loadProfiles()

      toast({
        title: 'Success',
        description: `User ${!currentStatus ? 'promoted to' : 'removed from'} admin`,
      })
    } catch (err) {
      console.error('Error updating admin status:', err)
      toast({
        title: 'Error',
        description: 'Failed to update admin status',
        variant: 'destructive'
      })
    } finally {
      setUpdating(null)
    }
  }

  if (!publicKey) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md">
        Please connect your wallet to access the admin panel.
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">User Management</h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Wallet</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {profiles.map((profile) => (
              <tr key={profile.wallet_address} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{profile.full_name}</div>
                  <div className="text-sm text-gray-500">{profile.email}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{profile.company_name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-mono text-gray-900">{profile.wallet_address}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    profile.is_admin ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {profile.is_admin ? 'Admin' : 'User'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleAdminStatus(profile.wallet_address, profile.is_admin)}
                    disabled={updating === profile.wallet_address || profile.wallet_address === publicKey.toBase58()}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      profile.is_admin
                        ? 'bg-red-100 text-red-800 hover:bg-red-200'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {updating === profile.wallet_address ? (
                      <LoadingSpinner size="sm" />
                    ) : profile.is_admin ? (
                      'Remove Admin'
                    ) : (
                      'Make Admin'
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 