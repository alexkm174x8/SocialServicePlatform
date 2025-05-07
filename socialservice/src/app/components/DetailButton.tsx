'use client';


interface Props {
  texto: string;
  color: string;
  id: number
  size: 'full' | 'auto';
  onClick: () => void;
}


export const DetailButton = ({ texto, size, onClick }: Props) => {

  return (
    <button
     onClick={onClick}
      className={`
        bg-blue-400 hover:bg-blue-900
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

