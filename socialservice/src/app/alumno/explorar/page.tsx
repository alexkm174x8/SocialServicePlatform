"use client";

import { useState, useEffect, useCallback } from "react";
import { HeaderBar } from "@/app/components/HeaderBar";
import { SearchBar } from "@/app/components/SearchBar";
import { FilterButton } from "@/app/components/FilterButton";
import { CardItem } from "@/app/alumno/components/custom/CardItem";
import { SideBar } from "@/app/alumno/components/custom/StudentSideBar";
import { Compass } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Project = {
  id_proyecto: any;
  proyecto: any;
  cupos: any;
  objetivo_ps: any;
  horas: any;
  modalidad: any;
};

type Postulacion = {
  id_proyecto: number;
  email: string;
};

const getBackgroundColor = (hours: number): string => {
  const colors: Record<number, string> = {
    180: "bg-teal-300",
    120: "bg-purple-400",
    60: "bg-rose-400",
    100: "bg-orange-400",
    200: "bg-sky-400",
  };

  return colors[hours] || "bg-gray-400";
};

const fetchProjects = async (userEmail: string) => {
  // First get all projects
  const { data: projects, error: projectsError } = await supabase
    .from('proyectos_solidarios')
    .select('id_proyecto, proyecto, cupos, objetivo_ps, horas, modalidad');

  if (projectsError) throw new Error(projectsError.message);

  // Then get user's postulations
  const { data: postulaciones, error: postulacionesError } = await supabase
    .from('postulacion')
    .select('id_proyecto')
    .eq('email', userEmail);

  if (postulacionesError) throw new Error(postulacionesError.message);

  // Create a set of project IDs that the user has already applied to
  const appliedProjectIds = new Set(postulaciones?.map(p => p.id_proyecto) || []);

  // Filter out projects that the user has already applied to
  // Filtra proyectos con cupos > 0 y que el usuario no haya solicitado
const availableProjects = projects?.filter(
  project => project.cupos > 0 && !appliedProjectIds.has(project.id_proyecto)
) || [];

  return availableProjects;
};

const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get the current user's session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.email) {
          setError("No se encontró una sesión activa. Por favor inicia sesión.");
          return;
        }

        const userEmail = session.user.email;
        const data = await fetchProjects(userEmail);
        setProjects(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  return { projects, isLoading, error };
};

const useFilteredProjects = (projects: Project[], filters: any) => {
  return projects.filter((project) => {
    const { search, filterModalities, filterHours } = filters;

    const matchesModality = !filterModalities.length || filterModalities.includes(project.modalidad);
    const matchesHours = !filterHours.length || filterHours.includes(project.horas.toString());
    const matchesSearch = project.proyecto.toLowerCase().includes(search.toLowerCase()) ||
                          project.objetivo_ps.toLowerCase().includes(search.toLowerCase());

    return matchesModality && matchesHours && matchesSearch;
  });
};

export default function Explorar() {
  const [search, setSearch] = useState("");
  const [filterModalities, setFilterModalities] = useState<string[]>([]);
  const [filterHours, setFilterHours] = useState<string[]>([]);

  const { projects, isLoading, error } = useProjects();

  const filteredProjects = useFilteredProjects(projects, { search, filterModalities, filterHours });

  const resetFilters = useCallback(() => {
    setFilterModalities([]);
    setFilterHours([]);
    setSearch("");
  }, []);

  return (
    <>
      <SideBar />
      <HeaderBar titulo="Explorar" Icono={Compass} />
      <main className="transition-all mt-20 ml-30 mr-10">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <SearchBar
            search={search}
            setSearch={setSearch}
            onSearchApply={() => {}}
            onSearchClear={() => setSearch("")}
          />

          <div className="flex gap-7 items-center">
            <button
              className="border border-gray-600 text-gray-500 font-semibold rounded-full px-4 py-1 text-sm hover:bg-gray-300 transition"
              onClick={resetFilters}
            >
              Limpiar filtros
            </button>

            <FilterButton
              label="Modalidad"
              options={["En línea", "Presencial", "Mixto"]}
              selectedValues={filterModalities}
              onChange={setFilterModalities}
            />

            <FilterButton
              label="Horas"
              options={["60", "100", "120", "180", "200"]}
              selectedValues={filterHours}
              onChange={setFilterHours}
            />
          </div>
        </div>

        {isLoading && <p className="text-center">Cargando proyectos...</p>}
        {error && <p className="text-center text-red-600">Error: {error}</p>}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <CardItem
                  key={project.id_proyecto}
                  name={project.proyecto}
                  description={project.objetivo_ps
                    ? project.objetivo_ps.split(" ").slice(0, 15).join(" ") + (project.objetivo_ps.split(" ").length > 15 ? "..." : "")
                    : "No description available"}
                  state={project.cupos}
                  id_project={project.id_proyecto}
                  hours={project.horas}
                  format={project.modalidad}
                  color={getBackgroundColor(project.horas)}
                />
              ))
            ) : (
              <p className="text-center col-span-full">No hay proyectos disponibles con este nombre.</p>
            )}
          </div>
        )}
      </main>
    </>
  );
}