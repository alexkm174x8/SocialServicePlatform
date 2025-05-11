"use client";
import Image from "next/image";
import { useState } from "react";

export default function LoginSocioformador() {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [showErrors, setShowErrors] = useState({
    correo: false,
    clave: false,
  });

  const handleSubmit = () => {
    const newErrors = {
      correo: correo.trim() === "",
      clave: clave.trim() === "",
    };

    setShowErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((val) => val);
    if (hasErrors) return;

    alert(`Correo: ${correo}, Clave: ${clave}`);
    // Aquí podrías manejar la autenticación real
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
            Hola, <br /> Socioformador!
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

          <div className="text-left space-y-4">
            <div>
              <label
                htmlFor="correo"
                className="block text-lg font-semibold text-[#0a2170] mb-1"
              >
                Correo del socioformador
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
                Clave otorgada
              </label>
              <input
                id="clave"
                type="password"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                placeholder="Clave"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  showErrors.clave ? "border-red-500 ring-red-500" : "focus:ring-[#0a2170]"
                }`}
              />
              {showErrors.clave && (
                <p className="text-red-600 text-sm mt-1">La clave es obligatoria.</p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              className="w-full mt-6 px-6 py-2 border border-[#0a2170] text-[#0a2170] font-semibold rounded-lg hover:bg-[#0a2170] hover:text-white transition"
            >
              INICIAR SESIÓN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
