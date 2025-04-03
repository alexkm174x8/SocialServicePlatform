"use client";

import { HeaderBar } from "@/components/custom/HeaderBar";
import {  SideBar } from "@/components/custom/SideBar";
import {Archive } from "lucide-react";

export default function Solicitudes() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideBar />
        <div className="flex-1 p-4 md:p-8">
           <HeaderBar titulo="Solicitudes" Icono={Archive} />
        </div>
    </div>
  )
}