"use client";
import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AccessDenied from "@/app/components/AccessDenied";

export default function Acceso_Denegado() {
    const searchParams = useSearchParams();
    const menu = searchParams.get("menu") === "true";
    const router = useRouter();

    useEffect(() => {
        if (!menu) {
            router.push("/");
        }
    }, [menu, router]);

    if (!menu) {
        return null;
    }

    return (
        <div>
            <AccessDenied />
        </div>
    );
}
