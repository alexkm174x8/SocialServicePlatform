"use client";

import { LucideIcon, UserIcon } from "lucide-react";

interface Props {
  titulo: string;
  Icono: LucideIcon;
  onClick?: () => void; 
}

export const HeaderBar = ({ titulo, Icono, onClick }: Props) => {
  const id = "A01736897";

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-3">
        {onClick ? (
          <button onClick={onClick} className="focus:outline-none">
            <Icono className="text-blue-900 cursor-pointer" size={40} />
          </button>
        ) : (
          <Icono className="text-blue-900" size={40} />
        )}
        
        <h1 className="text-2xl md:text-3xl font-bold text-blue-900">{titulo}</h1>
      </div>

      <div className="flex items-center gap-2 text-blue-900 text-base md:text-lg font-medium">
        <UserIcon className="h-6 w-6" />
        <span>{id}</span>
      </div>
    </div>
  );
};



