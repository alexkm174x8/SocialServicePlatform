"use client";

import { useState } from "react";
import { useRouter, usePathname} from "next/navigation";
import { LogOut,  Archive , TextSearch, AlignJustify } from "lucide-react";
import { ConfirmPopup } from "@/components/popup/ConfirmPopup";

export function SideBar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname()

  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const handleLogout = () => {
    console.log("Cerrando sesión...");
    setShowConfirmLogout(false);
  };

  const cancelLogout = () => {
    setShowConfirmLogout(false);
  };

  const handleNavigation = ( path: string) => {
    router.push(path);
  };

  return (
    <div
      className={`$ {
        isSidebarOpen ? "w-64" : "w-16"
      } bg-blue-900 h-screen p-4 transition-all shadow-md flex flex-col justify-between `}
    >
      <div>
        <button
          className="text-white text-xl mb-5"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          < AlignJustify className="mx-2"/>
        </button>
        <div className="mb-5">
            <img 
                src={isSidebarOpen ? "/images/sslogo.png"  : "/images/sslogo2.png"} 
                className={isSidebarOpen ? "w-45 h-15" : "w-10 h-15"}
                alt="Logo"
            />
        </div>
        <nav className="flex flex-col gap-4">
          <button
            className={`flex items-center gap-3 p-2 rounded-md transition ${
              pathname === "/explorar" ? "bg-white text-blue-900" : "text-white"
            }`}
            onClick={() => handleNavigation( "/explorar")}
          >
            <TextSearch size={24} />
            {isSidebarOpen && <span>Explorar</span>}
          </button>
          <button
            className={`flex items-center gap-3 p-2 rounded-md transition ${
              pathname === "/solicitudes" ? "bg-white text-blue-900" : "text-white"
            }`}
            onClick={() => handleNavigation( "/solicitudes")}
          >
            < Archive size={24} />
            {isSidebarOpen && <span>Solicitudes</span>}
          </button>
        </nav>
      </div>
      <>
      <button
        className="flex items-center gap-3 p-2 rounded-md text-black hover:text-black hover:bg-white transition"
        onClick={() => setShowConfirmLogout(true)}
      >
        <LogOut size={24} />
        {isSidebarOpen && <span>Cerrar sesión</span>}
      </button>

      {showConfirmLogout && (
        <ConfirmPopup
          message="¿Desea cerrar sesión?"
          onConfirm={handleLogout}
          onCancel={cancelLogout}
        />
      )}
    </>
    </div>
  );
}
