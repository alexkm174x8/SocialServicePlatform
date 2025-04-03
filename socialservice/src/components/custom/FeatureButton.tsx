'use client';

interface Props {
  texto: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg'; 
}

const sizeClasses = {
  sm: 'text-xs px-2 py-1',
  md: 'text-sm px-3 py-1.5',
  lg: 'text-base px-4 py-2',
};

export const FeatureButton = ({ texto, size = 'md' }: Props) => (
  <span
    className={`bg-white text-blue-900 font-semibold rounded-full ${sizeClasses[size]}`}
  >
    {texto}
  </span>
);

