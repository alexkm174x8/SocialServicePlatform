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
          estatus_ps: data.estatus_ps || "Activo",
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

    if (params.id) fetchProjectDetails();
  }, [params.id, router]);

  useEffect(() => {
    const checkExistingApplication = async () => {
      try {
        // Get the current user's session
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user?.email) {
          console.error("No active session")
          return
        }

        // Check if user has already applied to this project
        const { data, error } = await supabase
          .from('postulacion')
          .select('id_proyecto, estatus')
          .eq('email', session.user.email)
          .eq('id_proyecto', params.id)
          .single()

        if (error && error.code !== 'PGRST116') { // Ignore "no rows found" error
          console.error("Error checking existing application:", error)
          return
        }

        if (data) {
          setHasExistingApplication(true)
          setWarning("Ya has postulado a este proyecto. No puedes postularte nuevamente.")
        }
      } catch (error) {
        console.error("Error checking existing application:", error)
      }
    }

    if (params.id) {
      checkExistingApplication()
    }
  }, [params.id])

  useEffect(() => {
    const initializeFormFromSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user?.email) {
          console.error("No active session")
          return
        }

        const userEmail = session.user.email
        const matricula = userEmail.replace('@tec.mx', '')

        setForm(prev => ({
          ...prev,
          correo: userEmail,
          matricula: matricula
        }))
      } catch (error) {
        console.error("Error getting session data:", error)
      }
    }

    initializeFormFromSession()
  }, [])

  const regexMap: { [key: string]: { regex: RegExp; message: string } } = {
    nombre: {
      regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,}$/,
      message: "Nombre inválido. Usa solo letras y mínimo 3 caracteres.",
    },
    matricula: {
      regex: /^[Aa]\d{8}$/,
      message: "Matrícula inválida. Debe iniciar con 'A' o 'a' seguido de 8 números.",
    },
    carreraCompleta: {
      regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,}$/,
      message: "Nombre de carrera inválido. Usa solo letras.",
    },
    correo: {
      regex: /^[a-zA-Z0-9._%+-]+@tec\.mx$/,
      message: "Correo inválido. Debe terminar en @tec.mx",
    },
    telefono: {
      regex: /^\d{10}$/,
      message: "Teléfono inválido. Debe contener exactamente 10 dígitos.",
    },
    r1: {
      regex: /^.{10,}$/,
      message: "La respuesta debe tener al menos 10 caracteres.",
    },
    r2: {
      regex: /^.{10,}$/,
      message: "La respuesta debe tener al menos 10 caracteres.",
    },
    r3: {
      regex: /^.{10,}$/,
      message: "La respuesta debe tener al menos 10 caracteres.",
    },
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (regexMap[name]) {
      const { regex, message } = regexMap[name];
      if (!regex.test(value)) {
        setErrors((prev) => ({ ...prev, [name]: message }));
      } else {
        setErrors((prev) => {
          const updated = { ...prev };
          delete updated[name];
          return updated;
        });
      }
    }
  };

  const handleSubmit = async () => {
  if (!project || hasExistingApplication) return;
  setIsSubmitting(true);
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.email) {
      setWarning("No se encontró una sesión activa. Por favor inicia sesión.");
      return;
    }

    const { data: existingApp } = await supabase
      .from('postulacion')
      .select('id_proyecto')
      .eq('email', session.user.email)
      .eq('id_proyecto', project.id_proyecto)
      .single();

    if (existingApp) {
      setWarning("Ya has postulado a este proyecto. No puedes postularte nuevamente.");
      setShowPopup(false);
      return;
    }

    // Obtener y actualizar cupos
    const { data: proyectoActual, error: fetchError } = await supabase
      .from("proyectos_solidarios")
      .select("cupos")
      .eq("id_proyecto", project.id_proyecto)
      .single();

    if (fetchError) throw fetchError;

    const decodeCupos = (raw: any): number => {
      if (typeof raw === "number") return raw;
      if (raw instanceof Uint8Array || raw instanceof ArrayBuffer) {
        return parseInt(new TextDecoder().decode(raw));
      }
      return parseInt(raw);
    };

    const cuposActuales = decodeCupos(proyectoActual.cupos);
    if (isNaN(cuposActuales) || cuposActuales <= 0) {
      throw new Error("No hay cupos disponibles.");
    }

    const { error: insertError } = await supabase
      .from("postulacion")
      .insert({
        matricula: form.matricula,
        id_proyecto: project.id_proyecto,
        estatus: "postulado",
        nombre: form.nombre,
        carrera: form.carreraCompleta,
        email: session.user.email,
        numero: form.telefono,
        respuesta_1: form.r1,
        respuesta_2: form.r2,
        respuesta_3: form.r3,
      });

    if (insertError) throw insertError;

    const { error: updateError } = await supabase
      .from("proyectos_solidarios")
      .update({ cupos: cuposActuales - 1 })
      .eq("id_proyecto", project.id_proyecto);

    if (updateError) throw updateError;

    router.push("/alumno/explorar");
  } catch (error) {
    console.error("Error submitting application:", error);
    setWarning("Error al enviar la postulación. Por favor intenta de nuevo.");
    setShowPopup(false);
  } finally {
    setIsSubmitting(false);
  }
};

  const handleNextClick = () => {
    const inputs = document.querySelectorAll("input, select") as NodeListOf<HTMLInputElement | HTMLSelectElement>;
    const missingFields: string[] = [];

    inputs.forEach((input) => {
      const label = input.closest("label")?.textContent || input.getAttribute("placeholder") || input.name;
      const fieldNamesMap: { [key: string]: string } = {
        "Ingresa tu nombre": "Nombre completo",
        "Ingresa tu matrícula": "Matrícula",
        "Ingresa tu carrera": "Carrera",
        "ejemplo@correo.com": "Correo electrónico",
        "Ingresa tu número": "Número de teléfono",
        "estatus": "Estatus",
        "proyecto": "Proyecto",
        "compromiso": "Compromiso",
      };

      const fieldName = fieldNamesMap[label] || label;

      if (
        (input.type === "radio" &&
          !document.querySelector(`input[name="${input.name}"]:checked`)) ||
        ((input.type !== "radio" && input.type !== "submit" && input.type !== "button") &&
          input.value.trim() === "")
      ) {
        if (!missingFields.includes(fieldName)) {
          missingFields.push(fieldName);
        }
      }
    });

    if (missingFields.length > 0) {
      setWarning(`Por favor completa los siguientes campos: ${missingFields.join(", ")}.`);
      return;
    }

    // Get the selected compromiso value
    const selectedCompromiso = document.querySelector('input[name="compromiso"]:checked') as HTMLInputElement;
    if (selectedCompromiso) {
      setCompromiso(selectedCompromiso.value);
    }

    setWarning("");
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

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