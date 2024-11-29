"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AccessDenied from "@/app/components/AccessDenied";

export default function Acceso_Denegado() {
  const searchParams = useSearchParams();
  const [menu, setMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const isMenu = searchParams.get("menu") === "true";
    setMenu(isMenu);

    if (!isMenu) {
      router.push("/");
    }
  }, [searchParams, router]);

  if (!menu) {
    return null;
  }

  return (
    <div>
      <AccessDenied />
    </div>
  );
}
