'use client';

import { useRouter } from "next/navigation";

interface Props {
  texto: string;
  color: string;
  id: number
  size: 'full' | 'auto';
}


export const DetailButton = ({ texto, size, id }: Props) => {
  const router = useRouter();

  const handleNavigation = () => {
    router.push(`explorar/proyecto/${id}`);
  };

  return (
    <button
      onClick={handleNavigation}
      className={`
        bg-[#3154bb] hover:bg-blue-900
        text-white font-semibold text-sm
        px-8 py-[6px] 
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

