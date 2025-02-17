"use client";
import React from "react";
import { Suspense } from "react";
import AccessDenied from "@/app/components/AccessDenied";

export default function Acceso_Denegado() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <AccessDenied />
    </Suspense>
  );
}
