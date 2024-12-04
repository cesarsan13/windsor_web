import iconos from "@/app/utils/iconos";
import Image from "next/image";
import React, { use, useEffect, useState } from "react";
import Inputs from "./Inputs";
import { useForm } from "react-hook-form";

function ModalAccesosUsuarios({
  accesoUsuario,
  accion,
  onSubmit,
  errors,
  register,
  watch,
  setValue,
  getValues
  
}) {
  const [titulo, setTitulo] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);

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

  useEffect(() => {

    if (todos === true) {
      setValue("t_a", 1);
      setValue("altas", 1);
      setValue("bajas", 1);
      setValue("cambios", 1);
      setValue("impresion", 1);
    } else if (todos === false) {

      setValue("t_a", 0);
      setValue("altas", 0);
      setValue("bajas", 0);
      setValue("cambios", 0);
      setValue("impresion", 0);
    }
  }, [watch("todos"), setValue]); 

  useEffect(() => {
    const valores = [
      getValues("t_a"),
      getValues("altas"),
      getValues("bajas"),
      getValues("cambios"),
      getValues("impresion"),
    ];

    const todosSeleccionados = valores.every(valor => valor === 1);
    if (todosSeleccionados && todos !== true) {
      setValue("todos", true);
    }

    else if (!todosSeleccionados && todos !== false) {
      setValue("todos", false);
    }
  }, [getValues, setValue, watch("todos")]);

  


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
            <Inputs
              Titulo={"Todos"}
              register={register}
              errors={errors}
              message={"Todo Requerido"}
              name={"todos"}
              requerido={false}
              tamañolabel={"w-full"}
              className={"md:w-1/3 w-3/6"}
              
            />
              
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
              
              
              
              
             {/* <Inputs
                Titulo={"Todos"}
                register={register}
                errors={errors}
                message={"todo Requerido"}
                name={"todos"}
                requerido={false}
                tamañolabel={"w-full"}
                className={"md:w-1/3 w-3/6"}
                value={accesoUsuario.todos}
                onChange={(e) => setTodos("todos", e.target.checked)}
              />
              <Inputs
                Titulo={"Tiene Acceso"}
                register={register}
                errors={errors}
                message={"T_A Requerido"}
                name={"t_a"}
                requerido={false}
                tamañolabel={"w-full"}
                className={"md:w-1/3 w-3/6"}
                value={accesoUsuario.t_a}
                onChange={(e) => handleToggleChange("t_a", e.target.checked)}
              />
              <Inputs
                Titulo={"Altas"}
                register={register}
                errors={errors}
                message={"Altas Requerido"}
                name={"altas"}
                requerido={false}
                className={"md:w-1/3 w-3/6"}
                value={accesoUsuario.altas}
                onChange={(e) => handleToggleChange("altas", e.target.checked)}
               
              />
              <Inputs
                Titulo={"Bajas"}
                register={register}
                errors={errors}
                message={"Baja Requerido"}
                name={"bajas"}
                requerido={false}
                className={"md:w-1/3 w-3/6"}
                value={accesoUsuario.bajas}
                onChange={(e) => handleToggleChange("bajas", e.target.checked)}
              />
              <Inputs
                Titulo={"Cambios"}
                register={register}
                errors={errors}
                message={"Cambios Requerido"}
                name={"cambios"}
                requerido={false}
                className={"md:w-1/3 w-3/6"}
                value={accesoUsuario.cambios}
                onChange={(e) => handleToggleChange("cambios", e.target.checked)}
              />
              <Inputs
                Titulo={"Impresion"}
                register={register}
                errors={errors}
                message={"Impresion Requerido"}
                name={"impresion"}
                requerido={false}
                className={"md:w-1/3 w-3/6"}
                value={accesoUsuario.impresion}
                onChange={(e) => handleToggleChange("impresion", e.target.checked)}
              />*/}
            </div>
          </fieldset>
        </form>
      </div>
    </dialog>
  );
}

export default ModalAccesosUsuarios;
