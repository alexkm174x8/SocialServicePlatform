"use client"

import { useState, useEffect } from "react"
import { HeaderBar } from "@/app/components/HeaderBar"
import { SideBar } from "@/app/alumno/components/custom/StudentSideBar"
import { FileText, Check, X, Loader2, Lock, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

type Status = "completed" | "in-progress" | "locked" | "rejected"

type Step = {
  label: string
  status: Status
}

type PostulacionDB = {
  id_proyecto: number
  estatus: string
  email: string
  fecha_postulacion: string
  fecha_actualizacion: string
  proyectos_solidarios: {
    proyecto: string
  } | null
}

type CardProps = {
  title: string
  requestedDate: string
  updatedDate: string
  actionLabel: string
  steps: Step[]
  id_proyecto: number
}

const mapStatusToSteps = (estatus: string): Step[] => {
  const baseSteps = [
    { label: "Enviado", status: "completed" as Status },
    { label: "Resultado", status: "locked" as Status },
    { label: "Mi Respuesta", status: "locked" as Status },
  ]

  switch (estatus.toLowerCase()) {
    case "postulado":
      return baseSteps
    case "aceptado":
      return [
        { label: "Enviado", status: "completed" as Status },
        { label: "Resultado", status: "completed" as Status },
        { label: "Mi Respuesta", status: "in-progress" as Status },
      ]
    case "no":
      return [
        { label: "Enviado", status: "completed" as Status },
        { label: "Resultado", status: "rejected" as Status },
        { label: "Mi Respuesta", status: "rejected" as Status },
      ]
    case "esperando":
      return [
        { label: "Enviado", status: "completed" as Status },
        { label: "Resultado", status: "completed" as Status },
        { label: "Mi Respuesta", status: "in-progress" as Status },
      ]
    default:
      return baseSteps
  }
}

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

const ProgressTrackerCard = ({ title, requestedDate, updatedDate, actionLabel, steps, id_proyecto }: CardProps) => {
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

  const handleAccept = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user?.email) return

      const { error } = await supabase
        .from('postulacion')
        .update({ estatus: 'esperando' })
        .eq('email', session.user.email)
        .eq('id_proyecto', id_proyecto)

      if (error) throw error

      const updated = localSteps.map((step, i) => ({
        ...step,
        status: i >= 2 ? 'completed' as Status : step.status
      }))
      setLocalSteps(normalize(updated))
      setIsResponding(false)
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleReject = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user?.email) return

      const { error } = await supabase
        .from('postulacion')
        .update({ estatus: 'no' })
        .eq('email', session.user.email)
        .eq('id_proyecto', id_proyecto)

      if (error) throw error

      const updated = localSteps.map((step, i) => ({
        ...step,
        status: i >= 2 ? 'rejected' as Status : step.status
      }))
      setLocalSteps(normalize(updated))
      setIsResponding(false)
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  if (isResponding) {
    return (
      <div className="w-full lg:h-30 max-w-4xl mx-auto bg-[#0a2170] text-white rounded-xl p-4 md:p-6 mb-4">
        <div className="flex items-center mb-4">
          <ArrowLeft className="w-6 h-6 cursor-pointer mr-2" onClick={() => setIsResponding(false)} />
          <h2 className="text-xl font-bold"> {`¿Aceptas ${title} como proyecto solidario definitivo?`} </h2>
        </div>
        <div className="flex space-x-4 justify-center ">
          <ActionButton texto="Rechazar" size="auto" colorClass='bg-[#ff5757] hover:bg-red-600' onClick={handleReject} />
          <ActionButton texto="Aceptar" size="auto" colorClass='bg-[#00c48c] hover:bg-green-600' onClick={handleAccept} />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full lg:h-45 max-w-4xl mx-auto bg-[#0a2170] text-white rounded-xl p-4 md:p-6 mb-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 mt-1 md:mt-0">
          <div className="text-xs md:text-sm"><span className="opacity-80">Solicitado: </span>{requestedDate}</div>
          <div className="text-xs md:text-sm"><span className="opacity-80">Actualizado: </span>{updatedDate}</div>
          <div className="flex gap-2">
            <ActionButton 
              texto={actionLabel} 
              size="auto" 
              onClick={() => router.push(`/alumno/explorar/proyecto/${id_proyecto}`)} 
              colorClass="bg-white hover:bg-gray-100 text-[#0a2170] border border-[#0a2170]"
            />
            {renderResponderButton()}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center pb-6">
        <div className="flex items-center justify-center gap-4">
          {localSteps.map((step, index) => (
            <div key={`${step.label}-${index}`} className="flex items-center">
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
  const [postulaciones, setPostulaciones] = useState<PostulacionDB[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPostulaciones = async () => {
      try {
        setError(null)
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user?.email) {
          setError("No se encontró una sesión activa. Por favor inicia sesión.")
          return
        }

        const userEmail = session.user.email
        const { data, error } = await supabase
          .from('postulacion')
          .select(`
            id_proyecto,
            estatus,
            email,
            fecha_postulacion,
            proyectos_solidarios!inner (
              proyecto
            )
          `)
          .eq('email', userEmail)
          .returns<PostulacionDB[]>()

        if (error) throw error

        if (!data || data.length === 0) {
          setError("No se encontraron solicitudes para tu cuenta.")
          return
        }

        setPostulaciones(data)
      } catch (error: any) {
        console.error("Error fetching postulaciones:", error)
        setError("Error al cargar las solicitudes. Por favor intenta de nuevo.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPostulaciones()
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <SideBar />
        <div className="flex-1 p-4 md:p-4">
          <HeaderBar titulo="Solicitudes" Icono={FileText} />
          <main className="flex items-center justify-center mt-20 ml-30 mr-10">
            <Loader2 className="w-8 h-8 animate-spin text-blue-900" />
          </main>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <SideBar />
        <div className="flex-1 p-4 md:p-4">
          <HeaderBar titulo="Solicitudes" Icono={FileText} />
          <main className="flex justify-center mt-20 ml-30 mr-10">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              {error.includes("No se encontraron solicitudes") && (
                <button
                  onClick={() => window.location.href = '/alumno/explorar'}
                  className="bg-blue-400 hover:bg-blue-900 text-white font-semibold py-2 px-4 rounded-full transition duration-200"
                >
                  Explorar Proyectos
                </button>
              )}
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-white">
      <SideBar />
      <div className="flex-1 p-4 md:p-4">
        <HeaderBar titulo="Solicitudes" Icono={FileText} />
        <main className={`transition-all mt-20 ml-30 mr-10`}>
          <div className="space-y-6 mt-6">
            {postulaciones.map((postulacion) => (
              <ProgressTrackerCard
                key={postulacion.id_proyecto}
                title={postulacion.proyectos_solidarios?.proyecto || 'Proyecto no disponible'}
                requestedDate={new Date(postulacion.fecha_postulacion).toLocaleDateString()}
                updatedDate={new Date(postulacion.fecha_actualizacion).toLocaleDateString()}
                actionLabel="Ver proyecto"
                steps={mapStatusToSteps(postulacion.estatus)}
                id_proyecto={postulacion.id_proyecto}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

