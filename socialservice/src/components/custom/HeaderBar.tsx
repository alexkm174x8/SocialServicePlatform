'use client';

import { UserIcon } from 'lucide-react';
import Image from 'next/image';


export const HeaderBar = () => {
  const id = "A01736897";

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-3">

        <Image src="/explorar.svg" alt="icono explorar" width={32} height={32} />
        <h1 className="text-2xl md:text-3xl font-bold text-blue-900">Explorar</h1>
      </div>

      <div className="flex items-center gap-2 text-blue-900 text-base md:text-lg font-medium">
        <UserIcon className="h-6 w-6" />
        <span>{id}
        </span>
      </div>
    </div>
  );
};
