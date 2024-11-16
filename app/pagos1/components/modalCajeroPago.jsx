import { soloEnteros, soloDecimales, pone_ceros } from "@/app/utils/globalfn";
import React from "react";
import { showSwalAndWait } from "@/app/utils/alerts";
import { useState, useEffect } from "react";
import Inputs from "@/app/pagos1/components/Inputs";
import BuscarCat from "@/app/components/BuscarCat";
import { useForm } from "react-hook-form";
import Image from "next/image";
import iconos from "@/app/utils/iconos";
import { FaSpinner } from "react-icons/fa";
function ModalCajeroPago({
  session,
  validarClaveCajero,
  showModal,
  setValidar,
  home,
  cajero,
  setCajero,
  registerCaj,
  handleSubmitCaj,
  errorsCaj,
  accionB,
}) {
  const columnasBuscaCat = ["numero", "nombre"];
  const nameInputs = ["numero", "nombre"];

  useEffect(() => {
    document.getElementById("clave_cajero").focus();
  }, [cajero.numero]);

  const onSubmitModal = handleSubmitCaj(async (data) => {
    data.cajero = cajero.numero;
    const { token } = session.user;
    let res;
    if (Object.keys(cajero).length > 0) {
      res = await validarClaveCajero(token, data);
      if (res.status) {
        showModal("my_modal_3", false);
        await showSwalAndWait(res.alert_title, res.alert_text, res.alert_icon);
        setValidar(true);
      } else {
        showModal("my_modal_3", false);
        await showSwalAndWait(res.alert_title, res.alert_text, res.alert_icon);
        showModal("my_modal_3", true);
        setValidar(false);
      }
    } else {
      showModal("my_modal_3", false);
      await showSwalAndWait(
        "Oppss!",
        "Para validar la clave, debe estar seleccionado un cajero",
        "error"
      );
      showModal("my_modal_3", true);
      setValidar(false);
    }
  });

  const backCloseAndHome = () => {
    document.getElementById("my_modal_3").close();
    home();
  };

  return (
    <dialog id="my_modal_3" className="modal">
      <div className="modal-box w-full max-w-md sm:max-w-lg p-6 bg-base-200">
        <form onSubmit={onSubmitModal}>
          <div className="sticky -top-6 flex justify-between items-center bg-base-200 w-full h-10 z-10 mb-5">
            <h3 className="font-bold text-lg text-neutral-600 dark:text-white">Ingresa Clave del Cajero</h3>
            <div className="flex space-x-2 items-center">
              <div className={`tooltip tooltip-bottom`} data-tip="Validar">
                <button
                  type="submit"
                  id="btn_guardar"
                  className="bg-transparent hover:bg-base-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-white rounded-lg btn btn-sm"
                >
                  <Image
                    src={iconos.guardar_w}
                    alt="Validar"
                    className="w-5 h-5 md:w-6 md:h-6 mr-1 hidden dark:block"
                  />
                  <Image
                    src={iconos.guardar}
                    alt="Validar"
                    className="w-5 h-5 md:w-6 md:h-6 mr-1 block dark:hidden"
                  />
                  <span className="hidden sm:inline">Validar</span>
                </button>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-circle btn-ghost bg-base-200 dark:bg-[#1d232a] text-neutral-600 dark:text-white"
                onClick={() => backCloseAndHome()}
              >
                ✕
              </button>
            </div>
          </div>
          <fieldset id="fs_cajeropago">
            <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row lg:flex-row">
              <BuscarCat
                table="cajeros"
                fieldsToShow={columnasBuscaCat}
                nameInput={nameInputs}
                titulo={"Cajeros: "}
                setItem={setCajero}
                token={session.user.token}
                accion={accionB}
                modalId="modal_cajeros"
                alignRight={"text-right"}
                inputWidths={{
                  contdef: "180px",
                  first: "70px",
                  second: "150px",
                }}
              />
            </div>
            <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row lg:flex-row mt-4">
              <Inputs
                dataType={"string"}
                name={"clave_cajero"}
                tamañolabel={"w-80 md:w-80"}
                className={"rounded block grow "}
                Titulo={"Clave Cajero: "}
                type={"password"}
                requerido={true}
                isNumero={false}
                errors={errorsCaj}
                register={registerCaj}
                message={"Clave requerida"}
                maxLength={50}
                isDisabled={false}
              />
            </div>
          </fieldset>
        </form>
      </div>
    </dialog>
  );
}
export default ModalCajeroPago;
