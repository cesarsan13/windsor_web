"use client";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/NoData";
import React from "react";
import iconos from "@/app/utils/iconos";
import Image from "next/image";
function TablaProductos({
  productosFiltrados,
  isLoading,
  showModal,
  setProducto,
  setAccion,
  setCurrentId,
  formatNumber,
  tableAction,
  session
}) {
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
              <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Ver</th>
              <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Editar</th>
              <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Eliminar</th>
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

                <th className="w-[5%] pt-[.10rem] pb-[.10rem]">
                  <div
                    className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem] content-center"
                    data-tip={`Ver`}
                    onClick={(evt) => tableAction(`Ver`, item.numero)}
                  >
                    <Image src={iconos.ver} alt="Ver" />
                  </div>
                </th>
                <th className="w-[5%] pt-[.10rem] pb-[.10rem]">
                  <div
                    className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem] content-center"
                    data-tip={`Editar`}
                    onClick={(evt) => tableAction(`Editar`, item.numero)}
                  >
                    <Image src={iconos.editar} alt="Editar" />
                  </div>
                </th>
                <th className="w-[5%] pt-[.10rem] pb-[.10rem]">
                  <div
                    className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem] content-center"
                    data-tip={`Eliminar`}
                    onClick={(evt) => tableAction("Eliminar", item.numero)}
                  >
                    <Image src={iconos.eliminar} alt="Eliminar" />
                  </div>
                </th>
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
