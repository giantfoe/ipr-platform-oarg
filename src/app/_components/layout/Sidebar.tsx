'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileText,
  User,
  Settings,
  BookOpen,
  LogOut
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Applications', href: '/applications', icon: FileText },
  { name: 'Resources', href: '/resources', icon: BookOpen },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen w-64 flex-col border-r bg-card">
      <div className="flex h-16 shrink-0 items-center border-b px-6">
        <Link href="/" className="text-xl font-semibold">
          IP Register
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
                  className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent ${
                    pathname === item.href ? "bg-accent text-accent-foreground" : "text-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
} 