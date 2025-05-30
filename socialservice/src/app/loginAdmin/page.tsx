"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

export default function LoginAdmin() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showErrors, setShowErrors] = useState({
    correo: false,
    contrasena: false,
  });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          // Check if user is an admin
          const { data: { user } } = await supabase.auth.getUser();
          if (user?.user_metadata?.is_admin) {
            router.push('/admin/proyectos-solidarios');
          } else {
            // If not admin, sign them out
            await supabase.auth.signOut();
          }
        }
      } catch (err) {
        console.error('Session check error:', err);
      }
    };

    checkSession();
  }, [router]);

  const handleSubmit = async () => {
    // Reset states
    setError("");
    setShowErrors({
      correo: false,
      contrasena: false,
    });

    // Validate inputs
    const newErrors = {
      correo: correo.trim() === "",
      contrasena: contrasena.trim() === "",
    };

    setShowErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((val) => val);
    if (hasErrors) return;

    try {
      setIsLoading(true);

      // Attempt to sign in
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: correo,
        password: contrasena,
      });

      if (signInError) {
        if (signInError.message === 'Invalid login credentials') {
          setError('Correo o contraseña incorrectos');
        } else {
          setError('Error al iniciar sesión. Por favor, intenta de nuevo.');
        }
        console.error('Error signing in:', signInError);
        return;
      }

      // Get user metadata to check if they're an admin
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user?.user_metadata?.is_admin) {
        await supabase.auth.signOut();
        setError('Esta cuenta no tiene permisos de administrador.');
        return;
      }

      // Successful login - redirect to admin dashboard
      router.push('/admin/proyectos-solidarios');
      
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Ocurrió un error inesperado. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

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
            Gestión de <br /> Proyecto Solidario
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
            Hola, inicia sesión con tu cuenta registrada.
          </p>

          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="text-left space-y-4">
            <div>
              <label
                htmlFor="correo"
                className="block text-lg font-semibold text-[#0a2170] mb-1"
              >
                Correo del administrador
              </label>
              <input
                id="correo"
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="ejemplo@correo.com"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  showErrors.correo ? "border-red-500 ring-red-500" : "focus:ring-[#0a2170]"
                }`}
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
                id="contraseña"
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                placeholder="Contraseña"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  showErrors.contrasena ? "border-red-500 ring-red-500" : "focus:ring-[#0a2170]"
                }`}
              />
              {showErrors.contrasena && (
                <p className="text-red-600 text-sm mt-1">La contraseña es obligatoria.</p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full mt-6 px-6 py-2 border border-[#0a2170] text-[#0a2170] font-semibold rounded-lg hover:bg-[#0a2170] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Iniciando sesión...' : 'INICIAR SESIÓN'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
