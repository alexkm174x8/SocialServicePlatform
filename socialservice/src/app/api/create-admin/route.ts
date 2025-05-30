import { supabaseAdmin } from '@/lib/supabase-admin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Create admin user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: 'ale@tec.mx',
      password: 'holahola',
      email_confirm: true,  // Auto-confirm the email
      user_metadata: {
        is_admin: true  // Set admin flag in metadata
      }
    });

    if (authError) {
      console.error('Error creating admin user:', authError);
      return NextResponse.json(
        { error: 'Failed to create admin user', details: authError },
        { status: 500 }
      );
    }

    console.log('Successfully created admin user:', authData);
    return NextResponse.json({ 
      message: 'Admin user created successfully',
      user: authData.user 
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