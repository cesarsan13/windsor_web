import { soloEnteros, soloDecimales, pone_ceros } from "@/app/utils/globalfn";
import { useForm } from "react-hook-form";

import React from "react";
import { showSwal, confirmSwal } from "@/app/utils/alerts";
import { useState, useEffect } from "react";
import Inputs from "@/app/asignaturas/components/Inputs";
import Image from "next/image";
import iconos from "@/app/utils/iconos";
import { FaSpinner } from "react-icons/fa";

function ModalAsignaturas({
  accion,
  onSubmit,
  currentID,
  register,
  errors,
  setAsignatura,
  setValue,
  watch,
  disabledNum,
  num,
  setNum,
  getValues,
  isLoadingButton
}) {
  // const { getValues } = useForm();
  const [error, setError] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const numeroProd = watch("numero");
  useEffect(() => {
    if (accion === "Eliminar" || accion === "Ver") {
      setIsDisabled(true);
    }
    if (accion === "Alta" || accion === "Editar") {
      setIsDisabled(false);
    }
    setTitulo(
      accion === "Alta"
        ? `Nuevo Asignatura: ${currentID}`
        : accion === "Editar"
          ? `Editar Asignatura: ${currentID}`
          : accion === "Eliminar"
            ? `Eliminar Asignatura: ${currentID}`
            : `Ver Asignatura: ${currentID}`
    );
  }, [accion, currentID]);

  useEffect(() => {
    setValue("numero", num);
    setTitulo(
      accion === "Alta"
        ? `Nuevo Asignatura: ${num}`
        : accion === "Editar"
          ? `Editar Asignatura: ${num}`
          : accion === "Eliminar"
            ? `Eliminar Asignatura: ${num}`
            : `Ver Asignatura: ${num}`
    );
  }, [num]);

  const handleBlurOut = (evt, datatype) => {
    if (evt.target.name === "numero") {
      setNum(evt.target.value);
    }
  };

  const handleBlur = (evt, datatype) => {
    if (evt.target.value === "") return;
    datatype === "int"
      ? setAsignatura((asignatura) => ({
        ...asignatura,
        [evt.target.name]: pone_ceros(evt.target.value, 0, true),
      }))
      : setAsignatura((asignatura) => ({
        ...asignatura,
        [evt.target.name]: pone_ceros(evt.target.value, 2, true),
      }));
  };
  return (
    <dialog id="my_modal_3" className="modal">
      <div className="modal-box bg-base-200">
        <form onSubmit={onSubmit}>
          <div className="sticky -top-6 flex justify-between items-center bg-base-200  w-full h-10 z-10 mb-5">
            <h3 className="font-bold text-lg text-neutral-600 dark:text-white">{titulo}</h3>
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
                  disabled={isLoadingButton}
                >
                  {isLoadingButton ? (
                    <FaSpinner className="animate-spin mx-2" />
                  ) : (
                    <>
                      <Image src={iconos.guardar} alt="Guardar" className="w-5 h-5 md:w-6 md:h-6 block dark:hidden" />
                      <Image src={iconos.guardar_w} alt="Guardar" className="w-5 h-5 md:w-6 md:h-6 hidden dark:block" />
                    </>
                  )}
                  {isLoadingButton ? " Cargando..." : " Guardar"}
                  {/* <Image
                    src={iconos.guardar}
                    alt="Guardar"
                    className="w-5 h-5 md:w-6 md:h-6 mr-1"
                  />
                  <span className="hidden sm:inline">Guardar</span> */}
                </button>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-circle btn-ghost bg-base-200 dark:bg-[#1d232a] text-neutral-600 dark:text-white"
                onClick={() => document.getElementById("my_modal_3").close()}
              >
                ✕
              </button>
            </div>
          </div>
          <fieldset id="fs_asignaturas">
            <div className="flex flex-wrap -mx-3 mb-6 px-3 gap-x-5 gap-y-5">
              <div className="flex flex-col w-full">
                <Inputs
                  dataType={"int"}
                  name={"numero"}
                  tamañolabel={"w-2/4"}
                  className={"w-3/6  text-right uppercase"}
                  Titulo={"Numero: "}
                  type={"inputNum"}
                  requerido={accion === "Alta" ? false : true}
                  errors={errors}
                  register={register}
                  maxLenght={6}
                  message={"Numero requerido"}
                  isDisabled={true}
                  handleBlur={handleBlurOut}
                />
              </div>
              <div className="flex flex-col w-full">
                <Inputs
                  dataType={"string"}
                  name={"descripcion"}
                  tamañolabel={"w-full"}
                  className={"w-full uppercase"}
                  Titulo={"Descripción: "}
                  type={"text"}
                  requerido={true}
                  isNumero={false}
                  errors={errors}
                  register={register}
                  message={"Descripción requerida"}
                  maxLenght={100}
                  isDisabled={isDisabled}
                  handleBlur={handleBlur}
                />
              </div>
              <div className="flex flex-col w-full">
                <Inputs
                  dataType={"string"}
                  name={"lenguaje"}
                  tamañolabel={"w-full"}
                  className={`fyo8m-select p-1.5 grow ${isDisabled ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-white"}`}
                  Titulo={"Lenguaje: "}
                  type={"select"}
                  requerido={true}
                  isNumero={false}
                  errors={errors}
                  register={register}
                  message={"Lenguaje requerido"}
                  maxLenght={15}
                  isDisabled={isDisabled}
                  handleBlur={handleBlur}
                  arreglos={[
                    { id: "ESPAÑOL", descripcion: "ESPAÑOL" },
                    { id: "INGLÉS", descripcion: "INGLÉS" },
                  ]}
                />
              </div>
              <div className="flex flex-col w-full">
                <Inputs
                  dataType={"string"}
                  name={"caso_evaluar"}
                  tamañolabel={""}
                  className={"fyo8m-select p-1.5 grow bg-[#ffffff] "}
                  Titulo={"Caso a Evaluar: "}
                  type={"select"}
                  requerido={true}
                  isNumero={false}
                  errors={errors}
                  register={register}
                  message={"Caso a Evaluar requerido"}
                  maxLenght={15}
                  isDisabled={isDisabled}
                  handleBlur={handleBlur}
                  arreglos={[
                    { id: "CALIFICACIÓN", descripcion: "CALIFICACIÓN" },
                    { id: "OTRO", descripcion: "OTRO" },
                  ]}
                />
              </div>
              <div className="flex flex-row w-full gap-x-5">
                <div className="flex flex-col w-3/6 gap-x-5">
                  <Inputs
                    dataType={"int"}
                    name={"area"}
                    tamañolabel={"w-full"}
                    className={"w-3/6 text-right"}
                    Titulo={"Area: "}
                    type={"select"}
                    requerido={true}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Area requerida"}
                    maxLenght={15}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                    arreglos={[
                      { id: 1, descripcion: 1 },
                      { id: 2, descripcion: 2 },
                      { id: 3, descripcion: 3 },
                      { id: 4, descripcion: 4 },
                    ]}
                  />
                </div>
                <div className="flex flex-col w-3/6 gap-x-5">
                  <Inputs
                    dataType={"int"}
                    name={"orden"}
                    tamañolabel={"w-full"}
                    className={"w-3/6 text-right "}
                    Titulo={"Orden: "}
                    type={"inputNum"}
                    requerido={false}
                    errors={errors}
                    register={register}
                    maxLenght={6}
                    message={"Orden requerido"}
                    isDisabled={isDisabled}
                    handleBlur={handleBlurOut}
                  />
                </div>

              </div>

              <div className="flex flex-row w-full gap-x-5 gap-y-5 max-[420px]:flex-wrap">
                <div className="flex flex-col w-3/6">
                  <Inputs
                    dataType={"int"}
                    name={"evaluaciones"}
                    tamañolabel={"w-full"}
                    className={"w-3/6 text-right"}
                    Titulo={"Evaluaciones: "}
                    type={"inputNum"}
                    requerido={false}
                    errors={errors}
                    register={register}
                    maxLenght={6}
                    message={"Evaluaciones requerida"}
                    isDisabled={isDisabled}
                    handleBlur={handleBlurOut}
                  />
                </div>
                <div className="flex flex-col max-[420px]:w-full w-3/6">
                  <Inputs
                    dataType={"boolean"}
                    name={"actividad"}
                    tamañolabel={"max-[420px]:w-full"}
                    className={"max-[420px]:w-full w-2/6 "}
                    Titulo={"Evaluación por Actividades."}
                    type={"checkbox"}
                    requerido={false}
                    errors={errors}
                    register={register}
                    message={"Evaluación por Actividades requerida"}
                    maxLenght={5}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                    getValues={getValues}
                  />
                </div>
              </div>
            </div>
          </fieldset>
        </form>
      </div>
    </dialog>
  );
}

export default ModalAsignaturas;
