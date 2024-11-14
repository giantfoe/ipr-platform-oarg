'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { LoadingSpinner } from '@/app/_components/ui/LoadingSpinner'
import { Shield } from 'lucide-react'
import ClientOnly from '@/app/_components/ClientOnly'
import { useWallet } from "@solana/wallet-adapter-react"

interface UserProfile {
  id: string
  wallet_address: string
  full_name: string | null
  company_name: string | null
  email: string | null
  phone_number: string | null
  is_admin: boolean
  created_at: string
}

const AdminUsersPage: React.FC = () => {
  const { publicKey } = useWallet()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const supabase = createClient()
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setUsers(data || [])
    } catch (error) {
      console.error('Error loading users:', error)
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
    if (!publicKey) return
    setUpdating(userId)
    
    try {
      const supabase = createClient()
      
      // Call the database function
      const { data, error: toggleError } = await supabase
        .rpc('toggle_admin_status', {
          user_id: userId,
          admin_wallet: publicKey.toBase58()
        })

      if (toggleError) {
        console.error('Toggle error:', toggleError)
        throw new Error(toggleError.message)
      }

      if (!data.success) {
        console.error('Operation failed:', data.error)
        throw new Error(data.error)
      }

      // Update local state
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId
            ? { ...user, is_admin: !currentStatus }
            : user
        )
      )
    } catch (error: any) {
      console.error('Error updating admin status:', {
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      // You might want to show this error to the user
      setError(error.message || 'Failed to update admin status')
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <ClientOnly>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Manage Users</h1>
          <div className="text-sm text-gray-500">
            Total Users: {users.length}
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Wallet Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.full_name || 'No Name Set'}
                        </div>
                        {user.company_name && (
                          <div className="text-sm text-gray-500">
                            {user.company_name}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 font-mono">
                      {user.wallet_address.substring(0, 4)}...
                      {user.wallet_address.substring(user.wallet_address.length - 4)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {user.email || 'No Email'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user.phone_number || 'No Phone'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.is_admin 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.is_admin ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleAdminStatus(user.id, user.is_admin)}
                      disabled={updating === user.id}
                      className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                        user.is_admin
                          ? 'bg-red-50 text-red-700 hover:bg-red-100'
                          : 'bg-primary/10 text-primary hover:bg-primary/20'
                      }`}
                    >
                      {updating === user.id ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <>
                          <Shield className="h-4 w-4 mr-1" />
                          {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ClientOnly>
  )
}

export default AdminUsersPage 