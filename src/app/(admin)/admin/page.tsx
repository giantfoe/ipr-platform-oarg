'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    totalUsers: 0,
    recentActivity: []
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function loadStats() {
      // Get total applications
      const { count: totalApps } = await supabase
        .from('ip_applications')
        .select('*', { count: 'exact' })

      // Get pending applications
      const { count: pendingApps } = await supabase
        .from('ip_applications')
        .select('*', { count: 'exact' })
        .eq('status', 'pending')

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
        totalUsers: totalUsers || 0,
        recentActivity: recentActivity || []
      })
      setLoading(false)
    }

    loadStats()
  }, [supabase])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Applications</h3>
          <p className="mt-2 text-3xl font-semibold">{stats.totalApplications}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Pending Applications</h3>
          <p className="mt-2 text-3xl font-semibold">{stats.pendingApplications}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
          <p className="mt-2 text-3xl font-semibold">{stats.totalUsers}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {stats.recentActivity.map((activity: any) => (
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