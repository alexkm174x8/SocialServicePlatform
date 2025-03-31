'use client';

interface Props {
  texto: string;
  color: string;
}

export const FeatureButton = ({ texto }: Props) => (
  <span className="bg-white text-blue-800 font-semibold text-[12px] px-3 py-1 rounded-full">
    {texto}
  </span>
);
