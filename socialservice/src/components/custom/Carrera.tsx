type Props = {
  carreras: string[];
};

export const Carrera = ({ carreras }: Props) => (
  <div className="border border-[#e2e8f0] p-4 rounded-md bg-purple-50 space-y-2">
    <h3 className="text-sm font-medium text-[#0a2170]">
      Para este proyecto, el perfil de Carrera es:
    </h3>
    <p className="text-sm text-gray-800">{carreras.join(", ")}</p>
  </div>
);
