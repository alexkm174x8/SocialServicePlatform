"use client"

import { HeaderBar } from "@/components/custom/HeaderBar"
import { SideBar } from "@/components/custom/SideBar"
import { Archive, Check, X, Loader2, Lock } from "lucide-react"
import { DetailButton } from "@/components/custom/DetailButton"

type Status = "completed" | "in-progress" | "locked" | "rejected"

type Step = {
  label: string
  status: Status
}

type CardProps = {
  title: string
  requestedDate: string
  updatedDate: string
  actionLabel: string
  steps: Step[]
}

const examples: CardProps[] = [
  {
    title: "Special Olympics",
    requestedDate: "03/03/25",
    updatedDate: "05/03/25",
    actionLabel: "Ver proyecto",
    steps: [
      { label: "Enviado", status: "completed" },
      { label: "Resultado", status: "completed" },
      { label: "Mi Respuesta", status: "completed" },
      { label: "Inscritx", status: "completed" },
    ],
  },
  {
    title: "Patitas sin Rumbo",
    requestedDate: "03/03/25",
    updatedDate: "05/03/25",
    actionLabel: "Ver proyecto",
    steps: [
      { label: "Enviado", status: "completed" },
      { label: "Resultado", status: "completed" },
      { label: "Mi Respuesta", status: "rejected" },
      { label: "Inscritx", status: "rejected" },
    ],
  },
  {
    title: "Patitas sin Rumbo",
    requestedDate: "03/03/25",
    updatedDate: "05/03/25",
    actionLabel: "Ver proyecto",
    steps: [
      { label: "Enviado", status: "completed" },
      { label: "Resultado", status: "completed" },
      { label: "Mi Respuesta", status: "in-progress" },
      { label: "Inscritx", status: "locked" },
    ],
  },
]

const getResponderButton = (status: Status) => {
  if (status === "completed") {
    return (
      <DetailButton texto="Responder" color="green" size="auto">
        Responder
      </DetailButton>
    )
  } else if (status === "in-progress") {
    return (
      <DetailButton texto="Responder" color="gray" size="auto">
        Responder
      </DetailButton>
    )
  } else if (status === "locked" || status === "rejected") {
    return (
      <DetailButton texto="Responder" color="gray" size="auto" disabled>
        Responder
      </DetailButton>
    )
  } else {
    return null
  }
}

const ProgressTrackerCard = ({ title, requestedDate, updatedDate, actionLabel, steps }: CardProps) => (
  <div className="w-full max-w-4xl mx-auto bg-[#0a2170] text-white rounded-xl p-4 md:p-6 mb-8">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 mt-2 md:mt-0">
        <div className="text-xs md:text-sm">
          <span className="opacity-80">Solicitado: </span>
          {requestedDate}
        </div>
        <div className="text-xs md:text-sm">
          <span className="opacity-80">Actualizado: </span>
          {updatedDate}
        </div>
        <DetailButton texto="Ver Proyecto" color="blue" size="auto">
          {actionLabel}
        </DetailButton>
        {getResponderButton(steps[steps.length - 1].status)}
      </div>
    </div>

    <div className="flex-1 flex items-center justify-center">
  <div className="flex items-center justify-center gap-4">
    {steps.map((step, index) => (
      <div key={index} className="flex items-center">
        {/* círculo */}
        <div className="flex flex-col items-center relative z-10">
          <div
            className={`
              w-12 h-12 rounded-full flex items-center justify-center
              ${
                step.status === "completed"
                  ? "bg-[#00c48c]"
                  : step.status === "rejected"
                  ? "bg-[#ff5757]"
                  : "bg-white"
              }
            `}
          >
            {step.status === "completed" && <Check className="w-5 h-5 text-white" />}
            {step.status === "rejected" && <X className="w-5 h-5 text-white" />}
            {step.status === "in-progress" && <Loader2 className="w-5 h-5 text-[#0a2170] animate-spin" />}
            {step.status === "locked" && <Lock className="w-5 h-5 text-[#0a2170]" />}
          </div>
          <div className="text-xs text-center mt-2 text-white">{step.label}</div>
        </div>

        {/* conector */}
        {index < steps.length - 1 && (
          <div className="w-30 h-0.5 mx-1">
            <div
              className={`
                h-full 
                ${
                  step.status === "rejected"
                    ? "bg-[#ff5757]"
                    : step.status === "completed" && steps[index + 1].status !== "locked"
                    ? "bg-[#00c48c]"
                    : "bg-gray-300"
                }
              `}
            />
          </div>
        )}
      </div>
    ))}
  </div>
</div>

  </div>
)

export default function Solicitudes() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideBar />
      <div className="flex-1 p-4 md:p-8">
        <HeaderBar titulo="Solicitudes" Icono={Archive} />
        <div className="space-y-6 mt-6">
          {examples.map((tracker, index) => (
            <ProgressTrackerCard key={index} {...tracker} />
          ))}
        </div>
      </div>
    </div>
  )
}
