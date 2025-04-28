'use client';

import React from 'react';
import { Trash2, Edit } from 'lucide-react';

export const ListItem = () => {
  const rows = [
  {
    subido: '2025-04-25T14:35:00Z',
    estatus: 'Abierto',
    perfil: "CAG'S",
    grupo: 'Grupo A',
    clave: 'ABC123',
    proyecto: 'Proyecto Ejemplo',
    representante: 'Juan Pérez',
    contacto: 'juan.perez@ejemplo.com',
    manejar: 'Permiso X',
  },
  {
    subido: '2025-04-20T10:00:00Z',
    estatus: 'En Revisión',
    perfil: 'Admin',
    grupo: 'Grupo B',
    clave: 'DEF456',
    proyecto: 'Sistema de Gestión',
    representante: 'María López',
    contacto: 'maria.lopez@ejemplo.com',
    manejar: 'Permiso Y',
  },
  {
    subido: '2025-04-18T08:15:00Z',
    estatus: 'Cerrado',
    perfil: 'Usuario',
    grupo: 'Grupo C',
    clave: 'GHI789',
    proyecto: 'App de Inventarios',
    representante: 'Carlos Sánchez',
    contacto: 'carlos.sanchez@ejemplo.com',
    manejar: 'Permiso Z',
  },
  {
    subido: '2025-04-22T16:45:00Z',
    estatus: 'Abierto',
    perfil: 'Supervisor',
    grupo: 'Grupo A',
    clave: 'JKL012',
    proyecto: 'Proyecto Rediseño',
    representante: 'Laura Gómez',
    contacto: 'laura.gomez@ejemplo.com',
    manejar: 'Permiso X',
  },
  {
    subido: '2025-04-19T12:30:00Z',
    estatus: 'Pendiente',
    perfil: 'Cliente',
    grupo: 'Grupo D',
    clave: 'MNO345',
    proyecto: 'Nueva Plataforma',
    representante: 'Luis Fernández',
    contacto: 'luis.fernandez@ejemplo.com',
    manejar: 'Permiso Y',
  },
];


  return (
    <div className="overflow-x-auto lg:overflow-x-visible">
      <table className="table-auto w-full text-sm text-left text-gray-500">
        <thead className="text-xs border-b border-blue-900 text-blue-900">
          <tr>
            <th className="px-4 py-2"></th>
            <th className="px-4 py-2">Subido</th>
            <th className="px-4 py-2">Estatus</th>
            <th className="px-4 py-2">Perfil de Aceptación</th>
            <th className="px-4 py-2">Grupo</th>
            <th className="px-4 py-2">Clave</th>
            <th className="px-4 py-2">Título de Proyecto</th>
            <th className="px-4 py-2">Representante</th>
            <th className="px-4 py-2">Contacto</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="px-4 py-2">
                <input
                  id={`checkbox-${idx}`}
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 rounded"
                />
                <label htmlFor={`checkbox-${idx}`} className="sr-only">
                  Seleccionar fila {idx + 1}
                </label>
              </td>
              <td className="px-4 py-2">
                {new Date(row.subido).toLocaleString('es-MX')}
              </td>
              <td className="px-4 py-2">{row.estatus}</td>
              <td className="px-4 py-2">{row.perfil}</td>
              <td className="px-4 py-2">{row.grupo}</td>
              <td className="px-4 py-2">{row.clave}</td>
              <td className="px-4 py-2">{row.proyecto}</td>
              <td className="px-4 py-2">{row.representante}</td>
              <td className="px-4 py-2">
                <a href={`mailto:${row.contacto}`} className="underline">
                  {row.contacto}
                </a>
              </td>
              <td className="flex items-center px-4 py-2 space-x-2">
                <button aria-label="Editar">
                  <Edit className="w-4 h-4 text-blue-900 hover:text-blue-800" />
                </button>
                <button aria-label="Eliminar">
                  <Trash2 className="w-4 h-4 text-blue-900 hover:text-red-800" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


