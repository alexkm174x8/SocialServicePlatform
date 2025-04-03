'use client';

interface Props {
  label: string; 
  value: string; 
}

export const ProjectDetails = ({ label, value }: Props) => (
  <div className="flex gap-5  my-5">
    <span className="text-blue-900 font-semibold ">{label}:</span>
    <span className="text-blue-900 "> {value}</span>
  </div>
);
