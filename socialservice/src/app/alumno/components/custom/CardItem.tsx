"use client";

import Image from "next/image";
import { Card } from "@/app/alumno/components/ui/card"; // asegúrate que este archivo exista
import { DetailButton } from "./DetailButton";
import { FeatureButton } from "./FeatureButton";

interface Props {
  name: string;
  description: string;
  state: string;
  id_project: number;
  format: string;
  hours: number;
  color: string;
}

export const CardItem = ({ name, description, state, id_project, format, hours, color }: Props) => (
  <Card className={`relative w-full min-w-[160px] max-w-[220px] sm:max-w-[240px] md:max-w-[280px] h-60 overflow-hidden rounded-3xl shadow-md transition-transform transform hover:scale-105 ${color}`}>
  <div className="absolute inset-0 bg-black/40 text-white px-3 py-2 flex flex-col justify-end">
    <h2 className="text-sm font-semibold mb-1 line-clamp-1">{name}</h2>
    <p className="text-xs font-light mb-2 leading-tight line-clamp-2">{description}</p>
    <div className="flex gap-1 mb-2 text-xs">
      <FeatureButton texto={format} color="white" size="sm" />
      <FeatureButton texto={`${hours} horas`} color="white" size="sm" />
    </div>
    <div className="flex justify-between items-center gap-2 text-xs">
      <p className="text-white">
        <span className="font-semibold">Cupos:</span> {state}
      </p>
      <DetailButton texto="Ver" color="blue" id={id_project} size="auto" />
    </div>
  </div>
</Card>

);
