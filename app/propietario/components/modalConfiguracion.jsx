import { soloEnteros, soloDecimales, pone_ceros } from "@/app/utils/globalfn";
import React from "react";
import { useState, useEffect } from "react";
import Inputs from "@/app/propietario/components/Inputs";
import Image from "next/image";
import iconos from "@/app/utils/iconos";
import { FaSpinner } from "react-icons/fa";

function ModalConfiguracion({
  accion,
  onSubmit,
  currentID,
  register,
  errors,
  isLoadingButton,
  setDataConfiguracion
}) {
  const [error, setError] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  useEffect(() => {
    if (accion === "Eliminar" || accion === "Ver") {
      setIsDisabled(true);
    }
    if (accion === "Alta" || accion === "Editar") {
      setIsDisabled(false);
    }
    setTitulo(
      accion === "Alta"
      ? `Nueva Configuracion`
      : accion === "Editar"
      ? `Editar Configuracion: ${currentID}`
      : `Ver Configuracion: ${currentID}`
    );
  }, [accion, currentID]);


  const handleBlur = (evt, datatype) => {
    if (evt.target.value === "") return;
    datatype === "int"
      ? setDataConfiguracion((configuracion) => ({
          ...configuracion,
          [evt.target.name]: pone_ceros(evt.target.value, 0, true),
        }))
      : setDataConfiguracion((configuracion) => ({
          ...configuracion,
          [evt.target.name]: pone_ceros(evt.target.value, 2, true),
        }));
  };

  return (
    <dialog id="modal_Configuracion" className="modal">
      <div className="modal-box bg-base-200 max-w-2xl">
        <form onSubmit={onSubmit}>
          <div className="sticky -top-6 flex justify-between items-center bg-base-200  dark:bg-[#1d232a] w-full h-10 z-10 mb-5">{/* bg-white */}
            <h3 className="font-bold text-lg text-neutral-600 dark:text-white">{titulo}</h3>
            <div className="flex space-x-2 items-center">
              <div
                className={`tooltip tooltip-bottom ${
                  accion === "Ver"
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
                </button>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-circle btn-ghost bg-base-200 dark:bg-[#1d232a] text-neutral-600 dark:text-white"
                onClick={() => document.getElementById("modal_Configuracion").close()}
              >
                ✕
              </button>
            </div>
          </div>

          <fieldset id="fs_configuracion">
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
                  name={"numero_configuracion"}
                  tamañolabel={"w-2/6"}
                  className={"w-3/6 text-right"}
                  Titulo={"Numero: "}
                  type={"text"}
                  requerido={true}
                  errors={errors}
                  register={register}
                  message={"Numero Requerido"}
                  isDisabled={isDisabled}
                />
              </fieldset>
              <Inputs
                dataType={"string"}
                name={"descripcion_configuracion"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Descripcion Configuracion: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Descripcion Configuracion requerida"}
                maxLenght={50}
                isDisabled={isDisabled}
              />

              <Inputs
                dataType={"int"}
                name={"valor_configuracion"}
                tamañolabel={"w-4/6"}
                className={"rounded block grow text-right"}
                Titulo={"Valor Configuracion: "}
                type={"text"}
                requerido={true}
                isNumero={true}
                errors={errors}
                register={register}
                message={"valor Configuracion requerido"}
                maxLenght={11}
                isDisabled={isDisabled}
              />

              <Inputs
                dataType={"string"}
                name={"texto_configuracion"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Texto Configuracion: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Texto Configuracion requerido"}
                maxLenght={70}
                isDisabled={isDisabled}
              />
            </div>
          </fieldset>
        </form>
      </div>
    </dialog>
  );
}

export default ModalConfiguracion;