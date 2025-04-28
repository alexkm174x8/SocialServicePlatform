"use client";

type Props = {
    label: string;
    placeholder: string;
    type?: string;
  };
  
  export function PInput({ label, placeholder, type = "text" }: Props) {
    return (
      <div className="text-left space-y-1">
        <label className="text-sm font-semibold text-[#0a2170]">{label}</label>
        <input
          type={type}
          placeholder={placeholder}
          className="w-full px-4 py-2 rounded-lg border border-[#0a2170] focus:outline-none focus:ring-2 focus:ring-[#0a2170]"
        />
      </div>
    );
  }