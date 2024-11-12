import { createServerSupabaseClient } from './server'
import { NextRequest, NextResponse } from 'next/server'
import type { CookieOptions } from '@supabase/ssr'

export async function updateSession(request: NextRequest) {
  // Create a response object that we can modify
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create a Supabase client configured to use cookies
  const supabase = createServerSupabaseClient()

  // Refresh session if it exists
  const { data: { session }, error } = await supabase.auth.getSession()

  if (error) {
    console.error('Supabase session error:', error)
  }

  // If there's no session or it's expired, check protected routes
  if (!session) {
    const path = request.nextUrl.pathname
    const protectedRoutes = ['/dashboard', '/profile', '/applications']
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))

    if (isProtectedRoute) {
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirect', path)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return response
}