"use client";

import React, { useCallback, useState } from "react";

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
        onFileUpload(file);
      } else {
        alert("Por favor, sube un archivo en formato CSV o XLSX.");
      }
    },
    [onFileUpload]
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === "text/csv" || file.name.endsWith(".xlsx"))) {
      setFileName(file.name);
      onFileUpload(file);
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