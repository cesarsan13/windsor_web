"use client";
import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import iconos from "@/app/utils/iconos";
import Link from "next/link";
function LoginPage() {
  const { session } = useSession();
  const router = useRouter();
  const [error, setError] = useState(null);
  useEffect(() => {
    // Quitar scroll en el body al cargar la página
    document.body.style.overflow = "hidden";
    return () => {
      // Restaurar el scroll en el body al salir de la página
      document.body.style.overflow = "auto";
    };
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = handleSubmit(async (data) => {
    event.preventDefault();
    const res = await signIn("credentials", {
      email: data.username,
      password: data.password,
      redirect: false,
    });
    if (res.error) {
      setError(res.error);
    } else {
      router.push("/");
    }
  });
  if (session) {
    return <></>;
  }

  return (
    <div className="h-screen w-full flex justify-center items-center bg-white overflow-hidden">
      <Image
        src={iconos.fondoLogin}
        alt="Background"
        layout="fill"
        objectFit="contain"
        objectPosition="center"
        className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none" // Agregado pointer-events-none
        />

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
          Iniciar Sesión
        </h1>
        
        <label className="text-slate-500 mb-2 block" htmlFor="username">
          Correo Electrónico
        </label>
        <input
          type="email"
          name="username"
          className="p-3 rounded block text-slate-400 w-full"
          {...register("username", { required: "Usuario requerido" })}
        />
        {errors.username && (
          <span className="text-red-500 text-sm">
            {errors.username.message}
          </span>
        )}
        <label className="text-slate-500 mb-2 block" htmlFor="password">
          Contraseña
        </label>
        <input
          type="password"
          name="password"
          className="p-3 rounded block text-slate-400 w-full"
          {...register("password", { required: "Contraseña requerida" })}
        />
        {errors.password && (
          <span className="text-red-500 text-sm">
            {errors.password.message}
          </span>
        )}

        <p className="p-4 inline-block text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors duration-300 ease-in-out">
          <Link href="/check-identity" className="underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </p>
        
        <button className="w-full bg-blue-700 text-white p-3 rounded-lg hover:bg-blue-900 mt-4">
          Iniciar Sesión
        </button>
        
        <div className="border-t border-gray-400 mt-4">
          <p className="text-slate-500 mt-2 mb-2 text-center">
            ¿No tienes una cuenta?
          </p>
          <Link
            href={"./register"}
            className="w-full block text-center bg-[#8000ff] text-white p-3 rounded-lg hover:bg-[#40007f]"
          >
            Regístrate ahora
          </Link>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
