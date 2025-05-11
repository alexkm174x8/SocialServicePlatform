"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { HeaderBar } from "@/app/components/HeaderBar";
import { SideBar } from "@/app/alumno/components/custom/StudentSideBar";
import { ArrowLeft } from "lucide-react";
import { PInput } from "@/app/alumno/components/custom/PInput";
import { DetalleProyecto } from "@/app/alumno/components/custom/DetalleProyecto";
import { Carrera } from "@/app/alumno/components/custom/Carrera";
import { RadioGroup } from "@/app/alumno/components/custom/RadioGroup";
import SubmissionConfirmation from "@/app/alumno/components/custom/SubmissionConfirmation";

export default function Formulario() {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [warning, setWarning] = useState("");

  const handleNextClick = () => {
    const inputs = document.querySelectorAll("input, select");
    const missingFields: string[] = [];

    inputs.forEach((input) => {
      const label = input.closest("label")?.textContent || input.getAttribute("placeholder") || input.name;
      if (
        (input.type === "radio" &&
          !document.querySelector(`input[name="${input.name}"]:checked`)) ||
        ((input.type !== "radio" && input.type !== "submit" && input.type !== "button") &&
          input.value.trim() === "")
      ) {
        if (!missingFields.includes(label)) {
          missingFields.push(label);
        }
      }
    });

    if (missingFields.length > 0) {
      setWarning(`Por favor completa los siguientes campos:\n- ${missingFields.join("\n- ")}`);
      return;
    }

    setWarning("");
    setShowPopup(true);
  };

  return (
    <main className="flex-1 overflow-y-auto mt-20 ml-30 mr-10 ">
      <div>
        <SideBar />
        <div className="flex flex-col flex-1 p-4">
          <HeaderBar 
            titulo="Proyecto" 
            Icono={ArrowLeft} 
            onClick={() => router.back()} 
          />
          <div className="max-w-2xl w-full mx-auto mt-4 rounded-lg p-6 border-blue-900 border-2">
            <div className="space-y-4">
              <PInput label="Nombre completo" placeholder="Ingresa tu nombre" />
              <PInput label="Matrícula" placeholder="Ingresa tu matrícula" />
              <Carrera
                carreras={["IBT", "IC", "LC", "IIS", "IM", "IMT", "IQ", "IRS", "ITC"]}
              />
              <PInput label="Por favor menciona el nombre completo de tu carrera" placeholder="Ingresa tu carrera" />
              <PInput label="Correo institucional" placeholder="ejemplo@correo.com" type="email" />
              <PInput label="Teléfono (a 10 dígitos y sin espacios)" placeholder="Ingresa tu número" type="tel" />
              <RadioGroup 
                label="Estatus en el que te encuentras:"
                name="estatus"
                options={["Postuladx"]}
              />
              <RadioGroup 
                label="Proyecto al que te estás postulando"
                name="proyecto"
                options={[
                  "PS 108 61319 EmpowerShe: Empoderamiento femenino mediante clases STEM - EmpowerShe FJ25"
                ]}
              />
              <DetalleProyecto
                detalles={{
                  modalidad: "MIXTO",
                  periodo: "1 - Del 11 de febrero al 13 marzo",
                  ubicacion:
                    'ESC. PRIM. “CADETE JUAN ESCUTIA”, Av. de Las Flores s/n INFONAVIT San José Xilotzingo, 72190 Puebla.',
                  diasEjecucion: [
                    "Asistencia presencial: 1 vez por semana",
                    "Asistencia remota: 2 veces por semana",
                    "Días presenciales: Sábados (semanales)",
                    "Días remotos: Acordar entre el alumno TEC y la alumna beneficiaria",
                    "Horas por día: 4h presenciales / 2h remotas",
                    "Horario presencial: 9:00 am - 1:00 pm",
                    "Horario remoto: Acordar entre ambas partes",
                  ],
                }}
              />
              <div >
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
              {warning && (
                <div className="text-red-600 whitespace-pre-line font-semibold">{warning}</div>
              )}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
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
        {showPopup && <SubmissionConfirmation />}
      </div>
    </main>
  );
}