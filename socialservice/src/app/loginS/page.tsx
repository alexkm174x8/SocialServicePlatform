"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

// Add type for project data
interface ProjectData {
  id_proyecto: string;
  nombre_proyecto: string;
  // Add other project fields as needed
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

export default function LoginSocioformador() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const [showErrors, setShowErrors] = useState({
    correo: false,
    clave: false,
  });

  // Single session check effect
  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        // First, ensure we're signed out
        await supabase.auth.signOut();
        sessionStorage.removeItem('projectInfo');
        
        if (mounted) {
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Session cleanup error:', err);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    checkSession();

    // Cleanup function
    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async () => {
    // Reset states
    setError("");
    setShowErrors({
      correo: false,
      clave: false,
    });

    // Validate inputs
    const newErrors = {
      correo: correo.trim() === "",
      clave: clave.trim() === "",
    };

    setShowErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((val) => val);
    if (hasErrors) return;

    try {
      setIsLoading(true);

      // Attempt to sign in
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: correo,
        password: clave,
      });

      if (signInError) {
        if (signInError.message === 'Invalid login credentials') {
          setError('Correo o contraseña incorrectos');
        } else {
          setError('Error al iniciar sesión. Por favor, intenta de nuevo.');
        }
        console.error('Error signing in:', signInError);
        setIsLoading(false);
        return;
      }

      // Get user metadata to check if it's a project account
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user?.user_metadata?.id_proyecto) {
        await supabase.auth.signOut();
        setError('Esta cuenta no tiene acceso a la plataforma de servicio social.');
        setIsLoading(false);
        return;
      }

      // Get project information
      const { data: projectData, error: projectError } = await supabase
        .from('proyectos_solidarios')
        .select('*')
        .eq('id_proyecto', user.user_metadata.id_proyecto)
        .single();

      if (projectError || !projectData) {
        await supabase.auth.signOut();
        setError('Error al obtener información del proyecto.');
        setIsLoading(false);
        return;
      }

      // Store project info
      sessionStorage.setItem('projectInfo', JSON.stringify(projectData as ProjectData));

      // Redirect to socio
      router.push('/socio');
      
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Ocurrió un error inesperado. Por favor, intenta de nuevo.');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  return (
    <div className="flex h-screen w-screen">
      {/* LADO IZQUIERDO */}
      <div className="w-1/2 bg-[#0a2170] text-white flex flex-col items-center justify-center px-10">
        <div className="absolute top-6 left-6">
          <Image
            src="/logoss.svg"
            alt="Logo de la plataforma"
            width={60}
            height={60}
            className="mb-20"
          />
        </div>

        <div className="text-left w-full max-w-lg mt-10">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-snug">
            ¡Hola, <br /> Socioformador!
          </h1>
        </div>
      </div>

      {/* LADO DERECHO */}
      <div className="w-1/2 bg-gray-100 flex items-center justify-center">
        <div className="text-center space-y-6 w-full max-w-xs md:max-w-md">
          <h2 className="text-4xl font-extrabold text-[#0a2170]">
            INICIAR SESIÓN
          </h2>
          <p className="text-gray-600 text-lg">
            ¡Hola! Inicia sesión con tu cuenta registrada.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="text-left space-y-4">
            <div>
              <label
                htmlFor="correo"
                className="block text-lg font-semibold text-[#0a2170] mb-1"
              >
                Correo del proyecto
              </label>
              <input
                id="correo"
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="proyecto.id@serviciosocial.com"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  showErrors.correo ? "border-red-500 ring-red-500" : "focus:ring-[#0a2170]"
                }`}
                disabled={isLoading}
              />
              {showErrors.correo && (
                <p className="text-red-600 text-sm mt-1">El correo es obligatorio.</p>
              )}
            </div>

            <div>
              <label
                htmlFor="clave"
                className="block text-lg font-semibold text-[#0a2170] mb-1"
              >
                Contraseña
              </label>
              <input
                id="clave"
                type="password"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                placeholder="Contraseña"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  showErrors.clave ? "border-red-500 ring-red-500" : "focus:ring-[#0a2170]"
                }`}
                disabled={isLoading}
              />
              {showErrors.clave && (
                <p className="text-red-600 text-sm mt-1">La contraseña es obligatoria.</p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full mt-6 px-6 py-2 border border-[#0a2170] text-[#0a2170] font-semibold rounded-lg transition
                ${isLoading 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-[#0a2170] hover:text-white'
                }`}
            >
              {isLoading ? 'INICIANDO SESIÓN...' : 'INICIAR SESIÓN'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}