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
  // nuevos campos
  cupos: string;
  objetivo_ps: string;
  num_pmt: string;
  ods_ps: string;
  actividades: string;
  detalles_horario: string;
  habilidades: string;
  modalidad: string;
  lugar_trabajo: string;
  duracion: string;
  horas: string;
  tipo_inscripcion: string;
  ruta_maps: string;
  crn: string;
  periodo_academico: string;
  fecha_pue: string;
  pregunta_1: string;
  pregunta_2: string;
  pregunta_3: string;
  id_socioformador: string;
  carreras: string;
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
          .select(`*`);

        if (error) {
          throw error;
        }

        const formattedData = data.map((item) => ({
          subido: new Date().toISOString(),
          estatus: "Activo",
          representante: item.responsable || "N/A",
          manejar: "Ver detalles",
          cupos: item.cupos,
          perfil: item.perfil_aceptacion,
          proyecto: item.proyecto,
          contacto: item.socioformador?.correo || 'N/A',
          objetivo_ps: item.objetivo_ps,
          num_pmt: item.num_pmt,
          ods_ps: item.ods_ps,
          actividades: item.actividades,
          detalles_horario: item.detalles_horario,
          habilidades: item.habilidades,
          modalidad: item.modalidad,
          lugar_trabajo: item.lugar_trabajo,
          duracion: item.duracion,
          horas: item.horas,
          tipo_inscripcion: item.tipo_inscripcion,
          ruta_maps: item.ruta_maps,
          crn: item.crn,
          grupo: item.grupo,
          clave: item.clave,
          periodo_academico: item.periodo_academico,
          fecha_pue: item.fecha_pue,
          pregunta_1: item.pregunta_1,
          pregunta_2: item.pregunta_2,
          pregunta_3: item.pregunta_3,
          id_socioformador: item.id_socioformador,
          carreras: item.carreras,
        }));
        setExplorar(formattedData);
      } catch (error) {
        console.error('Error fetching proyectos_solidarios:', error instanceof Error ? error.message : String(error));
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
      s.cupos.toLowerCase
      s.perfil.toLowerCase().includes(searchTerm) ||
      s.proyecto.toLowerCase().includes(searchTerm) ||
      s.contacto.toLowerCase().includes(searchTerm) ||
      s.objetivo_ps.toLowerCase().includes(searchTerm) ||
      s.num_pmt.toLowerCase().includes(searchTerm) ||
      s.ods_ps.toLowerCase().includes(searchTerm) ||
      s.actividades.toLowerCase().includes(searchTerm) ||
      s.detalles_horario.toLowerCase().includes(searchTerm) ||
      s.habilidades.toLowerCase().includes(searchTerm) ||
      s.modalidad.toLowerCase().includes(searchTerm) ||
      s.lugar_trabajo.toLowerCase().includes(searchTerm) ||
      s.duracion.toLowerCase().includes(searchTerm) ||
      s.horas.toLowerCase().includes(searchTerm) ||
      s.tipo_inscripcion.toLowerCase().includes(searchTerm) ||
      s.ruta_maps.toLowerCase().includes(searchTerm) ||
      s.crn.toLowerCase().includes(searchTerm) ||
      s.grupo.toLowerCase().includes(searchTerm) ||
      s.clave.toLowerCase().includes(searchTerm) ||
      s.periodo_academico.toLowerCase().includes(searchTerm) ||
      s.fecha_pue.toLowerCase().includes(searchTerm) ||
      s.pregunta_1.toLowerCase().includes(searchTerm) ||
      s.pregunta_2.toLowerCase().includes(searchTerm) ||
      s.pregunta_3.toLowerCase().includes(searchTerm) ||
      s.id_socioformador.toLowerCase().includes(searchTerm) ||
      s.carreras.toLowerCase().includes(searchTerm);

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
              Limpiar filtros
            </button>

            <FilterButton
              label="Estado"
              options={["Abierto", "En Revisión", "Cerrado", "Pendiente"]}
              selectedValues={filterEstado}
              onChange={setFilterEstado}
            />
          </div>
        </div>

        <div className="">
          <DetailButton
            texto="Subir proyectos"
            size="auto"
            color="blue"
            id={0}
            onClick={() => setIsUploaderVisible(true)}
          />
        </div>

        {isUploaderVisible && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setIsUploaderVisible(false)}  // Aquí usas onClick para cerrar
          >
            <div
              className="bg-white p-6 rounded-lg shadow-lg"
              onClick={(e) => e.stopPropagation()} // Evita cerrar al hacer clic dentro
            >
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                onClick={() => setIsUploaderVisible(false)}
              >
                X
              </button>
              {/* Aquí sí pasas el onClose esperado */}
              <UploaderButton onClose={() => setIsUploaderVisible(false)} />
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