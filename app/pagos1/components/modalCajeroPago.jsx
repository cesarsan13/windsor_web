import { soloEnteros, soloDecimales, pone_ceros } from "@/app/utils/globalfn";
import React from "react";
import { showSwalAndWait } from "@/app/utils/alerts";
import { useState, useEffect } from "react";
import Inputs from "@/app/cajeros/components/Inputs";
import BuscarCat from "@/app/components/BuscarCat";
import { useForm } from "react-hook-form";
function ModalCajeroPago({
  session,
  validarClaveCajero,
  showModal,
  setValidar,
  home,
  cajero,
  setCajero,
  // validar,
  // pago,
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
        console.log('true');
        showModal(false);
        await showSwalAndWait(res.alert_title, res.alert_text, res.alert_icon);
        setValidar(true);
      } else {
        console.log('false');
        showModal(false);
        await showSwalAndWait(res.alert_title, res.alert_text, res.alert_icon);
        showModal(true);
        setValidar(false);
      }
    } else {
      showModal(false);
      await showSwalAndWait("Oppss!", "Para validar la clave, debe estar seleccionado un cajero", "error");
      showModal(true);
      setValidar(false);
    }
  });



  return (
    <dialog id="my_modal_3" className="modal">
      <div className="modal-box w-1/2 max-w-3xl">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => home()}
        >
          ✕
        </button>
        <form onSubmit={onSubmitModal}>
          <h3 className="font-bold text-lg mb-5">Ingresa Clave del Cajero</h3>
          <fieldset id="fs_cajeropago">
            <div className="container flex flex-col space-y-5">
              <BuscarCat
                table="cajeros"
                fieldsToShow={columnasBuscaCat}
                nameInput={nameInputs}
                titulo={"Cajeros: "}
                setItem={setCajero}
                token={session.user.token}
                modalId="modal_cajeros"
              />
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
          <div className=" modal-action">
            <div
              className={`tooltip tooltip-top my-5 hover:cursor-pointer`}
              data-tip="Guardar"
            >
              <button
                type="submit"
                id="btn_validar"
                className="btn  bg-blue-500 hover:bg-blue-700 text-white"
              >
                <i className="fa-regular fa-floppy-disk mx-2"></i> Validar
              </button>
            </div>
          </div>
        </form>
      </div>
    </dialog>
  );
}
export default ModalCajeroPago;
