'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Loader2 } from 'lucide-react'

interface DashboardStats {
  totalApplications: number
  pendingApplications: number
  approvedApplications: number
  totalUsers: number
  recentActivity: Array<{
    id: string
    application_id: string
    status: string
    created_at: string
    ip_applications: {
      title: string
    }
    profiles: {
      full_name: string
    }
  }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    totalUsers: 0,
    recentActivity: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      const supabase = createClient()

      // Get total applications
      const { count: totalApps } = await supabase
        .from('ip_applications')
        .select('*', { count: 'exact' })

      // Get pending applications
      const { count: pendingApps } = await supabase
        .from('ip_applications')
        .select('*', { count: 'exact' })
        .eq('status', 'pending')

      // Get approved applications
      const { count: approvedApps } = await supabase
        .from('ip_applications')
        .select('*', { count: 'exact' })
        .eq('status', 'approved')

      // Get total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })

      // Get recent activity
      const { data: recentActivity } = await supabase
        .from('status_history')
        .select(`
          *,
          ip_applications (title),
          profiles (full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5)

      setStats({
        totalApplications: totalApps || 0,
        pendingApplications: pendingApps || 0,
        approvedApplications: approvedApps || 0,
        totalUsers: totalUsers || 0,
        recentActivity: recentActivity || []
      })
      setLoading(false)
    }

    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Applications</h3>
          <p className="mt-2 text-3xl font-semibold">{stats.totalApplications}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Pending Applications</h3>
          <p className="mt-2 text-3xl font-semibold">{stats.pendingApplications}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Approved Applications</h3>
          <p className="mt-2 text-3xl font-semibold">{stats.approvedApplications}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
          <p className="mt-2 text-3xl font-semibold">{stats.totalUsers}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {stats.recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{activity.ip_applications?.title}</p>
                <p className="text-sm text-gray-500">
                  Status changed to {activity.status} by {activity.profiles?.full_name}
                </p>
              </div>
              <p className="text-sm text-gray-500">
                {new Date(activity.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 