"use client";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/NoData";
import React from "react";
import iconos from "@/app/utils/iconos";
import Image from "next/image";
import { permission } from "process";
function TablaFormaPago({
  formaPagosFiltrados,
  session,
  isLoading,
  showModal,
  setFormaPago,
  setAccion,
  setCurrentId,
  permiso_cambio,
  permiso_baja,
}) {
  const tableAction = (evt, formaPago, accion) => {
    setFormaPago(formaPago);
    setAccion(accion);
    setCurrentId(formaPago.numero);
    showModal(true);
  };

  const ActionButton = ({ tooltip, iconDark, iconLight, onClick, permission }) => {
    if (!permission) return null;
    return (
      <th>
        <div
          className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem] content-center"
          data-tip={tooltip}
          onClick={onClick}
        >
          <Image src={iconDark} alt={tooltip} className="block dark:hidden" />
          <Image src={iconLight} alt={tooltip} className="hidden dark:block" />
        </div>
      </th>
    );
  };

  const ActionColumn = ({ description, permission }) => {
    if (!permission) return null;
    return (
      <>
        <th className="w-[5%] pt-[.10rem] pb-[.10rem]">{description}</th>
      </>
    )
  }

  return !isLoading ? (
    <div className="overflow-y-auto mt-3 h-[calc(55vh)] md:h-[calc(65vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white w-full lg:w-full">
      {formaPagosFiltrados && formaPagosFiltrados.length > 0 ? (
        <table className="table table-xs table-zebra w-full">
          <thead className="sticky top-0 bg-white dark:bg-[#1d232a]">
            <tr>
              <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</td>
              <td className="w-[50%]">Descripcion</td>
              <td className="w-[8%]">Comision</td>
              <td className="w-[15%]">Aplicacion</td>
              <td className="w-[20%]">Cuenta Banco</td>
              < ActionColumn
                description={"Ver"}
                permission={true}
              />
              < ActionColumn
                description={"Editar"}
                permission={permiso_cambio}
              />
              < ActionColumn
                description={"Eliminar"}
                permission={permiso_baja}
              />
            </tr>
          </thead>
          <tbody>
            {formaPagosFiltrados.map((item) => (
              <tr key={item.numero} className="hover:cursor-pointer">
                <th className={"text-right"}>{item.numero}</th>
                <td>{item.descripcion}</td>
                <td className={`text-right w-11`}>{item.comision}</td>
                <td>{item.aplicacion}</td>
                <td>{item.cue_banco}</td>
                <ActionButton
                  tooltip="Ver"
                  iconDark={iconos.ver}
                  iconLight={iconos.ver_w}
                  onClick={(evt) => tableAction(evt, item, "Ver")}
                  permission={true}
                />
                <ActionButton
                  tooltip="Editar"
                  iconDark={iconos.editar}
                  iconLight={iconos.editar_w}
                  onClick={(evt) => tableAction(evt, item, "Editar")}
                  permission={permiso_cambio}
                />
                <ActionButton
                  tooltip="Eliminar"
                  iconDark={iconos.eliminar}
                  iconLight={iconos.eliminar_w}
                  onClick={(evt) => tableAction(evt, item, "Eliminar")}
                  permission={permiso_baja}
                />
              </tr>
            ))}
          </tbody>
          <tfoot />
        </table>
      ) : formaPagosFiltrados != null &&
      session &&
      formaPagosFiltrados.length === 0 ? (
      <NoData></NoData>
    ) : (
      <Loading></Loading>
    )}
    </div>
  ) : (
    <Loading></Loading>
  );
}

export default TablaFormaPago;
