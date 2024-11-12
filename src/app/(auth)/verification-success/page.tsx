'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function VerificationSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to dashboard after showing success message
    const timeout = setTimeout(() => {
      router.push('/dashboard')
    }, 3000)

    return () => clearTimeout(timeout)
  }, [router])

  return (
    <div className="text-center">
      <div className="mb-4 text-green-500">
        <svg
          className="h-12 w-12 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Email Verified Successfully
      </h2>
      <p className="text-gray-600">
        Redirecting you to your dashboard...
      </p>
    </div>
  )
} 