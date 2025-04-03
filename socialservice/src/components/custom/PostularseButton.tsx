'use client';

interface Props {
  texto: string;
  color: string;
}


export const PostularseButton = ({ texto}: Props) => {


  return (
    <button
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