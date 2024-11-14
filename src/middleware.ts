import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const walletAddress = request.cookies.get('wallet_address')?.value

  // Protected routes that require wallet connection
  const protectedRoutes = ['/dashboard', '/profile', '/applications', '/documents', '/resources']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  // Only check for wallet connection on protected routes
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