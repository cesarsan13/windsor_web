import iconos from "@/app/utils/iconos";
import Image from "next/image";
import React, { use, useEffect, useState, useRef } from "react";
import Inputs from "./Inputs";

function ModalAccesosUsuarios({
  accion,
  onSubmit,
  errors,
  register,
  watch,
  setValue
}) {
  const [titulo, setTitulo] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (accion === "Eliminar" || accion === "ver") {
      setIsDisabled(true);
    }
    if (accion === "Alta" || accion === "Editar") {
      setIsDisabled(false);
    }
    setTitulo(
      accion === "Alta"
        ? `Nueva Accesos Usuarios`
        : accion === "Editar"
        ? `Editar Accesos Usuarios`
        : accion === "Eliminar"
        ? `Eliminar Accesos Usuarios`
        : `Ver Accesos Usuarios`
    );
  }, [accion]);

  const toggleCheckbox = (event) => {
    if (event.target.checked === true) {
      setValue("t_a", 1);
      setValue("altas", 1);
      setValue("bajas", 1);
      setValue("cambios", 1);
      setValue("impresion", 1);
    } else if (event.target.checked === false) {
      setValue("t_a", 0);
      setValue("altas", 0);
      setValue("bajas", 0);
      setValue("cambios", 0);
      setValue("impresion", 0);
    }
  };

  useEffect(() => {
    const valores = [
      watch("t_a"),
      watch("altas"),
      watch("bajas"),
      watch("cambios"),
      watch("impresion"),
    ];
    const todosSeleccionados = valores.every(valor => valor === 1 || valor === true);
    if (todosSeleccionados && watch("todos") !== true) {
      setIsChecked(true);
    }
    else if (!todosSeleccionados && watch("todos") !== false ){
      setIsChecked(false);
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("todos"), watch("t_a"), watch("altas"), watch("bajas"), watch("cambios"), watch("impresion"), setValue]); 


  return (
    <dialog className="modal" id="my_modal_3">
      <div className="modal-box bg-base-200">
        <form onSubmit={onSubmit}>
          <div className="sticky -top-6 flex justify-between items-center bg-base-200 w-full h-10 z-10 mb-5">
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
                className="btn btn-sm btn-circle btn-ghost text-neutral-600 dark:text-white"
                onClick={(event) => {
                  event.preventDefault();
                  document.getElementById("my_modal_3").close();
                }}
              >
                ✕
              </button>
            </div>
          </div>
          <fieldset id="fs_accesosusuario">
            <div className="container flex flex-col space-y-5">
            <div className="form-control w-52">
              <label className={`label cursor-pointer`}>
                <span className="label-text">Todos</span>
                <input
                  name="todos"
                  id= "todos"
                  type="checkbox"
                  className="toggle toggle-success"
                  checked={isChecked}
                  onChange={toggleCheckbox}
                />
              </label>
            </div>
              
              <Inputs
                Titulo={"Tiene Acceso"}
                register={register}
                errors={errors}
                message={"T_A Requerido"}
                name={"t_a"}
                requerido={false}
                tamañolabel={"w-full"}
                className={"md:w-1/3 w-3/6"}
              />
              <Inputs
                Titulo={"Altas"}
                register={register}
                errors={errors}
                message={"Altas Requerido"}
                name={"altas"}
                requerido={false}
                className={"md:w-1/3 w-3/6"}
              />
              <Inputs
                Titulo={"Bajas"}
                register={register}
                errors={errors}
                message={"Baja Requerido"}
                name={"bajas"}
                requerido={false}
                className={"md:w-1/3 w-3/6"}
              />
              <Inputs
                Titulo={"Cambios"}
                register={register}
                errors={errors}
                message={"Cambios Requerido"}
                name={"cambios"}
                requerido={false}
                className={"md:w-1/3 w-3/6"}
              />
              <Inputs
                Titulo={"Impresion"}
                register={register}
                errors={errors}
                message={"Impresion Requerido"}
                name={"impresion"}
                requerido={false}
                className={"md:w-1/3 w-3/6"}
              />
            </div>
          </fieldset>
        </form>
      </div>
    </dialog>
  );
}

export default ModalAccesosUsuarios;
