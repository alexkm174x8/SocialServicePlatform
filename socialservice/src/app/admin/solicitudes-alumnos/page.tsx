"use client";

import { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import { HeaderBarAdmin } from "@/app/components/HeaderBarAdmin";
import { SearchBar } from "@/app/components/SearchBar";
import { FilterButton } from "@/app/components/FilterButton";
import { ListItem } from "@/app/components/ListItem";
import { SideBar } from "@/app/admin/components/custom/AdminSideBar";
import { Inbox} from "lucide-react";
import {DetailButton} from "@/app/components/DetailButton";
import { Lista } from "@/app/components/Lista";
import CompararDrawer from "@/app/admin/components/custom/CompararDrawer"; 



type Solicitud = {
  estatus: string;
  matricula: string;
  email: string;
  carrera: string;
  numero: string;
  respuesta_1: string;
  respuesta_2: string;
  respuesta_3: string;
  id_proyecto?: number;  // Make this optional
  proyecto?: string; // Título del proyecto
  modificado?: boolean;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Key must be provided. Please check your environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default function Solicitud() {
  const [search, setSearch] = useState("");
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [filterCarrera, setFilterCarrera] = useState<string[]>([]);
  const [filterEstado, setFilterEstado] = useState<string[]>([]);
   const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mensajeVisible, setMensajeVisible] = useState(false);
const [matriculasSubidas, setMatriculasSubidas] = useState<string[]>([]);
const [solicitudesOriginal, setSolicitudesOriginal] = useState<Solicitud[]>([]);



  


  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        // Obtener postulaciones con id_proyecto
        const { data: postulaciones, error: errorPostulaciones } = await supabase
          .from('postulacion')
          .select(`estatus, matricula, email, carrera, numero, respuesta_1, respuesta_2, respuesta_3, id_proyecto`);

        if (errorPostulaciones) {
          throw errorPostulaciones;
        }

        // Obtener todos los proyectos para hacer el match
        const { data: proyectos, error: errorProyectos } = await supabase
          .from('proyectos_solidarios')
          .select(`id_proyecto, proyecto`);

        if (errorProyectos) {
          throw errorProyectos;
        }

        // Hacer match y agregar el título del proyecto
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

    fetchProyectos();
  }, []);

   
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
    (s.numero?.toLowerCase().includes(searchTerm) || false) ||
    (s.respuesta_1?.toLowerCase().includes(searchTerm) || false) ||
    (s.respuesta_2?.toLowerCase().includes(searchTerm) || false) ||
    (s.respuesta_3?.toLowerCase().includes(searchTerm) || false);

  const matchesCarrera = filterCarrera.length === 0 || filterCarrera.includes(s.carrera);
  const matchesEstado = filterEstado.length === 0 || filterEstado.includes(s.estatus);

  return matchesSearch && matchesCarrera && matchesEstado;
});

const handleComparar = async (
  matriculas: string[],
  modo: "inscribir" | "noInscribir"
) => {
  if (matriculas.length === 0) return;

  const estadosValidos = [
    "Aceptadx",
    "Aceptadx por el alumnx",
    "Aceptadx por el alumno",
    "Inscritx",
    "No inscritx"
  ];

  const nuevoEstado = modo === "inscribir" ? "Inscritx" : "No inscritx";

  try {
    const { data, error } = await supabase
      .from("postulacion")
      .update({ estado: nuevoEstado })
      .in("matricula", matriculas)
      .in("estatus", estadosValidos);

    if (error) {
      console.error("Error actualizando estados:", error.message);
      alert("Hubo un error al actualizar los estados.");
    } else {
      alert(`Se actualizó el estado de ${data?.length || 0} postulaciones.`);
    }
  } catch (err) {
    console.error("Error inesperado:", err);
    alert("Error inesperado.");
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
      setTimeout(() => setMensajeVisible(false), 3000); // desaparece tras 3 segundos

    } catch (error) {
      alert('Error al actualizar los estados.');
      console.error(error);
    }
  };


  return (
    <>
      <SideBar/>
      <HeaderBarAdmin
        titulo="Solicitudes de Alumno"
        Icono={Inbox}
      />

     <main className="mt-20 ml-15 px-15">
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
                 <DetailButton 
                  texto="Comparar" 
                  size="auto" 
                  color="blue" 
                  id={0} 
                  onClick={() => setDrawerOpen(true)} 
                />
                <DetailButton texto="Enviar" size="auto" color="blue" id={0} onClick={handleEnviar} />
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
             <Lista data={filtered} setData={setSolicitudes} />
             </div>
           </main>
           {mensajeVisible && (
  <div
    className="fixed bottom-6 right-5 transform text-blue-900 px-6 py-2 rounded-full border border-1 shadow-md z-50 transition-opacity duration-700 opacity-100 animate-fade-out"
    style={{
      animation: "fadeOut 2s ease-in-out forwards"
    }}
  >
    Enviado satisfactoriamente
  </div>
)}

{drawerOpen && (
  <>
    <div
      className="fixed inset-0 z-40 "
      onClick={() => setDrawerOpen(false)}
    />

    <CompararDrawer
  open={drawerOpen}
  onClose={() => setDrawerOpen(false)}
  onComparar={async (matriculas, modo) => {
    if (matriculas.length === 0) return;

    // Definir los estados válidos según el modo
    const estadosValidos =
      modo === "inscribir"
        ? ["No inscritx", "Aceptadx por el alumnx"]
        : ["Aceptadx por el alumnx", "Inscritx"];

    const nuevoEstado = modo === "inscribir" ? "Inscritx" : "No inscritx";

    try {
      // Filtrar solo las matrículas que cumplen con el estado previo correcto
      const matriculasValidas = solicitudes.filter(
        (sol) =>
          matriculas.includes(sol.matricula) &&
          estadosValidos.includes(sol.estatus)
      ).map((sol) => sol.matricula);

      if (matriculasValidas.length === 0) {
        alert("No hay matrículas con estados válidos para actualizar.");
        return;
      }

      const { data, error } = await supabase
        .from("postulacion")
        .update({ estatus: nuevoEstado })
        .in("matricula", matriculasValidas)
        .in("estatus", estadosValidos);

      if (error) {
        console.error("Error actualizando estados:", error.message);
        alert("Hubo un error al actualizar los estados.");
      } else {
        // Actualizar las listas en el frontend
        setSolicitudes((prev) =>
          prev.map((sol) =>
            matriculasValidas.includes(sol.matricula)
              ? { ...sol, estatus: nuevoEstado }
              : sol
          )
        );
        setSolicitudesOriginal((prev) =>
          prev.map((sol) =>
            matriculasValidas.includes(sol.matricula)
              ? { ...sol, estatus: nuevoEstado }
              : sol
          )
        );

        setMensajeVisible(true);
        setTimeout(() => setMensajeVisible(false), 3000);
        alert(`Se actualizó el estado de ${matriculasValidas.length} matrículas a "${nuevoEstado}".`);
      }
    } catch (err) {
      console.error("Error inesperado:", err);
      alert("Error inesperado.");
    }

    setDrawerOpen(false);
  }}
/>

  </>
)}
         </>
       );
     }