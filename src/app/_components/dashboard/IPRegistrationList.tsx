'use client'

import React from 'react'
import IPRegistrationItem from './IPRegistrationItem'

interface IPRegistrationListProps {
  ipRegistrations: Array<{
    id: string
    ip_name: string
    ip_type: string
    registration_date: string
    status: string
  }>
}

const IPRegistrationList: React.FC<IPRegistrationListProps> = ({ ipRegistrations }) => {
  if (ipRegistrations.length === 0) {
    return <p className="text-gray-600 mt-4">No IP registrations found.</p>
  }

  return (
    <div className="mt-4">
      {ipRegistrations.map(ip => (
        <IPRegistrationItem key={ip.id} ip={ip} />
      ))}
    </div>
  )
}

export default IPRegistrationList 