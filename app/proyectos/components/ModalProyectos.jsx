import { soloEnteros, soloDecimales, pone_ceros } from "@/app/utils/globalfn";
import React from "react";
import { useState, useEffect } from "react";
import Inputs from "@/app/proyectos/components/Inputs";
import Image from "next/image";
import iconos from "@/app/utils/iconos";
import { FaSpinner } from "react-icons/fa";
import { estructuras, seeders } from "@/app/utils/api/proyectos/proyectos";
import { showSwal } from "@/app/utils/alerts";

function ModalProyectos({
  accion,
  onSubmit,
  currentID,
  register,
  errors,
  isLoadingButton,
  baseSeleccionada,
  showModal,
}) {
  const [error, setError] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoadingEstructura, setisLoadingEstructura] = useState(false);

  useEffect(() => {
    if (accion === "Ver") {
      setIsDisabled(true);
      setIsPasswordVisible(false);
    }
    if (accion === "Alta" || accion === "Editar") {
      setIsDisabled(false);
      setIsPasswordVisible(false);
    }
    setTitulo(
      accion === "Alta"
        ? `Nuevo Proyecto`
        : accion === "Editar"
          ? `Editar Proyecto: ${currentID}`
          : `Ver Proyecto: ${currentID}`
    );
  }, [accion, currentID]);

  const ejecutaEstructuras = async () => {
    try {
      setisLoadingEstructura(true);
      if (!baseSeleccionada) return;

      const res = await estructuras(baseSeleccionada);
      if (!res.status) {
        showSwal("Error", res.message, res.alert_icon, "modal_proyectos");
        return;
      }
      showSwal("Exito!", res.message, res.alert_icon, "modal_proyectos");
    } catch (error) { }
    finally {
      setisLoadingEstructura(false);
      showModal(false);
    }
  };
  const ejecutaSeeders = async () => { };

  return (
    <dialog id="modal_proyectos" className="modal">
      <div className="modal-box bg-base-200">
        <form onSubmit={onSubmit}>
          <div className="sticky -top-6 flex justify-between items-center bg-transparent w-full h-10 z-10 mb-5">
            <h3 className="font-bold text-lg text-neutral-600 dark:text-white">
              {titulo}
            </h3>
            <div className="flex space-x-2 items-center">
              <div
                className={`tooltip tooltip-bottom ${accion === "Ver"
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
                className="bg-transparent hover:bg-slate-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-white rounded-lg btn btn-sm"
                onClick={(evt) => ejecutaEstructuras(evt)}
              >
                {isLoadingEstructura ? (
                  <>
                    <FaSpinner className="animate-spin mx-2" />
                    Cargando...
                  </>
                ) : (
                  "Estructuras"
                )}
              </button>
              <button
                type="button"
                className="btn btn-sm btn-circle btn-ghost bg-base-200 dark:bg-[#1d232a] text-neutral-600 dark:text-white"
                onClick={() =>
                  document.getElementById("modal_proyectos").close()
                }
              >
                ✕
              </button>
            </div>
          </div>

          <fieldset id="fs_comentario">
            <div className="container flex flex-col space-y-5">
              <fieldset
                disabled={
                  accion === "Alta" || accion === "Editar" || accion === "Ver"
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
                  message={"Id Requerido"}
                  isDisabled={accion === "Alta" ? !isDisabled : isDisabled}
                />
              </fieldset>
              <Inputs
                dataType={"string"}
                name={"nombre"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Nombre: "}
                type={"text"}
                requerido={false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Nombre requerido"}
                maxLenght={60}
                isDisabled={isDisabled}
              />
              <Inputs
                dataType={"string"}
                name={"host"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Host: "}
                type={"text"}
                requerido={false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Host requerido"}
                maxLenght={255}
                isDisabled={isDisabled}
              />
              <Inputs
                dataType={"int"}
                name={"port"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Port: "}
                type={"int"}
                requerido={false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Port requerido"}
                maxLenght={11}
                isDisabled={isDisabled}
              />
              <Inputs
                dataType={"string"}
                name={"database"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Database: "}
                type={"text"}
                requerido={false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Database requerida"}
                maxLenght={200}
                isDisabled={isDisabled}
              />
              <Inputs
                dataType={"string"}
                name={"username"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Username: "}
                type={"text"}
                requerido={false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Username requerido"}
                maxLenght={100}
                isDisabled={isDisabled}
              />
              <Inputs
                contrasena={true}
                dataType={"string"}
                name={"password"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Password: "}
                type={"password"}
                requerido={false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Password requerido"}
                maxLenght={255}
                isDisabled={isDisabled}
                isPasswordVisible={isPasswordVisible}
                setIsPasswordVisible={setIsPasswordVisible}
              />
              <Inputs
                dataType={"string"}
                name={"clave_propietario"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Clave propietario: "}
                type={"text"}
                requerido={false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Clave propietario requerida"}
                maxLenght={255}
                isDisabled={isDisabled}
              />
              <Inputs
                dataType={"string"}
                name={"proyecto"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Proyecto: "}
                type={"text"}
                requerido={false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Proyecto requerido"}
                maxLenght={100}
                isDisabled={isDisabled}
              />
            </div>
          </fieldset>
        </form>
        <div className="flex flex-row justify-between mt-5 mx-5"></div>
      </div >
    </dialog >
  );
}
export default ModalProyectos;
