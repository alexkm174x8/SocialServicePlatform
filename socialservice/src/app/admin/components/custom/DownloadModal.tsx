"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';

const columnOptions = ['Nombre', 'Modalidad', 'Carrera', 'Fecha'];

export default function DownloadModal() {
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

  return (
    <div className="fixed inset-0 bg-white rounded-xl p-6 shadow-lg w-full max-w-md mx-auto my-8 border border-gray-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-center text-blue-900">Descargar información</h2>
        <button className="text-blue-900">
          <X />
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

      {/* Columnas */}
      <div className="mb-4">
        <p className="font-semibold text-blue-900">Seleccionar las columnas a descargar:</p>
        <div className="flex items-center mt-2">
          <div className="relative w-full mr-2">
            <select
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
              className="w-full border border-blue-900 rounded-full px-4 py-2 text-blue-900 appearance-none pr-10"
            >
              {columnOptions.map((col) => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
              <svg className="w-4 h-4 text-blue-900" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <button
            onClick={addColumn}
            className="bg-blue-900 text-white px-4 py-2 rounded-full hover:bg-blue-800"
          >
            Añadir
          </button>
        </div>

        <div className="mt-4 border-dashed border-2 border-blue-900 p-4 rounded-xl">
          {columns.map((col) => (
            <div
              key={col}
              className="flex justify-between items-center bg-white border border-blue-900 rounded-full px-4 py-2 mb-2"
            >
              <span className="text-blue-900">{col}</span>
              <button onClick={() => removeColumn(col)} className="text-blue-900 ml-4">
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Registros */}
      <div>
        <label className="block font-semibold text-blue-900 mb-1">Seleccionar los registros:</label>
        <input
          type="text"
          value={recordRange}
          onChange={(e) => setRecordRange(e.target.value)}
          className="w-full border border-blue-900 rounded-full px-4 py-2 text-blue-900"
        />
      </div>
    </div>
  );
}