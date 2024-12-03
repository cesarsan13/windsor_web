import { soloEnteros, soloDecimales, pone_ceros } from "@/app/utils/globalfn";
import React from "react";
import { showSwal, confirmSwal } from "@/app/utils/alerts";
import { useState, useEffect } from "react";
import Inputs from "@/app/cajeros/components/Inputs";
import Image from "next/image";
import iconos from "@/app/utils/iconos";
import { FaSpinner } from "react-icons/fa";

function ModalMenus({
  accion,
  onSubmit,
  currentID,
  register,
  errors,
  setMenu,
  menu,
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
        ? `Nuevo Menu: ${currentID}`
        : accion === "Editar"
        ? `Editar Menu: ${currentID}`
        : accion === "Eliminar"
        ? `Eliminar Menu: ${currentID}`
        : `Ver Menu: ${currentID}`
    );
  }, [accion, currentID]);
  const handleBlur = (evt, datatype) => {
    if (evt.target.value === "") return;
    datatype === "int"
      ? setMenu((menu) => ({
          ...menu,
          [evt.target.name]: pone_ceros(evt.target.value, 0, true),
        }))
      : setMenu((menu) => ({
          ...menu,
          [evt.target.name]: pone_ceros(evt.target.value, 2, true),
        }));
  };
  return (
    <dialog id="my_modal_3" className="modal">
      <div className="modal-box bg-base-200">
        <form onSubmit={onSubmit}>
          <div className="sticky -top-6 flex justify-between items-center bg-base-200  w-full h-10 z-10 mb-5">
            <h3 className="font-bold text-lg dark:text-white">{titulo}</h3>
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
                  className="bg-transparent text-neutral-600 dark:text-white rounded-lg btn btn-sm"
                  onClick={onsubmit}
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

          <fieldset id="fs_menu">
            <div className="container flex flex-col space-y-5">
              {/* <Inputs
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
                /> */}
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
                message={"Nombre requerido"}
                maxLenght={80}
                isDisabled={isDisabled}
              />
            </div>
          </fieldset>
        </form>
      </div>
    </dialog>
  );
}

export default ModalMenus;
