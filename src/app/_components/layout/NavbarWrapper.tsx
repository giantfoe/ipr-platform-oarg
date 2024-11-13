'use client'

import dynamic from 'next/dynamic'

const Navbar = dynamic(
  () => import('./navbar'),
  { ssr: false }
)

export function NavbarWrapper() {
  return <Navbar />
} 