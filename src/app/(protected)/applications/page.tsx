'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Loader2, Plus } from 'lucide-react'
import Link from 'next/link'
import { useWallet } from "@solana/wallet-adapter-react"

interface Application {
  id: string
  title: string
  description: string
  application_type: 'patent' | 'trademark' | 'copyright'
  status: 'draft' | 'pending' | 'in-review' | 'approved' | 'rejected'
  regions: string[]
  created_at: string
  wallet_address: string
}

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
  'in-review': 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
}

export default function ApplicationsPage() {
  const { publicKey } = useWallet()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadApplications() {
      if (!publicKey) return

      try {
        const supabase = createClient()
        const walletAddress = publicKey.toBase58()

        console.log('Fetching applications for wallet:', walletAddress) // Debug log

        const { data, error: fetchError } = await supabase
          .from('ip_applications')
          .select('*')
          .eq('wallet_address', walletAddress)
          .order('created_at', { ascending: false })

        if (fetchError) {
          console.error('Supabase error:', fetchError) // Debug log
          throw fetchError
        }

        console.log('Applications data:', data) // Debug log
        setApplications(data || [])
      } catch (err) {
        console.error('Error loading applications:', err)
        setError('Failed to load applications. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadApplications()
  }, [publicKey])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">IP Applications</h1>
        <Link
          href="/applications/new"
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Application
        </Link>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          {error}
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No applications</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new IP application.
          </p>
          <div className="mt-6">
            <Link
              href="/applications/new"
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Application
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((app) => (
                <tr 
                  key={app.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => window.location.href = `/applications/${app.id}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {app.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {app.description.substring(0, 50)}...
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">
                      {app.application_type}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[app.status]}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(app.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
} 