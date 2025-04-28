"use client";

import { useState, useEffect } from "react";
import { HeaderBar } from "@/components/custom/HeaderBar";
import { SearchBar } from "@/components/custom/SearchBar";
import { FilterButton } from "@/components/custom/FilterButton";
import { CardItem } from "@/components/custom/CardItem";
import { SideBar } from "@/components/custom/SideBar";
import { TextSearch } from "lucide-react";
import { supabase } from "@/lib/supabase"; 

type Project = {
  id_proyecto: any;
  proyecto: any;
  estatus_ps: any;
  objetivo_ps: any;
};

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
        .select('id_proyecto, proyecto, estatus_ps, objetivo_ps');

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
          {["Modalidad", "Ubicación", "Disponibilidad", "Relevancia"].map(
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
                  description={project.objetivo_ps}
                  state={project.estatus_ps}
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