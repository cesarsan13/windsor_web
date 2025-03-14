"use client";
import React, { useState, useEffect } from "react";
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
  const [empresas, setEmpresas] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const handleChange = (evt) => {
    evt.preventDefault();
    const { value } = evt.target;
    localStorage.setItem("xescuela", value);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${process.env.DOMAIN_API_PROYECTOS}api/basesDatos`);
      const resJson = await res.json();
      setEmpresas(resJson.data);
    };
    fetchData();
  }, []);

  const validatePassword = (password) => {
    const length = password.length >= 8;
    const uppercase = /[A-Z]/.test(password);
    const lowercase = /[a-z]/.test(password);
    const number = /[0-9]/.test(password);
    const specialChar = /[^A-Za-z0-9]/.test(password);

    setPasswordCriteria({ length, uppercase, lowercase, number, specialChar });
  };

  useEffect(() => {
    const subscription = watch((data) => {
      if (data.password) {
        validatePassword(data.password);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = handleSubmit(async (data) => {
    event.preventDefault();
    if (data.password !== data.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
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
        className="pointer-events-none hidden md:block bg-cover bg-center h-full w-full"
      />
      <Image
        src={iconos.fondoLoginMovil}
        alt="Background"
        layout="fill"
        objectPosition="center"
        className="absolute pointer-events-none block md:hidden bg-cover bg-center h-full w-full"
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
          titulo={"Escuela"}
          name={"xEscuela"}
          type={"select"}
          opciones={empresas.filter((arreglo) => arreglo.proyecto === 'control_escolar')}
          register={register}
          errors={errors}
          requerido={true}
          message={"Seleccione una Escuela"}
          handleChange={handleChange}
        />
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
        
        <div className="relative w-full">
          <Inputs
            titulo={"Contraseña"}
            name={"password"}
            id={"password"}
            message={"Contraseña requerida"}
            errors={errors}
            requerido={true}
            register={register}
            type={showPassword ? "text" : "password"}
            className={"p-3 rounded block text-slate-400 w-full pr-10"}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            )}
          </button>
        </div>

        <div className="relative mt-4">
          <Inputs
            titulo={"Confirmar Contraseña"}
            name={"confirmPassword"}
            id={"confirmPassword"}
            message={"Debe confirmar su contraseña"}
            errors={errors}
            requerido={true}
            register={register}
            type={showConfirmPassword ? "text" : "password"}
            className={"p-3 rounded block text-slate-400 w-full pr-10"}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10"
            onClick={toggleConfirmPasswordVisibility}
          >
            {showConfirmPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            )}
          </button>
        </div>
        <div className="w-full pl-4 mt-2">
            <ul className="text-sm">            
            <li className={passwordCriteria.length ? "text-green-500" : "text-red-500"}>Mínimo 8 caracteres</li>
            <li className={passwordCriteria.uppercase ? "text-green-500" : "text-red-500"}>Mínimo una mayúscula</li>
            <li className={passwordCriteria.lowercase ? "text-green-500" : "text-red-500"}>Mínimo una minúscula</li>
            <li className={passwordCriteria.number ? "text-green-500" : "text-red-500"}>Mínimo un número</li>
            <li className={passwordCriteria.specialChar ? "text-green-500" : "text-red-500"}>Mínimo un carácter especial</li>
          </ul>
          </div>

        <button className="w-full bg-blue-700 text-white p-3 rounded-lg mt-6 hover:bg-blue-900">
          Crear cuenta
        </button>
        <button
          type="button"
          className="w-full  bg-red-700 text-white p-3 rounded-lg mt-6 hover:bg-red-900"
          onClick={() => router.push("./login")}
        >
          Regresar
        </button>
      </form>
    </div>
  );
}

export default Register;
