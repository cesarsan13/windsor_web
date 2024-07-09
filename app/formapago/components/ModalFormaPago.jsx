import { soloEnteros, soloDecimales } from "@/app/utils/globalfn";
import React from "react";
import { showSwal, confirmSwal } from "@/app/utils/alerts";
import { useState, useEffect } from "react";
import Inputs from "@/app/formaPago/components/Inputs";

function ModalFormaPago({ accion, onSubmit, currentID, register, errors }) {
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
      document.getElementById("id").setAttribute("disabled", true);
    }
    setTitulo(
      accion === "Alta"
        ? `Nueva Forma de Pago: ${currentID}`
        : accion === "Editar"
        ? `Editar Forma de Pago: ${currentID}`
        : accion === "Eliminar"
        ? `Eliminar Forma de Pago: ${currentID}`
        : `Ver Forma de Pago: ${currentID}`
    );
  }, [accion]);
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
                name={"id"}
                tamañolabel={"w-2/6"}
                className={"w-3/6 text-right"}
                Titulo={"Numero: "}
                type={"text"}
                requerido={true}
                isNumero={true}
                errors={errors}
                register={register}
                message={"idRequerido"}
                isDisabled={isDisabled}
                //defaultValue={formaPago.id}
              />
              <Inputs
                name={"descripcion"}
                tamañolabel={""}
                className={"grow"}
                Titulo={"Descripcion: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"descripcion requerid"}
                maxLength={50}
                isDisabled={isDisabled}
                //defaultValue={formaPago.descripcion}
              />

              <Inputs
                name={"comision"}
                tamañolabel={"w-3/6"}
                className={" w-2/6 grow text-right"}
                Titulo={"Comision:"}
                type={"text"}
                requerido={true}
                isNumero={true}
                errors={errors}
                register={register}
                message={"comision requerid"}
                maxLength={50}
                isDisabled={isDisabled}
                //defaultValue={formaPago.comision}
              />
              <Inputs
                name={"aplicacion"}
                tamañolabel={""}
                className={"grow"}
                Titulo={"Aplicacion:"}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Aplicacion requerida"}
                maxLength={34}
                isDisabled={isDisabled}
                //defaultValue={formaPago.aplicacion}
              />
              <Inputs
                name={"cue_banco"}
                tamañolabel={""}
                className={"grow"}
                Titulo={"Cuenta Banco:"}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Cuenta Banco requerida"}
                maxLength={30}
                isDisabled={isDisabled}
                //defaultValue={formaPago.cue_banco}
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
              <kbd className="kbd">
                <button type="submit" id="btn_guardar">
                  <i className="fa-regular fa-floppy-disk mx-2"></i> Guardar
                </button>
              </kbd>
            </div>
          </div>
        </form>
      </div>
    </dialog>
  );
}

export default ModalFormaPago;
