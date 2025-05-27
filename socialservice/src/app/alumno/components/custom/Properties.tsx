'use client';

import { ReactNode } from "react";


interface Props {
  label: string; 
  value: ReactNode; 
}

export const Properties = ({ label, value }: Props) => (
    <div className="text-center text-blue-900 max-w-80 ">
      <span className="text-md font-bold ">{label}</span>
      <hr className="w-50 border-1 border-blue-900 mx-auto my-2 text-md" />
      <span className="text-sm">{value}</span>
  </div>
);