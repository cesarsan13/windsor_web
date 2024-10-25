"use client";
import React from "react";
import Inputs from "@/app/pagos1/components/Inputs";
import BuscarCat from "@/app/components/BuscarCat";

function ModalNuevoRegistro({
  session,
  setAlumnos1,
  setComentarios1,
  setProductos1,
  register,
  errors,
  accionB,
  colorInput,
  precio_base,
  handleKeyDown,
  handleBlur,
}) {
  const nameInputs = ["numero", "nombre_completo"];
  const columnasBuscaCat = ["numero", "nombre_completo"];
  const nameInputs2 = ["numero", "comentario_1"];
  const columnasBuscaCat2 = ["numero", "comentario_1"];
  const nameInputs3 = ["numero", "descripcion"];
  const columnasBuscaCat3 = ["numero", "descripcion"];
  return (
    <dialog id="modal_nuevo_registro" className="modal">
      <div className="modal-box w-full md:w-3/4 max-w-2xl h-auto">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() =>
            document.getElementById("modal_nuevo_registro").close()
          }
        >
          ✕
        </button>
        <h3 className="font-bold text-lg mb-5">Añadir Nuevo Pago</h3>
        <fieldset id="fs_pagoimprime">
          <div className="container flex flex-col ">
            <div className="grid grid-flow-row gap-3">
              <div className="w-full">
                <BuscarCat
                  table="alumnos"
                  itemData={[]}
                  fieldsToShow={columnasBuscaCat}
                  nameInput={nameInputs}
                  titulo={"Alumnos: "}
                  setItem={setAlumnos1}
                  token={session.user.token}
                  modalId="modal_alumnos1"
                  alignRight={"text-right"}
                  inputWidths={{
                    contdef: "180px",
                    first: "70px",
                    second: "170px",
                  }}
                />
              </div>
              <div className="w-full">
                <BuscarCat
                  table="comentarios"
                  itemData={[]}
                  fieldsToShow={columnasBuscaCat2}
                  nameInput={nameInputs2}
                  titulo={"Comentario: "}
                  setItem={setComentarios1}
                  token={session.user.token}
                  modalId="modal_comentarios1"
                  alignRight={"text-right"}
                  inputWidths={{
                    contdef: "180px",
                    first: "70px",
                    second: "170px",
                  }}
                />
              </div>
              <div className="w-full ">
                <Inputs
                  name={"comentarios"}
                  tamañolabel={""}
                  className={"rounded "}
                  Titulo={"Comentario: "}
                  requerido={false}
                  type={"text"}
                  register={register}
                  errors={errors}
                  maxLength={15}
                  isDisabled={false}
                />
              </div>
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
                <div className="flex flex-col md:flex-row lg:flex-row ">
                  <Inputs
                    tipoInput={"enterEvent"}
                    dataType={"int"}
                    name={"cantidad_producto"}
                    tamañolabel={"w-[calc(55%)]"}
                    className={`${colorInput} text-right w-[calc(55%)]`}
                    Titulo={"Cantidad: "}
                    type={"text"}
                    requerido={false}
                    errors={errors}
                    register={register}
                    message={"numero requerido"}
                    isDisabled={false}
                    eventInput={handleKeyDown}
                    handleBlur={handleBlur}
                    maxLength={8}
                  />
                  <Inputs
                    tipoInput={"numberDouble"}
                    dataType={"double"}
                    name={"precio_base"}
                    tamañolabel={"w-[calc(32%)]"}
                    className={`w-[calc(32%)] text-right ${colorInput}`}
                    Titulo={"Precio Base: "}
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
