"use client";
import React, { useEffect } from "react";
import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AccessDenied from "@/app/components/AccessDenied";

export default function Acceso_Denegado() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Acceso_Denegado />
    </Suspense>
  );
}
