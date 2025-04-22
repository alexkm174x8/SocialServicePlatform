import React from "react";

interface PopupProps {
  onCancel: () => void;
  onSubmit: () => void;
}

export const PostulacionPopup: React.FC<PopupProps> = ({ onCancel, onSubmit }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500/10 backdrop-blur-sm z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-[420px] text-sm text-[#0a2170] text-center space-y-4 border border-gray-300">
        <p>Gracias por el tiempo dedicado a responder el formulario.</p>

        <p>
          <strong>Al finalizar tu postulación, la Organización te contactará.</strong> Debes estar pendiente de una llamada o mensaje. <br />
          <strong>Si eres aceptadx</strong>, la Organización solicitará tu inscripción a Formación Social. <br />
          <strong>Si no fuiste aceptadx</strong>, debes postularte en otro Proyecto.
        </p>

        <p className="text-[#0a2170] font-medium">¡Síguenos en IG @sstecpue!</p>

        <div className="flex justify-center gap-4 pt-2">
          <button
            onClick={onCancel}
            className="border border-[#0a2170] text-[#0a2170] px-4 py-1.5 rounded-full hover:bg-[#f0f4ff] transition"
          >
            Cancelar
          </button>
          <button
            onClick={onSubmit}
            className="bg-[#0a2170] text-white px-4 py-1.5 rounded-full hover:bg-[#091b5c] transition"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};
