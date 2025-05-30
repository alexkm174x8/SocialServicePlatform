import { metadata } from './../../layout';
import { EmailTemplate } from '@/app/socio/components/EmailTemplate';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received request body:', JSON.stringify(body, null, 2));
    
    const { projects } = body;

    if (!Array.isArray(projects)) {
      console.error('Invalid request format - projects is not an array:', projects);
      return NextResponse.json({ error: 'Invalid request format' }, { status: 400 });
    }

    if (projects.length === 0) {
      console.error('No projects provided in request');
      return NextResponse.json({ error: 'No projects provided' }, { status: 400 });
    }

    console.log(`Processing ${projects.length} projects`);
    const results = [];

    for (const { proyecto, correo, id_proyecto } of projects) {
      try {
        console.log(`\nProcessing project: ${JSON.stringify({ proyecto, correo }, null, 2)}`);

        if (!proyecto || !correo) {
          console.error('Missing required fields:', { proyecto, correo });
          results.push({ 
            proyecto: proyecto || 'unknown', 
            success: false, 
            error: 'Missing required fields: proyecto or correo' 
          });
          continue;
        }

        // Generate auth email and password
        const authMail = proyecto
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-zA-Z0-9]/g, "")
          .toLowerCase() + '@gmail.com';

        console.log(`Generated credentials for ${proyecto}:`, {
          authMail,
          correo
        });

        const password = Array.from(crypto.getRandomValues(new Uint32Array(12)))
          .map(num => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-='[num % 72])
          .join('');

        // Create user in Supabase
        console.log(`Attempting to create Supabase user for ${proyecto}`);
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: authMail,
          password: password,
          email_confirm: true,  // This will create the user without requiring email verification
          user_metadata: {
            id_proyecto: id_proyecto  // Add the project ID to user metadata
          }
        });

        if (authError) {
          console.error(`Error creating Supabase user for ${proyecto}:`, JSON.stringify(authError, null, 2));
          results.push({ 
            proyecto, 
            success: false, 
            error: `User creation failed: ${authError.message}`,
            details: authError
          });
          continue;
        }

        console.log(`Successfully created Supabase user for ${proyecto}:`, JSON.stringify(authData, null, 2));

        const { data , error } = await supabaseAdmin
            .from('socioformador')
            .insert({
              correo: authMail,  // Using authMail instead of correo since that's the fake email we created
              id_proyecto: id_proyecto
            })

          if (error && error.code !== 'PGRST116') {
            console.error("Error inserting into socioformador table:", error);
            results.push({ 
              proyecto, 
              success: false, 
              error: `Database insert failed: ${error.message}`,
              details: error
            });
            continue;
          }

        // Send welcome email
        console.log(`Preparing email template for ${proyecto}`);
        const emailBody = await EmailTemplate({ 
          projectName: proyecto, 
          username: authMail, 
          password 
        });

        console.log(`Attempting to send email to ${correo}`);
        const { error: emailError } = await resend.emails.send({
          from: 'Servicio Social TEC <onboarding@resend.dev>',
          to: [correo],
          subject: 'Bienvenido a la plataforma de Servicio Social',
          react: emailBody,
        });

        if (emailError) {
          console.error(`Error sending email for ${proyecto}:`, JSON.stringify(emailError, null, 2));
          results.push({ 
            proyecto, 
            success: false, 
            error: `Email sending failed: ${emailError.message}`,
            details: emailError
          });
          continue;
        }

        console.log(`Successfully sent email to ${correo}`);
        results.push({ 
          proyecto, 
          success: true,
          authMail
        });
      } catch (err) {
        console.error(`Unexpected error for ${proyecto}:`, err instanceof Error ? err.stack : err);
        results.push({ 
          proyecto, 
          success: false, 
          error: err instanceof Error ? err.message : 'Unknown error',
          details: err
        });
      }
    }

    // Log final results
    console.log('\nUser creation process completed with results:', JSON.stringify(results, null, 2));
    console.log('Summary:', {
      total: projects.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length
    });

    return NextResponse.json({ 
      message: 'User creation process completed',
      results,
      summary: {
        total: projects.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      }
    });

  } catch (error) {
    console.error('Error in create-users route:', error instanceof Error ? error.stack : error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 