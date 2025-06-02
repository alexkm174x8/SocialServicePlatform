"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { HeaderBar } from "@/app/components/HeaderBar";
import Mapa from "@/app/components/Mapa";
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
  <div className="flex bg-white mx-10">
    <SideBar />
    <div className="flex-1 flex flex-col h-screen">
      <HeaderBar titulo="Proyecto" Icono={ArrowLeft} onClick={() => router.back()} />
      <main className="flex-1 border border-blue-900 rounded-2xl mb-10 p-6 overflow-y-auto mt-20 ml-30 mr-10 bg-white space-y-6">

        {/* ENCABEZADO */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-3xl font-bold text-blue-900">{project.proyecto}</h1>
          <PostularseButton texto="Postularme" color="bg-blue-400" id_proyecto={Number(id)} />
        </div>

        {/* ETIQUETAS */}
        <div className="flex flex-wrap gap-3">
          <FeatureButton texto={project.modalidad} color="white" size="sm" />
          <FeatureButton texto={`${project.horas} horas`} color="white" size="sm" />
          <FeatureButton texto={project.clave} color="white" size="sm" />
          <FeatureButton texto={`${project.cupos} cupos`} color="white" size="sm" />
        </div>

        {/* DATOS GENERALES */}
<div className="grid md:grid-cols-3 gap-6 bg-gray-50 p-4 rounded-xl items-start">
  {/* Carreras */}
<ProjectDetails
  label="Carreras"
  value={
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
      {project.carreras.split(",").map((carrera, index) => (
        <span
          key={index}
          className="bg-blue-900 text-white text-xs px-3 py-1 rounded-full text-center"
        >
          {carrera.trim()}
        </span>
      ))}
    </div>
  }
/>

  {/* Otros datos */}
  <div className="space-y-2">
    <ProjectDetails label="Tipo de inscripción" value={project.tipo_inscripcion} />
    <ProjectDetails label="Periodo académico" value={project.periodo_academico} />
    <ProjectDetails label="Duración" value={project.duracion} />
  </div>

  {/* Logo del ODS */}
  {project.ods_data && (
    <div className="flex justify-center items-center">
      <Image
        src={project.ods_data.link_logo}
        alt={project.ods_data.nombre_ods}
        width={120}
        height={120}
        className="object-contain rounded-xl"
      />
    </div>
  )}
</div>


        {/* OBJETIVO, HABILIDADES, ACTIVIDADES, UBICACIÓN */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Properties label="Objetivo" value={<p>{project.objetivo_ps}</p>} />
          <Properties label="Habilidades" value={<p>{project.habilidades}</p>} />
          <Properties label="Actividades" value={<p>{project.actividades}</p>} />
          <Properties label="Ubicación" value={<p>{project.lugar_trabajo}</p>} />
        </div>

        {/* ODS + MAPA */}
        <div className="p-4 rounded-xl">
          <div className="w-full max-w-5xl mx-auto">
            <Mapa embedUrl={project.ruta_maps} />
          </div>
        </div>
      </main>
    </div>
  </div>
);


}