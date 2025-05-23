"use client";

import { useState } from "react";
import { useRouter, usePathname} from "next/navigation";
import { LogOut,  Inbox , FolderOpen, AlignJustify } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function SideBar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname()

  const handleNavigation = ( path: string) => {
    router.push(path);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
        router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-blue-900 p-4 transition-all shadow-md flex flex-col justify-between z-2000 ${
        isSidebarOpen ? 'w-64' : 'w-18'
      }`}
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
                src={isSidebarOpen ? "/images/sslogo-descomprimido.png"  : "/images/sslogo-comprimido.png"} 
                className={isSidebarOpen ? "w-45 h-15" : "w-10 h-15"}
                alt="Logo"
            />
        </div>
        <nav className="flex flex-col gap-4">
          <button
            className={`flex items-center gap-3 p-2 rounded-md transition text-blue-900 hover:text-blue-900 hover:bg-white transition ${
              pathname === "/admin/proyectos-solidarios" ? "bg-white text-blue-900" : "text-white"
            }`}
            onClick={() => handleNavigation( "/admin/proyectos-solidarios")}
          >
            <FolderOpen size={24} />
            {isSidebarOpen && <span>Explorar</span>}
          </button>
          <button
            className={`flex items-center gap-3 p-2 rounded-md transition text-blue-900 hover:text-blue-900 hover:bg-white transition ${
              pathname === "/admin/solicitudes-alumnos" ? "bg-white text-blue-900" : "text-white"
            }`}
            onClick={() => handleNavigation( "/admin/solicitudes-alumnos")}
          >
            < Inbox size={24} />
            {isSidebarOpen && <span>Solicitudes</span>}
          </button>
        </nav>
      </div>
      <button
        className="flex items-center gap-3 p-2 rounded-md text-white hover:text-black hover:bg-white transition"
        onClick={handleLogout}
      >
        <LogOut size={24} />
        {isSidebarOpen && <span>Cerrar sesión</span>}
      </button>
    </div>
  );
}