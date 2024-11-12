'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function VerifyEmailPage() {
  const [email, setEmail] = useState<string | null>(null)
  const [resending, setResending] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    // Get email from localStorage
    const storedEmail = localStorage.getItem('signUpEmail')
    if (storedEmail) setEmail(storedEmail)
  }, [])

  const handleResend = async () => {
    if (!email) return

    setResending(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      })

      if (error) throw error
      setMessage('Verification email resent successfully!')
    } catch (error) {
      setMessage('Error sending verification email. Please try again.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Check your email
      </h2>
      
      {email && (
        <p className="text-gray-600 mb-2">
          We sent a verification link to <span className="font-medium">{email}</span>
        </p>
      )}
      
      <p className="text-gray-600 mb-6">
        Click the link in the email to verify your account and continue.
      </p>

      <div className="space-y-4">
        <button
          onClick={handleResend}
          disabled={resending}
          className="text-primary hover:text-primary-dark font-semibold disabled:opacity-50"
        >
          {resending ? 'Sending...' : 'Resend verification email'}
        </button>

        {message && (
          <p className={`text-sm ${
            message.includes('Error') ? 'text-red-600' : 'text-green-600'
          }`}>
            {message}
          </p>
        )}

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
} 