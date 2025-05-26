'use client';

import React, { useCallback, useState } from 'react';
import * as XLSX from 'xlsx';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const REQUIRED_FIELDS = [
  "id_proyecto", "perfil_aceptacion", "proyecto", "grupo", "clave", "representante",
  "contacto", "cupos", "objetivo_ps", "num_pmt", "ods_ps", "actividades",
  "detalles_horario", "habilidades", "modalidad", "lugar_trabajo", "duracion",
  "horas", "tipo_inscripcion", "ruta_maps", "crn", "periodo_academico",
  "fecha_pue", "pregunta_1", "pregunta_2", "pregunta_3", "id_socioformador",
  "carreras"
];

const validateFields = (fields: string[]) => {
  const normalized = fields.map(f => f.trim().toLowerCase());
  return REQUIRED_FIELDS.every(field => normalized.includes(field));
};

interface UploaderButtonProps {
  onClose: () => void;
}

const UploaderButton: React.FC<UploaderButtonProps> = ({ onClose }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    processFile(droppedFile);
  }, []);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    processFile(selectedFile);
  };

  const processFile = (uploadedFile: File | undefined) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!uploadedFile) return;

    const isCSV = uploadedFile.type === 'text/csv';
    const isXLSX = uploadedFile.name.endsWith('.xlsx');

    if (!isCSV && !isXLSX) {
      setErrorMessage("Por favor, selecciona un archivo CSV o XLSX válido.");
      return;
    }

    setFile(uploadedFile);
    setFileName(uploadedFile.name);
  };

  const handleImport = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!file) {
      setErrorMessage("Primero selecciona un archivo válido.");
      return;
    }

    setIsImporting(true);
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target!.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        if (jsonData.length === 0) {
          setErrorMessage("El archivo está vacío.");
          setIsImporting(false);
          return;
        }

        const fields = Object.keys(jsonData[0]);
        const isValid = validateFields(fields);

        if (!isValid) {
          setErrorMessage("El archivo no contiene todos los campos requeridos.");
          setFile(null); 
          setFileName(null);
          setIsImporting(false);
          return;
        }

        for (const record of jsonData) {
          const { data: existing, error: fetchError } = await supabase
            .from('proyectos_solidarios')
            .select('id_proyecto')
            .eq('id_proyecto', record['id_proyecto'])
            .single();

          if (fetchError && fetchError.code !== 'PGRST116') {
            setErrorMessage("Error al verificar duplicados.");
            setIsImporting(false);
            return;
          }

          if (existing) {
            console.log(`Registro duplicado: ${record['id_proyecto']}`);
            continue;
          }

          const { error: insertError } = await supabase
            .from('proyectos_solidarios')
            .insert(record);

          if (insertError) {
            setErrorMessage(`Error al insertar el registro ${record['id_proyecto']}`);
            setIsImporting(false);
            return;
          }
        }

        setSuccessMessage("Archivo importado exitosamente.");
        resetUploader();
      } catch (err) {
        setErrorMessage("Ocurrió un error al procesar el archivo.");
        console.error(err);
      } finally {
        setIsImporting(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const resetUploader = () => {
    setFile(null);
    setFileName(null);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  return (
    <div
      className="w-full max-w-sm h-auto p-6 bg-gray-100 border-2 border-dashed border-gray-400 rounded-2xl text-center flex flex-col items-center justify-center space-y-4"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <img src="/upload.svg" alt="upload" className="h-8 w-8" />
      <p className="text-base font-semibold text-gray-800">Arrastra y suelta para subir</p>
      <p className="text-sm text-gray-600">
        También puedes <label htmlFor="file-upload" className="text-blue-600 font-semibold cursor-pointer">buscar</label> en tu explorador
      </p>
      <input
        id="file-upload"
        type="file"
        accept=".csv,.xlsx"
        className="hidden"
        onChange={handleFileChange}
      />

      {fileName && (
        <p className="text-sm text-green-700 truncate">{fileName}</p>
      )}

      {errorMessage && (
        <div className="text-red-600 text-sm font-medium">{errorMessage}</div>
      )}

      {successMessage && (
        <div className="text-green-600 text-sm font-medium">{successMessage}</div>
      )}

      <div className="flex gap-4 mt-4">
      <button
        onClick={() => {
          resetUploader();
          onClose();
        }}
        className="border border-blue-900 rounded-full px-6 py-2 text-sm font-semibold text-blue-900 hover:bg-blue-50 transition duration-200"
      >
        Cancelar
      </button>

        <button
          onClick={handleImport}
          disabled={!file || isImporting}
          className={`rounded-full px-6 py-2 text-sm font-semibold transition duration-200
            ${file ? 'bg-blue-900 text-white hover:bg-[#3154bb]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          {isImporting ? 'Importando...' : 'Importar'}
        </button>
      </div>
    </div>
  );
};

export default UploaderButton;

