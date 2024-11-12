import { createServerSupabaseClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType
  const next = searchParams.get('next') || '/dashboard'

  // Create redirect URL without the token
  const redirectTo = request.nextUrl.clone()
  redirectTo.pathname = next
  redirectTo.searchParams.delete('token_hash')
  redirectTo.searchParams.delete('type')

  if (token_hash && type) {
    const supabase = createServerSupabaseClient()
    
    const { error, data: { session } } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    if (!error && session) {
      // Successfully verified email
      return NextResponse.redirect(redirectTo)
    }

    // Handle specific verification errors
    if (error?.message.includes('expired')) {
      return NextResponse.redirect(new URL('/auth/verification-expired', request.url))
    }
  }

  // Return the user to an error page
  return NextResponse.redirect(new URL('/auth/verification-error', request.url))
} 