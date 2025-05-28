import * as React from 'react';

interface EmailTemplateProps {
  projectName: string;
  username: string;
  password: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  projectName,
  username,
  password,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.5', color: '#333' }}>
    <h1 style={{ color: '#4CAF50' }}>¡Bienvenido, a la plataforma de Servicio Social Tec con tu proyecto {projectName}!</h1>
    <p>Gracias por ser parte de la plataforma de Servicio Social Tec. Nos alegra tenerte con nosotros.</p>
    
    <p>En la siguiente plataforma podrás aceptar las solicitudes de los alumnos que quieren postularse a tu proyecto.</p>

    <p>A continuación encontrarás tus credenciales de acceso para tu proyecto {projectName}:</p>
    <ul>
      <li><strong>Usuario:</strong> {username}</li>
      <li><strong>Contraseña:</strong> {password}</li>
    </ul>
    
    <p>Si tienes alguna duda o necesitas ayuda, no dudes en contactarnos.</p>
    
    <p>¡Bienvenido a bordo!</p>
  </div>
);
