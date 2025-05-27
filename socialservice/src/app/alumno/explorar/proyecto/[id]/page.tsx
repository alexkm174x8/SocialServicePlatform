"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { HeaderBar } from "@/app/components/HeaderBar";
import { Mapa } from "@/app/components/Mapa";
import { SideBar } from "@/app/alumno/components/custom/StudentSideBar";
import { FeatureButton } from "@/app/alumno/components/custom/FeatureButton";
import { ProjectDetails } from "@/app/alumno/components/custom/ProjectDetails";
import { Properties } from "@/app/alumno/components/custom/Properties";
import { PostularseButton } from "@/app/alumno/components/custom/PostularseButton";

type ProjectData = {
  clave: string;
  proyecto: string;
  cupos: string;
  objetivo_ps: string;
  lugar_trabajo: string;
  ods: number; 
  tipo_inscripcion: string;
  descripcion: string;
  periodo_academico: string; 
  detalles_horario: string;
  modalidad: string;
  horas: number;
  habilidades: string;
  duracion: string;
  actividades: string;
  ruta_maps: string;
  carreras: string; 
  ods_data: {
    nombre_ods: string;
    link_logo: string;
  } | null;
};




export default function ProjectPage() {
  const { id } = useParams();
  const router = useRouter();

  const [project, setProject] = useState<ProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("proyectos_solidarios")
          .select("*, ods(nombre_ods, link_logo)")
          .eq("id_proyecto", id)
          .single();

        if (error) throw error;
        
        // Log the data we receive
        console.log("Received project data:", data);

        // Check if we have the minimum required data
        if (!data || !data.proyecto) {
          throw new Error("Project not found");
        }

        const projectData: ProjectData = {
          clave: data.clave || "N/A",
          proyecto: data.proyecto,
          cupos: data.cupos || "Activo",
          objetivo_ps: data.objetivo_ps || "No especificado",
          lugar_trabajo: data.lugar_trabajo || "No especificada",
          ods: data.ods || 0,
          tipo_inscripcion: data.tipo_inscripcion || "No especificada",
          periodo_academico: data.periodo_academico || "No especificado",
          descripcion: data.descripcion || "No especificada",
          detalles_horario: data.detalles_horario || "No especificado",
          modalidad: data.modalidad || "No especificada",
          horas: data.horas || 0,
          carreras: data.carreras || "No especificadas",
          habilidades: data.habilidades || "No especificadas",
          ruta_maps: data.ruta_maps || "No especificada",
          duracion: data.duracion || "No especificada",
          actividades: data.actividades || "No especificadas",
          ods_data: data.ods || null,
        };
        
        setProject(projectData);
      } catch (error) {
        console.error("Error fetching project:", error);
        setError(error instanceof Error ? error.message : "Error fetching project");
        router.push("/alumno/explorar"); // Redirect to explore page if project not found
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchProjectDetails();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-white">
        <SideBar />
        <div className="flex-1 flex flex-col h-screen">
          <HeaderBar titulo="Proyecto" Icono={ArrowLeft} onClick={() => router.back()} />
          <main className="flex-1 overflow-y-auto mt-20 ml-30 mr-10">
            <div className="flex justify-center items-center h-full">
              <p>Cargando...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return null; 
  }

  const colorOptions = [
    'bg-teal-300',
    'bg-purple-400',
    'bg-rose-400',
    'bg-orange-400',
    'bg-sky-400',
  ];

  const carreras = project.carreras || [];

  return (
    <div className="flex bg-white">
      <SideBar />
      <div className="flex-1 flex flex-col h-screen">
        <HeaderBar titulo="Proyecto" Icono={ArrowLeft} onClick={() => router.back()} />
        <main className="flex-1 border border-blue-900 rounded-2xl mb-10 p-5 overflow-y-auto mt-20 ml-30 mr-10">
          <div className="w-full">
          <div className="flex flex-col md:flex-row items-center md:items-center justify-center md:justify-between gap-2 mb-4 w-full">
            <h1 className="text-2xl font-bold text-blue-900 w-full md:text-left md:w-auto">
              {project.proyecto}
            </h1>
            <div className="w-full md:w-auto flex  md:justify-end">
              <PostularseButton texto="Postularme" color="bg-blue-400" id_proyecto={Number(id)} />
            </div>
          </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="">             
                <div className="flex gap-2 mt-2 flex-wrap">
                  <FeatureButton texto={project.modalidad} color="white" size="sm" />
                  <FeatureButton texto={`${project.horas} horas`} color="white" size="sm" />
                  <FeatureButton texto={project.clave} color="white" size="sm" />
                  <FeatureButton texto={`${project.cupos} cupos`} color="white" size="sm" />
                </div>
                <div className="mt-2 space-y-1 ">
                <ProjectDetails
                  label="Carreras"
                  value={
                    project.carreras &&
                    project.carreras.split(",").map((carrera, index) => (
                      <span
                        key={index}
                        className="rounded-full px-3 py-1 text-sm bg-blue-900 text-white mr-2 mb-1"
                      >
                        {carrera.trim()}
                      </span>
                    ))
                  }
                />
                  <ProjectDetails label="Modalidad" value={project.modalidad} />
                  <ProjectDetails label="Clave" value={project.clave} />
                  <ProjectDetails label="Tipo de inscripción" value={project.tipo_inscripcion} />
                  <ProjectDetails label="Periodo académico" value={project.periodo_academico} />
                  <ProjectDetails label="Duración" value={project.duracion} />
                  
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2 place-items-center text-center">
              <Properties label="Objetivo" value={<p>{project.objetivo_ps}</p>} />

              {project.ods_data && (
                <Properties
                  label="ODS"
                  value={
                    <div className="flex flex-col items-center text-center">
                      <Image
                        src={project.ods_data.link_logo}
                        alt={project.ods_data.nombre_ods}
                        width={200}
                        height={200}
                        className="object-contain rounded-2xl"
                      />
                    </div>
                  }
                />
              )}

              <Properties
                label="Habilidades"
                value={
                  <div>
                    <p>{project.habilidades}</p>
                  </div>
                }
              />

              <Properties label="Actividades" value={<p>{project.actividades}</p>} />

              <Properties label="Ubicación" value={<p>{project.lugar_trabajo}</p>} />

              <Properties
                label="Mapa"
                value={
                  <div className="w-full max-w-xs mx-auto">
                    <Mapa embedUrl={project.ruta_maps} />
                  </div>
                }
              />
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}