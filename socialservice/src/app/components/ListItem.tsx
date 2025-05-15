'use client';

import React from 'react';
import { Trash2, Edit } from 'lucide-react';

export const ListItem = ({ data }: { data: any[] }) => {
  return (
    <div className="overflow-x-auto lg:overflow-x-visible">
      <table className="table-auto w-full text-sm text-left text-gray-500">
        <thead className="text-xs border-b border-blue-900 text-blue-900">
          <tr>
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
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="px-4 py-2">
                {new Date(row.subido).toLocaleString("es-MX")}
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
                  <Edit className="w-4 h-4 text-blue-900 hover:text-blue-400" />
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