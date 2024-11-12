'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'

export function GetStartedModal({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean
  onClose: () => void 
}) {
  const router = useRouter()

  const handleOptionClick = (path: string) => {
    onClose()
    router.push(path)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
        
        <h2 className="text-2xl font-bold mb-6">Get Started with IP Register</h2>
        
        <div className="space-y-4">
          <button
            onClick={() => handleOptionClick('/register')}
            className="w-full p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-semibold">Create New Account</h3>
            <p className="text-sm text-gray-600">
              Register as a new user to start managing your IP registrations
            </p>
          </button>
          
          <button
            onClick={() => handleOptionClick('/login')}
            className="w-full p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-semibold">Sign In</h3>
            <p className="text-sm text-gray-600">
              Already have an account? Sign in to continue your work
            </p>
          </button>
          
          <button
            onClick={() => handleOptionClick('/pricing')}
            className="w-full p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-semibold">View Pricing</h3>
            <p className="text-sm text-gray-600">
              Explore our pricing plans and features
            </p>
          </button>
        </div>
      </div>
    </div>
  )
} 