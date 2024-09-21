import { soloEnteros, soloDecimales, pone_ceros } from "@/app/utils/globalfn";
import React from "react";
import { showSwal, confirmSwal } from "@/app/utils/alerts";
import { useState, useEffect } from "react";
import Inputs from "@/app/productos/components/Inputs";

function ModalProductos({
  accion,
  onSubmit,
  currentID,
  register,
  errors,
  setProducto,
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
        ? `Nuevo Producto: ${currentID}`
        : accion === "Editar"
          ? `Editar Producto: ${currentID}`
          : accion === "Eliminar"
            ? `Eliminar Producto: ${currentID}`
            : `Ver Producto: ${currentID}`
    );
  }, [accion, currentID]);
  const handleBlur = (evt, datatype) => {
    if (evt.target.value === "") return;
    datatype === "int"
      ? setProducto((producto) => ({
        ...producto,
        [evt.target.name]: pone_ceros(evt.target.value, 0, true),
      }))
      : setProducto((producto) => ({
        ...producto,
        [evt.target.name]: pone_ceros(evt.target.value, 2, true),
      }));
  };
  return (
    <dialog id="my_modal_3" className="modal">
      <div className="modal-box">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 dark:text-white text-black"
          onClick={() => document.getElementById("my_modal_3").close()}
        >
          ✕
        </button>
        {/* if there is a button in form, it will close the modal */}
        <form onSubmit={onSubmit}>
          <h3 className="font-bold text-lg mb-5 dark:text-white text-black">
            {titulo}
          </h3>
          <fieldset id="fs_productos">
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
                message={"idRequerido"}
                isDisabled={true}
              />
              <Inputs
                dataType={"string"}
                name={"descripcion"}
                tamañolabel={""}
                className={"grow"}
                Titulo={"Descripción: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Descripción requerido"}
                maxLenght={30}
                isDisabled={isDisabled}
                handleBlur={handleBlur}

              />
              <Inputs
                dataType={"string"}
                name={"ref"}
                tamañolabel={""}
                className={"grow"}
                Titulo={"Referencia: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Referencia requerido"}
                maxLenght={3}
                isDisabled={isDisabled}
                handleBlur={handleBlur}

              />
              <Inputs
                dataType={"string"}
                name={"frecuencia"}
                tamañolabel={""}
                className={"grow"}
                Titulo={"Frecuencia:"}
                type={"text"}
                requerido={true}
                errors={errors}
                register={register}
                message={"Frecuencia requerido"}
                maxLenght={6}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
              />
              <Inputs
                dataType={"string"}
                name={"aplicacion"}
                tamañolabel={""}
                className={"grow"}
                Titulo={"Aplicación:"}
                type={"text"}
                requerido={true}
                errors={errors}
                register={register}
                message={"Aplicación requerido"}
                maxLenght={34}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
              />
              <Inputs
                dataType={"float"}
                name={"costo"}
                tamañolabel={"w-3/6"}
                className={" w-2/6 grow text-right"}
                Titulo={"Costo:"}
                type={"float"}
                requerido={true}
                errors={errors}
                register={register}
                message={"Costo requerido"}
                maxLenght={10}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
              />
              <Inputs
                dataType={"float"}
                name={"por_recargo"}
                tamañolabel={"w-3/6"}
                className={" w-2/6 grow text-right"}
                Titulo={"Recargos:"}
                type={"float"}
                requerido={true}
                errors={errors}
                register={register}
                message={"Recargos requerido"}
                maxLenght={10}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
              />
              <Inputs
                dataType={"float"}
                name={"iva"}
                tamañolabel={"w-3/6"}
                className={" w-2/6 grow text-right"}
                Titulo={"IVA:"}
                type={"float"}
                requerido={true}
                errors={errors}
                register={register}
                message={"IVA requerido"}
                maxLenght={10}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
              />
              <Inputs
                dataType={"int"}
                name={"cond_1"}
                tamañolabel={"w-3/6"}
                className={" w-2/6 grow text-right"}
                Titulo={"Condición:"}
                type={"int"}
                requerido={true}
                errors={errors}
                register={register}
                message={"Condición requerido"}
                maxLenght={10}
                isDisabled={isDisabled}
                handleBlur={handleBlur}
              />
              <Inputs
                dataType={"boolean"}
                name={"cam_precio"}
                tamañolabel={"w-3/6"}
                className={" w-2/6 grow"}
                Titulo={"Cambia precio"}
                type={"checkbox"}
                requerido={false}
                errors={errors}
                register={register}
                message={"Cambia precio requerido"}
                maxLenght={1}
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

export default ModalProductos;
