'use client'

interface ProfileCardProps {
  profile: {
    full_name: string
    company_name?: string
    phone_number?: string
    wallet_address: string
    created_at: string
  } | null
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  if (!profile) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-500">Full Name</p>
          <p className="font-medium">{profile.full_name}</p>
        </div>
        {profile.company_name && (
          <div>
            <p className="text-sm text-gray-500">Company</p>
            <p className="font-medium">{profile.company_name}</p>
          </div>
        )}
        {profile.phone_number && (
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium">{profile.phone_number}</p>
          </div>
        )}
        <div>
          <p className="text-sm text-gray-500">Wallet Address</p>
          <p className="font-medium text-sm truncate">{profile.wallet_address}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Member Since</p>
          <p className="font-medium">
            {new Date(profile.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  )
} 