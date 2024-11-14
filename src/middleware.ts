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

  // Check admin routes
  if (pathname.startsWith('/admin')) {
    try {
      const supabase = createClient()
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('wallet_address', walletAddress)
        .single()

      if (!profile?.is_admin) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Protected routes that require wallet connection
  const protectedRoutes = ['/dashboard', '/profile', '/applications', '/documents', '/resources']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute && !walletAddress) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 