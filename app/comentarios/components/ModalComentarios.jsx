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
      <div className="modal-box">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => document.getElementById("my_modal_3").close()}
        >
          ✕
        </button>
        {/* if there is a button in form, it will close the modal */}
        <form onSubmit={onSubmit}>
          <h3 className="font-bold text-lg mb-5">{titulo}</h3>
          <fieldset id="fs_comentario">
            <div className="container flex flex-col space-y-5">
              <Inputs
                dataType={"int"}
                name={"id"}
                tamañolabel={"w-2/6"}
                className={"w-3/6 text-right"}
                Titulo={"Numero: "}
                type={"text"}
                requerido={true}
                errors={errors}
                register={register}
                message={"id Requerido"}
                isDisabled={true}

              />
              <Inputs
                dataType={"string"}
                name={"comentario_1"}
                tamañolabel={""}
                className={"grow"}
                Titulo={"Comentario 1: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Comentario requerido"}
                maxLength={50}
                isDisabled={isDisabled}

              />

              <Inputs
                dataType={"string"}
                name={"comentario_2"}
                tamañolabel={""}
                className={"grow"}
                Titulo={"Comentario 2: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Comentario requerido"}
                maxLength={50}
                isDisabled={isDisabled}
                
              />

              <Inputs
                dataType={"string"}
                name={"comentario_3"}
                tamañolabel={""}
                className={"grow"}
                Titulo={"Comentario 3: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Comentario requerido"}
                maxLength={50}
                isDisabled={isDisabled}
              />

              <Inputs
                name={"generales"}
                tamañolabel={"w-3/6"}
                className={" w-1/6 grow text-right"}
                Titulo={"Generales:"}
                type={"select"}
                requerido={true}
                errors={errors}
                register={register}
                message={"General requerido"}
                isDisabled={isDisabled}
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
                className="btn  bg-blue-500 hover:bg-blue-700 text-white"
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
