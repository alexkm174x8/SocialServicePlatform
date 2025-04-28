"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import clsx from "clsx";

type Entry = {
  matricula: string;
  correo: string;
  carrera: string;
  status: "accepted" | "rejected";
};

export default function UploadInscripciones() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [data, setData] = useState<Entry[]>([]); // ← dynamic data here

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);

      // Example logic to populate data for now:
      // Replace this with CSV/XLSX parsing later
      setData([
        { matricula: "A01736897", correo: "A01736897@tec.com", carrera: "ITC", status: "accepted" },
        { matricula: "A01736897", correo: "A01736897@tec.com", carrera: "IRS", status: "accepted" },
        { matricula: "A01736897", correo: "A01736897@tec.com", carrera: "IRS", status: "rejected" },
      ]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);

      // Simulated data on drop (same as above)
      setData([
        { matricula: "A01736897", correo: "A01736897@tec.com", carrera: "IC", status: "rejected" },
        { matricula: "A01736897", correo: "A01736897@tec.com", carrera: "IRS", status: "accepted" },
      ]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="p-6 w-full max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-left text-blue-900">Subir inscripciones</h2>
        <X className="w-6 h-6 text-gray-600 cursor-pointer" />
      </div>

      <div className="flex justify-center items-center py-10">
        <div
          className="w-full max-w-3xl h-52 p-4 bg-gray-100 border-2 border-dashed border-gray-400 rounded-2xl text-center flex flex-col justify-center"
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
              También puedes{" "}
              <label htmlFor="file-upload" className="text-blue-600 font-semibold cursor-pointer">
                buscar
              </label>{" "}
              en tu explorador de archivos
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
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-green-500 rounded" />{" "}
          <span className="text-sm font-semibold">Aceptadx</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-red-500 rounded" />{" "}
          <span className="text-sm font-semibold">No aceptadx</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-t">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 px-3"> </th>
              <th className="py-2 px-3">Matrícula</th>
              <th className="py-2 px-3">Correo</th>
              <th className="py-2 px-3">Carrera</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, index) => (
              <tr key={index} className="border-b">
                <td className="py-2 px-3">
                  <div
                    className={clsx("w-4 h-4 rounded", {
                      "bg-green-500": entry.status === "accepted",
                      "bg-red-500": entry.status === "rejected",
                    })}
                  />
                </td>
                <td className="py-2 px-3">{entry.matricula}</td>
                <td className="py-2 px-3">{entry.correo}</td>
                <td className="py-2 px-3">{entry.carrera}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}