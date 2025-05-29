"use client";

import { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import { HeaderBarSocio } from "@/app/components/HeaderBarSocio";
import { SearchBar } from "@/app/components/SearchBar";
import { FilterButton } from "@/app/components/FilterButton";
import { ListItem } from "@/app/components/ListItem";
import { Inbox} from "lucide-react";
import UploaderButton from "@/app/admin/components/custom/UploaderButton";
import Download from '@/app/socio/components/custom/Download';
import { Trash2 } from "lucide-react";
import {DetailButton} from "@/app/components/DetailButton";
import { Lista } from "@/app/components/Lista";
import { useRouter } from 'next/navigation';


type Solicitud = {
  estatus: string;
  matricula: string;
  email: string;
  carrera: string;
  numero: string;
  respuesta_1: string;
  respuesta_2: string;
  respuesta_3: string;
  id_proyecto?: number;
  proyecto?: string; // Título del proyecto
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Key must be provided. Please check your environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default function Solicitudes() {
  const router = useRouter();
  const [socioCorreo, setSocioCorreo] = useState<string | null>(null); // Ahora el correo viene de la sesión
  const [search, setSearch] = useState("");
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [filterCarrera, setFilterCarrera] = useState<string[]>([]);
  const [filterEstado, setFilterEstado] = useState<string[]>([]);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [solicitudesOriginal, setSolicitudesOriginal] = useState<Solicitud[]>([]); // Para comparar cambios
  const [proyectosSocio, setProyectosSocio] = useState<number[]>([]); // IDs de proyectos del socio

  // Verificar autenticación y redirigir si es necesario
  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        router.replace('/loginS');
        return;
      }
      if (!data.user.user_metadata?.id_proyecto) {
        router.replace('/loginS');
        return;
      }
    };
    checkAuth();
  }, [router]);

  // Obtener el correo del usuario autenticado
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error obteniendo usuario autenticado:', error.message);
        return;
      }
      setSocioCorreo(data?.user?.email || null);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!socioCorreo) return; // Esperar a tener el correo
    const fetchProyectosSocio = async () => {
      const { data: socioData, error: errorSocio } = await supabase
        .from('socioformador')
        .select('id_proyecto')
        .eq('correo', socioCorreo);
      if (errorSocio) {
        console.error('Error obteniendo proyectos del socio:', errorSocio.message);
        return;
      }
      const ids = socioData?.map((row) => row.id_proyecto) || [];
      setProyectosSocio(ids);
      return ids;
    };

    const fetchProyectos = async (ids: number[]) => {
      try {
        const { data: postulaciones, error: errorPostulaciones } = await supabase
          .from('postulacion')
          .select(`estatus, matricula, email, carrera, numero, respuesta_1, respuesta_2, respuesta_3, id_proyecto`)
          .in('id_proyecto', ids);

        if (errorPostulaciones) {
          throw errorPostulaciones;
        }

        const { data: proyectos, error: errorProyectos } = await supabase
          .from('proyectos_solidarios')
          .select(`id_proyecto, proyecto`)
          .in('id_proyecto', ids);

        if (errorProyectos) {
          throw errorProyectos;
        }

        const formattedData = postulaciones.map((item) => {
          const proyectoMatch = proyectos.find((p) => p.id_proyecto === item.id_proyecto);
          return {
            estatus: item.estatus,
            matricula: item.matricula,
            email: item.email,
            carrera: item.carrera,
            numero: item.numero,
            respuesta_1: item.respuesta_1,
            respuesta_2: item.respuesta_2,
            respuesta_3: item.respuesta_3,
            id_proyecto: item.id_proyecto,
            proyecto: proyectoMatch ? proyectoMatch.proyecto : undefined,
          };
        });
        setSolicitudes(formattedData);
        setSolicitudesOriginal(formattedData);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching proyectos_solidarios:', error.message);
        } else {
          console.error('Error fetching proyectos_solidarios:', error);
        }
      }
    };

    fetchProyectosSocio().then((ids) => {
      if (ids && ids.length > 0) {
        fetchProyectos(ids);
      } else {
        setSolicitudes([]);
        setSolicitudesOriginal([]);
      }
    });
  }, [socioCorreo]);
   
  const filtered = solicitudes.filter((s) => {
    const searchTerm = search.toLowerCase();
    const matchesSearch =
    (s.estatus?.toLowerCase().includes(searchTerm) || false) ||
    (s.matricula?.toLowerCase().includes(searchTerm) || false) ||
    (s.email?.toLowerCase().includes(searchTerm) || false) ||
    (s.carrera?.toLowerCase().includes(searchTerm) || false) ||
    (s.numero?.toLowerCase().includes(searchTerm) || false) ||
    (s.respuesta_1?.toLowerCase().includes(searchTerm) || false) ||
    (s.respuesta_2?.toLowerCase().includes(searchTerm) || false) ||
    (s.respuesta_3?.toLowerCase().includes(searchTerm) || false);

    const matchesCarrera =
      filterCarrera.length === 0 || filterCarrera.includes(s.carrera);

      const matchesEstado =
      filterEstado.length === 0 || filterEstado.includes(s.estatus);

    return matchesSearch && matchesCarrera && matchesEstado;
  });

  // Enviar los cambios de estatus a la base de datos
  const handleEnviar = async () => {
    try {
      const updates = solicitudes.filter((s, idx) => s.estatus !== solicitudesOriginal[idx]?.estatus);
      for (const solicitud of updates) {
        await supabase
          .from('postulacion')
          .update({ estatus: solicitud.estatus })
          .eq('matricula', solicitud.matricula)
          .eq('id_proyecto', solicitud.id_proyecto);
      }
      setSolicitudesOriginal([...solicitudes]);
      alert('Estados actualizados correctamente.');
    } catch (error) {
      alert('Error al actualizar los estados.');
      console.error(error);
    }
  };

  return (
    <>
      <HeaderBarSocio
        proyecto="Special Olympics"
      />

     <main className="mt-28 px-15">
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
                     setFilterCarrera([]);
                     setSearch("");
                   }}
                 >
                  Limpiar filtros
                 </button>
     
                 <FilterButton
                   label="Carrera"
                   options={[...new Set(solicitudes.map((s) => s.carrera))]}
                   selectedValues={filterCarrera}
                   onChange={setFilterCarrera}
                 />
     
                 <FilterButton
                   label="Estado"
                   options={[...new Set(solicitudes.map((s) => s.estatus))]}
                   selectedValues={filterEstado}
                   onChange={setFilterEstado}
                 />
                  </div>
             </div>
     
             <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
               <div className="flex items-center gap-4">
                 <DetailButton texto="Enviar" size="auto" color="blue" id={0} onClick={handleEnviar} />
                 <DetailButton texto="Descargar" size="auto" color="blue" id={1} onClick={() => setIsDownloadModalOpen(true)} />
               </div>
     
               <div className="flex flex-wrap gap-4 items-center text-sm">
                 <div className="flex items-center gap-1">
                   <div className="w-4 h-4 rounded bg-green-700" />
                   <span className="text-[#001C55] font-medium">Aceptadx por el alumnx</span>
                 </div>
                 <div className="flex items-center gap-1">
                   <div className="w-4 h-4 rounded bg-green-500" />
                   <span className="text-[#001C55] font-medium">Aceptadx</span>
                 </div>
                 <div className="flex items-center gap-1">
                   <div className="w-4 h-4 rounded bg-orange-400" />
                   <span className="text-[#001C55] font-medium">Declinadx por el alumnx</span>
                 </div>
                 <div className="flex items-center gap-1">
                   <div className="w-4 h-4 rounded bg-red-500" />
                   <span className="text-[#001C55] font-medium">No aceptadx</span>
                 </div>
                 <div className="flex items-center gap-1">
                   <div className="w-4 h-4 rounded bg-indigo-400" />
                   <span className="text-[#001C55] font-medium">En revisión</span>
                 </div>
                 <div className="flex items-center gap-1">
                   <div className="w-4 h-4 rounded bg-black" />
                   <span className="text-[#001C55] font-medium">No inscritx</span>
                 </div>
               </div>
             </div>
     
             <div className="rounded-lg">
             <Lista data={filtered} setData={setSolicitudes} />
             </div>
           </main>

           {isDownloadModalOpen && (
             <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
               <Download onClose={() => setIsDownloadModalOpen(false)} />
             </div>
           )}
         </>
       );
     }