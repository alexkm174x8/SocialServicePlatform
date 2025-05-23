"use client";

import { LucideIcon, UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Props {
  titulo: string;
  Icono: LucideIcon;
  onClick?: () => void; 
}

export const HeaderBar = ({ titulo, Icono, onClick }: Props) => {
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        // Get the part before @tec.mx
        const email = session.user.email;
        const username = email.split('@')[0];
        setUsername(username);
      }
    };

    getUser();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email) {
        const email = session.user.email;
        const username = email.split('@')[0];
        setUsername(username);
      } else {
        setUsername("");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div
      className=" fixed top-0 left-20 right-0 bg-white px-4 py-3 flex justify-between items-center z-50 mt-2"
    >
      <div className=" flex items-center gap-3">
        {onClick ? (
          <button onClick={onClick} className="focus:outline-none">
            <Icono className="text-blue-900 cursor-pointer" size={40} />
          </button>
        ) : (
          <Icono className="text-blue-900" size={40} />
        )}
        
        <h1 className="text-2xl md:text-3xl font-bold text-blue-900">{titulo}</h1>
      </div>

      <div className="flex items-center gap-2 text-blue-900 text-base md:text-lg font-medium">
        <UserIcon className="h-6 w-6" />
        <span>{username || "Cargando..."}</span>
      </div>
    </div>
  );
};



