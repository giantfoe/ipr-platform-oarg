import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  try {
    // Refresh session if needed
    const { data: { session }, error } = await supabase.auth.getSession()

    // Handle admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
      if (!session?.user) {
        return NextResponse.redirect(new URL('/', request.url))
      }

      // Check if user is admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('wallet_address', session.user.id)
        .single()

      if (profileError || !profile?.is_admin) {
        console.error('Admin access denied:', { profileError, profile })
        return NextResponse.redirect(new URL('/', request.url))
      }
    }

    return res
  } catch (err) {
    console.error('Middleware error:', err)
    return NextResponse.redirect(new URL('/', request.url))
  }
}

export const config = {
  matcher: ['/admin/:path*']
} 