'use client';

type Props = {
  label: string;
  value: React.ReactNode;
};

export const ProjectDetails = ({ label, value }: Props) => (
  <div className="flex gap-2 my-1">
    <span className="text-md text-blue-900 font-semibold">{label}:</span>
    <span className="text-md text-blue-900">{value}</span>
  </div>
);