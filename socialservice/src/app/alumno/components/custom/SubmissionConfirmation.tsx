import React from "react";

const SubmissionConfirmation: React.FC = () => {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md p-8 text-center border border-gray-300">
        <p className="text-lg mb-6 text-gray-800">
          Gracias por el tiempo dedicado a responder el formulario.
        </p>

        <p className="text-gray-800 mb-4">
          Al <span className="font-bold">finalizar tu postulación, la Organización te contactará</span>. Debes estar pendiente de una llamada o mensaje.
          <br />
          <span className="font-bold">Si eres aceptadx</span>, la Organización solicitará tu inscripción a Formación Social.{' '}
          <span className="font-bold">Si no fuiste aceptadx</span>, debes postularte en otro Proyecto.
        </p>

        <p className="text-sm font-bold text-gray-800 mb-4 uppercase">
          RECUERDA QUE ESTE PROYECTO NO SE INSCRIBE EN IRIS.
        </p>

        <p className="text-gray-800 mb-6">
          ¡Síguenos en IG <span className="font-semibold">@sstecpue</span>!
        </p>

        <div className="flex justify-center gap-4">
          <button className="px-6 py-2 rounded-full border border-blue-800 text-blue-800 font-semibold hover:bg-blue-50 transition">
            Cancelar
          </button>
          <button className="px-6 py-2 rounded-full bg-blue-800 text-white font-semibold hover:bg-blue-900 transition">
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionConfirmation;