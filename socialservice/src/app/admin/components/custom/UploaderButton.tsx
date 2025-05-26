'use client';

import React, { useCallback, useState } from 'react';
import * as XLSX from 'xlsx';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const requiredFields = ["id_proyecto","cupos", "perfil_aceptacion", "proyecto", "objetivo_ps", "num_pmt", "ods_ps", "actividades", "detalles_horario", "habilidades", "modalidad", "lugar_trabajo", "duracion", "horas", "tipo_inscripcion", "ruta_maps", "crn", "grupo", "clave", "periodo_academico", "fecha_pue", "pregunta_1", "pregunta_2", "pregunta_3", "carreras", "correo"] as const;

// Normaliza los nombres de campos eliminando acentos y convirtiendo a minúsculas
const normalize = (str: string) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "_").toLowerCase();

type RequiredField = typeof requiredFields[number];

type RecordType = {
  [K in RequiredField]?: string | number | null;
};

const validateFields = (fields: string[]): boolean => {
  const normalizedFields = fields.map((field: string) => field.trim().toLowerCase());
  console.log("Campos detectados (normalizados):", normalizedFields);
  console.log("Campos requeridos:", requiredFields);
  return requiredFields.every((field) => normalizedFields.includes(field.toLowerCase()));
};

const filterRequiredFields = (data: any[]): RecordType[] => {
  return data.map((record: any) => {
    const filteredRecord: RecordType = {};
    requiredFields.forEach((field) => {
      // Busca el campo en el registro, normalizando los nombres
      const key = Object.keys(record).find(k => normalize(k) === field);
      filteredRecord[field] = key ? record[key] : null;
    });
    return filteredRecord;
  });
};

const UploaderButton: React.FC<UploaderButtonProps> = ({ onClose }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleFileUpload = async (file: File) => {
    const reader = new FileReader();

    reader.onload = async (event: ProgressEvent<FileReader>) => {
      try {
        const result = event.target?.result;
        if (!result) {
          setErrorMessage("No se pudo leer el archivo.");
          return;
        }
        const data = new Uint8Array(result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        if (!Array.isArray(jsonData) || jsonData.length === 0) {
          setErrorMessage("El archivo está vacío.");
          return;
        }

        const firstRow = jsonData[0] as object;
        const fields = Object.keys(firstRow);
        const normalizedFields = fields.map((field: string) => normalize(field));
        const missingFields = requiredFields.filter((field) => !normalizedFields.includes(field));
        if (missingFields.length > 0) {
          setErrorMessage(`El archivo no contiene todos los campos requeridos. Faltan: ${missingFields.join(", ")}`);
          return;
        }

        const filteredData = filterRequiredFields(jsonData);

        for (const record of filteredData) {
          if (!record.proyecto) {
            setErrorMessage('Error al insertar el registro dado a que el campo "proyecto" está vacío');
            return;
          }
          const { data: existingRecord, error: fetchError } = await supabase
            .from('proyectos_solidarios')
            .select('proyecto')
            .eq('proyecto', record.proyecto)
            .single();

          if (fetchError && fetchError.code !== 'PGRST116') {
            setErrorMessage("Hubo un error al verificar los datos existentes.");
            return;
          }

          if (existingRecord) {
            console.log(`El registro con proyecto ${record.proyecto} ya existe. Se omitirá.`);
            continue;
          }

          const { error: insertError } = await supabase
            .from('proyectos_solidarios')
            .insert(record);

          if (insertError) {
            setErrorMessage(`Error al insertar el registro dado a que el campo "proyecto" es ${record.proyecto}`);
            return;
          }
        }

        setSuccessMessage("Archivo importado exitosamente.");
        // Ya no se limpia el formulario automáticamente, el mensaje permanece hasta que el usuario cancele o cierre
      } catch (err) {
        setErrorMessage("Ocurrió un error al procesar el archivo.");
        console.error(err);
      } finally {
        setIsImporting(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    processFile(droppedFile);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    processFile(selectedFile);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
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
    setIsImporting(true);
    if (!file) return;
    await handleFileUpload(file);
  };

  const resetUploader = () => {
    setFile(null);
    setFileName(null);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  return (
    <div className="w-full max-w-sm h-auto  rounded-2xl text-center flex flex-col items-center justify-center"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="border-2 border-dashed border-blue-900 w-full flex flex-col items-center justify-center space-y-4 hover:bg-blue-50 p-4 rounded-xl">
        <img src="/upload.svg" alt="upload" className="h-8 w-8 text-blue-900" />
        <p className="text-xl font-semibold mb-4 text-blue-900">Arrastra y suelta para subir</p>
        <p className="text-sm text-gray-600">
          También puedes{' '}
          <label htmlFor="file-upload" className="text-blue-600 font-semibold cursor-pointer">
            buscar
          </label>{' '}
          en tu explorador
        </p>
        <p className="text-[11px] text-gray-600">Se aceptan subir archivos .CSV o .XLSX</p>
        {successMessage && (
          <div className="mt-2 text-green-700 text-sm font-semibold">
            {successMessage}
          </div>
        )}
        <input
          id="file-upload"
          type="file"
          accept=".csv,.xlsx"
          className="hidden"
          onChange={handleFileChange}
        />
        {fileName && <p className="text-sm text-green-700 truncate">{fileName}</p>}
      </div>
      <div className= "pt-3">
      {errorMessage && <div className="text-red-600 text-sm font-medium">{errorMessage}</div>}
      {successMessage && <div className="text-green-600 text-sm font-medium">{successMessage}</div>}
      </div>
  
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => {
            resetUploader();
            onClose?.();
          }}
          className="border border-blue-900 rounded-full px-6 py-2 text-sm font-semibold text-blue-900 hover:bg-transparent transition duration-200"
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

interface UploaderButtonProps {
  onClose?: () => void;
}

export default UploaderButton;