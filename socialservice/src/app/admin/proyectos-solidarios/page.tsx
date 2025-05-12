"use client";

import { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import { HeaderBarAdmin } from "@/app/components/HeaderBarAdmin";
import { SearchBar } from "@/app/components/SearchBar";
import { FilterButton } from "@/app/components/FilterButton";
import { ListItem } from "@/app/components/ListItem";
import { SideBar } from "@/app/admin/components/custom/AdminSideBar";
import { FolderOpen } from "lucide-react";
import UploaderButton from "@/app/admin/components/custom/UploaderButton";
import DownloadModal from '@/app/admin/components/custom/DownloadModal';
import { Trash2 } from "lucide-react";
import { DetailButton } from "@/app/components/DetailButton";

type Explorar = {
  subido: string;
  estatus: string;
  perfil: string;
  grupo: string;
  clave: string;
  proyecto: string;
  representante: string;
  contacto: string;
  manejar: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Key must be provided. Please check your environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default function Explorar() {
  const [search, setSearch] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [explorar, setExplorar] = useState<Explorar[]>([]);
  const [isUploaderVisible, setIsUploaderVisible] = useState(false);
  const [isDownloadModalVisible, setIsDownloadModalVisible] = useState(false);
  const [filterEstado, setFilterEstado] = useState<string[]>([]);

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const { data, error } = await supabase
          .from('proyectos_solidarios')
          .select(`id_proyecto, perfil_aceptacion, proyecto, grupo, clave, id_socioformador, socioformador ( correo )`);

        if (error) {
          throw error;
        }

        const formattedData = data.map((item) => ({
          subido: new Date().toISOString(), // Placeholder for "subido"
          estatus: 'Pendiente', // Placeholder for "estatus"
          perfil: item.perfil_aceptacion,
          grupo: item.grupo,
          clave: item.clave,
          proyecto: item.proyecto,
          contacto: item.socioformador?.correo || 'N/A', // Use correo from socioformador or fallback to 'N/A'
          representante: 'N/A', // Placeholder for "representante"
          manejar: 'N/A', // Placeholder for "manejar"
        }));
        setExplorar(formattedData);
      } catch (error) {
        console.error('Error fetching proyectos_solidarios:', error.message || error);
      }
    };

    fetchProyectos();
  }, []);

  const handleFileUpload = (file: File) => {
    console.log("Archivo recibido:", file);
  };

  const filtered = explorar.filter((s) => {
    const searchTerm = search.toLowerCase();
    const matchesSearch =
      s.subido.toLowerCase().includes(searchTerm) ||
      s.perfil.toLowerCase().includes(searchTerm) ||
      s.grupo.toLowerCase().includes(searchTerm) ||
      s.clave.toLowerCase().includes(searchTerm) ||
      s.proyecto.toLowerCase().includes(searchTerm) ||
      s.representante.toLowerCase().includes(searchTerm) ||
      s.contacto.toLowerCase().includes(searchTerm) ||
      s.manejar.toLowerCase().includes(searchTerm);

    const matchesEstado =
      filterEstado.length === 0 || filterEstado.includes(s.estatus);

    return matchesSearch && matchesEstado;
  });

  return (
    <>
      <SideBar />
      <HeaderBarAdmin titulo="Proyectos solidarios" Icono={FolderOpen} />

      <main className={`transition-all mt-20 ml-30 mr-10`}>
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <SearchBar
            search={search}
            setSearch={setSearch}
            onSearchApply={() => {}}
            onSearchClear={() => setSearch("")}
          />
          <div className="flex items-center gap-6">
            <button
              className="border border-gray-600 text-gray-500 font-semibold rounded-full px-4 py-1 text-sm hover:bg-gray-300 transition"
              onClick={() => {
                setFilterEstado([]);
                setSearch("");
              }}
            >
              <Trash2 className="w-5 h-5" />
            </button>

            <FilterButton
              label="Estado"
              options={["Abierto", "En Revisión", "Cerrado", "Pendiente"]}
              selectedValues={filterEstado}
              onChange={setFilterEstado}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <DetailButton
            texto="Importar"
            size="auto"
            onClick={() => setIsUploaderVisible(true)}
          />
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
          <ListItem data={filtered} />
        </div>
      </main>
    </>
  );
}