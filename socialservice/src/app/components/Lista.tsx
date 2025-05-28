'use client';

import React, { useEffect, useRef, useState } from 'react';

type Solicitud = {
  estatus: string;
  matricula: string;
  email: string;
  carrera: string;
  numero: string;
  respuesta_1: string;
  respuesta_2: string;
  respuesta_3: string;
  id_proyecto?: number;
  proyecto?: string;
};

const statusColorMap: Record<string, string> = {
  "Aceptadx por el alumnx": "bg-green-700",
  "Aceptadx": "bg-green-500",
  "Declinadx por el alumnx": "bg-orange-400",
  "No aceptadx": "bg-red-500",
  "En revisión": "bg-indigo-400",
  "No inscritx": "bg-black",
} as const;

const STATUS_OPTIONS = [
  { label: "Aceptadx", color: "bg-green-500" },
  { label: "Declinadx por el alumnx", color: "bg-orange-400" },
  { label: "No aceptadx", color: "bg-red-500" },
  { label: "En revisión", color: "bg-indigo-400" },
  { label: "No inscritx", color: "bg-black" },
] as const;

export const Lista = ({
  data,
  setData,
}: {
  data: Solicitud[];
  setData: React.Dispatch<React.SetStateAction<Solicitud[]>>;
}) => {

  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<{ label: string; color: string }[]>(
    data.map((item) => {
      const matchingOption = STATUS_OPTIONS.find(option => option.label === item.estatus) || STATUS_OPTIONS[4];
      return matchingOption;
    })
  );

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Update selectedStatus when data changes
    setSelectedStatus(data.map((item) => {
      const matchingOption = STATUS_OPTIONS.find(option => option.label === item.estatus) || STATUS_OPTIONS[4];
      return matchingOption;
    }));
  }, [data]);

  const toggleDropdown = (index: number) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleSelect = (index: number, option: typeof STATUS_OPTIONS[number]) => {
    const updatedData = [...data];
    updatedData[index] = {
      ...updatedData[index],
      estatus: option.label,
    };
    setData(updatedData);
    setSelectedStatus(prev => {
      const newStatus = [...prev];
      newStatus[index] = option;
      return newStatus;
    });
    setActiveDropdown(null);
  };
  
  return (
    <div className="w-full" ref={containerRef}>
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs border-b border-blue-900 text-blue-900">
          <tr>
            <th className="px-4 py-2"></th>
            <th className="px-4 py-2">Estado</th>
            <th className="px-4 py-2">Matrícula</th>
            <th className="px-4 py-2">Correo</th>
            <th className="px-4 py-2">Carrera</th>
            <th className="px-4 py-2">Teléfono</th>
            <th className="px-4 py-2">Título del proyecto</th>
            <th className="px-4 py-2">Respuesta 1</th>
            <th className="px-4 py-2">Respuesta 2</th>
            <th className="px-4 py-2">Respuesta 3</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50 relative">
              <td className="px-4 py-2 relative">
                <div
                  onClick={() => toggleDropdown(idx)}
                  className={`w-4 h-4 rounded cursor-pointer ${statusColorMap[row.estatus] || 'bg-gray-300'}`}
                  title={row.estatus}
                />
                {activeDropdown === idx && (
                  <div className="absolute z-50 bg-white border shadow-lg rounded-lg mt-2 w-60 p-3">
                    {STATUS_OPTIONS.map((option, i) => {
                      console.log('Rendering option:', option);
                      return (
                        <div
                          key={i}
                          className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-100 rounded"
                          onClick={() => {
                            console.log('Selected option:', option);
                            handleSelect(idx, option);
                          }}
                        >
                          <div className={`w-4 h-4 rounded ${option.color}`} />
                          <span className="text-sm text-blue-900">{option.label}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </td>
              <td className="px-4 py-2">{row.estatus}</td>
              <td className="px-4 py-2">{row.matricula}</td>
              <td className="px-4 py-2">{row.email}</td>
              <td className="px-4 py-2">{row.carrera}</td>
              <td className="px-4 py-2">{row.numero}</td>
              <td className="px-4 py-2">{row.proyecto || ''}</td>
              <td className="px-4 py-2 truncate max-w-[200px]">{row.respuesta_1}</td>
              <td className="px-4 py-2 truncate max-w-[200px]">{row.respuesta_2}</td>
              <td className="px-4 py-2 truncate max-w-[200px]">{row.respuesta_3}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};