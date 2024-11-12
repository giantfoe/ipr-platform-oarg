'use client'

import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useRouter } from 'next/navigation'
import ProfileCard from '@/app/_components/dashboard/ProfileCard'
import IPRegistrationList from '@/app/_components/dashboard/IPRegistrationList'
import AddIPRegistrationModal from '@/app/_components/dashboard/AddIPRegistrationModal'

export default function DashboardPage() {
  const { publicKey } = useWallet()
  const router = useRouter()
  const [profile, setProfile] = useState(null)
  const [ipRegistrations, setIPRegistrations] = useState([])

  useEffect(() => {
    if (publicKey) {
      // Fetch user profile from Supabase
      fetch(`/api/profile?wallet=${publicKey.toBase58()}`)
        .then(response => response.json())
        .then(data => setProfile(data.profile))
        .catch(error => console.error('Error fetching profile:', error))

      // Fetch user's IP registrations
      fetch(`/api/ip-registrations?wallet=${publicKey.toBase58()}`)
        .then(response => response.json())
        .then(data => setIPRegistrations(data.ipRegistrations))
        .catch(error => console.error('Error fetching IP Registrations:', error))
    }
  }, [publicKey])

  if (!publicKey) {
    return <p>Loading...</p>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileCard profile={profile} />
      <div className="mt-8 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-[#0A2540]">Your IP Registrations</h2>
        <AddIPRegistrationModal />
      </div>
      <IPRegistrationList ipRegistrations={ipRegistrations} />
    </div>
  )
} 