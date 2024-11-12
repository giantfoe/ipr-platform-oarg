'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'

export function AuthChoice() {
  const router = useRouter()
  const [isNew, setIsNew] = useState<boolean | null>(null)

  const handleChoice = (isNewUser: boolean) => {
    setIsNew(isNewUser)
    router.push(isNewUser ? '/register' : '/login')
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <button
        onClick={() => handleChoice(true)}
        className="group relative inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark transition-all duration-200 ease-in-out"
      >
        <span className="relative flex items-center">
          Create Account
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </button>
      <button
        onClick={() => handleChoice(false)}
        className="group relative inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary border border-primary shadow-sm hover:bg-gray-50 transition-all duration-200 ease-in-out"
      >
        <span className="relative flex items-center">
          Sign In
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </button>
    </div>
  )
} 