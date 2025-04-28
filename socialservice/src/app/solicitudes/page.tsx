"use client"

import { useState, useEffect } from "react"
import { HeaderBar } from "@/components/custom/HeaderBar"
import { SideBar } from "@/components/custom/SideBar"
import { Archive, Check, X, Loader2, Lock, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

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
      { label: "Mi Respuesta", status: "in-progress" },
    ],
  },
  {
    title: "Patitas sin Rumbo",
    requestedDate: "03/03/25",
    updatedDate: "05/03/25",
    actionLabel: "Ver proyecto",
    steps: [
      { label: "Enviado", status: "completed" },
      { label: "Resultado", status: "rejected" },
      { label: "Mi Respuesta", status: "rejected" },
    ],
  },
  {
    title: "Proyecto X",
    requestedDate: "04/04/25",
    updatedDate: "04/04/25",
    actionLabel: "Ver proyecto",
    steps: [
      { label: "Enviado", status: "completed" },
      { label: "Resultado", status: "completed" },
      { label: "Mi Respuesta", status: "completed" },
    ],
  },
]

interface ActionButtonProps {
  texto: string
  size: 'full' | 'auto'
  colorClass?: string
  onClick?: () => void
  disabled?: boolean
}

const ActionButton = ({ texto, size, colorClass = 'bg-blue-400 hover:bg-blue-900', onClick, disabled }: ActionButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={
      `
        ${colorClass}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        text-white font-semibold text-sm
        px-8 py-[6px]
        rounded-full
        flex items-center justify-center
        leading-tight
        transition duration-200
        ${size === 'full' ? 'w-full' : 'w-auto'}
      `
    }
  >
    {texto}
  </button>
)

const ProgressTrackerCard = ({ title, requestedDate, updatedDate, actionLabel, steps }: CardProps) => {
  const router = useRouter()
  const [localSteps, setLocalSteps] = useState<Step[]>([])
  const [isResponding, setIsResponding] = useState(false)

  const normalize = (arr: Step[]) => {
    const base = [...arr]
    // Determina estado de Inscritx
    const resp = base[2].status
    let insStatus: Status = 'locked'
    if (resp === 'completed') insStatus = 'completed'
    else if (resp === 'rejected') insStatus = 'rejected'
    const all = [...base, { label: 'Inscritx', status: insStatus }]
    if (all[1].status === 'rejected') {
      for (let i = 2; i < all.length; i++) all[i].status = 'rejected'
    }
    return all
  }

  useEffect(() => {
    setLocalSteps(normalize(steps))
  }, [steps])

  
  const canRespond = localSteps[2]?.status === 'in-progress'

  const renderResponderButton = () => {
    const handleClick = () => setIsResponding(true)
    const baseProps = { texto: 'Responder', size: 'auto' as const, onClick: handleClick, disabled: !canRespond }
    const colorClass = canRespond ? 'bg-blue-400 hover:bg-blue-900' : 'bg-gray-400 hover:bg-gray-600'
    return <ActionButton {...baseProps} colorClass={colorClass} />
  }

  if (isResponding) {
    const handleAccept = () => {
      const updated = localSteps.map((step, i) => ({
        ...step,
        status: i >= 2 ? 'completed' as Status : step.status
      }))
      setLocalSteps(normalize(updated))
      setIsResponding(false)
    }
    const handleReject = () => {
      const updated = localSteps.map((step, i) => ({
        ...step,
        status: i >= 2 ? 'rejected' as Status : step.status
      }))
      setLocalSteps(normalize(updated))
      setIsResponding(false)
    }

    return (
      <div className="w-full  lg:h-50 max-w-4xl mx-auto bg-[#0a2170] text-white rounded-xl p-4 md:p-6 mb-8">
        <div className="flex items-center mb-4">
          <ArrowLeft className="w-6 h-6 cursor-pointer mr-2" onClick={() => setIsResponding(false)} />
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
        <div className="flex space-x-4 justify-center ">
          <ActionButton texto="Rechazar" size="auto" colorClass='bg-red-400 hover:bg-red-600' onClick={handleReject} />
          <ActionButton texto="Aceptar" size="auto" colorClass='bg-green-400 hover:bg-green-600' onClick={handleAccept} />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full lg:h-50 max-w-4xl mx-auto bg-[#0a2170] text-white rounded-xl p-4 md:p-6 mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 mt-2 md:mt-0">
          <div className="text-xs md:text-sm"><span className="opacity-80">Solicitado: </span>{requestedDate}</div>
          <div className="text-xs md:text-sm"><span className="opacity-80">Actualizado: </span>{updatedDate}</div>
          <ActionButton texto={actionLabel} size="auto" onClick={() => router.push("/explorar/proyecto")} />
          {renderResponderButton()}
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="flex items-center justify-center gap-4">
          {localSteps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className="flex flex-col items-center relative z-10">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  step.status === "completed" ? "bg-[#00c48c]" : step.status === "rejected" ? "bg-[#ff5757]" : "bg-white"
                }`}>
                  {step.status === "completed" && <Check className="w-5 h-5 text-white" />}
                  {step.status === "rejected" && <X className="w-5 h-5 text-white" />}
                  {step.status === "in-progress" && <Loader2 className="w-5 h-5 text-[#0a2170] animate-spin" />}
                  {step.status === "locked" && <Lock className="w-5 h-5 text-[#0a2170]" />}
                </div>
                <div className="text-xs text-center mt-2 text-white">{step.label}</div>
              </div>
              {index < localSteps.length - 1 && (
                <div className="w-30 h-0.5 mx-1"><div className={`h-full ${
                  step.status === "rejected" ? "bg-[#ff5757]" : step.status === "completed" && localSteps[index + 1].status !== "locked" ? "bg-[#00c48c]" : "bg-gray-300"
                }`} /></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Solicitudes() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideBar />
      <div className="flex-1 p-4 md:p-8">
        <HeaderBar titulo="Solicitudes" Icono={Archive} />
        <main className={`transition-all mt-20 ml-30 mr-10`}>
          <div className="space-y-6 mt-6">
            {examples.map((tracker, index) => (
              <ProgressTrackerCard key={index} {...tracker} />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

