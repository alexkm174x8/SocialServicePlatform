"use client"

import { useState, useEffect } from "react"
import { HeaderBar } from "@/app/components/HeaderBar"
import { SideBar } from "@/app/alumno/components/custom/StudentSideBar"
import { FileText, Check, X, Loader2, Lock, ArrowLeft, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

type Status = "completed" | "in-progress" | "locked" | "rejected" | "warning"

type Step = {
  label: string
  status: Status
  message?: string
}

type PostulacionDB = {
  id_proyecto: number
  estatus: string
  email: string
  proyectos_solidarios: {
    proyecto: string
  }
}

type Postulacion = {
  id_proyecto: number
  proyecto: string
  estatus: string
  fecha_postulacion: string
  fecha_actualizacion: string
}

type DBStatus = "postuladx" | "no aceptadx" | "aceptadx" | "aceptadx por el alumnx" | "declinadx por el alumnx" | "inscritx" | "no inscritx"

type CardProps = {
  title: string
  requestedDate: string
  //updatedDate: string
  actionLabel: string
  steps: Step[]
  id_proyecto: number
}

const mapStatusToSteps = (estatus: string): Step[] => {
  const baseSteps = [
    { label: "Enviado", status: "completed" as Status },
    { label: "Resultado", status: "in-progress" as Status },
    { label: "Mi Respuesta", status: "locked" as Status },
  ]

  switch (estatus.toLowerCase()) {
    case "postuladx":
      return [
        { label: "Enviado", status: "completed" as Status },
        { label: "Resultado", status: "in-progress" as Status },
        { label: "Mi Respuesta", status: "locked" as Status },
      ]
    case "no aceptadx":
      return [
        { label: "Enviado", status: "completed" as Status },
        { label: "Resultado", status: "rejected" as Status },
        { label: "Mi Respuesta", status: "rejected" as Status },
      ]
    case "aceptadx":
      return [
        { label: "Enviado", status: "completed" as Status },
        { label: "Resultado", status: "completed" as Status },
        { label: "Mi Respuesta", status: "in-progress" as Status },
      ]
    case "aceptadx por el alumnx":
      return [
        { label: "Enviado", status: "completed" as Status },
        { label: "Resultado", status: "completed" as Status },
        { label: "Mi Respuesta", status: "completed" as Status },
      ]
    case "declinadx por el alumnx":
      return [
        { label: "Enviado", status: "completed" as Status },
        { label: "Resultado", status: "completed" as Status },
        { label: "Mi Respuesta", status: "rejected" as Status },
      ]
    case "inscritx":
      return [
        { label: "Enviado", status: "completed" as Status },
        { label: "Resultado", status: "completed" as Status },
        { label: "Mi Respuesta", status: "completed" as Status },
      ]
    case "no inscritx":
      return [
        { label: "Enviado", status: "completed" as Status },
        { label: "Resultado", status: "completed" as Status },
        { label: "Mi Respuesta", status: "completed" as Status },
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
  showTooltip?: boolean
  tooltipText?: string
}

const ActionButton = ({ texto, size, colorClass = 'bg-blue-400 hover:bg-blue-900', onClick, disabled, showTooltip, tooltipText }: ActionButtonProps) => (
  <div className="relative inline-block group">
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
    {showTooltip && tooltipText && (
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-red-600 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
        <div className="flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          <span>{tooltipText}</span>
        </div>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-600"></div>
      </div>
    )}
  </div>
)

const ProgressTrackerCard = ({ title, requestedDate, actionLabel, steps, id_proyecto }: CardProps) => {
  const incrementarCupos = async () => {
  const { data, error } = await supabase
    .from('proyectos_solidarios')
    .select('cupos')
    .eq('id_proyecto', id_proyecto)
    .single()

  if (error) {
    console.error("Error al obtener cupos:", error)
    return
  }

  const nuevoCupo = data.cupos + 1

  const { error: updateError } = await supabase
    .from('proyectos_solidarios')
    .update({ cupos: nuevoCupo })
    .eq('id_proyecto', id_proyecto)

  if (updateError) {
    console.error("Error al actualizar cupos:", updateError)
  } else {
    console.log("Cupo incrementado correctamente")
  }
}

  const router = useRouter()
  const [localSteps, setLocalSteps] = useState<Step[]>([])
  const [isResponding, setIsResponding] = useState(false)
  const [currentDBStatus, setCurrentDBStatus] = useState<DBStatus>("postuladx")
  const [hasAcceptedProject, setHasAcceptedProject] = useState(false)
  const [isCheckingAcceptance, setIsCheckingAcceptance] = useState(true)

  // Check if student already has an accepted project
  useEffect(() => {
    const checkAcceptedProjects = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user?.email) return

        const userEmail = session.user.email
        
        const { data, error } = await supabase
          .from('postulacion')
          .select('estatus, id_proyecto')
          .eq('email', userEmail)
          .in('estatus', ['Aceptadx por el alumnx', 'Inscritx'])

        if (error) {
          console.error('Error checking accepted projects:', error)
          return
        }

        // Check if there's an accepted project that's not the current one
        // Handle potential duplicates by checking if any row has a different project ID
        const hasOtherAcceptedProject = data.some(item => 
          item.id_proyecto !== id_proyecto && 
          ['Aceptadx por el alumnx', 'Inscritx'].includes(item.estatus)
        )
        
        setHasAcceptedProject(hasOtherAcceptedProject)
      } catch (error) {
        console.error('Error in checkAcceptedProjects:', error)
      } finally {
        setIsCheckingAcceptance(false)
      }
    }

    checkAcceptedProjects()
  }, [id_proyecto])

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('postulacion')
          .select('estatus')
          .eq('id_proyecto', id_proyecto)

        if (error) throw error

        if (data && data.length > 0) {
          // If multiple rows exist, take the first one or the most recent one
          // You might want to add a timestamp column to get the most recent
          const status = data[0].estatus.toLowerCase() as DBStatus
          console.log('Fetched DB status:', status)
          setCurrentDBStatus(status)
          if (["no aceptadx", "declinadx por el alumnx", "no inscritx"].includes(status)) {
            await incrementarCupos()
          }
        }
      } catch (error) {
        console.error('Error fetching status:', error)
      }
    }
    fetchStatus()
  }, [id_proyecto])

  useEffect(() => {
    console.log('Current DB status changed:', currentDBStatus)
    // Re-normalize steps when DB status changes
    if (localSteps.length > 0) {
      const normalized = normalize([...localSteps.slice(0, 3)])
      setLocalSteps(normalized)
    }
  }, [currentDBStatus])

  const normalize = (arr: Step[]) => {
    console.log('Normalizing steps with DB status:', currentDBStatus)
    if (arr.length === 4) {
      console.log('Steps already normalized:', arr)
      return arr
    }
    
    const base = [...arr]
    let insStatus: Status = 'locked'
    let insMessage: string | undefined = undefined

    // Set Inscritx status based on database status
    switch (currentDBStatus) {
      case 'aceptadx por el alumnx':
        console.log('Setting status for aceptadx por el alumnx')
        insStatus = 'in-progress'
        break
      case 'inscritx':
        console.log('Setting status for inscritx')
        // Ensure all previous steps are completed
        base.forEach(step => {
          step.status = 'completed'
        })
        insStatus = 'completed'
        break
      case 'no inscritx':
        console.log('Setting status for no inscritx')
        insStatus = 'warning'
        insMessage = "Por favor contacta al departamento de servicio social para completar tu inscripción"
        break
      default:
        console.log('Setting default status')
        if (base[0].status === 'completed' && 
            base[1].status === 'completed' && 
            base[2].status === 'completed') {
          insStatus = 'in-progress'
        }
    }
    
    if (base[1].status === 'rejected') {
      console.log('Cascading rejection')
      for (let i = 2; i < base.length; i++) {
        base[i].status = 'rejected'
      }
      insStatus = 'rejected'
    }
    
    const result = [...base, { label: 'Inscritx', status: insStatus, message: insMessage }]
    console.log('Normalized result:', result)
    return result
  }

  useEffect(() => {
    console.log('Initial steps:', steps)
    setLocalSteps(normalize(steps))
  }, [steps])

  const canRespond = localSteps[2]?.status === 'in-progress' && !hasAcceptedProject && !isCheckingAcceptance

  const renderResponderButton = () => {
    const handleClick = () => setIsResponding(true)
    const baseProps = { texto: 'Responder', size: 'auto' as const, onClick: handleClick, disabled: !canRespond }
    const colorClass = canRespond ? 'bg-[#fc8b01] hover:bg-[#faa846]' : 'bg-gray-400 hover:bg-gray-600'
    return <ActionButton {...baseProps} colorClass={colorClass} />
      {/*
    const handleClick = () => {
      if (hasAcceptedProject) {
        // Show a more prominent message or prevent action
        return
      }
      setIsResponding(true)
    }
    
    const baseProps = { 
      texto: 'Responder', 
      size: 'auto' as const, 
      onClick: handleClick, 
      disabled: !canRespond 
    }
    
    let colorClass = 'bg-gray-400 hover:bg-gray-600'
    if (canRespond) {
      colorClass = 'bg-green-400 hover:bg-green-900'
    } else if (hasAcceptedProject) {
      colorClass = 'bg-orange-400 hover:bg-orange-600'
    }
    
    return (
      <ActionButton 
        {...baseProps} 
        colorClass={colorClass}
        showTooltip={hasAcceptedProject && localSteps[2]?.status === 'in-progress'}
        tooltipText="Ya tienes un proyecto aceptado"
      />
    )
    */}
  }

  if (isResponding) {
    const handleAccept = async () => {
      try {
        console.log('Handling accept')
        const { error } = await supabase
          .from('postulacion')
          .update({ estatus: 'Aceptadx por el alumnx' })
          .eq('id_proyecto', id_proyecto)

        if (error) throw error

        console.log('DB updated to aceptadx por el alumnx')
        setCurrentDBStatus('aceptadx por el alumnx')
        setIsResponding(false)
      } catch (error) {
        console.error('Error updating status:', error)
      }
    }

    const handleReject = async () => {
  try {
    const { error } = await supabase
      .from('postulacion')
      .update({ estatus: 'Declinadx por el alumnx' })
      .eq('id_proyecto', id_proyecto)

    if (error) throw error

    await incrementarCupos()

    setCurrentDBStatus('declinadx por el alumnx')
    setIsResponding(false)
  } catch (error) {
    console.error('Error updating status:', error)
  }
}


    return (
      <div className="w-full lg:h-50 max-w-4xl mx-auto bg-[#0a2170] text-white rounded-xl p-4 md:p-6 mb-4">
        <div className="flex items-center mb-4">
          <ArrowLeft className="w-6 h-6 cursor-pointer mr-2" onClick={() => setIsResponding(false)} />
          <h2 className="text-xl font-bold"> {`¿Aceptas "${title}" como proyecto solidario definitivo?`} </h2>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 my-12">
          <div className="flex space-x-4 w-full md:w-auto justify-center">
            <ActionButton 
              texto="Rechazar" 
              size="auto" 
              colorClass='bg-[#ff5757] hover:bg-red-600' 
              onClick={handleReject} 
            />
            <ActionButton 
              texto="Aceptar" 
              size="auto" 
              colorClass='bg-[#00c48c] hover:bg-green-600' 
              onClick={handleAccept} 
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full lg:h-50 max-w-4xl mx-auto bg-[#0a2170] text-white rounded-xl p-4 md:p-6 mb-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 mt-1 md:mt-0">
          <div className="text-xs md:text-sm"><span className="opacity-80">Solicitado: </span>{requestedDate}</div>
          {/*<div className="text-xs md:text-sm"><span className="opacity-80">Actualizado: </span>{updatedDate}</div>*/}
          <div className="flex gap-2">
            <ActionButton 
              texto={actionLabel} 
              size="auto" 
              onClick={() => router.push(`/alumno/explorar/proyecto/${id_proyecto}`)} 
              colorClass="bg-[#3455c2] hover:bg-[#4e6dd4] text-[#0a2170] border border-[#0a2170]"
            />
            {renderResponderButton()}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center justify-center gap-4">
          {localSteps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className="flex flex-col items-center relative z-10">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  step.status === "completed" ? "bg-[#00c48c]" : 
                  step.status === "rejected" ? "bg-[#ff5757]" : 
                  step.status === "warning" ? "bg-yellow-500" :
                  "bg-white"
                }`}>
                  {step.status === "completed" && <Check className="w-5 h-5 text-white" />}
                  {step.status === "rejected" && <X className="w-5 h-5 text-white" />}
                  {step.status === "in-progress" && <Loader2 className="w-5 h-5 text-[#0a2170] animate-spin" />}
                  {step.status === "warning" && <AlertTriangle className="w-5 h-5 text-white" />}
                  {step.status === "locked" && <Lock className="w-5 h-5 text-[#0a2170]" />}
                </div>
                <div className="text-xs text-center mt-2 text-white">{step.label}</div>
                {step.message && (
                  <div className="absolute top-full mt-2 w-64 p-2 bg-yellow-500 text-white text-xs rounded-lg shadow-lg">
                    {step.message}
                  </div>
                )}
              </div>
              {index < localSteps.length - 1 && (
                <div className="w-30 h-0.5 mx-1">
                  <div className={`h-full ${
                    step.status === "rejected" ? "bg-[#ff5757]" : 
                    step.status === "warning" ? "bg-yellow-500" :
                    step.status === "completed" && localSteps[index + 1].status !== "locked" ? "bg-[#00c48c]" : 
                    "bg-gray-300"
                  }`} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Solicitudes() {
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPostulaciones = async () => {
      try {
        setError(null)
        // Get the current user's session
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user?.email) {
          setError("No se encontró una sesión activa. Por favor inicia sesión.")
          return
        }

        const userEmail = session.user.email
        console.log("Fetching applications for user:", userEmail)

        // Fetch postulaciones for this specific user's email
        const { data, error } = await supabase
          .from('postulacion')
          .select(`
            id_proyecto,
            estatus,
            email,
            proyectos_solidarios (
              proyecto
            )
          `)
          .eq('email', userEmail) // Filter by the user's email
          .returns<PostulacionDB[]>()

        if (error) {
          console.error("Error fetching postulaciones:", error)
          setError("Error al cargar las solicitudes. Por favor intenta de nuevo.")
          return
        }

        if (!data || data.length === 0) {
          setError("No se encontraron solicitudes para tu cuenta.")
          return
        }

        // Format the data
        const formattedData: Postulacion[] = data.map(item => ({
          id_proyecto: item.id_proyecto,
          proyecto: item.proyectos_solidarios.proyecto,
          estatus: item.estatus,
          fecha_postulacion: new Date().toISOString(), // You might want to add this column to your database
          fecha_actualizacion: new Date().toISOString(), // You might want to add this column to your database
        }))

        setPostulaciones(formattedData)
      } catch (error) {
        console.error("Error in fetchPostulaciones:", error)
        setError("Ocurrió un error inesperado. Por favor intenta de nuevo.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPostulaciones()
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-white">
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
      <div className="flex min-h-screen bg-white">
        <SideBar />
        <div className="flex-1 p-4 md:p-4">
          <HeaderBar titulo="Solicitudes" Icono={FileText} />
          <main className="flex items-center justify-center mt-20 ml-30 mr-10">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              {error.includes("No se encontraron solicitudes") && (
                <button
                  onClick={() => window.location.href = '/alumno/explorar'}
                  className="bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-full transition duration-200"
                >
                  ¡Explora los proyectos disponibles!
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
                title={postulacion.proyecto}
                requestedDate={new Date(postulacion.fecha_postulacion).toLocaleDateString()}
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

