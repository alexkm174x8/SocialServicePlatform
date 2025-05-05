"use client";

import Image from "next/image";
import { FeatureButton } from "@/app/alumno/components/custom/FeatureButton";
import { useParams, useRouter } from "next/navigation";
import { HeaderBar } from "@/app/components/HeaderBar";
import { SideBar } from "@/app/alumno/components/custom/StudentSideBar";
import { ArrowLeft } from "lucide-react";
import { ProjectDetails } from "@/app/alumno/components/custom/ProjectDetails";
import { Properties } from "@/app/alumno/components/custom/Properties";
import { PostularseButton } from "@/app/alumno/components/custom/PostularseButton";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";


type ProjectData = {
    clave: string;
    proyecto: string;
    estatus_ps: string;
    objetivo_ps: string;
    ubicacion?: string;
    descripcion?: string;
    requisitos?: string;
    fecha_ejecucion: string;
    organizacion?: string;
    responsable?: string;
    horario: string;
    modalidad?: string;
    horas?: number;
    actividades: string;
  };

export default function ProjectPage() {
    const params = useParams();
    const id = params?.id as string;
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
            .from('proyectos_solidarios')
            .select('*')
            .eq('id_proyecto', id)
            .single();
  
          if (error) {
            throw error;
          }
  
          setProject(data);
        } catch (err: any) {
          console.error("Error fetching project details:", err);
          setError(err.message || "Failed to load project details");
        } finally {
          setIsLoading(false);
        }
      };
  
      if (params.id) {
        fetchProjectDetails();
      }
    }, [params.id]);
  
  return (
    <div className="flex min-h-screen bg-white overflow-hidden">
      <SideBar />
      <div className="flex flex-col flex-1 h-screen p-4">
        <HeaderBar 
          titulo="Proyecto" 
          Icono={ArrowLeft} 
          onClick={() => router.back()} 
        />
         <main className="flex-1 overflow-y-auto mt-20 ml-30 mr-10 ">
          <div className="w-full mx-auto shadow-md border-2 rounded-3xl border-blue-900 ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-blue-900">{project?.proyecto}</h1>
                <div className="flex mt-4 gap-3 flex-wrap">
                  <FeatureButton texto="Presencial" color="white" size="lg" />
                  <FeatureButton texto={`${project?.horas}`} color="white" size="lg" />
                </div>
                <div className="mt-5 space-y-2">
                  <ProjectDetails label="Modalidad" value={`${project?.modalidad}`}/>
                  <ProjectDetails label="Periodo" value={`${project?.fecha_ejecucion}`} />
                  <ProjectDetails label="Clave" value={`${project?.clave}`} />
                  <ProjectDetails label="Horario" value={`${project?.horario}`} />
                </div>
              </div>
              <div className="flex flex-col items-center gap-4">
                <PostularseButton texto="Postularme" color="bg-blue-400" />
                <Image
                  src="/images/example.jpg"
                  alt="Imagen"
                  width={300}
                  height={300}
                  className="object-cover rounded-lg w-full max-w-xs"
                />

            
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 ">
              <Properties label="Objetivo" value={
                <p>
                    {project?.objetivo_ps}
                </p>
              }/>
              <Properties label="Ubicación" value={
                <p>
                    {project?.ubicacion}
                </p>
              }/>
              <Properties label="Actividades" value={
                <p>
                    {project?.actividades}
                </p>
              }/>
            </div>
            </div>
        </main>
      </div>
    </div>
  );
}