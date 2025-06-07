import { supabaseAdmin } from '@/lib/supabase-admin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Crear usuario admin 1
    const { data: authData1, error: authError1 } = await supabaseAdmin.auth.admin.createUser({
      email: 'alelobatonss@tec.mx',
      password: 'AlejaL0b@2025!',
      email_confirm: true,
      user_metadata: {
        is_admin: true
      }
    });

    if (authError1) {
      console.error('Error al crear el usuario administrador 1:', authError1);
      return NextResponse.json(
        { error: 'No se pudo crear el usuario administrador 1.', detalles: authError1.message || authError1 },
        { status: 500 }
      );
    }

    // Crear usuario admin 2
    const { data: authData2, error: authError2 } = await supabaseAdmin.auth.admin.createUser({
      email: 'maribelramirezss@tec.mx',
      password: 'MarR@m!2025',
      email_confirm: true,
      user_metadata: {
        is_admin: true
      }
    });

    if (authError2) {
      console.error('Error al crear el usuario administrador 2:', authError2);
      return NextResponse.json(
        { error: 'No se pudo crear el usuario administrador 2.', detalles: authError2.message || authError2 },
        { status: 500 }
      );
    }

    console.log('Usuarios administradores creados exitosamente:', authData1, authData2);
    return NextResponse.json({
      mensaje: 'Usuarios administradores creados correctamente.',
      usuarios: [authData1.user, authData2.user]
    });

  } catch (error) {
    console.error('Error inesperado al crear usuarios administradores:', error);
    return NextResponse.json(
      {
        error: 'Error interno del servidor.',
        detalles: error instanceof Error ? error.message : 'Error desconocido.'
      },
      { status: 500 }
    );
  }
}
