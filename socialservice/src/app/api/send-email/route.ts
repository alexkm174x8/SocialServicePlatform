import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { originalEmail, projectEmail, password, proyecto } = await request.json();

    const { data, error } = await resend.emails.send({
      from: 'Plataforma de Servicio Social <onboarding@resend.dev>',
      to: originalEmail,
      subject: 'Bienvenido a la Plataforma de Servicio Social',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">¡Bienvenido a la Plataforma de Servicio Social!</h2>
          <p>Hola,</p>
          <p>Tu cuenta ha sido creada exitosamente para el proyecto: <strong>${proyecto}</strong></p>
          <p>Para este proyecto específico, se ha creado una cuenta única con las siguientes credenciales:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Email de acceso:</strong> ${projectEmail}</p>
            <p style="margin: 5px 0;"><strong>Contraseña:</strong> ${password}</p>
          </div>
          <p><strong>Nota importante:</strong> Esta cuenta es específica para el proyecto "${proyecto}". Si tienes otros proyectos, cada uno tendrá su propia cuenta con credenciales únicas.</p>
          <p>Por razones de seguridad, te recomendamos cambiar tu contraseña después de iniciar sesión por primera vez.</p>
          <p>Para acceder a la plataforma, visita: <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" style="color: #2563eb;">Iniciar Sesión</a></p>
          <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
          <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
            Este es un correo automático, por favor no respondas a este mensaje.
          </p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Error sending email' },
      { status: 500 }
    );
  }
} 