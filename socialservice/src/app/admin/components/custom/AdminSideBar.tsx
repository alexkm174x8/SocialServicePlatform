import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, Inbox, FolderOpen, AlignJustify } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { LogOutModal } from "../../../components/LogOutModal";

export function SideBar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleLogoutConfirm = async () => {
    setLoadingLogout(true);
    setLogoutError(null);
    try {
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      setLogoutError("Ocurrió un error al cerrar sesión. Intenta de nuevo.");
    } finally {
      setLoadingLogout(false);
    }
  };

  return (
    <>
      <div
        className={`fixed left-0 top-0 h-screen bg-blue-900 p-4 transition-all shadow-md flex flex-col justify-between z-[2000] ${
          isSidebarOpen ? "w-64" : "w-18"
        }`}
      >
        <div>
          <button
            className="text-white text-xl mb-5"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <AlignJustify className="mx-2" />
          </button>
          <div className="mb-5">
            <img
              src={
                isSidebarOpen
                  ? "/images/sslogo-descomprimido.png"
                  : "/images/sslogo-comprimido.png"
              }
              className={isSidebarOpen ? "w-45 h-15" : "w-10 h-15"}
              alt="Logo"
            />
          </div>
          <nav className="flex flex-col gap-4">
            <button
              className={`flex items-center gap-3 p-2 rounded-md transition hover:text-blue-900  hover:bg-white ${
                pathname === "/admin/proyectos-solidarios"
                  ? "bg-white text-blue-900"
                  : "text-white"
              }`}
              onClick={() => handleNavigation("/admin/proyectos-solidarios")}
            >
              <FolderOpen size={24} />
              {isSidebarOpen && <span>Explorar</span>}
            </button>
            <button
              className={`flex items-center gap-3 p-2 rounded-md transition hover:text-blue-900  hover:bg-white ${
                pathname === "/admin/solicitudes-alumnos"
                  ? "bg-white text-blue-900"
                  : "text-white"
              }`}
              onClick={() => handleNavigation("/admin/solicitudes-alumnos")}
            >
              <Inbox size={24} />
              {isSidebarOpen && <span>Solicitudes</span>}
            </button>
          </nav>
        </div>

        <div>
          <button
            className="flex items-center gap-3 p-2 rounded-md text-white hover:text-black hover:bg-white transition"
            onClick={() => setShowLogoutModal(true)}
          >
            <LogOut size={24} />
            {isSidebarOpen && <span>Cerrar sesión</span>}
          </button>

          {logoutError && (
            <p className="text-red-400 text-sm mt-2">{logoutError}</p>
          )}
          {loadingLogout && (
            <p className="text-white text-sm mt-2 animate-pulse">Cerrando sesión...</p>
          )}
        </div>
      </div>

      {showLogoutModal && (
        <LogOutModal
          title="Cerrar sesión"
          message="¿Estás seguro que deseas cerrar sesión?"
          confirmText="Cerrar sesión"
          cancelText="Cancelar"
          onConfirm={handleLogoutConfirm}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </>
  );
}
