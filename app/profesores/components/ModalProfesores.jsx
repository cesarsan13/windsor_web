import { soloEnteros, soloDecimales, pone_ceros } from "@/app/utils/globalfn";
import React from "react";
import { useState, useEffect } from "react";
import Inputs from "@/app/profesores/components/Inputs";
import Image from "next/image";
import iconos from "@/app/utils/iconos";
import { FaSpinner } from "react-icons/fa";

function ModalProfesores({
  accion,
  onSubmit,
  currentID,
  register,
  errors,
  setProfesor,
  isLoading,
}) {
  const [error, setError] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    if (accion === "Eliminar" || accion === "Ver") {
      setIsDisabled(true);
      // accion === "Ver" &&
      //   document.getElementById("btn_guardar").setAttribute("disabled", true);
    }
    if (accion === "Alta" || accion === "Editar") {
      // alert(accion);
      setIsDisabled(false);
    }
    setTitulo(
      accion === "Alta"
        ? `Nuevos Profesor: ${currentID}`
        : accion === "Editar"
          ? `Editar Profesor: ${currentID}`
          : accion === "Eliminar"
            ? `Eliminar Profesor: ${currentID}`
            : `Ver Profesor: ${currentID}`
    );
  }, [accion, accion]);

  const handleBlur = (evt, datatype) => {
    if (evt.target.value === "") return;
    datatype === "int"
      ? setProfesor((profesores) => ({
        ...profesores,
        [evt.target.name]: pone_ceros(evt.target.value, 0, true),
      }))
      : setProfesor((profesores) => ({
        ...profesores,
        [evt.target.name]: pone_ceros(evt.target.value, 2, true),
      }));
  };

  return (
    <dialog id="my_modal_3" className="modal">
      <div className="modal-box">
        <form onSubmit={onSubmit}>
          <div className="sticky -top-6 flex justify-between items-center bg-white dark:bg-[#1d232a] w-full h-10 z-10 mb-5">
            <h3 className="font-bold text-lg">{titulo}</h3>
            <div className="flex space-x-2 items-center">
              <div
                className={`tooltip tooltip-bottom ${accion === "Ver"
                  ? "hover:cursor-not-allowed hidden"
                  : "hover:cursor-pointer"
                  }`}
                data-tip="Guardar"
              >
                <button
                  type="submit"
                  id="btn_guardar"
                  className="bg-transparent hover:bg-slate-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-white rounded-lg btn btn-sm"
                  onClick={onsubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <FaSpinner className="animate-spin mx-2" />
                  ) : (
                    <Image src={iconos.guardar} alt="guardar" className="w-5 h-5 md:w-6 md:h-6" />
                  )}
                  {isLoading ? " Cargando..." : " guardar"}
                </button>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-circle btn-ghost"
                onClick={() => document.getElementById("my_modal_3").close()}
              >
                ✕
              </button>
            </div>
          </div>

          <fieldset id="fs_profesores">
            <div className="container flex flex-col space-y-5">
              <fieldset
                disabled={
                  accion === "Alta" ||
                  accion === "Editar" ||
                  accion === "Eliminar" ||
                  accion === "Ver"
                }
              >
                <Inputs
                  dataType={"int"}
                  name={"numero"}
                  tamañolabel={"w-2/6"}
                  className={"w-3/6 text-right"}
                  Titulo={"Numero: "}
                  type={"text"}
                  requerido={true}
                  errors={errors}
                  register={register}
                  message={"id Requerido"}
                  isDisabled={isDisabled}
                />
              </fieldset>

              <Inputs
                dataType={"string"}
                name={"nombre"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Nombre: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Nombre requerido"}
                maxLenght={50}
                isDisabled={isDisabled}
              />

              <Inputs
                dataType={"string"}
                name={"ap_paterno"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Apellido Paterno: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Apellido Paterno requerido"}
                maxLenght={50}
                isDisabled={isDisabled}
              />

              <Inputs
                dataType={"string"}
                name={"ap_materno"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Apellido Materno: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Apellido Materno requerido"}
                maxLenght={50}
                isDisabled={isDisabled}
              />

              <Inputs
                dataType={"string"}
                name={"direccion"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Direccion: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Direccion requerido"}
                maxLenght={50}
                isDisabled={isDisabled}
              />

              <Inputs
                dataType={"string"}
                name={"colonia"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Colonia: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Colonia requerido"}
                maxLenght={50}
                isDisabled={isDisabled}
              />

              <Inputs
                dataType={"string"}
                name={"ciudad"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Ciudad: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Ciudad requerido"}
                maxLenght={50}
                isDisabled={isDisabled}
              />

              <Inputs
                dataType={"string"}
                name={"estado"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Estado: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Estado requerido"}
                maxLenght={20}
                isDisabled={isDisabled}
              />

              <Inputs
                dataType={"string"}
                name={"cp"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"CP: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"CP requerido"}
                maxLenght={6}
                isDisabled={isDisabled}
              />

              <Inputs
                dataType={"string"}
                name={"pais"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Pais: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Pais requerido"}
                maxLenght={20}
                isDisabled={isDisabled}
              />

              <Inputs
                dataType={"string"}
                name={"rfc"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"RFC: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"RFC requerido"}
                maxLenght={20}
                isDisabled={isDisabled}
              />

              <Inputs
                dataType={"string"}
                name={"telefono_1"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Telefono 1: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Telefono 1 requerido"}
                maxLenght={20}
                isDisabled={isDisabled}
              />

              <Inputs
                dataType={"string"}
                name={"telefono_2"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Telefono 2: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Telefono 2 requerido"}
                maxLenght={20}
                isDisabled={isDisabled}
              />

              <Inputs
                dataType={"string"}
                name={"fax"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Fax: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Fax requerido"}
                maxLenght={20}
                isDisabled={isDisabled}
              />

              <Inputs
                dataType={"string"}
                name={"celular"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Celular: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Celular requerido"}
                maxLenght={20}
                isDisabled={isDisabled}
              />

              <Inputs
                dataType={"string"}
                name={"email"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Email: "}
                type={"email"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Email requerido"}
                maxLenght={80}
                isDisabled={isDisabled}
              />

              <Inputs
                dataType={"string"}
                name={"contraseña"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Contraseña: "}
                type={"password"}
                requerido={false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Contraseña requerido"}
                maxLenght={12}
                isDisabled={isDisabled}
              />

            </div>
          </fieldset>
        </form>
      </div>
    </dialog>
  );
}

export default ModalProfesores;
