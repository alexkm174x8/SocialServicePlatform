'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';
import { LogOutModal } from './LogOutModal';

interface ListItemProps {
  data: Array<{
    id_proyecto: number;
    [key: string]: any;
  }>;
  onDelete?: (id: number) => Promise<void>;
}

export const ListItem = ({ data, onDelete }: ListItemProps) => {
  const [showDeleteModal, setShowDeleteModal] = React.useState<number | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async (id: number) => {
    if (!onDelete) {
      console.error('No delete handler provided');
      return;
    }
    
    console.log('Attempting to delete project with ID:', id);
    setIsDeleting(true);
    try {
      await onDelete(id);
      console.log('Successfully deleted project with ID:', id);
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error al eliminar el proyecto. Por favor intenta de nuevo.');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(null);
    }
  };

  return (
    <div className="overflow-x-auto lg:overflow-x-visible">
      <table className="table-auto w-full text-sm text-left text-gray-500">
        <thead className="text-xs border-b border-blue-900 text-blue-900">
          <tr>
            <th className="px-6 py-3 min-w-[160px]">Subido</th>
            <th className="px-6 py-3 min-w-[80px]">Cupos</th>
            <th className="px-6 py-3 min-w-[150px]">Perfil de aceptación</th>
            <th className="px-6 py-3 min-w-[220px]">Título del proyecto</th>
            <th className="px-6 py-3 min-w-[200px]">Contacto del socioformador</th>
            <th className="px-6 py-3 min-w-[200px]">Objetivo‍‍‍‍‍</th>
            <th className="px-6 py-3 min-w-[80px]">Número PMT</th>
            <th className="px-6 py-3 min-w-[80px]">ODS asociado</th>
            <th className="px-6 py-3 min-w-[220px]">Actividades a desarrollar</th>
            <th className="px-6 py-3 min-w-[180px]">Detalles del horario</th>
            <th className="px-6 py-3 min-w-[180px]">Habilidades necesarias</th>
            <th className="px-6 py-3 min-w-[160px]">Modalidad de trabajo</th>
            <th className="px-6 py-3 min-w-[180px]">Lugar de trabajo</th>
            <th className="px-6 py-3 min-w-[120px]">Duración</th>
            <th className="px-6 py-3 min-w-[80px]">Horas a otorgar</th>
            <th className="px-6 py-3 min-w-[160px]">Tipo de inscripción</th>
            <th className="px-6 py-3 min-w-[100px]">Ruta de Google Maps</th>
            <th className="px-6 py-3 min-w-[100px]">CRN</th>
            <th className="px-6 py-3 min-w-[100px]">Grupo</th>
            <th className="px-6 py-3 min-w-[100px]">Clave</th>
            <th className="px-6 py-3 min-w-[160px]">Periodo académico</th>
            <th className="px-6 py-3 min-w-[220px]">Pregunta personalizada 1</th>
            <th className="px-6 py-3 min-w-[220px]">Pregunta personalizada 2</th>
            <th className="px-6 py-3 min-w-[220px]">Pregunta personalizada 3</th>
            <th className="px-6 py-3 min-w-[90px]">Id del socioformador</th>
            <th className="px-6 py-3 min-w-[140px]">Carreras solicitadas</th>
            <th className="px-6 py-3 min-w-[100px]">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => {
            console.log('Rendering row:', row); // Debug log
            return (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-4 py-2">
                  {new Date(row.subido).toLocaleString("es-MX")}
                </td>
                <td className="px-4 py-2 font-normal">{row.cupos}</td>
                <td className="px-4 py-2 font-normal">{row.perfil}</td>
                <td className="px-4 py-2 font-normal">{row.proyecto}</td>
                <td className="px-4 py-2 font-normal">{row.contacto}</td>
                <td className="px-4 py-2 font-normal">{row.objetivo_ps}</td>
                <td className="px-4 py-2 font-normal">{row.num_pmt}</td>
                <td className="px-4 py-2 font-normal">{row.ods_ps}</td>
                <td className="px-4 py-2 font-normal">{row.actividades}</td>
                <td className="px-4 py-2 font-normal">{row.detalles_horario}</td>
                <td className="px-4 py-2 font-normal">{row.habilidades}</td>
                <td className="px-4 py-2 font-normal">{row.modalidad}</td>
                <td className="px-4 py-2 font-normal">{row.lugar_trabajo}</td>
                <td className="px-4 py-2 font-normal">{row.duracion}</td>
                <td className="px-4 py-2 font-normal">{row.horas}</td>
                <td className="px-4 py-2 font-normal">{row.tipo_inscripcion}</td>
                <td className="px-4 py-2 font-normal">
                  {row.ruta_maps ? (
                    <a
                      href={row.ruta_maps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Ver mapa
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-2 font-normal">{row.crn}</td>
                <td className="px-4 py-2 font-normal">{row.grupo}</td>
                <td className="px-4 py-2 font-normal">{row.clave}</td>
                <td className="px-4 py-2 font-normal">{row.periodo_academico}</td>
                <td className="px-4 py-2 font-normal">{row.fecha_pue}</td>
                <td className="px-4 py-2 font-normal">{row.pregunta_1}</td>
                <td className="px-4 py-2 font-normal">{row.pregunta_2}</td>
                <td className="px-4 py-2 font-normal">{row.pregunta_3}</td>
                <td className="px-4 py-2 font-normal">{row.id_socioformador}</td>
                <td className="px-4 py-2 font-normal">{row.carreras}</td>
                <td className="px-4 py-2 font-normal">
                  <button
                    onClick={() => {
                      console.log('Delete button clicked for project:', row.id_proyecto); // Debug log
                      setShowDeleteModal(row.id_proyecto);
                    }}
                    className="text-red-600 hover:text-red-800 transition-colors"
                    title="Eliminar proyecto"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {showDeleteModal !== null && (
        <LogOutModal
          title="Eliminar proyecto"
          message={`¿Estás seguro que deseas eliminar el proyecto "${data.find(p => p.id_proyecto === showDeleteModal)?.proyecto}" y sus datos relacionados? Esta acción no se puede deshacer.`}
          confirmText={isDeleting ? "Eliminando..." : "Eliminar"}
          cancelText="Cancelar"
          onConfirm={() => handleDelete(showDeleteModal)}
          onCancel={() => setShowDeleteModal(null)}
        />
      )}
    </div>
  );
};