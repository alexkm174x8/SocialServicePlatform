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
  const { id } = useParams();
  const router = useRouter();

  const [project, setProject] = useState<ProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("proyectos_solidarios")
        .select("*")
        .eq("id_proyecto", id)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setProject(data);
      }

      setIsLoading(false);
    };

    if (id) fetchProjectDetails();
  }, [id]);

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
                <h1 className="text-lg font-bold text-blue-900">{project?.proyecto}</h1>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <FeatureButton texto={project?.modalidad ?? "Presencial"} color="white" size="sm" />
                  <FeatureButton texto={`${project?.horas ?? 0} horas`} color="white" size="sm" />
                </div>
                <div className="mt-2 space-y-1">
                  <ProjectDetails label="Modalidad" value={project?.modalidad} />
                  <ProjectDetails label="Periodo" value={project?.fecha_ejecucion} />
                  <ProjectDetails label="Clave" value={project?.clave} />
                  <ProjectDetails label="Horario" value={project?.horario} />
                </div>
              </div>

              {/* Columna más chica para imagen y botón */}
              <div className="md:col-span-1 flex flex-col items-center gap-4">
                <PostularseButton texto="Postularme" color="bg-blue-400" />
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
              <Properties label="Objetivo" value={<p>{project?.objetivo_ps}</p>} />
              <Properties label="Ubicación" value={<p>{project?.ubicacion}</p>} />
              <Properties label="Actividades" value={<p>{project?.actividades}</p>} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
