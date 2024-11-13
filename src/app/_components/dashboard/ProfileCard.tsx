'use client'

import React from 'react'

interface ProfileCardProps {
  profile: {
    full_name: string
    company_name: string
    phone_number: string
    wallet_address: string
    updated_at: string
  } | null
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  if (!profile) {
    return <p className="text-gray-600">Loading profile...</p>
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-xl font-semibold text-[#0A2540]">Profile Information</h3>
      <p className="mt-2 text-gray-600"><strong>Full Name:</strong> {profile.full_name}</p>
      <p className="mt-1 text-gray-600"><strong>Company Name:</strong> {profile.company_name}</p>
      <p className="mt-1 text-gray-600"><strong>Phone Number:</strong> {profile.phone_number}</p>
      <p className="mt-1 text-gray-600"><strong>Wallet Address:</strong> {profile.wallet_address}</p>
      <p className="mt-1 text-gray-500 text-sm">Last Updated: {new Date(profile.updated_at).toLocaleDateString()}</p>
    </div>
  )
}

export default ProfileCard 