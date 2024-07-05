"use client";
import { soloEnteros, soloDecimales } from "@/app/utils/globalfn";
import { useForm } from "react-hook-form";
import React from "react";
import { showSwal, confirmSwal } from "@/app/utils/alerts";
import { useState } from "react";
import Inputs from "@/app/formaPago/components/Inputs";

function ModalFormaPago({
  accion,
  handleModal,
  numero,
  guardaCajero,
  session,
  formaPago,
  formasPago,
  formaPagosFiltrados,
  setFormaPagosFiltrados,
  setFormasPago,
  bajas,
  onSubmit,
  errors,
  register,
}) {
  const [error, setError] = useState(null);
  console.log("forma", formaPago);

  return (
    <div>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
            {/* if there is a button in form, it will close the modal */}
            <h3 className="font-bold text-lg mb-5">
              {accion === "Alta" ? "Nueva" : "Editar "}Forma de Pago
            </h3>
            <fieldset>
              <div className="container flex flex-col space-y-5">
                <Inputs
                  name={"id"}
                  tamañolabel={"w-2/6"}
                  className={"w-3/6 text-right"}
                  Titulo={"Numero"}
                  type={"text"}
                  requerido={true}
                  isNumero={true}
                  errors={errors}
                  register={register}
                  message={"idRequerido"}
                />
                <Inputs
                  name={"descripcion"}
                  tamañolabel={""}
                  className={"grow"}
                  Titulo={"Descripcion"}
                  type={"text"}
                  requerido={true}
                  isNumero={false}
                  errors={errors}
                  register={register}
                  message={"descripcion requerid"}
                  maxLength={50}
                />
                {/* <div className="flex flex-col">
                <label className="input input-bordered input-md flex items-center gap-3">
                  Descripcion
                  <input
                    name="descripcion"
                    type="text"
                    className="grow"
                    maxLength={50}
                    defaultValue={formaPago.descripcion}
                    {...register("descripcion", {
                      required: "La descripcion es Requerida",
                    })}
                  />
                </label>
                {errors["descripcion"] && (
                  <span className="text-red-500 text-sm mt-2">
                    {errors["descripcion"].message}
                  </span>
                )}
              </div> */}
                <div className="flex flex-col">
                  <label className="input input-bordered input-md flex items-center gap-3 w-3/6">
                    Comision
                    <input
                      name="comision"
                      type="text"
                      className="grow w-4/6 text-right"
                      onKeyDown={soloDecimales}
                      {...register("comision", {
                        required: "La comision es Requerida",
                      })}
                    />
                  </label>
                  {errors["comision"] && (
                    <span className="text-red-500 text-sm mt-2">
                      {errors["comision"].message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="input input-bordered input-md flex items-center gap-3 w-5/6">
                    Aplicacion
                    <input
                      name="aplicacion"
                      type="text"
                      className="grow w-5/6"
                      maxLength={30}
                      {...register("aplicacion", {
                        required: "La aplicacion es Requerida",
                      })}
                    />
                  </label>
                  {errors["aplicacion"] && (
                    <span className="text-red-500 text-sm mt-2">
                      {errors["aplicacion"].message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="input input-bordered input-md flex items-center gap-3 w-5/6">
                    Banco
                    <input
                      name="cue_banco"
                      type="text"
                      className="grow w-5/6"
                      maxLength={34}
                      {...register("cue_banco", {
                        required: "La cuenta de banco es Requerida",
                      })}
                    />
                  </label>
                  {errors["cue_banco"] && (
                    <span className="text-red-500 text-sm mt-2">
                      {errors["cue_banco"].message}
                    </span>
                  )}
                </div>
              </div>
            </fieldset>
            <div className=" modal-action">
              <div className="tooltip tooltip-top my-5" data-tip="Guardar">
                <kbd className="kbd">
                  <button onClick={onSubmit}>
                    <i className="fa-regular fa-floppy-disk mx-2"></i> Guardar
                  </button>
                </kbd>
              </div>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}

export default ModalFormaPago;
