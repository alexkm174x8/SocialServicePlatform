"use client";
import Image from "next/image";

export default function Login() {
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
          <h1 className="text-6xl font-extrabold leading-snug">
            Gestión de <br /> Proyecto Solidario
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

          <button
            className="w-full flex items-center justify-center gap-5 border px-5 py-2 rounded-lg text-sm font-medium shadow-sm bg-white hover:bg-gray-200 hover:shadow-md transition"
            onClick={() => alert("Login con Google")}
            >
            <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
            />
            <span className="text-[#0a2170] font-semibold">
                Continuar con Google
            </span>
            </button>

        </div>
      </div>
    </div>
  );
}
