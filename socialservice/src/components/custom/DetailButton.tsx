'use client';

interface Props {
  texto: string;
  color: string;
  size: 'full' | 'auto';
}

export const DetailButton = ({ texto, size }: Props) => {
  const widthClass = size === 'full' ? 'w-full' : 'w-auto';

  return (
    <button
      className={`
        ${widthClass}
        bg-blue-400 hover:bg-blue-600
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
