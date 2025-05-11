import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  try {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })

    // Refresh session if expired - required for Server Components
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      console.error('Middleware auth error:', error)
    }

    // Get the pathname of the request
    const path = req.nextUrl.pathname
    console.log('Middleware path:', path, 'Session:', !!session)

    // If the user is not signed in and the current path is not / or /login,
    // redirect the user to /
    if (!session && (path.startsWith('/admin') || path.startsWith('/alumno') || path.startsWith('/socio'))) {
      console.log('Redirecting to login - no session')
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/'
      return NextResponse.redirect(redirectUrl)
    }

    // If the user is signed in and the current path is / or /login,
    // redirect the user to /alumno/explorar
    if (session && (path === '/' || path === '/login')) {
      console.log('Redirecting to explorar - has session')
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/alumno/explorar'
      return NextResponse.redirect(redirectUrl)
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    // In case of error, allow the request to continue
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/', '/login', '/admin/:path*', '/alumno/:path*', '/socio/:path*'],
} 