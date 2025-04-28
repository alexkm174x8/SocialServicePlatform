'use client';

import React from 'react';

interface ResponderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  onReject: () => void;
}

export const ResponderModal: React.FC<ResponderModalProps> = ({ isOpen, onClose, onAccept, onReject }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-4">¿Deseas aceptar o rechazar?</h2>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => {
              onReject();
              onClose();
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Rechazar
          </button>
          <button
            onClick={() => {
              onAccept();
              onClose();
            }}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};
