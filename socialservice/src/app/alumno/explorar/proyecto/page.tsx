"use client";

import Image from "next/image";
import { FeatureButton } from "@/app/alumno/components/custom/FeatureButton";
import { useRouter } from "next/navigation";
import { HeaderBar } from "@/app/components/HeaderBar";
import { SideBar } from "@/app/alumno/components/custom/StudentSideBar";
import { ArrowLeft } from "lucide-react";
import { ProjectDetails } from "@/app/alumno/components/custom/ProjectDetails";
import { Properties } from "@/app/alumno/components/custom/Properties";
import { PostularseButton } from "@/app/alumno/components/custom/PostularseButton";

export default function Proyecto() {
  const router = useRouter();
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
                <h1 className="text-2xl md:text-3xl font-bold text-blue-900">Naciones Unidas</h1>
                <div className="flex mt-4 gap-3 flex-wrap">
                  <FeatureButton texto="Presencial" color="white" size="lg" />
                  <FeatureButton texto="40 horas" color="white" size="lg" />
                </div>
                <div className="mt-5 space-y-2">
                  <ProjectDetails label="Modalidad" value="Presencial" />
                  <ProjectDetails label="Periodo" value="Enero - Marzo" />
                  <ProjectDetails label="Clave" value="ABC123" />
                  <ProjectDetails label="Horario" value="Lunes a Viernes 9:00 - 13:00" />
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
                  Asistencia en entrenamiento y acondicionamiento físico a personas con discapacidades mentales y ciegos dentro de unas canchas de fútbol.
                </p>
              }/>
              <Properties label="Ubicación" value={
                <p>
                  Tecnológico de Monterrey Campus Puebla, San Andrés Cholula, 72344
                </p>
              }/>
              <Properties label="Actividades" value={
                <p>
                  Asistencia en entrenamiento y acondicionamiento físico a personas con discapacidades mentales y ciegos dentro de unas canchas de fútbol.
                </p>
              }/>
            </div>
            </div>
        </main>
      </div>
    </div>
  );
}


