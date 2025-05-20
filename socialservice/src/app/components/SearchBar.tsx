'use client';

import { Input } from '@/app/alumno/components/ui/input';
import { Search, X } from 'lucide-react';
import { useRef } from 'react';

interface Props {
  search: string;
  setSearch: (value: string) => void;
  onSearchApply: () => void;
  onSearchClear: () => void;
}

export const SearchBar = ({ search, setSearch, onSearchApply, onSearchClear }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-2 border-b border-blue-800 pb-1 w-[600px]">
      <Input
        ref={inputRef}
        type="text"
        placeholder="Buscar..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSearchApply();
            inputRef.current?.blur();
          }
        }}
        className="border-0 outline-none ring-0 focus:outline-none focus:ring-0 focus:border-transparent border-transparent bg-transparent placeholder:text-gray-400 text-blue-800 shadow-none"
      />

      {search.length > 0 && (
        <button onClick={() => {
          setSearch('');
          onSearchClear();
          inputRef.current?.focus();
        }}>
          <X className="h-4 w-4 text-blue-800" />
        </button>
      )}

      <Search className="h-4 w-4 text-blue-800" />
    </div>
  );
};
