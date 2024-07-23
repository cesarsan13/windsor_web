import { soloEnteros, soloDecimales, pone_ceros } from "@/app/utils/globalfn";
import React from "react";
import { showSwal, confirmSwal } from "@/app/utils/alerts";
import { useState, useEffect } from "react";
import Inputs from "@/app/formfact/components/Inputs";

function ModalFormFact({
  accion,
  onSubmit,
  currentID,
  register,
  errors,
  setFormFact,
  formFact,
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
        ? `Nuevo Factura: ${currentID}`
        : accion === "Editar"
        ? `Editar Factura: ${currentID}`
        : accion === "Eliminar"
        ? `Eliminar Factura: ${currentID}`
        : `Ver Factura: ${currentID}`
    );
  }, [accion]);
  const handleBlur = (evt, datatype) => {
    if (evt.target.value === "") return;
    datatype === "int"
      ? setFormFact((formFact) => ({
          ...formFact,
          [evt.target.name]: pone_ceros(evt.target.value, 0, true),
        }))
      : setFormFact((formFact) => ({
          ...formFact,
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
          <fieldset id="fs_formapago">
            <div className="container flex flex-col space-y-5">
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
                message={"numero requerido"}
                isDisabled={true}
                //defaultValue={formaPago.id}
              />
              <Inputs
                dataType={"string"}
                name={"nombre"}
                tamañolabel={""}
                className={"grow"}
                Titulo={"Nombre: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"nombre requerido"}
                maxLength={50}
                isDisabled={isDisabled}
                //defaultValue={formaPago.descripcion}
              />
              <Inputs
                dataType={"float"}
                name={"longitud"}
                tamañolabel={""}
                className={"grow"}
                Titulo={"Longitud: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"longitud requerido"}
                maxLength={50}
                isDisabled={isDisabled}
                //defaultValue={formaPago.descripcion}
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

export default ModalFormFact;
