"use client";
import React, { useCallback, useRef, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { showSwal, confirmSwal } from "../utils/alerts";

import { useState, useEffect } from "react";

import Image from "next/image";
import iconos from "@/app/utils/iconos";
import Link from "next/link";

import {
    recuperaContra
  } from "@/app/utils/api/check-identity/check-identity";

// const { data: session, status } = useSession();

function Check_identity() {
    // const { session } = useSession();
    const router = useRouter();
    const [error, setError] = useState(null);
    const [mostrarContr, setMostrarContr] = useState(false);

    const mostrarContraseña = () => {
        setMostrarContr(!mostrarContr);
      };
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
        const formData = new FormData();
        formData.append("email", data.username || "");
        const res = await recuperaContra(formData);
        if (res.status) {
          showSwal(res.alert_title, res.alert_text, res.alert_icon);
          router.push("/");
        }else{
          showSwal(res.alert_title, res.alert_text, res.alert_icon);
        }
        // const res = await signIn("credentials", {
        //   email: data.username,
        //   password: data.password,
        //   redirect: false,
        // });
        // if (res.error) {
        //   setError(res.error);
        // } else {
        //   router.push("/");
        // }
      });
    //   if (session) {
    //     return <></>;
    //   }

    // if (status === "loading") {
    //     return (
    //       <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    //     );
    //   }
    return (
        <div className="h-screen w-full flex justify-center items-center bg-white overflow-hidden">
          <Image
            src={iconos.fondoLogin}
            alt="Background"
            layout="fill"
            objectPosition="center"
            className="pointer-events-non hidden md:block bg-cover bg-center h-full w-full" // Agregado pointer-events-none
          />
          <Image
            src={iconos.fondoLoginMovil}
            alt="Background"
            layout="fill"
            objectPosition="center"
            className="absolute  pointer-events-none block md:hidden bg-cover bg-center h-full w-full" // Agregado para moviles
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
                Recuperar Contraseña
            </h1>
    
            <label className="text-slate-500 mb-2 block" htmlFor="username">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="username"
              className="p-3 rounded block text-slate-400 w-full"
              {...register("username", { required: "Correo requerido" })}
            />
            {errors.username && (
              <span className="text-red-500 text-sm">
                {errors.username.message}
              </span>
            )}
            {/* <label className="text-slate-500 mb-2 block" htmlFor="password">
              Contraseña
            </label>
    
            <div className="relative w-full">
              <input
                type={mostrarContr ? "text" : "password"}
                name="password"
                id="password"
                className="p-3 rounded block text-slate-400 w-full pr-10"
                {...register("password", { required: "Contraseña requerida" })}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10"
                onClick={mostrarContraseña}
              >
                {mostrarContr ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                )}
              </button>
            </div> */}
    
    
            {errors.password && (
              <p className="text-red-500 text-xs mt-2">{errors.password.message}</p>
            )}
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password.message}
              </span>
            )}
    
            {/* <p className="p-4 inline-block text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors duration-300 ease-in-out">
              <Link href="/check-identity" className="underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </p> */}
    
            <button className="w-full bg-blue-700 text-white p-3 rounded-lg hover:bg-blue-900 mt-4">
              Enviar correo
            </button>
    
            <div className="border-t border-gray-400 mt-4">
            <button
              type="button"
              className="w-full max-w-md bg-red-700 text-white p-3 rounded-lg mt-6 hover:bg-red-900"
              onClick={() => router.push("./")}
            >
              Regresar
            </button>
              {/* <p className="text-slate-500 mt-2 mb-2 text-center">
                ¿No tienes una cuenta?
              </p>
              <Link
                href={"./register"}
                className="w-full block text-center bg-[#8000ff] text-white p-3 rounded-lg hover:bg-[#40007f]"
              >
                Regístrate ahora
              </Link> */}
            </div>
          </form>
        </div>
      );


}



export default Check_identity;