'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface Props {
  search: string;
  setSearch: (value: string) => void;
}

export const SearchBar = ({ search, setSearch }: Props) => (
  <div className="flex items-center gap-2 border-b border-blue-800 pb-1 max-w-2xl mb-6">
    <Input
  type="text"
  placeholder="Busca algo..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="border-0 outline-none ring-0 focus:outline-none focus:ring-0 focus:border-transparent border-transparent bg-transparent placeholder:text-gray-400 text-blue-800"
/>

    <Search className="h-4 w-4 text-blue-800" />
  </div>
);
