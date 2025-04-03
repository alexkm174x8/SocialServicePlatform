'use client';

import { ReactNode } from "react";


interface Props {
  label: string; 
  value: ReactNode; 
}

export const Properties = ({ label, value }: Props) => (
    <div className=" p-6 text-center text-blue-900 max-w-80 ">
      <span className="text-lg font-bold ">{label}:</span>
      <hr className="w-40 border-1 border-blue-900 mx-auto my-2" />
      <span>{value}</span>
  </div>
);