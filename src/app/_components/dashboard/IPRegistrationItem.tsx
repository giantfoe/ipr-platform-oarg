'use client'

import React from 'react'
import { PencilIcon, TrashIcon } from '@heroicons/react/solid'

interface IPRegistrationItemProps {
  ip: {
    id: string
    ip_name: string
    ip_type: string
    registration_date: string
    status: string
  }
}

const IPRegistrationItem: React.FC<IPRegistrationItemProps> = ({ ip }) => {
  return (
    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 mt-2">
      <div>
        <h4 className="text-lg font-medium text-[#0A2540]">{ip.ip_name}</h4>
        <p className="text-sm text-gray-600">{ip.ip_type}</p>
        <p className="text-sm text-gray-500">Registered on: {new Date(ip.registration_date).toLocaleDateString()}</p>
      </div>
      <div className="flex items-center space-x-4">
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${ip.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {ip.status}
        </span>
        <button className="text-[#635BFF] hover:text-[#0A2540]">
          <PencilIcon className="h-5 w-5" />
        </button>
        <button className="text-red-500 hover:text-red-700">
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

export default IPRegistrationItem 