"use client";

import { useState } from "react";
import { HeaderBar } from "@/components/custom/HeaderBar";
import { SearchBar } from "@/components/custom/SearchBar";
import { FilterButton } from "@/components/custom/FilterButton";
import { ListItem } from "@/components/custom/ListItem";
import { SideBar } from "@/components/custom/SideBar";
import { ListCheck} from "lucide-react";

const mockCards = [1, 2, 3, 4, 5, 6, 7, 8];

export default function Explorar() {
  const [search, setSearch] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <>
      <SideBar/>
      <HeaderBar
        titulo="Proyectos solidarios"
        Icono={ListCheck}
      />
      <main className={`transition-all mt-20  ml-30 mr-10`} >
        <SearchBar search={search} setSearch={setSearch} />

        <div className="flex flex-wrap justify-evenly gap-4 mb-6">
          <button className={`
              bg-blue-400 hover:bg-blue-900
              text-white font-semibold text-lg
              px-12 py-[12px] 
              rounded-full
              flex items-center justify-center
              leading-tight  
              transition duration-200`}>
            Subir
          </button>
          <button className={`
              bg-blue-400 hover:bg-blue-900
              text-white font-semibold text-lg
              px-12 py-[12px] 
              rounded-full
              flex items-center justify-center
              leading-tight  
              transition duration-200`}>
            Descargar 
          </button>
          <button
            className="border border-gray-600 text-gray-500 font-semibold rounded-full px-4 py-1 text-sm hover:bg-gray-300 transition"
            onClick={() => console.log("Limpiar filtros")}
          >
            Limpiar todo
          </button>
          {["Modalidad", "Disponibilidad"].map((label) => (
            <FilterButton key={label} label={label} />
          ))}
        </div>

        <div className="align-items justify-center">
          <ListItem/>
        </div>
      </main>
    </>
  );
}