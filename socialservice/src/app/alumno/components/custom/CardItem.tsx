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
  <Card className={`relative w-full h-60 overflow-hidden rounded-3xl shadow-md transition-transform transform hover:scale-105 ${color}`}>
    <div className="absolute inset-0 bg-black/40 text-white p-4 flex flex-col justify-end">
      <h2 className="text-l font-bold mb-1 line-clamp-2">{name}</h2>
      <p className="text-xs font-thin mb-3 leading-snug">{description}</p>
      <div className="flex gap-2 mb-2 text-sm">
        <FeatureButton texto={format} color="white" size="sm" />
        <FeatureButton texto={`${hours} horas`} color="white" size="sm" />
      </div>
      <div className="flex justify-between items-center gap-2 text-sm mt-2">
        <p className="text-white">
          <span className="font-bold">Cupos:</span> {state}
        </p>
        <DetailButton texto="Ver" color="blue" id={id_project} size="auto" />
      </div>
    </div>
  </Card>
);
