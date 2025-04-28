'use client';

import { useRouter } from "next/navigation";

interface Props {
  texto: string;
  color: string;
}

export const PostularseButton = ({ texto}: Props) => {
    const router = useRouter();
  
    const handleNavigation = () => {
      router.push("/explorar/proyecto/formulario");
    };
  
  return (
    <button
    onClick={handleNavigation}
      className={`
        bg-blue-400 hover:bg-blue-900
        text-white font-semibold text-lg
        px-12 py-[12px] 
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