"use client";

import { useState } from "react";
import { HeaderBar } from "@/app/components/HeaderBar";
import { SearchBar } from "@/app/components/SearchBar";
import { FilterButton } from "@/app/components/FilterButton";
import { CardItem } from "@/app/alumno/components/custom/CardItem";
import { SideBar } from "@/app/alumno/components/custom/StudentSideBar";
import { Compass } from "lucide-react";

const mockCards = [1, 2, 3, 4, 5, 6, 7, 8];

export default function Explorar() {
  const [search, setSearch] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <>
      <SideBar/>
      <HeaderBar
        titulo="Explorar"
        Icono={Compass}
      />
      <main className={`transition-all mt-20  ml-30 mr-10`} >
        <SearchBar search={search} setSearch={setSearch} />

        <div className="flex flex-wrap justify-end gap-4 mb-6">
          <button
            className="border border-gray-600 text-gray-500 font-semibold rounded-full px-4 py-1 text-sm hover:bg-gray-300 transition"
            onClick={() => console.log("Limpiar filtros")}
          >
            Limpiar todo
          </button>
          {["Modalidad", "Ubicación", "Disponibilidad", "Relevancia"].map((label) => (
            <FilterButton key={label} label={label} />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mockCards.map((_, idx) => (
            <CardItem key={idx} index={idx} />
          ))}
        </div>
      </main>
    </>
  );
}

