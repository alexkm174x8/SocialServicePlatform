"use client";

import { useState } from 'react';
import { HeaderBar } from '@/components/custom/HeaderBar';
import { SearchBar } from '@/components/custom/SearchBar';
import { FilterButton } from '@/components/custom/FilterButton';
import { CardItem } from '@/components/custom/CardItem';

const mockCards = [1, 2, 3, 4, 5, 6, 7, 8];

export default function Explorar() {
  const [search, setSearch] = useState('');

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <HeaderBar />
      <SearchBar search={search} setSearch={setSearch} />

      <div className="flex flex-wrap justify-end gap-4 mb-6">

<button
  className="border-1 border-gray-600 text-gray-500 font-semibold rounded-full px-4 py-1 text-sm hover:bg-gray-300 transition"
  onClick={() => {
    console.log('Limpiar filtros');
  }}
>
  Limpiar todo
</button>


  {['Modalidad', 'Ubicación', 'Disponibilidad', 'Relevancia'].map((label) => (
    <FilterButton key={label} label={label} />
  ))}
</div>


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mockCards.map((item, idx) => (
          <CardItem key={idx} index={idx} />
        ))}
      </div>
    </div>
  );
}
