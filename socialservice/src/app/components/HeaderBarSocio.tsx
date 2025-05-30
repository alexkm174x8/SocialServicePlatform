"use client";

import Image from "next/image";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { LogOutModal } from "./LogOutModal";
import { useRouter } from "next/navigation";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Key must be provided. Please check your environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface HeaderBarProps {
  proyecto: string;
}

export const HeaderBarSocio = ({ proyecto }: HeaderBarProps) => {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        // Clear any session storage
        sessionStorage.removeItem('projectInfo');
        // Use push instead of replace and add a small delay
        setTimeout(() => {
          router.push('/loginS');
        }, 100);
      }
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full flex items-center justify-between bg-[#0a2170] px-15 py-3 z-40">
        <div className="flex items-center gap-4">
          <Image
            src="/logoss.svg" // Asegúrate que este archivo esté en /public
            alt="Logo"
            width={25}
            height={25}
          />
          <h1 className="text-2xl md:text-2xl font-extrabold text-white">
            {`Solicitudes para ${proyecto}`}
          </h1>
        </div>
        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Cerrar sesión</span>
        </button>
      </header>

      {showLogoutModal && (
        <LogOutModal
          title="Cerrar sesión"
          message="¿Estás seguro que deseas cerrar sesión?"
          confirmText="Cerrar sesión"
          cancelText="Cancelar"
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </>
  );
};
