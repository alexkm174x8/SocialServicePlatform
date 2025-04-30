"use client";

import { useState, useEffect } from "react";
import { HeaderBar } from "@/app/components/HeaderBar";
import { SearchBar } from "@/app/components/SearchBar";
import { FilterButton } from "@/app/components/FilterButton";
import { CardItem } from "@/app/alumno/components/custom/CardItem";
import { SideBar } from "@/app/alumno/components/custom/StudentSideBar";
import { TextSearch } from "lucide-react";
import { supabase } from "@/lib/supabase"; 

type Project = {
  id_proyecto: any;
  proyecto: any;
  estatus_ps: any;
  objetivo_ps: any;
  hours: any;
  format: any;
  color: any;
};

function getBackgroundColor(hours: number): string {
  if (hours === 180) return "bg-teal-300";   
  if (hours === 120) return "bg-purple-400";     
  if (hours === 60) return "bg-rose-400";       
  if (hours === 100) return "bg-orange-400";   
  if (hours === 200) return "bg-sky-400";     
  return "bg-gray-400"; 
}

export default function Explorar() {
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('proyectos_solidarios')
        .select('id_proyecto, proyecto, estatus_ps, objetivo_ps, horas, modalidad');

      if (error) {
        console.error("Error fetching projects:", error);
        setError(error.message);
        setProjects([]);
      } else {
        setProjects(data || []);
      }

      setIsLoading(false);
    };

    fetchProjects();
  }, []); 

  return (
    <>
      <SideBar />
      <HeaderBar titulo="Explorar" Icono={TextSearch} />
      <main className={`transition-all mt-20 ml-30 mr-10`}>
        <SearchBar search={search} setSearch={setSearch} />

        <div className="flex flex-wrap justify-end gap-4 mb-6">
          <button
            className="border border-gray-600 text-gray-500 font-semibold rounded-full px-4 py-1 text-sm hover:bg-gray-300 transition"
            onClick={() => console.log("Limpiar filtros")}
          >
            Limpiar todo
          </button>
          {["Modalidad", "Disponibilidad"].map(
            (label) => (
              <FilterButton key={label} label={label} />
            )
          )}
        </div>

        {isLoading && <p className="text-center">Loading projects...</p>}
        {error && <p className="text-center text-red-600">Error: {error}</p>}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {projects.length > 0 ? (
               projects.map((project) => (
                <CardItem
                  name={project.proyecto}
                  description={project.objetivo_ps.split(' ').slice(0, 15).join(' ') + (project.objetivo_ps.split(' ').length > 15 ? '...' : '')}
                  state={project.estatus_ps}
                  hours={project.horas}
                  format={project.modalidad}
                  color =  {getBackgroundColor(project.horas)}
                />
              ))
            ) : (
              <p className="text-center col-span-full">No projects found.</p>
            )}
          </div>
        )}
      </main>
    </>
  );
}