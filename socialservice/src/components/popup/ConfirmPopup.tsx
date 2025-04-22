import React from "react";

interface ConfirmPopupProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmPopup: React.FC<ConfirmPopupProps> = ({
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500/10 backdrop-blur-sm z-50">
      <div className="bg-white rounded-3xl p-6 w-[270px] text-center text-[#0a2170] shadow-lg">
        <p className="text-lg font-medium mb-6">{message}</p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-[#0a2170] text-white font-bold px-4 py-2 rounded-full hover:bg-[#091b5c] transition"
          >
            Aceptar
          </button>
          <button
            onClick={onCancel}
            className="border-2 border-[#0a2170] text-[#0a2170] font-bold px-4 py-2 rounded-full hover:bg-[#e7edff] transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
