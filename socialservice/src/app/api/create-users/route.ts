import { metadata } from './../../layout';
import { EmailTemplate } from '@/app/socio/components/EmailTemplate';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('🟡 Solicitud recibida:', JSON.stringify(body, null, 2));
    
    const { projects } = body;

    if (!Array.isArray(projects)) {
      console.error('❌ Formato inválido: projects no es un arreglo:', projects);
      return NextResponse.json({ error: 'Formato de solicitud inválido. Se esperaba un arreglo de proyectos.' }, { status: 400 });
    }

    if (projects.length === 0) {
      console.error('❌ No se proporcionaron proyectos en la solicitud');
      return NextResponse.json({ error: 'No se proporcionaron proyectos para procesar.' }, { status: 400 });
    }

    console.log(`🔄 Procesando ${projects.length} proyectos...`);
    const results = [];

    for (const { proyecto, correo, id_proyecto } of projects) {
      try {
        console.log(`\n📌 Proyecto actual: ${JSON.stringify({ proyecto, correo }, null, 2)}`);

        if (!proyecto || !correo) {
          console.error('⚠️ Faltan campos requeridos:', { proyecto, correo });
          results.push({ 
            proyecto: proyecto || 'desconocido', 
            success: false, 
            error: 'Faltan campos requeridos: proyecto o correo.' 
          });
          continue;
        }

        // Generar email y contraseña ficticios
        const authMail = proyecto
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-zA-Z0-9]/g, "")
          .toLowerCase() + '@gmail.com';

        const password = Array.from(crypto.getRandomValues(new Uint32Array(12)))
          .map(num => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-='[num % 72])
          .join('');

        console.log(`✅ Credenciales generadas para ${proyecto}:`, { authMail });

        // Crear usuario en Supabase
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: authMail,
          password,
          email_confirm: true,
          user_metadata: {
            id_proyecto
          }
        });

        if (authError) {
          console.error(`❌ Error creando usuario para ${proyecto}:`, authError.message);
          results.push({ 
            proyecto, 
            success: false, 
            error: `No se pudo crear el usuario: ${authError.message}`,
            details: authError
          });
          continue;
        }

        // Insertar en tabla socioformador
        const { error: insertError } = await supabaseAdmin
          .from('socioformador')
          .insert({
            correo: authMail,
            id_proyecto
          });

        if (insertError && insertError.code !== 'PGRST116') {
          console.error('❌ Error insertando en socioformador:', insertError.message);
          results.push({ 
            proyecto, 
            success: false, 
            error: `No se pudo guardar el socio formador: ${insertError.message}`,
            details: insertError
          });
          continue;
        }

        // Enviar correo
        const emailBody = await EmailTemplate({ 
          projectName: proyecto, 
          username: authMail, 
          password 
        });

        const { error: emailError } = await resend.emails.send({
          from: 'Servicio Social TEC <onboarding@resend.dev>',
          to: [correo],
          subject: 'Bienvenido a la plataforma de Servicio Social',
          react: emailBody,
        });

        if (emailError) {
          console.error(`❌ Error enviando correo a ${correo}:`, emailError.message);
          results.push({ 
            proyecto, 
            success: false, 
            error: `No se pudo enviar el correo: ${emailError.message}`,
            details: emailError
          });
          continue;
        }

        console.log(`✅ Usuario creado y correo enviado a ${correo}`);
        results.push({ 
          proyecto, 
          success: true,
          authMail
        });

      } catch (err) {
        console.error(`❌ Error inesperado en proyecto ${proyecto}:`, err);
        results.push({ 
          proyecto, 
          success: false, 
          error: err instanceof Error ? err.message : 'Error desconocido',
          details: err
        });
      }
    }

    // Resultado final
    const resumen = {
      total: projects.length,
      exitosos: results.filter(r => r.success).length,
      fallidos: results.filter(r => !r.success).length
    };

    console.log('🟢 Proceso finalizado:', JSON.stringify(resumen, null, 2));
    return NextResponse.json({ mensaje: 'Proceso de creación finalizado.', resultados: results, resumen });

  } catch (error) {
    console.error('❌ Error general en la ruta create-users:', error);
    return NextResponse.json(
      { 
        error: 'Error interno del servidor.',
        detalles: error instanceof Error ? error.message : 'Error desconocido.'
      },
      { status: 500 }
    );
  }
}
