import { supabaseAdmin } from '@/lib/supabase-admin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Crear usuario admin 1
    const { data: authData1, error: authError1 } = await supabaseAdmin.auth.admin.createUser({
      email: 'alelobatonss@tec.mx',
      password: 'AlejaL0b@2025!',
      email_confirm: true,  // Auto-confirm the email
      user_metadata: {
        is_admin: true  // Set admin flag in metadata
      }
    });

    if (authError1) {
      console.error('Error creating admin user 1:', authError1);
      return NextResponse.json(
        { error: 'Failed to create admin user 1', details: authError1 },
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
      console.error('Error creating admin user 2:', authError2);
      return NextResponse.json(
        { error: 'Failed to create admin user 2', details: authError2 },
        { status: 500 }
      );
    }

    console.log('Successfully created admin users:', authData1, authData2);
    return NextResponse.json({ 
      message: 'Admin users created successfully',
      users: [authData1.user, authData2.user]
    });

  } catch (error) {
    console.error('Unexpected error creating admin:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}