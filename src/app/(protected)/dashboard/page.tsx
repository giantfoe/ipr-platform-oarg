'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useWallet } from "@solana/wallet-adapter-react"
import { LoadingSpinner } from '@/app/_components/ui/LoadingSpinner'
import IPRegistrationList from '@/app/_components/dashboard/IPRegistrationList'
import ProfileCard from '@/app/_components/dashboard/ProfileCard'

interface DashboardStats {
  total: number
  pending: number
  inReview: number
  approved: number
  rejected: number
}

interface Application {
  id: string
  title: string
  description: string
  application_type: 'patent' | 'trademark' | 'copyright'
  status: 'draft' | 'pending' | 'in-review' | 'approved' | 'rejected'
  created_at: string
}

export default function DashboardPage() {
  const { publicKey } = useWallet()
  const [applications, setApplications] = useState<Application[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    pending: 0,
    inReview: 0,
    approved: 0,
    rejected: 0
  })
  const [loading, setLoading] = useState(true)

  const updateStats = (apps: Application[]) => {
    setStats({
      total: apps.length,
      pending: apps.filter(app => app.status === 'pending').length,
      inReview: apps.filter(app => app.status === 'in-review').length,
      approved: apps.filter(app => app.status === 'approved').length,
      rejected: apps.filter(app => app.status === 'rejected').length
    })
  }

  useEffect(() => {
    if (!publicKey) {
      setLoading(false)
      return
    }

    const walletAddress = publicKey.toBase58()
    const supabase = createClient()
    let mounted = true

    async function loadApplications() {
      try {
        const { data, error } = await supabase
          .from('ip_applications')
          .select('*')
          .eq('wallet_address', walletAddress)
          .order('created_at', { ascending: false })

        if (error) throw error
        if (mounted) {
          const apps = data || []
          setApplications(apps)
          updateStats(apps)
        }
      } catch (error) {
        console.error('Error loading applications:', error)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadApplications()

    return () => {
      mounted = false
    }
  }, [publicKey])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Applications</h3>
          <p className="mt-2 text-3xl font-semibold">{stats.total}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Pending Review</h3>
          <p className="mt-2 text-3xl font-semibold text-yellow-600">{stats.pending}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">In Review</h3>
          <p className="mt-2 text-3xl font-semibold text-blue-600">{stats.inReview}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Approved</h3>
          <p className="mt-2 text-3xl font-semibold text-green-600">{stats.approved}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Rejected</h3>
          <p className="mt-2 text-3xl font-semibold text-red-600">{stats.rejected}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Applications List */}
        <div className="lg:col-span-2">
          <IPRegistrationList ipRegistrations={applications} />
        </div>

        {/* Profile Card */}
        <div>
          <ProfileCard profile={null} />
        </div>
      </div>
    </div>
  )
} 