'use client';

import { useRouter } from "next/navigation";

interface Props {
  texto: string;
  color: string;
  id_proyecto: number;
}

export const PostularseButton = ({ texto, id_proyecto }: Props) => {
  const router = useRouter();
  
  const handleNavigation = () => {
    router.push(`/alumno/explorar/proyecto/formulario/${id_proyecto}`);
  };
  
  return (
    <button
      onClick={handleNavigation}
      className={`
        bg-blue-900 hover:bg-[#3154bb]
        text-white font-semibold text-md
        px-10 py-[10px] 
        rounded-full
        flex items-center justify-center
        leading-tight  
        transition duration-200
      `}
    >
      {texto}
    </button>
  );
};