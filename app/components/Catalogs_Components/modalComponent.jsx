import React from "react";
import Image from "next/image";
import iconos from "@/app/utils/iconos";
import { FaSpinner } from "react-icons/fa";
import { CerrarModal } from "@/app/utils/globalfn";

export default function ModalComponent({
  accion,
  onSubmit,
  isLoadingButton,
  titulo,
  modalBody,
  size = "2xl", // Nuevo: Tamaño configurable, por defecto "2xl"
}) {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    full: "max-w-full",
  };

  return (
    <dialog id="my_modal_3" className="modal">
      <div className={`modal-box bg-base-200 ${sizeClasses[size] || "max-w-2xl"}`}>
        <form onSubmit={onSubmit} id="modal_form">
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
                  onClick={onSubmit}
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
                onClick={() => CerrarModal(accion)}
              >
                ✕
              </button>
            </div>
          </div>
          {modalBody()}
        </form>
      </div>
    </dialog>
  );
}
