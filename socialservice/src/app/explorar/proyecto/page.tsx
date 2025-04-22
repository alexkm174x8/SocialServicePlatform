"use client";

import Image from "next/image";
import { FeatureButton } from "@/components/custom/FeatureButton";
import { useRouter } from "next/navigation";
import { HeaderBar } from "@/components/custom/HeaderBar";
import { SideBar } from "@/components/custom/SideBar";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { ProjectDetails } from "@/components/custom/ProjectDetails";
import { Properties } from "@/components/custom/Properties";
import { PostularseButton } from "@/components/custom/PostularseButton";

export default function Proyecto() {
  const router = useRouter();

  // 📦 Información dinámica del proyecto
  const proyectoData = {
    titulo: "Naciones Unidas",
    modalidad: "Presencial",
    periodo: "Enero - Marzo",
    clave: "ABC123",
    horario: "Lunes a Viernes 9:00 - 13:00",
    ubicacion: "Tecnológico de Monterrey Campus Puebla, San Andrés Cholula, 72344",
    objetivo:
      "Asistencia en entrenamiento y acondicionamiento físico a personas con discapacidades mentales y ciegos dentro de unas canchas de fútbol.",
    actividades:
      "Asistencia en entrenamiento y acondicionamiento físico a personas con discapacidades mentales y ciegos dentro de unas canchas de fútbol.",
    imagen: "/images/example.jpg", // Ruta a tu imagen
    duracion: "40 horas",
  };

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-hidden">
      <SideBar />
      <div className="flex flex-col flex-1 h-screen p-4">
        <HeaderBar
          titulo="Proyecto"
          Icono={ArrowLeft}
          onClick={() => router.back()}
        />

        <div>
          <Card className="w-full max-w-screen-lg h-full mx-auto rounded-3xl shadow-md border-blue-900 border-2 bg-gray-100">
            <div className="grid grid-cols-3 p-5">
              {/* Columna izquierda */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-blue-900">
                  {proyectoData.titulo}
                </h1>
                <div className="flex mt-4 gap-5">
                  <FeatureButton texto={proyectoData.modalidad} color="white" size="lg" />
                  <FeatureButton texto={proyectoData.duracion} color="white" size="lg" />
                </div>
                <div className="mt-5">
                  <ProjectDetails label="Modalidad" value={proyectoData.modalidad} />
                  <ProjectDetails label="Periodo" value={proyectoData.periodo} />
                  <ProjectDetails label="Clave" value={proyectoData.clave} />
                  <ProjectDetails label="Horario" value={proyectoData.horario} />
                </div>
              </div>

              {/* Columna centro */}
              <div className="px-6 mt-15">
                <Properties label="Ubicación" value={<p>{proyectoData.ubicacion}</p>} />
              </div>

              {/* Columna derecha */}
              <div className="px-15">
                <div className="mb-10">
                  <PostularseButton texto="Postularme" color="bg-blue-400" />
                </div>
                <Image
                  src={proyectoData.imagen}
                  alt="Imagen del proyecto"
                  width={300}
                  height={300}
                  className="object-cover rounded-lg"
                />
              </div>
            </div>

            {/* Objetivo y actividades */}
            <div className="flex flex-wrap px-15 pb-5">
              <Properties label="Objetivo" value={<p>{proyectoData.objetivo}</p>} />
              <Properties label="Actividades" value={<p>{proyectoData.actividades}</p>} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
