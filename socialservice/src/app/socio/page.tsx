"use client";

import { useEffect, useState } from "react";
import { SearchBar } from "@/app/components/SearchBar";
import { FilterButton } from "@/app/components/FilterButton";
import { Lista } from "@/app/components/Lista";
import { HeaderBarSocio } from "@/app/components/HeaderBarSocio";
import { DetailButton } from "@/app/components/DetailButton";
import { Trash2 } from "lucide-react";

type Solicitud = {
  matricula: string;
  correo: string;
  carrera: string;
  telefono: string;
  servicio: string;
  estado: string;
  pregunta1: string;
  pregunta2: string;
};

const mockData: Solicitud[] = [
  {
    matricula: "A01736897",
    correo: "estefania.antonio@tec.mx",
    carrera: "ITC",
    telefono: "+52 921 135 6784",
    servicio: "Special Olympics",
    estado: "Aceptadx",
    pregunta1: "Tengo experiencia previa como voluntaria en eventos deportivos.",
    pregunta2: "Me interesa apoyar a personas con discapacidad.",
  },
  {
    matricula: "A01736898",
    correo: "miranda.colorado@tec.mx",
    carrera: "IRS",
    telefono: "+52 921 135 6785",
    servicio: "Banco de Alimentos",
    estado: "Declinadx por el alumnx",
    pregunta1: "He colaborado antes en actividades de distribución de alimentos.",
    pregunta2: "Quiero contribuir a reducir el desperdicio de comida.",
  },
  {
    matricula: "A01736899",
    correo: "alejandro.kong@tec.mx",
    carrera: "IMT",
    telefono: "+52 921 135 6786",
    servicio: "Clases de regularización",
    estado: "No aceptadx",
    pregunta1: "Me encanta enseñar matemáticas a jóvenes.",
    pregunta2: "Deseo mejorar la educación en mi comunidad.",
  },
  {
    matricula: "A01736900",
    correo: "sofia.zugasti@tec.mx",
    carrera: "IMD",
    telefono: "+52 921 135 6787",
    servicio: "Rescate animal",
    estado: "En revisión",
    pregunta1: "Tengo formación en primeros auxilios veterinarios.",
    pregunta2: "Me motiva proteger a los animales callejeros.",
  },
];

export default function Solicitudes() {
  const [search, setSearch] = useState("");
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [filterCarrera, setFilterCarrera] = useState<string[]>([]);
  const [filterEstado, setFilterEstado] = useState<string[]>([]);

  useEffect(() => {
    setSolicitudes(mockData);
  }, []);

  const filtered = solicitudes.filter((s) => {
    const searchTerm = search.toLowerCase();
    const matchesSearch =
      s.matricula.toLowerCase().includes(searchTerm) ||
      s.correo.toLowerCase().includes(searchTerm) ||
      s.carrera.toLowerCase().includes(searchTerm) ||
      s.telefono.toLowerCase().includes(searchTerm) ||
      s.servicio.toLowerCase().includes(searchTerm) ||
      s.estado.toLowerCase().includes(searchTerm) ||
      s.pregunta1.toLowerCase().includes(searchTerm) ||
      s.pregunta2.toLowerCase().includes(searchTerm);

    const matchesCarrera =
      filterCarrera.length === 0 || filterCarrera.includes(s.carrera);

      const matchesEstado =
      filterEstado.length === 0 || filterEstado.includes(s.estado);

    return matchesSearch && matchesCarrera && matchesEstado;
  });

  return (
    <>
      <HeaderBarSocio proyecto="Special Olympics" />
      <main className="mt-20 ml-15 mr-10 px-4">
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <SearchBar
            search={search}
            setSearch={setSearch}
            onSearchApply={() => {}}
            onSearchClear={() => setSearch("")}
          />
          <div className="flex items-center gap-6">

          <button
              className="border border-gray-600 text-gray-500 font-semibold rounded-full px-4 py-1 text-sm hover:bg-gray-300 transition"
              onClick={() => {
                setFilterEstado([]);
                setFilterCarrera([]);
                setSearch("");
              }}
            >
              <Trash2 className="w-5 h-5" />
            </button>

            <FilterButton
              label="Carrera"
              options={[...new Set(solicitudes.map((s) => s.carrera))]}
              selectedValues={filterCarrera}
              onChange={setFilterCarrera}
            />

            <FilterButton
              label="Estado"
              options={[...new Set(solicitudes.map((s) => s.estado))]}
              selectedValues={filterEstado}
              onChange={setFilterEstado}
            />
             </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <DetailButton texto="Enviar" size="auto" onClick ={console.log("Enviar")} />
            <DetailButton texto="Descargar" size="auto" onClick ={console.log("Enviar")}/>
          </div>

          <div className="flex flex-wrap gap-4 items-center text-sm">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-green-500" />
              <span className="text-[#001C55] font-medium">Aceptadx</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-orange-400" />
              <span className="text-[#001C55] font-medium">Declinadx por el alumnx</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-red-500" />
              <span className="text-[#001C55] font-medium">No aceptadx</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-indigo-400" />
              <span className="text-[#001C55] font-medium">En revisión</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg">
        <Lista data={filtered} setData={setSolicitudes} />
        </div>
      </main>
    </>
  );
}
