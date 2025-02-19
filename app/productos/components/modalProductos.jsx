import { soloEnteros, soloDecimales, pone_ceros } from "@/app/utils/globalfn";
import React from "react";
import { showSwal} from "@/app/utils/alerts";
import { useState, useEffect } from "react";
import Inputs from "@/app/productos/components/Inputs";
import Image from "next/image";
import iconos from "@/app/utils/iconos";
import { FaSpinner } from "react-icons/fa";
function ModalProductos({
  accion,
  onSubmit,
  currentID,
  register,
  errors,
  setProducto,
  setValue,
  watch,
  disabledNum,
  num,
  setNum,
  productos,
  isLoadingButton,
}) {
  const [error, setError] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const numeroProd = watch("numero");


  useEffect(() => {
    setValue("numero", num);
    setTitulo(
      accion === "Alta"
        ? `Nuevo Producto: ${num}`
        : accion === "Editar"
        ? `Editar Producto: ${num}`
        : accion === "Eliminar"
        ? `Eliminar Producto: ${num}`
        : `Ver Producto: ${num}`
    );
  }, [num]);

  const handleBlurOut = (evt, datatype) => {
    if (evt.target.name === "numero") {
      const valor = evt.target.value;
      const existeId = productos.some((p) => p.numero === valor);
      if (existeId) {
        showSwal(
          "¡Advertencia!",
          "El numero capturado ya existe, intenta con otro",
          "warning",
          "my_modal_3"
        );
        const T_Numero = document.getElementById("numero");
        T_Numero.value = "";
        setNum("");
        T_Numero.focus();
        return;
      }
      setNum(valor);
    }
  };

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
      <div className="modal-box bg-base-200">
        <form action="" onSubmit={onSubmit}>
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
                  onClick={onsubmit}
                  disabled={isLoadingButton}
                >
                  {isLoadingButton ? (
                    <FaSpinner className="animate-spin mx-2" />
                  ) : (
                    <>
                      <Image src={iconos.guardar} alt="Guardar" className="w-5 h-5 md:w-6 md:h-6 block dark:hidden" />
                      <Image src={iconos.guardar_w} alt="Guardar" className="w-5 h-5 md:w-6 md:h-6 hidden dark:block" />
                    </>
                  )}
                  {isLoadingButton ? " Cargando..." : " Guardar"}
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
          
        </form>
      </div>
    </dialog>
  );
}

export default ModalProductos;
