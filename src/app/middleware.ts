import { NextResponse, type NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

// Define protected and public paths
const protectedPaths = ['/dashboard', '/profile', '/settings']
const authPaths = ['/login', '/register']
const publicPaths = ['/', '/about', '/pricing']

// Helper function to check if path matches any patterns
const matchesPath = (pathname: string, patterns: string[]) => {
  return patterns.some(pattern => {
    // Exact match
    if (pattern === pathname) return true
    // Pattern with wildcard
    if (pattern.endsWith('*')) {
      const base = pattern.slice(0, -1)
      return pathname.startsWith(base)
    }
    return false
  })
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()

  // 1. Skip middleware for static files and api routes
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/)
  ) {
    return response
  }

  // 2. Create Supabase client
  const supabase = createMiddlewareClient({ req: request, res: response })
  const { data: { session } } = await supabase.auth.getSession()

  // 3. Handle authentication paths
  if (matchesPath(pathname, authPaths)) {
    if (session) {
      // Redirect authenticated users away from auth pages
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return response
  }

  // 4. Handle protected paths
  if (matchesPath(pathname, protectedPaths)) {
    if (!session) {
      // Redirect unauthenticated users to login
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirect_to', pathname)
      return NextResponse.redirect(redirectUrl)
    }
    return response
  }

  // 5. Handle public paths
  if (matchesPath(pathname, publicPaths)) {
    return response
  }

  // 6. Default behavior - allow access
  return response
}

// Configure matcher for better performance
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}