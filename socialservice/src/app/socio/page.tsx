"use client";

import { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import { HeaderBarSocio } from "@/app/components/HeaderBarSocio";
import { SearchBar } from "@/app/components/SearchBar";
import { FilterButton } from "@/app/components/FilterButton";
import Download from '@/app/socio/components/custom/Download';
import {DetailButton} from "@/app/components/DetailButton";
import { ListaSocio } from "@/app/components/ListaSocio";
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
  modificado?: boolean;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Key must be provided. Please check your environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default function Solicitudes() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [socioCorreo, setSocioCorreo] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [filterCarrera, setFilterCarrera] = useState<string[]>([]);
  const [filterEstado, setFilterEstado] = useState<string[]>([]);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [mensajeVisible, setMensajeVisible] = useState(false);
  const [solicitudesOriginal, setSolicitudesOriginal] = useState<Solicitud[]>([]); // Para comparar cambios
  const [proyectosSocio, setProyectosSocio] = useState<number[]>([]); // IDs de proyectos del socio
  const [nombreProyecto, setNombreProyecto] = useState<string>("");


  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [cuposRestantes, setCuposRestantes] = useState<number | null>(null);



const showToast = (msg: string) => {
  setToastMessage(msg);
  setTimeout(() => setToastMessage(null), 4000);
};


  // Single auth check effect
  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session?.user?.user_metadata?.id_proyecto) {
          if (mounted) {
            // Clear any existing session data
            await supabase.auth.signOut();
            sessionStorage.removeItem('projectInfo');
            router.push('/loginS');
          }
          return;
        }

        if (mounted) {
          setSocioCorreo(session.user.email || null);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        if (mounted) {
          router.push('/loginS');
        }
      }
    };

    checkAuth();

    // Cleanup function
    return () => {
      mounted = false;
    };
  }, [router]);

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
      // Si solo hay un proyecto, obtener el nombre
      if (ids.length === 1) {
        const { data: proyectoData, error: errorProyecto } = await supabase
          .from('proyectos_solidarios')
          .select('proyecto')
          .eq('id_proyecto', ids[0])
          .single();
        if (!errorProyecto && proyectoData) {
          setNombreProyecto(proyectoData.proyecto);
        }
      } else if (ids.length > 1) {
        // Si hay varios proyectos, puedes mostrar el primero o concatenar los nombres
        const { data: proyectosData, error: errorProyectos } = await supabase
          .from('proyectos_solidarios')
          .select('proyecto')
          .in('id_proyecto', ids);
        if (!errorProyectos && proyectosData) {
          setNombreProyecto(proyectosData.map((p: any) => p.proyecto).join(', '));
        }
      } else {
        setNombreProyecto("");
      }
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
          .select(`id_proyecto, proyecto, cupos`)
        
          .in('id_proyecto', ids);
          

        if (errorProyectos) {
          throw errorProyectos;
        }
        

        const formattedData = postulaciones.map((item) => {
          const proyectoMatch = proyectos.find((p) => p.id_proyecto === item.id_proyecto);
if (item.id_proyecto === proyectos[0]?.id_proyecto) {
  setCuposRestantes(proyectoMatch?.cupos ?? null);
}

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
   
  const filtered = solicitudes.map((s, idx) => {
  const original = solicitudesOriginal[idx];
  const modificado = original && s.estatus !== original.estatus;

  return {
    ...s,
    modificado,
  };
}).filter((s) => {
  const searchTerm = search.toLowerCase();
  const matchesSearch =
    (s.estatus?.toLowerCase().includes(searchTerm) || false) ||
    (s.matricula?.toLowerCase().includes(searchTerm) || false) ||
    (s.email?.toLowerCase().includes(searchTerm) || false) ||
    (s.carrera?.toLowerCase().includes(searchTerm) || false) ||
    (String(s.numero || '').toLowerCase().includes(searchTerm)) ||
    (s.respuesta_1?.toLowerCase().includes(searchTerm) || false) ||
    (s.respuesta_2?.toLowerCase().includes(searchTerm) || false) ||
    (s.respuesta_3?.toLowerCase().includes(searchTerm) || false);

  const matchesCarrera = filterCarrera.length === 0 || filterCarrera.includes(s.carrera);
  const matchesEstado = filterEstado.length === 0 || filterEstado.includes(s.estatus);
  return matchesSearch && matchesCarrera && matchesEstado;
});

const handleTerminarCupos = async () => {
  if (solicitudes.length === 0 || !solicitudes[0]?.id_proyecto) {
    showToast("No hay proyecto para finalizar cupos.");
    return;
  }

  const idProyecto = solicitudes[0].id_proyecto;


  try {
    const { error } = await supabase
      .from('proyectos_solidarios')
      .update({ cupos: 0 })
      .eq('id_proyecto', idProyecto);

    if (error) {
      console.error("Error al finalizar cupos:", error.message);
      showToast("Error al finalizar cupos.");
    } else {
      showToast("Los cupos se han finalizado correctamente.");
    }
  } catch (err) {
    console.error("Error inesperado:", err);
    showToast("Hubo un error al finalizar los cupos.");
  }
};


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
      setMensajeVisible(true);
      setTimeout(() => setMensajeVisible(false), 3000); 
    } catch (error) {
      showToast("Hubo un error al actualizar los estados.");
      console.error(error);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  if (!isLoading && solicitudes.length === 0) {
  return (
    <>
      <HeaderBarSocio proyecto="Special Olympics" />
      <main className="mt-28 px-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <p className="text-gray-700 text-lg font-medium mb-4">
          Aún no hay postulaciones para tus proyectos.
        </p>
        <p className="text-sm text-gray-500">Vuelve más tarde o asegúrate de que tus proyectos estén visibles.</p>
      </main>
    </>
  );
}


  return (
    <>
      <HeaderBarSocio
        proyecto={nombreProyecto}
      />

     <main className="mt-28 px-15">
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-end gap-5">


      <DetailButton
  texto={cuposRestantes === 0 ? "Cupos cerrados" : "Cerrar cupos"}
  size="auto"
  color="blue"
  id={2}
  onClick={() => {
    if (cuposRestantes !== 0) setIsConfirmModalOpen(true);
  }}
/>

        </div>
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
                   <div className="w-4 h-4 rounded bg-green-500" />
                   <span className="text-[#001C55] font-medium">Aceptadx</span>
                 </div>
                 <div className="flex items-center gap-1">
                   <div className="w-4 h-4 rounded bg-green-700" />
                   <span className="text-[#001C55] font-medium">Aceptadx por el alumnx</span>
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
                   <div className="w-4 h-4 rounded bg-blue-700" />
                   <span className="text-[#001C55] font-medium">Inscritx</span>
                 </div>
                 <div className="flex items-center gap-1">
                   <div className="w-4 h-4 rounded bg-black" />
                   <span className="text-[#001C55] font-medium">No inscritx</span>
                 </div>
              
               </div>
             </div>
     
             <div className="rounded-lg">
             <ListaSocio data={filtered} setData={setSolicitudes} />
             </div>
           </main>
            {mensajeVisible && (
              <div className="fixed bottom-6 right-5 transform text-blue-900 px-6 py-2 rounded-full border border-1 shadow-md transition-all duration-300 z-50">
                Enviado satisfactoriamente
              </div>
            )}


           {isDownloadModalOpen && (
             <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
               <Download 
                 onClose={() => setIsDownloadModalOpen(false)} 
                 idProyecto={proyectosSocio.length === 1 ? proyectosSocio[0] : (filterCarrera.length === 0 && filterEstado.length === 0 ? solicitudes[0]?.id_proyecto : null)}
               />
             </div>
           )}

           {toastMessage && (
  <div
    className="fixed bottom-6 right-5 bg-blue-100 border border-blue-400 text-blue-900 px-6 py-2 rounded shadow-md z-50 animate-fade-out"
    style={{
      animation: "fadeOut 3s ease-in-out forwards"
    }}
  >
    {toastMessage}
  </div>
)}
{isConfirmModalOpen && (
  <div className="fixed inset-0 z-50 bg-black/30  flex items-center justify-center">
    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
      <h2 className="text-xl font-bold text-[#0a2170] mb-4">Cerrar sesión</h2>
      <p className="text-gray-800 mb-6">¿Estás seguro que deseas cerrar los cupos?</p>
      <div className="flex justify-end gap-4">
        <button
          onClick={() => setIsConfirmModalOpen(false)}
          className="border border-[#0a2170] text-[#0a2170] font-semibold px-4 py-2 rounded-full hover:bg-[#f0f4ff] transition"
        >
          Cancelar
        </button>
        <button
          onClick={() => {
            setIsConfirmModalOpen(false);
            handleTerminarCupos();
          }}
          className="text-white font-semibold px-4 py-2  bg-black bg-opacity-30  rounded-full hover:bg-[#001C55] transition"
        >
          Cerrar cupos
        </button>
      </div>
    </div>
  </div>
)}

         </>
       );
     }