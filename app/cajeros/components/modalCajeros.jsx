"use client";
import SessionAuthProvider from "@/context/SessionAuthProvider";
import { Hanalei_Fill } from "next/font/google";
import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import TextComponent from "@/app/cajeros/components/textComponent";
import { showSwal, confirmSwal } from "@/app/utils/alerts";

function ModalCajeros({
    accion,
    handleModal,
    numero,
    guardaCajero,
    session,
    cajero,
    cajeros,
    cajerosFiltrados,
    setCajerosFiltrados,
    setCajeros,
    baja,
  }) {
    const [error, setError] = useState(null);
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm({
      defaultValues: {
        nombre: cajero.nombre,
        direccion: cajero.direccion,
        colonia: cajero.colonia,
        estado: cajero.estado,
        telefono: cajero.telefono,
        fax: cajero.fax,
        mail: cajero.mail,
        baja: cajero.baja,
        fec_cambio: cajero.fec_cambio,
        clave_cajero: cajero.clave_cajero,
      },
    });

    const onSubmit = handleSubmit(async (data) => {
        event.preventDefault;
        data.numero = numero;
        let res = null;
        if (accion === "Eliminar") {
          const confirmed = await confirmSwal(
            "¿Desea Continuar?",
            "Se eliminara el cajero seleccionado",
            "warning",
            "Aceptar",
            "Cancelar"
          );
          if (!confirmed) {
            return;
          }
        }
        res = await guardaCajero(session.user.token, data, accion);
    console.log(res.status + " " + res);
    if (res.status) {
      if (accion === "Alta") {
        const nuevoCajero = { numero, ...data };
        setCajeros([...cajeros, nuevoCajero]);
        if (!baja) {
          setCajerosFiltrados([...cajerosFiltrados, nuevoCajero]);
        }
      }
      if (accion === "Eliminar" || accion === "Editar") {
        const index = cajeros.findIndex(
          (cajero) => cajero.numero === data.numero
        );
        const indexfiltrados = cajerosFiltrados.findIndex(
          (cajero) => cajero.numero === data.numero
        );

        if (index !== -1) {
          if (accion === "Eliminar") {
            const cajFiltrados = cajeros.filter((p) => p.numero !== numero);
            setCajeros(cajFiltrados);
            setCajerosFiltrados(cajFiltrados);
          } else {
            if (baja) {
              const cajFiltrados = cajeros.filter((p) => p.numero !== numero);
              setCajeros(cajFiltrados);
              setCajerosFiltrados(cajFiltrados);
            } else {
              const cajerosActualizados = cajeros.map((p) =>
                p.numero === numero ? { ...p, ...data } : p
              );
              setCajeros(cajerosActualizados);
              setCajerosFiltrados(cajerosActualizados);
            }
          }
        }
      }
      showSwal(res.alert_title, res.alert_text, res.alert_icon);
      handleModal();
    }
  });

  return (
    <>
      {/* {openmodal && ( */}
      <div className="fixed rounded-xl h-[calc(100%-20%)] lg:h-[calc(100%-24px)] w-[calc(100%-5%)] lg:w-[calc(82%-1rem)] bg-slate-900 bg-opacity-75 flex items-center  justify-center z-10  ">
        <div className=" w-3/4 bg-slate-200 shadow-lg  rounded-md overflow-y-scroll xl:overflow-y-hidden lg:overflow-y-hidden h-[75%] lg:h-auto ">
          <div className="sticky top-0 bg-slate-200 ">
            <h1 className="font-medium text-gray-900 border-b border-gray-300 py-3 px-4 mb-4 ">
              {accion} Cajero {numero}.
            </h1>
          </div>

          <div className="px-4 pb-4 ">
            <form action="" onSubmit={onSubmit}>
              {error && (
                <p className="bg-red-500 text-white text-xs p-3 rounded-md text-center">
                  {error}
                </p>
              )}
              <fieldset disabled={accion === "Eliminar"}>
                <div className="flex flex-wrap -mx-3 mb-6">
                  <TextComponent
                    titulo="Nombre"
                    name="nombre"
                    message={"Nombre Requerido"}
                    register={register}
                    errors={errors}
                    requerido={true}
                    type="text"
                  />
                  <TextComponent
                    titulo="Direccion"
                    name="direccion"
                    message={"Direccion requerida"}
                    register={register}
                    errors={errors}
                    requerido={true}
                    type="text"
                  />
                  <TextComponent
                    titulo="Colonia"
                    name="colonia"
                    message={"Colonia requerida"}
                    register={register}
                    errors={errors}
                    requerido={false}
                    type="text"
                  />
                  <TextComponent
                    titulo="Estado"
                    name="estado"
                    message={"Estado requerido"}
                    register={register}
                    errors={errors}
                    requerido={false}
                    type="text"
                  />
                  <TextComponent
                    titulo="Telefono"
                    name="telefono"
                    message={"Telefono requerido"}
                    register={register}
                    errors={errors}
                    requerido={false}
                    type="text"
                  />
                  <TextComponent
                    titulo="Fax"
                    name="fax"
                    message={"Fax requerido"}
                    register={register}
                    errors={errors}
                    requerido={false}
                    type="text"
                  />
                  <TextComponent
                    titulo="Correo"
                    name="mail"
                    message={"Correo requerido"}
                    register={register}
                    errors={errors}
                    requerido={false}
                    type="email"
                  />
                  <TextComponent
                    titulo="Clave Cajero"
                    name="clave_cajero"
                    message={"Clave requerida"}
                    register={register}
                    errors={errors}
                    requerido={false}
                    type="text"
                  />
                </div>
              </fieldset>
              <div className="border-t border-gray-300 flex justify-between items-center px-4 pt-2 mt-5">
                <button
                  type="button"
                  className="h-8 px-2 text-md rounded-md bg-red-700 text-white "
                  onClick={handleModal}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className=" bg-green-800 text-white text-md h-8 px-3 rounded-md"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* )} */}
    </>
  );
}

export default ModalCajeros;
