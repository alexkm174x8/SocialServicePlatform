"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Error desde los query params
    const errorMessage = searchParams.get("error");
    if (errorMessage) {
      setUrlError(decodeURIComponent(errorMessage));
    }

    // Verificar si ya hay sesión
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/alumno/explorar");
      }
    };

    checkSession();
  }, [searchParams, router]);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            hd: "tec.mx",
            access_type: "offline",
            prompt: "consent",
          },
          skipBrowserRedirect: false,
        },
      });

      if (error) {
        console.error("Login error:", error);
        throw error;
      }

    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Ocurrió un error al iniciar sesión.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen">
      {/* ALERTA DE ERROR DESDE LA URL */}
      {urlError && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-6 py-3 rounded shadow-lg z-50 max-w-md w-full text-center">
          <strong className="font-bold">¡Error! </strong>
          <span>{urlError}</span>
        </div>
      )}

      {/* LADO IZQUIERDO */}
      <div className="w-1/2 bg-[#0a2170] text-white flex flex-col items-center justify-center px-10 relative">
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
        <div className="text-center space-y-6 max-w-xs">
          <h2 className="text-5xl md:text-4xl font-extrabold text-[#0a2170]">
            INICIAR SESIÓN
          </h2>
          <p className="text-gray-600 text-lg">
            Hola, inicia sesión con tu cuenta institucional.
          </p>

          {/* ERROR LOCAL */}
          {error && (
            <div className="text-red-600 text-sm bg-red-50 border border-red-300 px-4 py-2 rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-5 border px-5 py-2 rounded-lg text-sm font-medium shadow-sm bg-white hover:bg-gray-200 hover:shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span className="text-[#0a2170] font-semibold">
              {isLoading ? "Iniciando sesión..." : "Continuar con Google"}
            </span>
          </button>

          <p className="text-sm text-gray-500">
            Solo cuentas <strong>@tec.mx</strong> pueden acceder
          </p>
        </div>
      </div>
    </div>
  );
}
