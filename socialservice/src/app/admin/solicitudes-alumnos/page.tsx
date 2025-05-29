"use client";

import { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import { HeaderBarAdmin } from "@/app/components/HeaderBarAdmin";
import { SearchBar } from "@/app/components/SearchBar";
import { FilterButton } from "@/app/components/FilterButton";
import { ListItem } from "@/app/components/ListItem";
import { AdminSideBar } from "@/app/admin/components/custom/AdminSideBar";
import { Inbox} from "lucide-react";
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
  id_proyecto: number;
  proyecto?: string; // Título del proyecto
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
    <div className="fixed flex h-screen bg-white">
        <div className="fixed top-0 left-0 right-0 z-10 ml-[width of SideBar] bg-white">
          <AdminSideBar />
          <HeaderBarAdmin titulo="Solicitudes alumnos" Icono={Inbox} />
        </div>
    </div>
        <main className={`flex-1 mt-[80px] ml-30 mr-10`}>
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
        <div className="">
          <DetailButton 
            texto="Comparar" 
            size="auto" 
            color="blue" 
            id={0} 
            onClick={() => {}} 
          />
        </div>

          <div className="flex flex-wrap gap-4 mt-4 items-center text-sm">
            <div className="flex items-center gap-1 ">
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

        <div className="align-items justify-center">
        <Lista data={filtered} setData={setSolicitudes} />
        </div>
      </main>
  </>
  );
}