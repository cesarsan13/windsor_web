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
          <thead className="sticky top-0 bg-white dark:bg-[#1d232a] z-[2]">
            <tr>
              <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</td>
              <td className="w-[40%]">Descripcion</td>
              <td className="w-[15%]">Aplicacion</td>
              <td className="w-[15%]">Costo</td>
              <td className="w-[10%]">Recargo</td>
              <td className="w-[10%]">Condición</td>
              <td className="w-[10%]">IVA</td>
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
            {productosFiltrados.map((item) => (
              <tr key={item.numero} className="hover:cursor-pointer">
                <th
                  className={
                    typeof item.comision === "number"
                      ? "text-left"
                      : "text-right"
                  }
                >
                  {item.numero}
                </th>
                <td className="w-[40%] max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap pt-[.10rem] pb-[.10rem]">
                  {item.descripcion}
                </td>
                <td>{item.aplicacion}</td>
                <td className="text-right">{formatNumber(item.costo)}</td>
                <td className="text-right">{formatNumber(item.por_recargo)}</td>
                <td className="text-right">{item.cond_1}</td>
                <td className="text-right">{formatNumber(item.iva)}</td>

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
