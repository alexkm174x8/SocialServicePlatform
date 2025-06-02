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
        bg-blue-900 hover:bg-[#3154bb]
        text-white font-semibold text-sm
        px-6 py-[6px] 
        rounded-full
        flex items-center justify-center
        leading-tight  
      `}
    >
      {texto}
    </button>
  );
};
