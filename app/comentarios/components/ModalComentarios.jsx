import { soloEnteros, soloDecimales, pone_ceros } from "@/app/utils/globalfn";
import React from "react";
import { useState, useEffect } from "react";
import Inputs from "@/app/comentarios/components/Inputs";
import Image from "next/image";
import iconos from "@/app/utils/iconos";

function ModalComentarios({
  accion,
  onSubmit,
  currentID,
  register,
  errors,
  setFormaComentarios,
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
        ? `Nuevo Comentario`
        : accion === "Editar"
        ? `Editar Comentario: ${currentID}`
        : accion === "Eliminar"
        ? `Eliminar Comentario: ${currentID}`
        : `Ver Comentario: ${currentID}`
    );
  }, [accion, currentID]);
  const handleBlur = (evt, datatype) => {
    if (evt.target.value === "") return;
    datatype === "int"
      ? setFormaComentarios((comentarios) => ({
          ...comentarios,
          [evt.target.name]: pone_ceros(evt.target.value, 0, true),
        }))
      : setFormaComentarios((comentarios) => ({
          ...comentarios,
          [evt.target.name]: pone_ceros(evt.target.value, 2, true),
        }));
  };

  const generales = [
    { id: 1, descripcion: "Si" },
    { id: 0, descripcion: "No" },
  ];

  return (
    <dialog id="my_modal_3" className="modal">
      <div className="modal-box">
        <form onSubmit={onSubmit}>
          <div className="sticky -top-6 flex justify-between items-center bg-white dark:bg-[#1d232a] w-full h-10 z-10 mb-5">
            <h3 className="font-bold text-lg">{titulo}</h3>
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
                >
                  <Image
                    src={iconos.guardar}
                    alt="Guardar"
                    className="w-5 h-5 md:w-6 md:h-6 mr-1"
                  />
                  <span className="hidden sm:inline">Guardar</span>
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
                name={"comentario_1"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Comentario 1: "}
                type={"text"}
                requerido={false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Comentario requerido"}
                maxLenght={50}
                isDisabled={isDisabled}
              />

              <Inputs
                dataType={"string"}
                name={"comentario_2"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Comentario 2: "}
                type={"text"}
                requerido={false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Comentario requerido"}
                maxLenght={50}
                isDisabled={isDisabled}
              />

              <Inputs
                dataType={"string"}
                name={"comentario_3"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Comentario 3: "}
                type={"text"}
                requerido={false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Comentario requerido"}
                maxLenght={50}
                isDisabled={isDisabled}
              />

              <Inputs
                name={"generales"}
                tamañolabel={"w-3/6"}
                className={"select p-1.5 grow "}
                Titulo={"Generales:"}
                type={"select"}
                requerido={false}
                errors={errors}
                maxLenght={1}
                register={register}
                message={"General requerido"}
                isDisabled={isDisabled}
                generales={generales}
              />
            </div>
          </fieldset>
        </form>
      </div>
    </dialog>
  );
}

export default ModalComentarios;
