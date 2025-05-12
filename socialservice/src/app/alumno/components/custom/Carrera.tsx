"use client";

type Props = {
  carreras: string[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
};

export const Carrera = ({ carreras, value, onChange, error }: Props) => (
  <div className="space-y-2">
    <div className="border border-blue-900 p-4 rounded-md bg-blue-200 space-y-2">
      <h3 className="text-sm font-medium text-[#0a2170]">
        Para este proyecto, el perfil de Carrera es:
      </h3>
      <p className="text-sm text-gray-800">{carreras.join(", ")}</p>
    </div>
    
    <div className="mt-2">
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full px-4 py-2 rounded-lg border ${
          error ? 'border-red-500' : 'border-[#0a2170]'
        } focus:outline-none focus:ring-2 ${
          error ? 'focus:ring-red-500' : 'focus:ring-[#0a2170]'
        }`}
      >
        <option value="">Selecciona tu carrera</option>
        {carreras.map((carrera) => (
          <option key={carrera} value={carrera}>
            {carrera}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-red-600 text-sm mt-1">{error}</p>
      )}
    </div>
  </div>
);
