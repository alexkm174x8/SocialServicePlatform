"use client";

import { LucideIcon, UserIcon } from "lucide-react";

interface Props {
  titulo: string;
  Icono: LucideIcon;
  onClick?: () => void; 
}

export const HeaderBarAdmin = ({ titulo, Icono, onClick }: Props) => {

  return (
    <div
      className=" fixed top-0 left-20 right-0 bg-white px-4 py-3 flex justify-between items-center z-50 mt-2"
    >
      <div className=" flex items-center gap-3">
        {onClick ? (
          <button onClick={onClick} className="focus:outline-none">
            <Icono className="text-blue-900 cursor-pointer" size={40} />
          </button>
        ) : (
          <Icono className="text-blue-900" size={40} />
        )}
        
        <h1 className="text-2xl md:text-3xl font-bold text-blue-900">{titulo}</h1>
      </div>
    </div>
  );
};



