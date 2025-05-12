import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  
  try {
    const code = requestUrl.searchParams.get('code')
    const error = requestUrl.searchParams.get('error')
    const error_description = requestUrl.searchParams.get('error_description')

    // Handle OAuth errors
    if (error) {
      console.error('OAuth error:', error, error_description)
      return NextResponse.redirect(
        `${requestUrl.origin}/?error=${encodeURIComponent(error_description || 'Authentication failed')}`
      )
    }

    // Handle missing code
    if (!code) {
      console.error('No code provided in callback')
      return NextResponse.redirect(
        `${requestUrl.origin}/?error=${encodeURIComponent('Authentication code missing')}`
      )
    }

    const supabase = createRouteHandlerClient({ cookies })
    
    // Exchange the code for a session
    const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (sessionError) {
      console.error('Session error:', sessionError)
      return NextResponse.redirect(
        `${requestUrl.origin}/?error=${encodeURIComponent(sessionError.message)}`
      )
    }

    // Verify email domain
    const email = session?.user?.email
    if (!email?.endsWith('@tec.mx')) {
      console.error('Invalid email domain:', email)
      // Sign out the user if they don't have a tec.mx email
      await supabase.auth.signOut()
      return NextResponse.redirect(
        `${requestUrl.origin}/?error=${encodeURIComponent('Only @tec.mx accounts are allowed')}`
      )
    }

    // Successful login - redirect to explorar
    return NextResponse.redirect(`${requestUrl.origin}/alumno/explorar`)

  } catch (error: any) {
    console.error('Unexpected error in auth callback:', error)
    return NextResponse.redirect(
      `${requestUrl.origin}/?error=${encodeURIComponent('An unexpected error occurred')}`
    )
  }
} 