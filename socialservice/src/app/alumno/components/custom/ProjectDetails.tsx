'use client';

interface Props {
  label: string; 
  value: string; 
}

export const ProjectDetails = ({ label, value }: Props) => (
  <div className="flex gap-5 my-2">
    <span className=" text-sm text-blue-900 font-semibold ">{label}:</span>
    <span className="text-sm text-blue-900 "> {value}</span>
  </div>
);
