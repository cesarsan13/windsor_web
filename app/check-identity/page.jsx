"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { showSwal } from "../utils/alerts";
import { useState, useEffect } from "react";
import Image from "next/image";
import iconos from "@/app/utils/iconos";
import {
  recuperaContra
} from "@/app/utils/api/check-identity/check-identity";

  function Check_identity() {
    const router = useRouter();
    const [error, setError] = useState(null);
    const [mostrarContr, setMostrarContr] = useState(false);
    const [empresas, setEmpresas] = useState([]);

    const mostrarContraseña = () => {
      setMostrarContr(!mostrarContr);
    };

    useEffect(() => {
      const fetchData = async () => {
        const res = await fetch(`${process.env.DOMAIN_API}api/basesDatos`);
        const resJson = await res.json();
        setEmpresas(resJson.data);
      };
      fetchData() 
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
      const res = await recuperaContra(data);
      if (res.status) {
        showSwal(res.alert_title, res.alert_text, res.alert_icon);
        router.push("/");
      }else{
        showSwal(res.alert_title, res.alert_text, res.alert_icon);
      }
    });

    const handleChange = (evt) => {
      evt.preventDefault();
      const { value } = evt.target;
      localStorage.setItem("xescuela", value);
    };

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
              Escuela
            </label>
            <select
              type="select"
              name="xEscuela"
              className="p-3 rounded block text-slate-400 w-full"
              {...register("xEscuela", {
                required: "Seleccione una Escuela",
                onChange: (evt) => handleChange(evt),
              })}
            >
              <option
                value=""
                className="bg-transparent text-black dark:text-white dark:bg-[#1d232a]"
              >
                Seleccione una opción
              </option>
              {empresas &&
                empresas.map((arreglo) => (
                  <option
                    className="bg-transparent text-black dark:text-white dark:bg-[#1d232a]"
                    key={arreglo.id}
                    value={arreglo.id}
                  >
                    {arreglo.nombre}
                  </option>
                ))}
            </select>
            {errors.xEscuela && (
              <span className="text-red-500 text-sm">
                {errors.xEscuela.message}
              </span>
            )}
    
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
    
            {errors.password && (
              <p className="text-red-500 text-xs mt-2">{errors.password.message}</p>
            )}
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password.message}
              </span>
            )}
    
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
            </div>
          </form>
        </div>
      );
}

export default Check_identity;