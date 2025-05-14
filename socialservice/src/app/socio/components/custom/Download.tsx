'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const columnOptions = ['Estado', 'Matrícula', 'Correo', 'Carrera', 'Teléfono', 'Pregunta 1', 'Pregunta 2', 'Pregunta 3'];

interface DownloadModalProps {
  onClose: () => void;
}

const DownloadModal: React.FC<DownloadModalProps> = ({ onClose }) => {
  const [format, setFormat] = useState('PDF');
  const [selectedColumn, setSelectedColumn] = useState('Nombre');
  const [columns, setColumns] = useState<string[]>(['Nombre', 'Modalidad']);
  const [recordRange, setRecordRange] = useState('1-3, 3-4');

  const addColumn = () => {
    if (!columns.includes(selectedColumn)) {
      setColumns([...columns, selectedColumn]);
    }
  };

  const removeColumn = (col: string) => {
    setColumns(columns.filter(c => c !== col));
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest(".popup-content") === null) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [onClose]);

  return (
      <div className="popup-content bg-white rounded-xl p-6 shadow-lg w-full max-w-md mx-auto my-8 border border-gray-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-center text-blue-900">Descargar información</h2>
          <button className="text-blue-900" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Formato */}
        <div className="mb-4">
          <label className="block font-semibold text-blue-900 mb-1">Formato:</label>
          <div className="relative">
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full border border-blue-900 rounded-full px-4 py-2 text-left text-blue-900 appearance-none pr-10"
            >
              <option value="PDF">PDF</option>
              <option value="CSV">CSV</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
              <svg className="w-4 h-4 text-blue-900" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Botón Descargar */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              const data = { columns, recordRange, format };
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: format === 'PDF' ? 'application/pdf' : 'text/csv' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `informacion.${format.toLowerCase()}`;
              link.click();
              URL.revokeObjectURL(url);
            }}
            className="bg-blue-900 text-white px-6 py-2 rounded-full hover:bg-blue-800"
          >
            Descargar
          </button>
        </div>
      </div>
  );
};

export default DownloadModal;
