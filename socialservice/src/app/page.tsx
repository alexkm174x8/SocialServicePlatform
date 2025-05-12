"use client";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Get error from URL if it exists
    const errorMessage = searchParams.get('error');
    if (errorMessage) {
      setError(decodeURIComponent(errorMessage));
    }

    // Check if we have a session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/alumno/explorar');
      }
    };
    checkSession();
  }, [searchParams, router]);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Starting Google login...');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            hd: 'tec.mx',
            access_type: 'offline',
            prompt: 'consent',
          },
          skipBrowserRedirect: false,
        },
      });

      if (error) {
        console.error('Login error:', error);
        throw error;
      }

      console.log('Login response:', data);

    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen">
      {/* LADO IZQUIERDO */}
      <div className="w-1/2 bg-[#0a2170] text-white flex flex-col items-center justify-center px-10">
        {/* Logo */}
        <div className="absolute top-6 left-6">
          <Image
            src="/logoss.svg"          
            alt="Logo de la plataforma"
            width={50}              
            height={50}
            className="mb-20"         
          />
        </div>

        <div className="text-left w-full max-w-sm mt-10">
          <h1 className="text-7xl font-extrabold leading-snug">
            Hola, <br /> Borrego!
          </h1>
        </div>
      </div>

      {/* LADO DERECHO */}
      <div className="w-1/2 bg-gray-100 flex items-center justify-center">
        <div className="text-center space-y-6 max-w">
          <h2 className="text-5xl md:text-4xl font-extrabold text-[#0a2170]">
            INICIAR SESIÓN
          </h2>
          <p className="text-gray-600 text-lg">
            Hola, inicia sesión con tu cuenta institucional.
          </p>

          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            className="w-full flex items-center justify-center gap-5 border px-5 py-2 rounded-lg text-sm font-medium shadow-sm bg-white hover:bg-gray-200 hover:shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span className="text-[#0a2170] font-semibold">
              {isLoading ? 'Iniciando sesión...' : 'Continuar con Google'}
            </span>
          </button>

          <p className="text-sm text-gray-500">
            Solo cuentas @tec.mx pueden acceder
          </p>
        </div>
      </div>
    </div>
  );
}
