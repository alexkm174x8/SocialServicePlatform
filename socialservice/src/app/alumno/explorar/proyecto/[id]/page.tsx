"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { HeaderBar } from "@/app/components/HeaderBar";
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
  ubicacion: string;
  descripcion: string;
  requisitos: string;
  fecha_ejecucion: string;
  organizacion: string;
  responsable: string;
  horario: string;
  modalidad: string;
  horas: number;
  actividades: string;
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
          .select("*")
          .eq("id_proyecto", id)
          .single();

        if (error) throw error;
        
        // Log the data we receive
        console.log("Received project data:", data);

        // Check if we have the minimum required data
        if (!data || !data.proyecto) {
          throw new Error("Project not found");
        }

        // Set default values for optional fields
        const projectData: ProjectData = {
          clave: data.clave || "N/A",
          proyecto: data.proyecto,
          cupos: data.cupos || "Activo",
          objetivo_ps: data.objetivo_ps || "No especificado",
          ubicacion: data.ubicacion || "No especificada",
          descripcion: data.descripcion || "No especificada",
          requisitos: data.requisitos || "No especificados",
          fecha_ejecucion: data.fecha_ejecucion || "No especificada",
          organizacion: data.organizacion || "No especificada",
          responsable: data.responsable || "No especificado",
          horario: data.horario || "No especificado",
          modalidad: data.modalidad || "No especificada",
          horas: data.horas || 0,
          actividades: data.actividades || "No especificadas"
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
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex min-h-screen bg-white">
      <SideBar />
      <div className="flex-1 flex flex-col h-screen">
        <HeaderBar titulo="Proyecto" Icono={ArrowLeft} onClick={() => router.back()} />
        <main className="flex-1 overflow-y-auto mt-20 ml-30 mr-10">
          <div className="w-full mx-auto border border-blue-900 rounded-2xl shadow bg-white p-5">
            {/* Encabezado */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Columna de información más ancha */}
              <div className="md:col-span-2">
                <h1 className="text-lg font-bold text-blue-900">{project.proyecto}</h1>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <FeatureButton texto={project.modalidad} color="white" size="sm" />
                  <FeatureButton texto={`${project.horas} horas`} color="white" size="sm" />
                </div>
                <div className="mt-2 space-y-1">
                  <ProjectDetails label="Modalidad" value={project.modalidad} />
                  <ProjectDetails label="Periodo" value={project.fecha_ejecucion} />
                  <ProjectDetails label="Clave" value={project.clave} />
                  <ProjectDetails label="Horario" value={project.horario} />
                </div>
              </div>

              {/* Columna más chica para imagen y botón */}
              <div className="md:col-span-1 flex flex-col items-center gap-4">
                <PostularseButton texto="Postularme" color="bg-blue-400" id_proyecto={Number(id)} />
                <Image
                  src="/images/example.jpg"
                  alt="Imagen del proyecto"
                  width={160}
                  height={160}
                  className="object-cover rounded-lg"
                />
              </div>
            </div>


            {/* Detalles */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
              <Properties label="Objetivo" value={<p>{project.objetivo_ps}</p>} />
              <Properties label="Ubicación" value={<p>{project.ubicacion}</p>} />
              <Properties label="Actividades" value={<p>{project.actividades}</p>} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}