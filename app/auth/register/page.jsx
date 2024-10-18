"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { showSwal } from "@/app/utils/alerts";
import Inputs from "@/app/auth/register/component/Inputs";
function Register() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState(null);
  const onSubmit = handleSubmit(async (data) => {
    event.preventDefault();
    const res = await guardaRegistro(data);
    
    // console.log(res.status);
    showSwal(res.alert_title, res.alert_text, res.alert_icon);
    if (!res.status) {
      setError(res.alert_text);
    } else {
      router.push("./login");
    }
  });
  const handleChangeConsultorio = (e) => {
    e.preventDefault();
    const id_consultorio = e.target.value;
    const infofiltrada = medicos.filter((medico) => {
      return medico.consultorio_id === id_consultorio;
    });
    setMedicosFiltrados(infofiltrada);
  };
  return (
    <div className="w-full flex justify-center items-center bg-white">
      { }
      <form
        action=""
        className="w-5/6 md:w-1/4 lg:w-2/4  rounded-xl border shadow-xl p-6 bg-slate-200"
        onSubmit={onSubmit}
      >
        {error && (
          <p className="bg-red-500 text-white text-xs p-3 rounded-md text-center">
            {error}
          </p>
        )}
        <h1 className="text-slate-900 text-2xl block mb-6 mt-4 text-center ">
          Registro
        </h1>
        <div className="flex flex-wrap -mx-3 mb-6">
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

        </div>
        <div className="flex flex-row justify-between gap-6">
          <button className="w-full max-w-md bg-blue-700 text-white p-3 rounded-lg-3 mt-6 hover:bg-blue-900">
            Crear cuenta
          </button>
          <button
            className="w-full max-w-md bg-red-700 text-white p-3 rounded-lg-3 mt-6 hover:bg-red-900 "
            onClick={() => router.push("./login")}
          >
            Regresar
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
