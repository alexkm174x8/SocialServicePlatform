"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string>("Ha ocurrido un error inesperado.");

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      setErrorMessage(decodeURIComponent(error));
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-blue-300 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="text-red-600 text-6xl mb-4">⚠️</div>
        <h1 className="text-3xl font-bold mb-2">¡Ups! Algo salió mal</h1>
        <p className="text-gray-700 mb-6">{errorMessage}</p>

        <button
          onClick={() => router.back()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition"
        >
          Volver atrás
        </button>

        <p className="mt-4 text-sm text-gray-400">Si el problema persiste, contacta al equipo técnico.</p>
      </div>
    </div>
  );
}
