import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const walletAddress = request.cookies.get('wallet_address')?.value

  // Public routes that don't require wallet connection
  const publicRoutes = ['/', '/about', '/pricing', '/contact']
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // If no wallet is connected, redirect to home
  if (!walletAddress) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Check if user has completed profile
  const supabase = createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single()

  // Protected routes that require profile completion
  const protectedRoutes = ['/dashboard', '/profile', '/applications', '/documents']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  // If accessing protected route without profile, redirect to onboarding
  if (isProtectedRoute && !profile) {
    const redirectUrl = new URL('/onboarding', request.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If accessing onboarding with completed profile, redirect to dashboard
  if (pathname === '/onboarding' && profile) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 