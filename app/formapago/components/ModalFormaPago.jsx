import { soloEnteros, soloDecimales, pone_ceros } from "@/app/utils/globalfn";
import React from "react";
import { showSwal, confirmSwal } from "@/app/utils/alerts";
import { useState, useEffect } from "react";
import Inputs from "@/app/formapago/components/Inputs";

function ModalFormaPago({
  accion,
  onSubmit,
  currentID,
  register,
  errors,
  setFormaPago,
  formaPago,
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
        ? `Nueva Forma de Pago: ${currentID}`
        : accion === "Editar"
          ? `Editar Forma de Pago: ${currentID}`
          : accion === "Eliminar"
            ? `Eliminar Forma de Pago: ${currentID}`
            : `Ver Forma de Pago: ${currentID}`
    );
  }, [accion]);
  const handleBlur = (evt, datatype) => {
    if (evt.target.value === "") return;
    datatype === "int"
      ? setFormaPago((formaPago) => ({
        ...formaPago,
        [evt.target.name]: pone_ceros(evt.target.value, 0, true),
      }))
      : setFormaPago((formaPago) => ({
        ...formaPago,
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
          <h3 className="font-bold text-lg mb-5  text-black dark:text-white">{titulo}</h3>
          <fieldset id="fs_formapago">
            <div className="flex flex-wrap -mx-3 mb-6">
              <Inputs
                dataType={"int"}
                name={"id"}
                tamañolabel={""}
                className={"rounded block grow text-right"}
                Titulo={"Numero: "}
                type={"text"}
                requerido={true}
                errors={errors}
                register={register}
                message={"id Requerido"}
                isDisabled={true}
                handleBlur={handleBlur}
              />
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
                message={"descripcion requerid"}
                maxLenght={50}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
              />

              <Inputs
                dataType={"float"}
                name={"comision"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Comision:"}
                type={"text"}
                requerido={true}
                errors={errors}
                register={register}
                message={"comision requerid"}
                maxLenght={5}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
              />
              <Inputs
                dataType={"string"}
                name={"aplicacion"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Aplicacion:"}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Aplicacion requerida"}
                maxLenght={30}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
              />
              <Inputs
                dataType={"string"}
                name={"cue_banco"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Cuenta Banco:"}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Cuenta Banco requerida"}
                maxLenght={34}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
              />
            </div>
          </fieldset>
          <div className=" modal-action">
            <div
              className={`tooltip tooltip-top my-5 ${accion === "Ver"
                ? "hover:cursor-not-allowed hidden"
                : "hover:cursor-pointer"
                }`}
              data-tip="Guardar"
            >
              <button
                type="submit"
                id="btn_guardar"
                className="btn hover:bg-transparent border-none shadow-md bg-transparent hover:bg-slate-200 dark:hover:bg-neutral-700 text-black dark:text-white"
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

export default ModalFormaPago;
