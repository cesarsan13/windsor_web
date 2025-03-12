"use client";
import React from "react";
import Inputs from "@/app/pagos1/components/Inputs";
import { useEffect } from "react";
import BuscarCat from "@/app/components/BuscarCat";
import Image from "next/image";
import iconos from "@/app/utils/iconos";
function ModalNuevoRegistro({
  session,
  productos1,
  setProductos1,
  register,
  errors,
  accionB,
  colorInput,
  precio_base,
  handleKeyDown,
  handleBlur,
  handleInputClick,
  handleModalClick,
}) {
  const nameInputs3 = ["numero_producto", "descripcion"];
  const columnasBuscaCat3 = ["numero", "descripcion"];

  useEffect(() => {
    document.getElementById("cantidad_producto").focus();
  }, [productos1.numero]);

  return (
    <dialog id="modal_nuevo_registro" className="modal">
      <div className="modal-box w-full md:w-3/4 max-w-xl h-auto bg-base-200">
        <div className="sticky -top-6 flex justify-between items-center bg-base-200  w-full h-10 z-10 mb-5">
          <h3 className="font-bold text-lg text-neutral-600 dark:text-white">Añadir Nuevo Pago</h3>
          <div className="flex space-x-2 items-center">
            <div data-tip="Guardar">
              <button
                onClick={(evt) => handleModalClick(evt)}
                id="btn_guardar"
                className="bg-transparent hover:bg-slate-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-white rounded-lg btn btn-sm "
              >
                <Image
                  src={iconos.guardar_w}
                  alt="Guardar"
                  className="w-5 h-5 md:w-6 md:h-6 mr-1 hidden dark:block"
                />
                <Image
                  src={iconos.guardar}
                  alt="Guardar"
                  className="w-5 h-5 md:w-6 md:h-6 mr-1 block dark:hidden"
                />
                <span className="hidden sm:inline">Guardar</span>
              </button>
            </div>
            <button
              className="btn btn-sm btn-circle btn-ghost bg-base-200 dark:bg-[#1d232a] text-neutral-600 dark:text-white"
              onClick={(event) => {
                event.preventDefault();
                document.getElementById("modal_nuevo_registro").close();
              }}
            >
              ✕
            </button>
          </div>
        </div>
        <fieldset id="fs_pagoimprime">
          <div className="container flex flex-col ">
            <div className="grid grid-flow-row gap-3">
              <div className="w-full">
                <BuscarCat
                  table="productos"
                  itemData={[]}
                  fieldsToShow={columnasBuscaCat3}
                  nameInput={nameInputs3}
                  titulo={"Articulos: "}
                  setItem={setProductos1}
                  token={session.user.token}
                  modalId="modal_articulos1"
                  accion={accionB}
                  alignRight={"text-right"}
                  inputWidths={{
                    contdef: "180px",
                    first: "70px",
                    second: "150px",
                  }}
                />
              </div>

              <div className="w-full">
                <div className="flex flex-row ">
                  <Inputs
                    tipoInput={"enterEvent"}
                    dataType={"int"}
                    name={"cantidad_producto"}
                    tamañolabel={"w-[calc(85%)]"}
                    className={`${colorInput} text-right w-[calc(85%)]`}
                    Titulo={"Cantidad: "}
                    type={"text"}
                    requerido={true}
                    errors={errors}
                    register={register}
                    message={"numero requerido"}
                    isDisabled={false}
                    eventInput={handleKeyDown}
                    handleBlur={handleBlur}
                    maxLength={8}
                    onClick={handleInputClick}
                  />
                  <Inputs
                    tipoInput={"numberDouble"}
                    dataType={"double"}
                    name={"precio_base"}
                    tamañolabel={"w-[calc(100%)]"}
                    className={`w-[calc(65%)] text-right ${colorInput}`}
                    Titulo={"P. Base: "}
                    type={"text"}
                    requerido={false}
                    errors={errors}
                    register={register}
                    message={"numero requerido"}
                    isDisabled={false}
                    valueInput={precio_base}
                    eventInput={handleBlur}
                    maxLength={8}
                  />
                </div>
              </div>
            </div>

            <div className="pb-3"></div>
          </div>
        </fieldset>
      </div>
    </dialog>
  );
}

export default ModalNuevoRegistro;
