import { soloEnteros, soloDecimales, pone_ceros } from "@/app/utils/globalfn";
import React from "react";
import { showSwalAndWait } from "@/app/utils/alerts";
import { useState, useEffect } from "react";
import Inputs from "@/app/cajeros/components/Inputs";
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
  isLoading,
}) {
  const [error, setError] = useState(null);
  const columnasBuscaCat = ["numero", "nombre"];
  const nameInputs = ["numero", "nombre"];
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  // const handleBlur = (evt, datatype) => {
  //   if (evt.target.value === "") return;
  //   datatype === "int"
  //     ? setCajero((cajero) => ({
  //       ...cajero,
  //       [evt.target.name]: pone_ceros(evt.target.value, 0, true),
  //     }))
  //     : setCajero((cajero) => ({
  //       ...cajero,
  //       [evt.target.name]: pone_ceros(evt.target.value, 2, true),
  //     }));
  // };

  const onSubmitModal = handleSubmit(async (data) => {
    data.cajero = cajero.numero;
    const { token } = session.user;
    let res;
    if (Object.keys(cajero).length > 0) {
      res = await validarClaveCajero(token, data);
      if (res.status) {
        showModal(false);
        await showSwalAndWait(res.alert_title, res.alert_text, res.alert_icon);
        setValidar(true);
      } else {
        showModal(false);
        await showSwalAndWait(res.alert_title, res.alert_text, res.alert_icon);
        showModal(true);
        setValidar(false);
      }
    } else {
      showModal(false);
      await showSwalAndWait(
        "Oppss!",
        "Para validar la clave, debe estar seleccionado un cajero",
        "error"
      );
      showModal(true);
      setValidar(false);
    }
  });

  const backCloseAndHome = () => {
    document.getElementById("my_modal_3").close();
    home();
  }

  return (
    <dialog id="my_modal_3" className="modal">
      <div className="modal-box w-full max-w-md sm:max-w-lg p-6">
        <form onSubmit={onSubmitModal}>
          <div className="sticky -top-6 flex justify-between items-center bg-white dark:bg-[#1d232a] w-full h-10 z-10 mb-5">
            <h3 className="font-bold text-lg">Ingresa Clave del Cajero</h3>
            <div className="flex space-x-2 items-center">
              <div
                className={`tooltip tooltip-bottom`}
                data-tip="Validar"
              >
                <button
                  type="submit"
                  id="btn_guardar"
                  className="bg-transparent hover:bg-slate-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-white rounded-lg btn btn-sm"
                >
                  <Image src={iconos.guardar} alt="Validar" className="w-5 h-5 md:w-6 md:h-6 mr-1" />
                  <span className="hidden sm:inline">Validar</span>
                </button>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-circle btn-ghost"
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
                modalId="modal_cajeros"
                alignRight={"text-right"}
                inputWidths={{ contdef: "180px", first: "70px", second: "150px" }}
              />
            </div>
            <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row lg:flex-row mt-4">
              <Inputs
                dataType={"string"}
                name={"clave_cajero"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Clave Cajero: "}
                type={"password"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
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
