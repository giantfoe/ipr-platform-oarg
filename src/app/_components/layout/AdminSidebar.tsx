'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  Activity
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Applications', href: '/admin/applications', icon: FileText },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Activity', href: '/admin/activity', icon: Activity },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen w-64 flex-col border-r bg-white">
      <div className="flex h-16 shrink-0 items-center border-b px-6">
        <Link href="/admin" className="text-xl font-semibold text-primary">
          Admin Panel
        </Link>
      </div>
      <nav className="flex flex-1 flex-col p-4">
        <ul className="flex flex-1 flex-col gap-1">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-50",
                    pathname === item.href ? "bg-gray-50 text-primary" : "text-gray-700"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
        <div className="border-t pt-4">
          <button
            onClick={() => {
              document.cookie = 'wallet_address=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
              window.location.href = '/';
            }}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <LogOut className="h-5 w-5" />
            Disconnect Wallet
          </button>
        </div>
      </nav>
    </div>
  )
} 