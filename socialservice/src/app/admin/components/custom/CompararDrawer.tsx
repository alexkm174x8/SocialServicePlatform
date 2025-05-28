"use client";

import React, { useCallback, useState, useEffect } from "react";
import { X } from "lucide-react";
import * as XLSX from "xlsx";

interface CompararDrawerProps {
  open: boolean;
  onClose: () => void;
  onComparar: (matriculas: string[]) => void;
}

const CompararDrawer: React.FC<CompararDrawerProps> = ({
  open,
  onClose,
  onComparar,
}) => {
  const [matriculas, setMatriculas] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 💡 Este efecto reinicia los estados cuando se cierra el drawer
  useEffect(() => {
    if (!open) {
      setMatriculas([]);
      setFileName(null);
      setErrorMessage(null);
    }
  }, [open]);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const result = event.target?.result;
      if (!result) {
        setErrorMessage("No se pudo leer el archivo.");
        return;
      }
      const data = new Uint8Array(result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      const foundMatriculas = (jsonData as any[])
        .map((row) => row["matricula"] || row["Matrícula"] || row["MATRICULA"])
        .filter((m) => typeof m === "string" && m.trim() !== "");

      if (foundMatriculas.length === 0) {
        setErrorMessage("No se encontraron valores en la columna 'matricula'.");
        return;
      }

      setMatriculas(foundMatriculas);
      setErrorMessage(null);
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

  const processFile = (file?: File) => {
    setMatriculas([]);
    setErrorMessage(null);
    setFileName(null);
    if (!file) return;
    const isCSV = file.type === "text/csv";
    const isXLSX = file.name.endsWith(".xlsx");
    if (!isCSV && !isXLSX) {
      setErrorMessage("Solo se aceptan archivos .CSV o .XLSX");
      return;
    }
    setFileName(file.name);
    handleFileUpload(file);
  };

  const resetAndClose = () => {
  setMatriculas([]);
  setFileName(null);
  setErrorMessage(null);
  onClose(); // 👈 Esto es el que cierra realmente
};


  return (
    <div
      className={`fixed top-0 right-0 h-full w-[95%] max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ${
        open ? "translate-x-0" : "-translate-x-full"
      } border border-blue-900 rounded-r-2xl`}
    >
      {/* Encabezado */}
      <div className="flex justify-between items-center border-b p-4 bg-[#0a2170] text-white rounded-tr-2xl">
        <h2 className="text-lg font-semibold">Subir No Inscritxs</h2>
        <button onClick={resetAndClose} className="hover:text-red-300">
          <X className="h-6 w-6" />
        </button>

      </div>

      {/* Contenido */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="p-4 flex flex-col gap-4"
      >
        {/* Área para subir archivos */}
        <div className="border-2 border-dashed border-blue-900 p-6 rounded-xl flex flex-col items-center justify-center text-center space-y-2 bg-blue-50">
          <img src="/upload.svg" alt="upload" className="h-8 w-8 text-blue-900" />
          <p className="text-xl font-semibold mb-4 text-blue-900">Arrastra y suelta para subir</p>
          <p className="text-sm text-gray-600">
            También puedes{" "}
            <label htmlFor="file-upload" className="text-blue-600 font-semibold cursor-pointer">
              buscar
            </label>{" "}
            en tu explorador
          </p>
          <p className="text-[11px] text-gray-600">Se aceptan subir archivos .CSV o .XLSX</p>
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
        </div>

        {/* Lista de matrículas */}
        <div>
          <p className="font-bold text-xl text-[#0a2170] mb-1">
            Matrículas encontradas:
          </p>
          {matriculas.length === 0 ? (
            <p className="text-gray-400 text-sm">No hay matrículas cargadas</p>
          ) : (
            <ul className="max-h-[300px] overflow-y-auto mt-2 text-md list-disc pl-4">
              {matriculas.map((mat, i) => (
                <li key={i}>{mat}</li>
              ))}
            </ul>
          )}
        </div>

        {errorMessage && (
          <div className="text-red-600 text-sm font-medium">{errorMessage}</div>
        )}

        {/* Botón de acción */}
        <button
          onClick={() => onComparar(matriculas)}
          disabled={matriculas.length === 0}
          className="mt-4 w-full bg-[#0a2170] hover:bg-[#00144d] text-white font-semibold py-2 px-4 rounded-full transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Comparar y actualizar estados
        </button>
      </div>
    </div>
  );
};

export default CompararDrawer;
