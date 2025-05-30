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
        const successfulUploads = [];

        for (const record of filteredData) {
          if (!record.proyecto) {
            setErrorMessage('Error al insertar el registro dado que el campo "proyecto" está vacío');
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

          successfulUploads.push({
            proyecto: record.proyecto,
            correo: record.correo,
            id_proyecto: record.id_proyecto
          });
        }

        // After successful database upload, create users and send emails
        if (successfulUploads.length > 0) {
          try {
            console.log('Attempting to create users for projects:', JSON.stringify(successfulUploads, null, 2));
            
            const response = await fetch('/api/create-users', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify({ projects: successfulUploads }),
            });

            if (!response.ok) {
              const errorText = await response.text();
              console.error('Error response from create-users API:', errorText);
              try {
                const errorJson = JSON.parse(errorText);
                setErrorMessage(`Los proyectos se subieron correctamente pero hubo un error al crear los usuarios: ${errorJson.error || 'Error desconocido'}`);
              } catch (e) {
                setErrorMessage(`Los proyectos se subieron correctamente pero hubo un error al crear los usuarios: ${errorText}`);
              }
              return;
            }

            const result = await response.json();
            console.log('Create users API response:', JSON.stringify(result, null, 2));

            const failedProjects = result.results.filter((r: any) => !r.success);
            if (failedProjects.length > 0) {
              console.error('Failed projects details:', JSON.stringify(failedProjects, null, 2));
              const errorDetails = failedProjects.map((p: any) => 
                `${p.proyecto}: ${p.error}${p.details ? ` (${JSON.stringify(p.details, null, 2)})` : ''}`
              ).join('; ');
              
              setErrorMessage(
                `Los proyectos se subieron correctamente pero hubo errores al crear algunos usuarios: ${errorDetails}`
              );
              return;
            }

            // If we have a summary, show it in the success message
            if (result.summary) {
              const successMessage = `Archivo importado exitosamente. Se crearon ${result.summary.successful} usuarios de ${result.summary.total} proyectos.`;
              console.log('Success message:', successMessage);
              setSuccessMessage(successMessage);
            } else {
              setSuccessMessage("Archivo importado exitosamente y usuarios creados.");
            }
          } catch (err) {
            console.error('Error calling create-users API:', err instanceof Error ? err.stack : err);
            setErrorMessage(
              `Los proyectos se subieron correctamente pero hubo un error al crear los usuarios: ${
                err instanceof Error ? err.message : 'Error desconocido'
              }`
            );
            return;
          }
        } else {
          console.log('No projects to create users for');
          setSuccessMessage("Archivo importado exitosamente (no se crearon usuarios).");
        }
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