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

    const path = req.nextUrl.pathname
    const user = session?.user
    const isSocio = !!user?.user_metadata?.id_proyecto

    // Si no hay sesión y la ruta es protegida, redirige a /
    if (!session && (path.startsWith('/admin') || path.startsWith('/alumno') || path.startsWith('/socio'))) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/'
      return NextResponse.redirect(redirectUrl)
    }

    // Si es socio y accede a cualquier ruta que no sea /socio, redirige a /socio
    if (session && isSocio && path !== '/socio') {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/socio'
      return NextResponse.redirect(redirectUrl)
    }

    // Si es socio y accede a / o /login, redirige a /socio
    if (session && isSocio && (path === '/' || path === '/login')) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/socio'
      return NextResponse.redirect(redirectUrl)
    }

    // Si es alumno (no tiene id_proyecto) y accede a / o /login, redirige a /alumno/explorar
    if (session && !isSocio && (path === '/' || path === '/login')) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/alumno/explorar'
      return NextResponse.redirect(redirectUrl)
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/', '/login', '/admin/:path*', '/alumno/:path*', '/socio/:path*'],
}