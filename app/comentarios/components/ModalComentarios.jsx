import { soloEnteros, soloDecimales, pone_ceros } from "@/app/utils/globalfn";
import React from "react";
import { useState, useEffect } from "react";
import Inputs from "@/app/comentarios/components/Inputs";

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
        ? `Nuevos Comentarios: ${currentID}`
        : accion === "Editar"
        ? `Editar Comentarios: ${currentID}`
        : accion === "Eliminar"
        ? `Eliminar Comentarios: ${currentID}`
        : `Ver Comentarios: ${currentID}`
    );
  }, [accion]);
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
  return (
    <dialog id="my_modal_3" className="modal">
      <div className="modal-box w-full max-w-3xl h-full">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 dark:text-white text-black"
          onClick={() => document.getElementById("my_modal_3").close()}
        >
          ✕
        </button>
        {/* if there is a button in form, it will close the modal */}
        <form onSubmit={onSubmit}>
          <h3 className="font-bold text-lg mb-5  text-black dark:text-white">
            {titulo}
          </h3>
          <fieldset id="fs_comentario">
            <div className="flex flex-wrap -mx-3 mb-6">
              <Inputs
                dataType={"int"}
                name={"id"}
                tamañolabel={"w-2/6"}
                className={"rounded block grow text-right"}
                Titulo={"Numero: "}
                type={"text"}
                requerido={true}
                errors={errors}
                register={register}
                message={"id Requerido"}
                isDisabled={!isDisabled}
              />
              <Inputs
                dataType={"string"}
                name={"comentario_1"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Comentario 1: "}
                type={"text"}
                requerido={true}
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
                requerido={true}
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
                requerido={true}
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
                className={"fyo8m-select p-1.5 grow bg-[#ffffff] "}
                Titulo={"Generales:"}
                type={"select"}
                requerido={true}
                errors={errors}
                maxLenght={1}
                register={register}
                message={"General requerido"}
                isDisabled={isDisabled}
                arreglos={[
                  { id: "...", descripcion: "..." },
                  { id: "Si", descripcion: "Si" },
                  { id: "No", descripcion: "No" },
                ]}
              />
            </div>
          </fieldset>
          <div className=" modal-action">
            <div
              className={`tooltip tooltip-top my-5 ${
                accion === "Ver"
                  ? "hover:cursor-not-allowed hidden"
                  : "hover:cursor-pointer"
              }`}
              data-tip="Guardar"
            >
              <button
                type="submit"
                id="btn_guardar"
                className="bg-transparent over:bg-slate-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-white rounded-lg btn"
              >
                <i className="fa-regular fa-floppy-disk mx-2"></i> Guardar
              </button>
            </div>
          </div>
        </form>
      </div>
    </dialog>
  );
}

export default ModalComentarios;
