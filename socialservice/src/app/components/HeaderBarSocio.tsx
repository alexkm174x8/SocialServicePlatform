"use client";

import Image from "next/image";

interface HeaderBarProps {
  proyecto: string;
}

export const HeaderBarSocio = ({ proyecto }: HeaderBarProps) => {
  return (
    <header className="fixed top-0 left-0 w-full flex items-center bg-[#0a2170] px-15 py-3 z-40 ">
      <div className="flex items-center gap-4">
        <Image
          src="/logoss.svg" // Asegúrate que este archivo esté en /public
          alt="Logo"
          width={25}
          height={25}
        />
        <h1 className="text-2xl md:text-2xl font-extrabold text-white">
        {`Solicitudes para ${proyecto}`}
        </h1>
      </div>
    </header>
  );
};
