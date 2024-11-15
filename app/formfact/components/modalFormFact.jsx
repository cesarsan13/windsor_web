import { soloEnteros, soloDecimales, pone_ceros } from "@/app/utils/globalfn";
import React from "react";
import { showSwal, confirmSwal } from "@/app/utils/alerts";
import { useState, useEffect } from "react";
import Inputs from "@/app/formfact/components/Inputs";
import Image from "next/image";
import iconos from "@/app/utils/iconos";

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
  }, [accion,currentID]);
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
      <div className="modal-box bg-base-200">
        <form onSubmit={onSubmit}>
        <div className="sticky -top-6 flex justify-between items-center bg-base-200 w-full h-10 z-10 mb-5">
        <h3 className="font-bold text-lg text-black dark:text-white">{titulo}</h3>
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
              <Image src={iconos.guardar} alt="Guardar" className="w-5 h-5 md:w-6 md:h-6 mr-1" />
              <span className="hidden sm:inline">Guardar</span>
            </button>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost text-black dark:text-white"
            onClick={() => document.getElementById("my_modal_3").close()}
          >
            ✕
          </button>
        </div>
      </div>
          <fieldset id="fs_formapago">
            <div className="container flex flex-col space-y-5">
              <Inputs
                dataType={"int"}
                name={"numero_forma"}
                tamañolabel={"w-6/12"}
                className={"w-5/12 rounded block text-right"}
                Titulo={"Numero: "}
                type={"text"}
                requerido={true}
                errors={errors}
                register={register}
                message={"numero requerido"}
                isDisabled={true}
                handleBlur={handleBlur}
              //defaultValue={formaPago.id}
              />
              <Inputs
                dataType={"string"}
                name={"nombre_forma"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Nombre: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Nombre requerido"}
                maxLenght={30}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
              //defaultValue={formaPago.descripcion}
              />
              <Inputs
                dataType={"float"}
                name={"longitud"}
                tamañolabel={"w-4/6"}
                className={"rounded block w-4/6 text-right"}
                Titulo={"Longitud: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Longitud requerido"}
                maxLenght={7}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
              //defaultValue={formaPago.descripcion}
              />
            </div>
          </fieldset>
        </form>
      </div>
    </dialog>
  );
}

export default ModalFormFact;
