"use client";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/NoData";
import React, { useState } from "react";
import iconos from "@/app/utils/iconos";
import Image from "next/image";
import { formatNumber } from "@/app/utils/globalfn";

function TablaPagos1({
  session,
  pagosFiltrados,
  isLoading,
  setPago,
  setAccion,
  setSelectedTable,
  deleteRow,
  selectedRow,
  setSelectedRow,
  permiso_baja,
}) {

  const tableAction = (evt, pago, accion) => {
    setPago(pago);
    setAccion(accion);
    if (accion === "Seleccionar") {
      setSelectedTable(pago);
      setSelectedRow(pago.numero_producto);
    }
    if (accion === "Eliminar") {
      setSelectedTable({});
      setSelectedRow(null)
      deleteRow(pago);
    }
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
  };

  return !isLoading ? (
    <>
      <div
        className="overflow-y-auto mt-3 h-[calc(55vh)] md:h-[calc(65vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white  w-full lg:w-full"
        style={{ height: `auto` }}
      >
        {pagosFiltrados && pagosFiltrados.length > 0 ? (
          <table className="table table-xs w-full">
            <thead className="sticky top-0 bg-white dark:bg-[#1d232a] z-[2]">
              <tr>
                <th className="w-[5%]"></th>
                {/* <td className="hidden">Clave</td> */}
                <td className="w-[35%]">Descripción</td>
                <td className="w-[5%]">Documento</td>
                <td className="w-[5%] text-right">Cantidad</td>
                <td className="w-[6%] text-right">Precio</td>
                <td className="w-[6%] text-right">Descuento</td>
                <td className="w-[6%] text-right">Neto</td>
                <td className="w-[6%] text-right">Total</td>
                <td className="w-[5%] text-right">Alumno</td>
                < ActionColumn
                  description={"Eliminar"}
                  permission={permiso_baja}
                />
                < ActionColumn
                  description={"Seleccionar"}
                  permission={true}
                />
              </tr>
            </thead>
            <tbody>
              {pagosFiltrados.map((item) => (
                <tr
                  key={item.numero_producto}
                  className={`hover:cursor-pointer ${selectedRow === item.numero_producto
                    ? "dark:bg-[#334155] bg-[#f1f5f9]"
                    : ""
                    }`}
                >
                  <th className="text-right">{item.numero_producto}</th>
                  <td className="hidden">{item.numero_producto}</td>
                  <td className="text-left">{item.descripcion}</td>
                  <td className="text-right">{item.documento}</td>
                  <td className="text-right">{item.cantidad_producto}</td>
                  <td className="text-right">
                    {formatNumber(item.precio_base)}
                  </td>
                  <td className="text-right">{formatNumber(item.descuento)}</td>
                  <td className="text-right">{formatNumber(item.neto)}</td>
                  <td className="text-right">{formatNumber(item.total)}</td>
                  <td className="text-right">{item.alumno}</td>
                  <ActionButton
                    tooltip="Eliminar"
                    iconDark={iconos.eliminar}
                    iconLight={iconos.eliminar_w}
                    onClick={(evt) => tableAction(evt, item, "Eliminar")}
                    permission={permiso_baja}
                  />
                  <ActionButton
                    tooltip="Editar"
                    iconDark={iconos.documento}
                    iconLight={iconos.documento_w}
                    onClick={(evt) => tableAction(evt, item, "Seleccionar")}
                    permission={permiso_cambio}
                  />
                </tr>
              ))}
            </tbody>
            <tfoot />
            {/* <tfoot>
              <tr>
                <th></th>
                <td className="hidden">Clave</td>
                <td>Descripción</td>
                <td>Documento</td>
                <td>Cantidad</td>
                <td>Precio</td>
                <td>Descuento</td>
                <td>Neto</td>
                <td>Total</td>
                <td>Alumno</td>
                <th>Acciones</th>
              </tr>
            </tfoot> */}
          </table>
        ) : pagosFiltrados != null &&
          session &&
          pagosFiltrados.length === 0 ? (
          <NoData></NoData>
        ) : (
          <Loading></Loading>
        )}
      </div>
    </>
  ) : (
    <Loading />
  );
}

export default TablaPagos1;
