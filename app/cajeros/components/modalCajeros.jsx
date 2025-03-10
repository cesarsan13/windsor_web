import { soloEnteros, soloDecimales, pone_ceros } from "@/app/utils/globalfn";
import React from "react";
import { showSwal, confirmSwal } from "@/app/utils/alerts";
import { useState, useEffect } from "react";
import Inputs from "@/app/cajeros/components/Inputs";
import Image from "next/image";
import iconos from "@/app/utils/iconos";
import { FaSpinner } from "react-icons/fa";

function ModalCajeros({
  accion,
  onSubmit,
  currentID,
  register,
  errors,
  setCajero,
  cajero,
  isLoadingButton,
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
      <div className="modal-box bg-base-200">
        <form onSubmit={onSubmit}>
          <div className="sticky -top-6 flex justify-between items-center bg-transparent w-full h-10 z-10 mb-5">
            <h3 className="font-bold text-lg text-neutral-600 dark:text-white">
              {titulo}
            </h3>
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
                  onClick={onsubmit}
                  encType="multipart/form-data"
                  disabled={isLoadingButton}
                >
                  {isLoadingButton ? (
                    <FaSpinner className="animate-spin mx-2" />
                  ) : (
                    <>
                      <Image
                        src={iconos.guardar}
                        alt="Guardar"
                        className="w-5 h-5 md:w-6 md:h-6 block dark:hidden"
                      />
                      <Image
                        src={iconos.guardar_w}
                        alt="Guardar"
                        className="w-5 h-5 md:w-6 md:h-6 hidden dark:block"
                      />
                    </>
                  )}
                  {isLoadingButton ? " Cargando..." : " Guardar"}
                </button>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-circle btn-ghost bg-base-200 dark:bg-[#1d232a] text-neutral-600 dark:text-white"
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
                name={"numero"}
                tamañolabel={"w-3/6"}
                className={"w-3/6 text-right"}
                Titulo={"Numero: "}
                type={"text"}
                requerido={true}
                errors={errors}
                register={register}
                message={"numero requerido"}
                isDisabled={true}
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
                maxLenght={35}
                isDisabled={isDisabled}
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
                maxLenght={50}
                isDisabled={isDisabled}
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
                maxLenght={30}
                isDisabled={isDisabled}
              />
              <Inputs
                dataType={"string"}
                name={"estado"}
                tamañolabel={""}
                className={"grow"}
                Titulo={"Estado: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"estado requerido"}
                maxLenght={30}
                isDisabled={isDisabled}
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
                maxLenght={20}
                isDisabled={isDisabled}
              />
              <Inputs
                dataType={"string"}
                name={"fax"}
                tamañolabel={""}
                className={"grow"}
                Titulo={"Fax: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"fax requerido"}
                maxLenght={20}
                isDisabled={isDisabled}
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
                maxLenght={40}
                isDisabled={isDisabled}
              />
              <Inputs
                dataType={"string"}
                name={"clave_cajero"}
                tamañolabel={""}
                className={"grow"}
                Titulo={"Clave Cajero: "}
                type={"password"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Clave requerida"}
                maxLenght={8}
                isDisabled={isDisabled}
              />
            </div>
          </fieldset>
        </form>
      </div>
    </dialog>
  );
}

export default ModalCajeros;
