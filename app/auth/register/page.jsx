"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { showSwal } from "@/app/utils/alerts";
import Inputs from "@/app/auth/register/component/Inputs";
import { guardaRegistro } from "@/app/utils/api/register/register";
import Image from "next/image";
import iconos from "@/app/utils/iconos";

function Register() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


  const onSubmit = handleSubmit(async (data) => {

    event.preventDefault();

    const res = await guardaRegistro(data);

    showSwal(res.alert_title, res.alert_text, res.alert_icon);
    if (!res.status) {
      setError(res.alert_text);
    } else {
      router.push("./login");
    }
  });


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
          Registro
        </h1>
        <Inputs
          titulo={"Nombre Completo"}
          name={"nombre"}
          id={"nombre"}
          message={"Nombre Completo requerido"}
          errors={errors}
          requerido={true}
          register={register}
          type={"text"}
        />
        <Inputs
          titulo={"Correo"}
          name={"email"}
          id={"email"}
          message={"Correo requerido"}
          errors={errors}
          requerido={true}
          register={register}
          type={"email"}
        />
        <Inputs
          titulo={"Usuario"}
          name={"name"}
          id={"name"}
          message={"Usuario requerido"}
          errors={errors}
          requerido={true}
          register={register}
          type={"text"}
        />
        <button className="w-full max-w-md bg-blue-700 text-white p-3 rounded-lg mt-6 hover:bg-blue-900">
          Crear cuenta
        </button>
        <button
          type="button"
          className="w-full max-w-md bg-red-700 text-white p-3 rounded-lg mt-6 hover:bg-red-900"
          onClick={() => router.push("./login")}
        >
          Regresar
        </button>
      </form>
    </div>
  );
}

export default Register;
