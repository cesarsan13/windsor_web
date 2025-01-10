import { soloEnteros, soloDecimales, pone_ceros } from "@/app/utils/globalfn";
import { useForm } from "react-hook-form";

import React from "react";
import { showSwal, confirmSwal } from "@/app/utils/alerts";
import { useState, useEffect } from "react";
import Inputs from "@/app/c_otras/components/Inputs";
import Image from "next/image";
import iconos from "@/app/utils/iconos";

function ModalC_Otras({
  accion,
  onSubmit,
  currentID,
  register,
  errors,
  setC_otra,
  setValue,
  watch,
  disabledNum,
  num,
  setNum,
  getValues,
  materiaDesc
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
        ? `Nuevo ${materiaDesc}: ${currentID}`
        : accion === "Editar"
          ? `Editar ${materiaDesc}: ${currentID}`
          : accion === "Eliminar"
            ? `Eliminar ${materiaDesc}: ${currentID}`
            : `Ver ${materiaDesc}: ${currentID}`
    );
  }, [accion, currentID]);

  useEffect(() => {
    setValue("numero", num);
    setTitulo(
      accion === "Alta"
        ? `Nuevo ${materiaDesc}: ${num}`
        : accion === "Editar"
          ? `Editar ${materiaDesc}: ${num}`
          : accion === "Eliminar"
            ? `Eliminar ${materiaDesc}: ${num}`
            : `Ver ${materiaDesc}: ${num}`
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
      ? setC_otra((c_otra) => ({
        ...c_otra,
        [evt.target.name]: pone_ceros(evt.target.value, 0, true),
      }))
      : setC_otra((c_otra) => ({
        ...c_otra,
        [evt.target.name]: pone_ceros(evt.target.value, 2, true),
      }));
  };
  return (
    <dialog id="my_modal_c_otras" className="modal">
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
                >
                  <Image src={iconos.guardar} alt="Guardar" className="w-5 h-5 md:w-6 md:h-6 block dark:hidden" />
                  <Image src={iconos.guardar_w} alt="Guardar" className="w-5 h-5 md:w-6 md:h-6 hidden dark:block" />
                  <span className="hidden sm:inline">Guardar</span>
                </button>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-circle btn-ghost bg-base-200 dark:bg-[#1d232a] text-neutral-600 dark:text-white"
                onClick={() => document.getElementById("my_modal_c_otras").close()}
              >
                ✕
              </button>
            </div>
          </div>
          <fieldset id="fs_c_otras">
            <div className="flex flex-wrap -mx-3 mb-6 px-3 gap-x-5 gap-y-5">
              <div className="flex flex-col w-full">
                <Inputs
                  dataType={"int"}
                  name={"materia"}
                  tamañolabel={"w-2/4"}
                  className={"w-3/6  text-right uppercase"}
                  Titulo={"Numero: "}
                  type={"inputNum"}
                  requerido={accion === "Alta" ? false : true}
                  errors={errors}
                  register={register}
                  maxLenght={6}
                  message={"Numero requerido"}
                  isDisabled={!isDisabled}
                  handleBlur={handleBlurOut}
                />
              </div>
              <div className="flex flex-col w-full">
                <Inputs
                  dataType={"string"}
                  name={"descripcion"}
                  tamañolabel={"w-full"}
                  className={"w-full uppercase"}
                  Titulo={"Asignatura: "}
                  type={"text"}
                  requerido={true}
                  isNumero={false}
                  errors={errors}
                  register={register}
                  message={"Asignatura requerida"}
                  maxLenght={100}
                  isDisabled={!isDisabled}
                  handleBlur={handleBlur}
                />
              </div>
              <div className="flex flex-col w-full">
                <Inputs
                  dataType={"int"}
                  name={"calificacion"}
                  tamañolabel={"w-2/4"}
                  className={"w-3/6  text-right uppercase"}
                  Titulo={"Calificación: "}
                  type={"inputNum"}
                  requerido={accion === "Alta" ? false : true}
                  errors={errors}
                  register={register}
                  maxLenght={6}
                  message={"calificacion requerida"}
                  isDisabled={isDisabled}
                  handleBlur={handleBlur}
                />
              </div>
            </div>
          </fieldset>
        </form>
      </div>
    </dialog>
  );
}

export default ModalC_Otras;
