import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)

  try {
    const code = requestUrl.searchParams.get('code')
    const error = requestUrl.searchParams.get('error')
    const error_description = requestUrl.searchParams.get('error_description')

    // Manejar errores OAuth
    if (error) {
      console.error('Error de autenticación OAuth:', error, error_description)
      return NextResponse.redirect(
        `${requestUrl.origin}/?error=${encodeURIComponent(
          error_description || 'Error en la autenticación con el proveedor externo.'
        )}`
      )
    }

    // Manejar código faltante
    if (!code) {
      console.error('No se proporcionó código en el callback')
      return NextResponse.redirect(
        `${requestUrl.origin}/?error=${encodeURIComponent(
          'Código de autenticación no encontrado. Intenta iniciar sesión nuevamente.'
        )}`
      )
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Intercambiar código por sesión
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.exchangeCodeForSession(code)

    if (sessionError) {
      console.error('Error al crear sesión:', sessionError)
      return NextResponse.redirect(
        `${requestUrl.origin}/?error=${encodeURIComponent(
          'No se pudo establecer la sesión. Por favor, intenta de nuevo.'
        )}`
      )
    }

    // Validar dominio del correo
    const email = session?.user?.email
    if (!email?.endsWith('@tec.mx')) {
      console.error('Correo no permitido:', email)
      await supabase.auth.signOut()
      return NextResponse.redirect(
        `${requestUrl.origin}/?error=${encodeURIComponent(
          'Solo se permiten correos institucionales @tec.mx.'
        )}`
      )
    }

    // Éxito
    return NextResponse.redirect(`${requestUrl.origin}/alumno/explorar`)
  } catch (error: any) {
    console.error('Error inesperado en el callback de autenticación:', error)
    return NextResponse.redirect(
      `${requestUrl.origin}/?error=${encodeURIComponent(
        'Ocurrió un error inesperado. Por favor, intenta más tarde.'
      )}`
    )
  }
}
