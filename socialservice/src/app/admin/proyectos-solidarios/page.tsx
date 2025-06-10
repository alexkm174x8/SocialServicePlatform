"use client";

import { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import { HeaderBarAdmin } from "@/app/components/HeaderBarAdmin";
import { SearchBar } from "@/app/components/SearchBar";
import { FilterButton } from "@/app/components/FilterButton";
import { ListItem } from "@/app/components/ListItem";
import { SideBar } from "@/app/admin/components/custom/AdminSideBar";
import { FolderOpen, Trash2 } from "lucide-react";
import UploaderButton from "@/app/admin/components/custom/UploaderButton";
import DownloadModal from '@/app/admin/components/custom/DownloadModal';
import { DetailButton } from "@/app/components/DetailButton";
import { LogOutModal } from "@/app/components/LogOutModal";

type Explorar = {
  id_proyecto: number;
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
          id_proyecto: item.id_proyecto,
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

  const handleDeleteAll = async () => {
    setIsDeleting(true);
    try {
      // Delete in correct order to maintain referential integrity
      // 1. First delete all postulaciones
      const { error: postulacionesError } = await supabase
        .from('postulacion')
        .delete()
        .neq('id_proyecto', 0); // Delete all rows

      if (postulacionesError) throw postulacionesError;

      // 2. Then delete all socioformador entries
      const { error: socioformadorError } = await supabase
        .from('socioformador')
        .delete()
        .neq('id_proyecto', 0); // Delete all rows

      if (socioformadorError) throw socioformadorError;

      // 3. Finally delete all proyectos_solidarios
      const { error: proyectosError } = await supabase
        .from('proyectos_solidarios')
        .delete()
        .neq('id_proyecto', 0); // Delete all rows

      if (proyectosError) throw proyectosError;

      // Refresh the data
      setExplorar([]);
      alert('Todos los proyectos y datos relacionados han sido eliminados exitosamente.');
    } catch (error) {
      console.error('Error deleting data:', error);
      alert('Error al eliminar los datos. Por favor intenta de nuevo.');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteProject = async (id: number) => {
    try {
      // Delete in correct order to maintain referential integrity
      // 1. First delete all postulaciones for this project
      const { error: postulacionesError } = await supabase
        .from('postulacion')
        .delete()
        .eq('id_proyecto', id);

      if (postulacionesError) throw postulacionesError;

      // 2. Then delete the socioformador entry for this project
      const { error: socioformadorError } = await supabase
        .from('socioformador')
        .delete()
        .eq('id_proyecto', id);

      if (socioformadorError) throw socioformadorError;

      // 3. Finally delete the proyecto_solidario
      const { error: proyectosError } = await supabase
        .from('proyectos_solidarios')
        .delete()
        .eq('id_proyecto', id);

      if (proyectosError) throw proyectosError;

      // Update the local state
      setExplorar(prev => prev.filter(proj => proj.id_proyecto !== id));
      alert('Proyecto eliminado exitosamente.');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error al eliminar el proyecto. Por favor intenta de nuevo.');
      throw error; // Re-throw to be handled by the ListItem component
    }
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

        <div className="flex gap-4 mb-4">
          <DetailButton
            texto="Subir proyectos"
            size="auto"
            color="blue"
            id={0}
            onClick={() => setIsUploaderVisible(true)}
          />
          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-8 py-[6px] rounded-full flex items-center justify-center leading-tight transition duration-200"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Eliminar todos los proyectos
          </button>
        </div>

        {showDeleteModal && (
          <LogOutModal
            title="Eliminar todos los proyectos"
            message="¿Estás seguro que deseas eliminar todos los proyectos y sus datos relacionados? Esta acción no se puede deshacer."
            confirmText={isDeleting ? "Eliminando..." : "Eliminar todo"}
            cancelText="Cancelar"
            onConfirm={handleDeleteAll}
            onCancel={() => setShowDeleteModal(false)}
          />
        )}

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
          <ListItem data={filtered} onDelete={handleDeleteProject} />
        </div>
      </main>
    </>
  );
}