"use client";

import { useState } from "react";
import { HeaderBar } from "@/app/components/HeaderBar";
import { SearchBar } from "@/app/components/SearchBar";
import { FilterButton } from "@/app/components/FilterButton";
import { ListItem } from "@/app/components/ListItem";
import { SideBar } from "@/app/admin/components/custom/AdminSideBar";
import { Inbox} from "lucide-react";
import UploaderButton from "@/app/admin/components/custom/UploaderButton";
import DownloadModal from '@/app/admin/components/custom/DownloadModal';

const mockCards = [1, 2, 3, 4, 5, 6, 7, 8];

export default function Explorar() {
  const [search, setSearch] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUploaderVisible, setIsUploaderVisible] = useState(false);
  const [isDownloadModalVisible, setIsDownloadModalVisible] = useState(false);

  const handleFileUpload = (file: File) => {
    console.log("Archivo recibido:", file);
    // Aquí puedes hacer algo con el archivo
  };

  return (
    <>
      <SideBar/>
      <HeaderBar
        titulo="Solicitudes de alumnos" 
        Icono={Inbox}
      />
      <main className={`transition-all mt-20  ml-30 mr-10`} >
        <SearchBar search={search} setSearch={setSearch} />

        <div className="flex flex-wrap justify-evenly gap-4 mb-6">
          <button
            className={`
              bg-blue-400 hover:bg-blue-900
              text-white font-semibold text-lg
              px-12 py-[12px] 
              rounded-full
              flex items-center justify-center
              leading-tight  
              transition duration-200`}
            onClick={() => setIsUploaderVisible(true)}
          >
            Subir
          </button>
          <button
            className={`
              bg-blue-400 hover:bg-blue-900
              text-white font-semibold text-lg
              px-12 py-[12px] 
              rounded-full
              flex items-center justify-center
              leading-tight  
              transition duration-200`}
            onClick={() => setIsDownloadModalVisible(true)}
          >
            Descargar 
          </button>
          <button
            className="border border-gray-600 text-gray-500 font-semibold rounded-full px-4 py-1 text-sm hover:bg-gray-300 transition"
            onClick={() => console.log("Limpiar filtros")}
          >
            Limpiar todo
          </button>
          {["Modalidad", "Disponibilidad"].map((label) => (
            <FilterButton key={label} label={label} />
          ))}
        </div>

        {isUploaderVisible && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setIsUploaderVisible(false)}
          >
            <div
              className="bg-white p-6 rounded-lg shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                onClick={() => setIsUploaderVisible(false)}
              >
                X
              </button>
              <UploaderButton onFileUpload={handleFileUpload} />
            </div>
          </div>
        )}

        {isDownloadModalVisible && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setIsDownloadModalVisible(false)}
          >
            <div
              className="bg-white p-6 rounded-lg shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                onClick={() => setIsDownloadModalVisible(false)}
              >
                X
              </button>
              <DownloadModal />
            </div>
          </div>
        )}

        <div className="align-items justify-center">
          <ListItem/>
        </div>
      </main>
    </>
  );
}