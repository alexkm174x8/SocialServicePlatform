"use client";

import { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import { HeaderBarAdmin } from "@/app/components/HeaderBarAdmin";
import { SearchBar } from "@/app/components/SearchBar";
import { FilterButton } from "@/app/components/FilterButton";
import { ListItem } from "@/app/components/ListItem";
import { SideBar } from "@/app/admin/components/custom/AdminSideBar";
import { Inbox} from "lucide-react";
import UploaderButton from "@/app/admin/components/custom/UploaderButton";
import DownloadModal from '@/app/admin/components/custom/DownloadModal';
import { Trash2 } from "lucide-react";
import {DetailButton} from "@/app/components/DetailButton";
import { Lista } from "@/app/components/Lista";


type Solicitud = {
  estatus: string;
  matricula: string;
  email: string;
  carrera: string;
  numero: string;
  respuesta_1: string;
  respuesta_2: string;
  respuesta_3: string;
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

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const { data, error } = await supabase
          .from('postulacion')
          .select(`estatus, matricula, email, carrera, numero, respuesta_1, respuesta_2, respuesta_3`);

        if (error) {
          throw error;
        }

        const formattedData = data.map((item) => ({
          estatus: item.estatus,
          matricula: item.matricula,
          email: item.email,
          carrera: item.carrera,
          numero: item.numero,
          respuesta_1: item.respuesta_1,
          respuesta_2: item.respuesta_2,
          respuesta_3: item.respuesta_3,
        }));
        setSolicitudes(formattedData);
      } catch (error) {
        console.error('Error fetching proyectos_solidarios:', error.message || error);
      }
    };

    fetchProyectos();
  }, []);

   
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
                   <Trash2 className="w-5 h-5" />
                 </button>
     
                 <FilterButton
                   label="Carrera"
                   options={[...new Set(solicitudes.map((s) => s.carrera))]}
                   selectedValues={filterCarrera}
                   onChange={setFilterCarrera}
                 />
     
                 <FilterButton
                   label="Estado"
                   options={[...new Set(solicitudes.map((s) => s.estado))]}
                   selectedValues={filterEstado}
                   onChange={setFilterEstado}
                 />
                  </div>
             </div>
     
             <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
               <div className="flex items-center gap-4">
                 <DetailButton texto="Enviar" size="auto" onClick ={console.log("Enviar")} />
                 <DetailButton texto="Descargar" size="auto" onClick ={console.log("Enviar")}/>
               </div>
     
               <div className="flex flex-wrap gap-4 items-center text-sm">
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
               </div>
             </div>
     
             <div className="rounded-lg">
             <Lista data={filtered} />
             </div>
           </main>
         </>
       );
     }
     