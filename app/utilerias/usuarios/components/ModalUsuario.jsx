import { soloEnteros, soloDecimales, pone_ceros } from "@/app/utils/globalfn";
import React from "react";
import { useState, useEffect } from "react";
import Inputs from "@/app/usuarios/components/Inputs";
import Image from "next/image";
import iconos from "@/app/utils/iconos";

function ModalUsuarios({
  accion,
  onSubmit,
  currentID,
  register,
  errors,
  watch
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
        ? `Nuevo Usuario`
        : accion === "Editar"
        ? `Editar Usuario: ${currentID}`
        : accion === "Eliminar"
        ? `Eliminar Usuario: ${currentID}`
        : `Ver Usuario: ${currentID}`
    );
  }, [accion]);

  

  {/*const handleBlur = (evt, datatype) => {
    if (evt.target.value === "") return;
    datatype === "int"
      ? setUsuarios((usuarios) => ({
          ...usuarios,
          [evt.target.name]: pone_ceros(evt.target.value, 0, true),
        }))
      : setUsuarios((usuarios) => ({
          ...usuarios,
          [evt.target.name]: pone_ceros(evt.target.value, 2, true),
        }));
  };*/}

  return (
    <dialog id="modal_usuarios" className="modal">
      <div className="modal-box">
        <form onSubmit={onSubmit}>
          <div className="sticky -top-6 flex justify-between items-center bg-white dark:bg-[#1d232a] w-full h-10 z-10 mb-5">
            <h3 className="font-bold text-lg">{titulo}</h3>
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
                >
                  <Image
                    src={iconos.guardar}
                    alt="Guardar"
                    className="w-5 h-5 md:w-6 md:h-6 mr-1"
                  />
                  <span className="hidden sm:inline">Guardar</span>
                </button>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-circle btn-ghost"
                onClick={() => document.getElementById("modal_usuarios").close()}
              >
                ✕
              </button>
            </div>
          </div>

          <fieldset id="fs_usuario">
            <div className="container flex flex-col space-y-5">
              <fieldset
                disabled={
                  accion === "Alta" ||
                  accion === "Editar" ||
                  accion === "Eliminar" ||
                  accion === "Ver"
                }
              >
                <Inputs
                  dataType={"int"}
                  name={"id"}
                  tamañolabel={"w-2/6"}
                  className={"w-3/6 text-right"}
                  Titulo={"Id: "}
                  type={"text"}
                  requerido={accion === "Alta" ? false : true}
                  errors={errors}
                  register={register}
                  message={"id Requerido"}
                  isDisabled={accion === "Alta" ? !isDisabled : isDisabled}
                />
              </fieldset>
              <Inputs
                dataType={"string"}
                name={"name"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Usuario: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Usuario requerido"}
                maxLenght={50}
                isDisabled={isDisabled}
              />

              <Inputs
                dataType={"string"}
                name={"nombre"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Nombre: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Nombre requerido"}
                maxLenght={50}
                isDisabled={isDisabled}
              />

              <Inputs
                dataType={"string"}
                name={"email"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Email: "}
                type={"email"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Email requerido"}
                maxLenght={50}
                isDisabled={isDisabled}
              />

              <Inputs
                dataType={"string"}
                name={"password"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Contraseña: "}
                type={"password"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Contraseña requerida"}
                maxLenght={255}
                isDisabled={isDisabled}
              />
               <Inputs
                dataType={"string"}
                name={"password_confirm"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Confirmar Contraseña: "}
                type={"password"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Confirmar Contraseña requerida"}
                maxLenght={255}
                isDisabled={isDisabled}
              />
            </div>
          </fieldset>
        </form>
      </div>
    </dialog>
  );
}

export default ModalUsuarios;
