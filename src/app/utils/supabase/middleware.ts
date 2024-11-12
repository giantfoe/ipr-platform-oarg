import { createServerSupabaseClient } from '@/utils/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = [
    '/login',
    '/register',
    '/auth/callback',
    '/auth/confirm',
    '/verify-email',
    '/',
    '/about',
    '/pricing'
  ]

  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Create a Supabase client
  const supabase = createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()

  // If there's no session and the route is protected, redirect to login
  if (!session) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}