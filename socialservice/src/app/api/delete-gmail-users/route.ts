import { supabaseAdmin } from '@/lib/supabase-admin';
import { NextResponse } from 'next/server';

export async function DELETE() {
  try {
    // Get all users with @gmail.com domain
    const { data: users, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (usersError) {
      console.error('Error fetching users:', usersError);
      return NextResponse.json(
        { error: 'Error fetching users', details: usersError.message },
        { status: 500 }
      );
    }

    if (!users?.users) {
      return NextResponse.json({ message: 'No users found', deletedCount: 0 });
    }

    const gmailUsers = users.users.filter(user => 
      user.email && user.email.endsWith('@gmail.com')
    );
    
    console.log(`Found ${gmailUsers.length} users with @gmail.com domain`);
    
    let deletedCount = 0;
    const errors: string[] = [];
    
    // Delete each gmail user
    for (const user of gmailUsers) {
      try {
        const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
        if (deleteUserError) {
          console.error(`Error deleting user ${user.email}:`, deleteUserError);
          errors.push(`Failed to delete ${user.email}: ${deleteUserError.message}`);
        } else {
          console.log(`Successfully deleted user: ${user.email}`);
          deletedCount++;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error deleting user ${user.email}:`, error);
        errors.push(`Failed to delete ${user.email}: ${errorMessage}`);
      }
    }

    return NextResponse.json({
      message: `Successfully deleted ${deletedCount} gmail users`,
      deletedCount,
      totalFound: gmailUsers.length,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Error in delete gmail users API:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
} 