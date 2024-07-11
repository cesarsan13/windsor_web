import { soloEnteros, soloDecimales, pone_ceros } from "@/app/utils/globalfn";
import React from "react";
import { showSwal, confirmSwal } from "@/app/utils/alerts";
import { useState, useEffect } from "react";
import Inputs from "@/app/cajeros/components/Inputs";

function ModalCajeros({
  accion,
  onSubmit,
  currentID,
  register,
  errors,
  setCajero,
  cajero,
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
        ? `Nuevo Cajero: ${currentID}`
        : accion === "Editar"
        ? `Editar Cajero: ${currentID}`
        : accion === "Eliminar"
        ? `Eliminar Cajero: ${currentID}`
        : `Ver Cajero: ${currentID}`
    );
  }, [accion]);
  const handleBlur = (evt, datatype) => {
    if (evt.target.value === "") return;
    datatype === "int"
      ? setCajero((cajero) => ({
          ...cajero,
          [evt.target.name]: pone_ceros(evt.target.value, 0, true),
        }))
      : setCajero((cajero) => ({
          ...cajero,
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
                dataType={"string"}
                name={"direccion"}
                tamañolabel={""}
                className={"grow"}
                Titulo={"Direccion: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"direccion requerida"}
                maxLength={50}
                isDisabled={isDisabled}
                //defaultValue={formaPago.descripcion}
              />
              <Inputs
                dataType={"string"}
                name={"colonia"}
                tamañolabel={""}
                className={"grow"}
                Titulo={"Colonia: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"colonia requerida"}
                maxLength={50}
                isDisabled={isDisabled}
                //defaultValue={formaPago.descripcion}
              />
              <Inputs
                dataType={"string"}
                name={"estado"}
                tamañolabel={""}
                className={"grow"}
                Titulo={"Estado: "}
                type={"text"}
                requerido={false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"estado requerido"}
                maxLength={50}
                isDisabled={isDisabled}
                //defaultValue={formaPago.descripcion}
              />
              <Inputs
                dataType={"string"}
                name={"telefono"}
                tamañolabel={""}
                className={"grow"}
                Titulo={"Telefono: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"telefono requerido"}
                maxLength={50}
                isDisabled={isDisabled}
                //defaultValue={formaPago.descripcion}
              />
              <Inputs
                dataType={"string"}
                name={"fax"}
                tamañolabel={""}
                className={"grow"}
                Titulo={"Fax: "}
                type={"text"}
                requerido={false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"fax requerido"}
                maxLength={50}
                isDisabled={isDisabled}
                //defaultValue={formaPago.descripcion}
              />
              <Inputs
                dataType={"string"}
                name={"mail"}
                tamañolabel={""}
                className={"grow"}
                Titulo={"Correo: "}
                type={"email"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"correo requerido"}
                maxLength={50}
                isDisabled={isDisabled}
                //defaultValue={formaPago.descripcion}
              />
              <Inputs
                dataType={"string"}
                name={"clave_cajero"}
                tamañolabel={""}
                className={"grow"}
                Titulo={"Clave Cajero: "}
                type={"text"}
                requerido={false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Clave requerida"}
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

export default ModalCajeros;
