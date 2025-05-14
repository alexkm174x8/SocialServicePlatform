"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { HeaderBar } from "@/app/components/HeaderBar";
import { SideBar } from "@/app/alumno/components/custom/StudentSideBar";
import { ArrowLeft } from "lucide-react";
import { DetalleProyecto } from "@/app/alumno/components/custom/DetalleProyecto";
import { Carrera } from "@/app/alumno/components/custom/Carrera";
import { RadioGroup } from "@/app/alumno/components/custom/RadioGroup";
import SubmissionConfirmation from "@/app/alumno/components/custom/SubmissionConfirmation";
import { supabase } from "@/lib/supabase";

type ProjectData = {
  id_proyecto: number;
  proyecto: string;
  modalidad: string;
  fecha_ejecucion: string;
  ubicacion: string;
  horario: string;
  horas: number;
};

export default function Formulario() {
  const router = useRouter();
  const params = useParams();
  const [showPopup, setShowPopup] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [warning, setWarning] = useState("");
  const [project, setProject] = useState<ProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    matricula: "",
    carreraCompleta: "",
    correo: "",
    telefono: "",
  });

  const [estatus, setEstatus] = useState("");
  const [proyecto, setProyecto] = useState("");
  const [compromiso, setCompromiso] = useState("");

  useEffect(() => {
    const fetchProjectDetails = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("proyectos_solidarios")
          .select("*")
          .eq("id_proyecto", params.id)
          .single();

        if (error) throw error;
        
        setProject(data);
        setProyecto(data.proyecto);
      } catch (error) {
        console.error("Error fetching project:", error);
        router.push("/alumno/explorar"); 
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) fetchProjectDetails();
  }, [params.id, router]);

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
    if (!project) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("postulacion")
        .insert({
          matricula: form.matricula,
          id_proyecto: project.id_proyecto,
          estatus: "postulado",
          nombre: form.nombre,
          carrera: form.carreraCompleta,
          email: form.correo,
          numero: form.telefono,
          respuesta_1: null,
          respuesta_2: null,
          respuesta_3: null
        });

      if (error) throw error;

      // Redirect to explore page after successful submission
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
      <main className="flex-1 overflow-y-auto mt-20 ml-30 mr-10">
        <div className="flex justify-center items-center h-full">
          <p>Cargando...</p>
        </div>
      </main>
    );
  }

  if (!project) {
    return null; 
  }

  return (
    <main className="flex-1 overflow-y-auto mt-20 ml-30 mr-10">
      <div>
        <SideBar />
        <div className="flex flex-col flex-1 p-4">
          <HeaderBar titulo="Proyecto" Icono={ArrowLeft} onClick={() => router.back()} />
          <div className="max-w-2xl w-full mx-auto mt-4 rounded-md p-6 border-blue-900 border-2">
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-[#0a2170]">Nombre completo</label>
                <input
                  name="nombre"
                  type="text"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Ingresa tu nombre"
                  className="w-full border rounded-md p-2"
                />
                {errors.nombre && <p className="text-red-600">{errors.nombre}</p>}
              </div>

              <div>
                <label className="block font-semibold text-[#0a2170]">Matrícula</label>
                <input
                  name="matricula"
                  type="text"
                  value={form.matricula}
                  onChange={handleChange}
                  placeholder="Ingresa tu matrícula"
                  className="w-full border rounded-md p-2"
                />
                {errors.matricula && <p className="text-red-600">{errors.matricula}</p>}
              </div>

              <Carrera carreras={["IBT", "IC", "LC", "IIS", "IM", "IMT", "IQ", "IRS", "ITC"]} />

              <div>
                <label className="block font-semibold text-[#0a2170]">Correo institucional</label>
                <input
                  name="correo"
                  type="email"
                  value={form.correo}
                  onChange={handleChange}
                  placeholder="ejemplo@correo.com"
                  className="w-full border rounded-md p-2"
                />
                {errors.correo && <p className="text-red-600">{errors.correo}</p>}
              </div>

              <div>
                <label className="block font-semibold text-[#0a2170]">Teléfono (a 10 dígitos y sin espacios)</label>
                <input
                  name="telefono"
                  type="tel"
                  value={form.telefono}
                  onChange={handleChange}
                  placeholder="Ingresa tu número"
                  className="w-full border rounded-md p-2"
                />
                {errors.telefono && <p className="text-red-600">{errors.telefono}</p>}
              </div>

              <RadioGroup 
                label="Estatus en el que te encuentras:"
                name="estatus"
                options={["Postuladx"]}
                value={estatus}
                onChange={setEstatus}
              />
              <RadioGroup 
                label="Proyecto al que te estás postulando"
                name="proyecto"
                options={[project.proyecto]}
                value={proyecto}
                onChange={setProyecto}
              />
              <DetalleProyecto
                detalles={{
                  modalidad: project.modalidad,
                  periodo: project.fecha_ejecucion,
                  ubicacion: project.ubicacion,
                  diasEjecucion: [
                    `Horario: ${project.horario}`,
                    `Horas totales: ${project.horas}`,
                  ],
                }}
              />

              <div>
                <label className="block font-semibold text-[#0a2170]">
                  ¿Estás dispuestx a seguir con las postulación?
                </label>
                <div className="space-y-3 text-sm text-gray-800">
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      id="si-compromiso"
                      name="compromiso"
                      value="si"
                      className="accent-[#0a2170] mt-1"
                    />
                    <label htmlFor="si-compromiso" className="block">
                      Sí, estoy dispuestx a ejecutar el Proyecto Solidario con las condiciones de días y horarios requeridos.
                    </label>
                  </div>
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      id="no-compromiso"
                      name="compromiso"
                      value="no"
                      className="accent-[#0a2170] mt-1"
                    />
                    <label htmlFor="no-compromiso" className="block">
                      No, mis actividades escolares y personales no me permitirán participar en el proyecto. Gracias.
                    </label>
                  </div>
                </div>
              </div>

              {warning && <p className="text-red-600">{warning}</p>}

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2 rounded-full border border-[#0a2170] text-[#0a2170] font-semibold 
                            hover:bg-[#0a2170] hover:text-white transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleNextClick}
                  className="px-6 py-2 rounded-full border border-[#0a2170] bg-[#0a2170] text-white font-semibold 
                            hover:bg-black hover:text-white hover:border-black transition-colors duration-200"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>
        {showPopup && (
          <SubmissionConfirmation 
            onClose={() => setShowPopup(false)} 
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </main>
  );
} 