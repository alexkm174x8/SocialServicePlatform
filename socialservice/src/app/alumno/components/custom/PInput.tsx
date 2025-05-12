"use client";

type Props = {
    label: string;
    placeholder: string;
    type?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
  };
  
  export function PInput({ 
    label, 
    placeholder, 
    type = "text",
    value,
    onChange,
    error 
  }: Props) {
    return (
      <div className="text-left space-y-1">
        <label className="text-sm font-semibold text-[#0a2170]">{label}</label>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-2 rounded-lg border ${
            error ? 'border-red-500' : 'border-[#0a2170]'
          } focus:outline-none focus:ring-2 ${
            error ? 'focus:ring-red-500' : 'focus:ring-[#0a2170]'
          }`}
        />
        {error && (
          <p className="text-red-600 text-sm mt-1">{error}</p>
        )}
      </div>
    );
  }