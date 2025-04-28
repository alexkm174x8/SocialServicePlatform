'use client';

import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { DetailButton } from './DetailButton';
import { FeatureButton } from './FeatureButton';

interface Props {
  name: string;
  description: string;
  state: string;
}

export const CardItem = ({ name, description, state }: Props) => (
  <Card className="relative w-full h-60 overflow-hidden rounded-3xl shadow-md">
  
    <Image
      src="/images/example.jpg"
      alt="Imagen"
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, 400px"
    />

    {/* Contenido superpuesto */}
    <div className="absolute inset-0 bg-black/40 text-white p-4 flex flex-col justify-end">
      <h2 className="text-xl font-bold mb-1">{name}</h2>
      <p className="text-sm mb-3 leading-snug">
        {description}
      </p>
      <div className="flex gap-2 mb-2 text-sm">
        <FeatureButton texto="Presencial" color="white" size="sm"/>
        <FeatureButton texto="40 horas" color="white" size="sm"/>
      </div>

      <div className="flex justify-between items-center gap-2 text-sm mt-2">
  <p className="text-white">
    <span className="font-bold">Estado:</span> {state}
  </p>
  <DetailButton texto="Ver" color="blue" size="auto" />
</div>

    </div>
  </Card>
);
