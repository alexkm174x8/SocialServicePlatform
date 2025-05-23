"use client";

import React, { useCallback, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import * as XLSX from 'xlsx';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const validateFields = (fields) => {
  const requiredFields = [ "perfil_aceptacion", "proyecto", "grupo", "clave"];
  const normalizedFields = fields.map((field) => field.trim().toLowerCase());
  console.log("Campos detectados (normalizados):", normalizedFields);
  console.log("Campos requeridos:", requiredFields);
  return requiredFields.every((field) => normalizedFields.includes(field.toLowerCase()));
};

const filterRequiredFields = (data) => {
  const requiredFields = [ "perfil_aceptacion", "proyecto", "grupo", "clave"];
  return data.map((record) => {
    const filteredRecord = {};
    requiredFields.forEach((field) => {
      filteredRecord[field] = record[field];
    });
    return filteredRecord;
  });
};

const handleFileUpload = async (file) => {
  const reader = new FileReader();

  reader.onload = async (event) => {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    if (jsonData.length === 0) {
      alert("El archivo está vacío.");
      return;
    }

    const fields = Object.keys(jsonData[0]);
    console.log("Campos detectados en el archivo:", fields);
    if (!validateFields(fields)) {
      alert("El archivo no contiene todos los campos requeridos.");
      return;
    }

    const filteredData = jsonData.map((row) => {
      const { id_proyecto, perfil_aceptacion, proyecto, grupo, clave } = row;
      return { id_proyecto, perfil_aceptacion, proyecto, grupo, clave };
    });

    try {
      for (const record of filteredData) {
        const { data: existingRecord, error: fetchError } = await supabase
          .from('proyectos_solidarios')
          .select('id_proyecto')
          .eq('id_proyecto', record.id_proyecto)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // Ignore "no rows found" error
          console.error("Error al verificar existencia del registro:", fetchError);
          alert("Hubo un error al verificar los datos existentes.");
          return;
        }

        if (existingRecord) {
          console.log(`El registro con id_proyecto ${record.id_proyecto} ya existe. Se omitirá.`);
          continue;
        }

        const { error: insertError } = await supabase
          .from('proyectos_solidarios')
          .insert(record);

        if (insertError) {
          console.error("Error al insertar el registro:", insertError);
          alert(`Hubo un error al insertar el registro con id_proyecto ${record.id_proyecto}.`);
          return;
        }
      }

      alert("Datos subidos exitosamente.");
    } catch (err) {
      console.error("Error al procesar el archivo:", err);
      alert("Hubo un error al procesar el archivo.");
    }
  };

  reader.readAsArrayBuffer(file);
};

interface UploadBoxProps {
  onFileUpload: (file: File) => void;
}

const UploadBox: React.FC<UploadBoxProps> = ({ onFileUpload }) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (file && (file.type === "text/csv" || file.name.endsWith(".xlsx"))) {
        setFileName(file.name);
        handleFileUpload(file);
      } else {
        alert("Por favor, sube un archivo en formato CSV o XLSX.");
      }
    },
    []
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === "text/csv" || file.name.endsWith(".xlsx"))) {
      setFileName(file.name);
      handleFileUpload(file);
    } else {
      alert("Por favor, selecciona un archivo en formato CSV o XLSX.");
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div
      className="w-full max-w-sm h-52 p-4 bg-gray-100 border-2 border-dashed border-gray-400 rounded-2xl text-center flex flex-col justify-center"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="flex flex-col items-center space-y-1">
        <img
          src="/upload.svg"
          alt="Ícono de subir archivo"
          className="h-8 w-8 text-gray-600"
        />
        <p className="text-base font-semibold text-gray-800">Arrastra y suelta para subir</p>
        <p className="text-sm text-gray-600">
          También puedes <label htmlFor="file-upload" className="text-blue-600 font-semibold cursor-pointer">buscar</label> en tu explorador de archivos
        </p>
        <p className="text-xs text-gray-500">Formatos permitidos: CSV o XLSX</p>
        <input
          id="file-upload"
          type="file"
          accept=".csv, .xlsx"
          className="hidden"
          onChange={handleFileChange}
        />
        {fileName && (
          <p className="mt-2 text-sm text-green-600 font-medium truncate max-w-[90%]">
            {fileName}
          </p>
        )}
      </div>
    </div>
  );
};

export default UploadBox;