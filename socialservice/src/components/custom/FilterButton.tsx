'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Props {
  label: string;
}

export const FilterButton = ({ label }: Props) => {
  return (
    <Select>
      <SelectTrigger
        className="border-2 border-blue-800 text-blue-800 placeholder:text-blue-800 font-semibold rounded-full px-4 py-1 text-sm w-[140px] hover:bg-blue-300 transition [&>svg]:text-blue-800"
      >
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="op1">Opción 1</SelectItem>
        <SelectItem value="op2">Opción 2</SelectItem>
      </SelectContent>
    </Select>
  );
};
