"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

export default function CodigoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const xEscuela = searchParams.get("xEscuela");
  const [error, setError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!email || !xEscuela) {
      router.push("/auth/login");
    }
  }, [email, xEscuela, router]);

  const onSubmit = handleSubmit(async (data) => {
    setError(null);
    try {
      const res = await signIn("credentials", {
        email: email,
        xescuela: xEscuela,
        codigo: data.codigo,
        redirect: false,
      });
      if (res.error) {
        setError(res.error);
      } else {
        router.push("/");
      }
    } catch (error) {
      setError("Error al verificar el código.");
    }
  });

  return (
    <div className="h-screen w-full flex justify-center items-center bg-white">
      <form
        className="relative z-10 w-5/6 md:w-1/4 rounded-xl border shadow-xl p-6 bg-slate-200 bg-opacity-80"
        onSubmit={onSubmit}
      >
        {error && (
          <p className="bg-red-500 text-white text-xs p-3 rounded-md text-center">
            {error}
          </p>
        )}
        <h1 className="text-slate-900 text-2xl block mb-6 mt-4 text-center">
          Verificación de Código
        </h1>
        <label className="text-slate-500 mb-2 block" htmlFor="codigo">
          Código de Verificación
        </label>
        <input
          type="text"
          name="codigo"
          className="p-3 rounded block w-full"
          {...register("codigo", {
            required: "Codigo requerido",
          })}
        />
        <button
          type="submit"
          className="w-full bg-blue-700 text-white p-3 rounded-lg hover:bg-blue-900 mt-4"
        >
          Verificar Código
        </button>
      </form>
    </div>
  );
}
