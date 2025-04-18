type ProjectDetail = {
    modalidad: string;
    periodo: string;
    ubicacion: string;
    diasEjecucion: string[];
  };
  
  type Props = {
    detalles: ProjectDetail;
  };
  
  export function DetalleProyecto({ detalles }: Props) {
    return (
      <div className="text-sm text-[#0a2170] space-y-2 mt-4 bg-purple-50 border rounded-md p-4">
        <p>
          El proyecto al que te estás postulando es un <strong>Proyecto {detalles.modalidad}</strong>
        </p>
        <p>
          <strong>Periodo:</strong> {detalles.periodo}
        </p>
        <p>
          <strong>Ubicación:</strong> {detalles.ubicacion}
        </p>
        <p><strong>DÍAS DE EJECUCIÓN:</strong></p>
        <ul className="list-disc ml-6">
          {detalles.diasEjecucion.map((dia, i) => (
            <li key={i}>{dia}</li>
          ))}
        </ul>
      </div>
    );
  }
  