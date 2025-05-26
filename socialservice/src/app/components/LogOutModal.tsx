"use client";

import React from "react";

interface LogOutModalProps{
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const LogOutModal: React.FC<LogOutModalProps> = ({
  title = "Confirmar acción",
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-[3000]">
      <div className="absolute inset-0 bg-gray-200/50 bg-opacity-40 "></div>
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4 text-blue-900">{title}</h2>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end gap-4">
        <button
            className="border border-blue-900 bg-white rounded  hover:bg-[#3154bb]
              text-blue-900 font-semibold text-sm
              px-8 py-[6px] 
              rounded-full
              flex items-center justify-center
              leading-tight  
              transition duration-200"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className="bg-blue-900 hover:bg-[#3154bb]
            text-white font-semibold text-sm
            px-8 py-[6px] 
            rounded-full
            flex items-center justify-center
            leading-tight  
            transition duration-200"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};