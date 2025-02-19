"use client";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/NoData";
import React from "react";
import iconos from "@/app/utils/iconos";
import Image from "next/image";
import { poneCeros } from "@/app/utils/globalfn";
function TablaProductos({
  productosFiltrados,
  isLoading,
  showModal,
  setProducto,
  setAccion,
  setCurrentId,
  formatNumber,
  session,
  permiso_cambio,
  permiso_baja,
}) {
  const tableAction = async (evt, producto, accion) => {
    let ref = "100910" + poneCeros(producto.numero, 4);
    let resultado = `${ref}`;
    producto.referencia = resultado;
    setProducto(producto);
    setAccion(accion);
    setCurrentId(producto.numero);
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
    <div className="overflow-y-auto mt-3 h-[calc(55vh)] md:h-[calc(65vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white  w-full lg:w-full">
      {productosFiltrados && productosFiltrados.length > 0 ? (
        <table className="table table-xs table-zebra w-full">


          <tfoot />
        </table>
      ) : productosFiltrados != null &&
        session &&
        productosFiltrados.length === 0 ? (
        <NoData></NoData>
      ) : (
        <Loading></Loading>
      )}
    </div>
  ) : (
    <Loading></Loading>
  );
}

export default TablaProductos;
