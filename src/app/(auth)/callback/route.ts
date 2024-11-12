import { createServerSupabaseClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'
  
  if (code) {
    const supabase = createServerSupabaseClient()
    const { error, data: { session } } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && session) {
      // Successfully authenticated
      return NextResponse.redirect(new URL(next, request.url))
    }

    // Handle specific error cases
    if (error?.message.includes('expired')) {
      return NextResponse.redirect(new URL('/auth/link-expired', request.url))
    }
  }

  // General error case
  return NextResponse.redirect(new URL('/auth/auth-code-error', request.url))
} 