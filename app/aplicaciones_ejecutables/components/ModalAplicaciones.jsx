import { soloEnteros, soloDecimales, pone_ceros } from "@/app/utils/globalfn";
import React from "react";
import { useState, useEffect } from "react";
import Inputs from "@/app/comentarios/components/Inputs";
import Image from "next/image";
import iconos from "@/app/utils/iconos";
import { FaSpinner } from "react-icons/fa";

function ModalAplicaciones({
    accion,
    onSubmit,
    currentID,
    register,
    errors,
    setFormaAplicaciones,
    isLoadingButton,
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
            ? `Nuevo Ejecutable`
            : accion === "Editar"
            ? `Editar Ejecutable: ${currentID}`
            : accion === "Eliminar"
            ? `Eliminar Ejecutable: ${currentID}`
            : `Ver Ejecutable: ${currentID}`
        );
      }, [accion, currentID]);


    const handleBlur = (evt, datatype) => {
        if (evt.target.value === "") return;
        datatype === "int"
          ? setFormaAplicaciones((aplicaciones) => ({
              ...aplicaciones,
              [evt.target.name]: pone_ceros(evt.target.value, 0, true),
            }))
          : setFormaAplicaciones((aplicaciones) => ({
              ...aplicaciones,
              [evt.target.name]: pone_ceros(evt.target.value, 2, true),
            }));
      };
    
      return (
        <dialog id="my_modal_Apl" className="modal">
          <div className="modal-box bg-base-200">
            <form onSubmit={onSubmit}>
              <div className="sticky -top-6 flex justify-between items-center bg-transparent w-full h-10 z-10 mb-5">
                {/* bg-white */}
                <h3 className="font-bold text-lg text-neutral-600 dark:text-white">
                  {titulo}
                </h3>
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
                          <Image
                            src={iconos.guardar}
                            alt="Guardar"
                            className="w-5 h-5 md:w-6 md:h-6 block dark:hidden"
                          />
                          <Image
                            src={iconos.guardar_w}
                            alt="Guardar"
                            className="w-5 h-5 md:w-6 md:h-6 hidden dark:block"
                          />
                        </>
                      )}
                      {isLoadingButton ? " Cargando..." : " Guardar"}
                    </button>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-circle btn-ghost bg-base-200 dark:bg-[#1d232a] text-neutral-600 dark:text-white"
                    onClick={() => document.getElementById("my_modal_Apl").close()}
                  >
                    ✕
                  </button>
                </div>
              </div>
    
              <fieldset id="fs_comentario">
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
                      requerido={accion === "Alta" ? false : true}
                      errors={errors}
                      register={register}
                      message={"id Requerido"}
                      isDisabled={accion === "Alta" ? !isDisabled : isDisabled}
                    />
                  </fieldset>
                  <Inputs
                    dataType={"string"}
                    name={"descripcion"}
                    tamañolabel={""}
                    className={"rounded block grow"}
                    Titulo={"Descripcion: "}
                    type={"text"}
                    requerido={true}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Descripcion requerido"}
                    maxLenght={50}
                    isDisabled={isDisabled}
                  />
    
                  <Inputs
                    dataType={"string"}
                    name={"ruta_archivo"}
                    tamañolabel={""}
                    className={"rounded block grow"}
                    Titulo={"Ruta Archivo: "}
                    type={"text"}
                    requerido={true}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Ruta de Archivo requerida"}
                    maxLenght={255}
                    isDisabled={isDisabled}
                  />
    
                  <Inputs
                    dataType={"string"}
                    name={"icono"}
                    tamañolabel={""}
                    className={"rounded block grow"}
                    Titulo={"Icono: "}
                    type={"text"}
                    requerido={false}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Comentario requerido"}
                    maxLenght={50}
                    isDisabled={isDisabled}
                  />
                </div>
              </fieldset>
            </form>
          </div>
        </dialog>
      );
}
export default ModalAplicaciones;