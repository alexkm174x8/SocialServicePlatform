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
        className="border-2 border-blue-900 text-blue-900 placeholder:text-blue-900 font-semibold rounded-full px-4 py-1 text-sm w-[140px] hover:bg-blue-200 transition "
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
