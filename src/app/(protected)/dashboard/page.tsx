'use client'

import { useWallet } from "@solana/wallet-adapter-react"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import ProfileCard from "@/app/_components/dashboard/ProfileCard"
import IPRegistrationList from "@/app/_components/dashboard/IPRegistrationList"
import { Loader2 } from "lucide-react"

interface IPApplication {
  id: string
  title: string
  application_type: 'patent' | 'trademark' | 'copyright'
  status: 'draft' | 'pending' | 'in-review' | 'approved' | 'rejected'
  created_at: string
}

interface StatusHistory {
  id: string
  status: string
  created_at: string
  ip_applications: {
    title: string
  }
}

interface DashboardStats {
  totalApplications: number
  pendingApplications: number
  approvedApplications: number
  recentActivity: StatusHistory[]
}

interface Application {
  id: string
  status: 'pending' | 'approved' | 'rejected' | 'draft' | 'in-review'
}

export default function DashboardPage() {
  const { publicKey } = useWallet()
  const [profile, setProfile] = useState(null)
  const [ipRegistrations, setIpRegistrations] = useState([])
  const [stats, setStats] = useState<DashboardStats>({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    recentActivity: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      if (!publicKey) return

      try {
        const walletAddress = publicKey.toBase58()

        // Fetch profile data
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('wallet_address', walletAddress)
          .single()

        setProfile(profileData)

        // Fetch IP registrations
        const { data: registrationsData } = await supabase
          .from('ip_applications')
          .select('*')
          .eq('wallet_address', walletAddress)

        setIpRegistrations(registrationsData || [])

        // Calculate stats
        const total = registrationsData?.length || 0
        const pending = registrationsData?.filter((app: Application) => app.status === 'pending').length || 0
        const approved = registrationsData?.filter((app: Application) => app.status === 'approved').length || 0

        // Fetch recent activity
        const { data: activityData } = await supabase
          .from('status_history')
          .select(`
            *,
            ip_applications (title)
          `)
          .eq('created_by', walletAddress)
          .order('created_at', { ascending: false })
          .limit(5)

        setStats({
          totalApplications: total,
          pendingApplications: pending,
          approvedApplications: approved,
          recentActivity: activityData || []
        })

      } catch (err) {
        console.error('Error loading dashboard data:', err)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [publicKey, supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        {error}
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Applications</h3>
          <p className="mt-2 text-3xl font-semibold">{stats.totalApplications}</p>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-500">Pending Applications</h3>
          <p className="mt-2 text-3xl font-semibold">{stats.pendingApplications}</p>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-500">Approved Applications</h3>
          <p className="mt-2 text-3xl font-semibold">{stats.approvedApplications}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <ProfileCard profile={profile} />
          
          {/* Recent Activity */}
          <div className="bg-white shadow-md rounded-lg p-6 mt-6">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            {stats.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {stats.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">{activity.ip_applications?.title}</p>
                      <p className="text-gray-500">Status changed to {activity.status}</p>
                    </div>
                    <span className="text-gray-400">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No recent activity</p>
            )}
          </div>
        </div>
        
        {/* IP Applications List */}
        <div className="md:col-span-2">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Your IP Applications</h2>
            <IPRegistrationList ipRegistrations={ipRegistrations} />
          </div>
        </div>
      </div>
    </div>
  )
} 