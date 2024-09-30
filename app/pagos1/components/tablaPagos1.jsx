"use client";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/noData";
import React, { useState } from "react";
import iconos from "@/app/utils/iconos";
import Image from "next/image";
import { formatNumber } from "@/app/utils/globalfn";

function TablaPagos1({
  pagosFiltrados,
  isLoading,
  setPagos,
  setAccion,
  setSelectedTable,
  deleteRow,
  // tableHeight,
}) {
  const [selectedRow, setSelectedRow] = useState(null);

  const tableAction = (evt, pago, accion) => {
    setPagos(pago);
    setAccion(accion);
    setSelectedTable(pago);
    setSelectedRow(pago.numero);
    if (accion === "Eliminar") {
      deleteRow(pago);
    }
  };

  return !isLoading ? (
    <>
      <div
        className="overflow-y-auto mt-3 h-[calc(55vh)] md:h-[calc(65vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white  w-full lg:w-full"
        style={{ height: `auto` }}
      >
        {pagosFiltrados.length > 0 ? (
          <table className='table table-xs table-zebra w-full'>
            <thead className="sticky top-0 bg-white dark:bg-[#1d232a] z-[2]">
              <tr>
                <th></th>
                {/* <td className="hidden">Clave</td> */}
                <td className="w-[40%]">Descripción</td>
                <td className="w-[10%]">Documento</td>
                <td className="w-[10%]">Cantidad</td>
                <td className="w-[10%]">Precio</td>
                <td className="w-[10%]">Descuento</td>
                <td className="w-[10%]">Neto</td>
                <td className="w-[10%]">Total</td>
                <td className="w-[10%]">Alumno</td>
                <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Eliminar</th>
                <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Seleccionar</th>
              </tr>
            </thead>
            <tbody>
              {pagosFiltrados.map((item) => (
                <tr
                  key={item.numero}
                  className={`hover:cursor-pointer ${selectedRow === item.numero
                    ? "dark:bg-[#334155] bg-[#f1f5f9]"
                    : ""
                    }`}
                  // className={`hover:cursor-pointer ${selectedRow === item.numero ? 'selected-row' : ''}`}
                  onClick={() => setSelectedRow(item.numero)}
                >
                  <th className="text-right">{item.numero}</th>
                  <td className="hidden">{item.numero}</td>
                  <td className="text-left">{item.descripcion}</td>
                  <td className="text-right">{item.documento}</td>
                  <td className="text-right">{item.cantidad_producto}</td>
                  <td className="text-right">{formatNumber(item.precio_base)}</td>
                  <td className="text-right">{formatNumber(item.descuento)}</td>
                  <td className="text-right">{formatNumber(item.neto)}</td>
                  <td className="text-right">{formatNumber(item.total)}</td>
                  <td className="text-right">{item.alumno}</td>

                  <th className="w-[5%] pt-[.10rem] pb-[.10rem]">
                    <div
                      className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem] content-center"
                      data-tip={`Eliminar`}
                      onClick={(evt) => tableAction(evt, item, "Eliminar")}
                    >
                      <Image src={iconos.eliminar} alt="Eliminar" />
                    </div>
                  </th>
                  <th className="w-[5%] pt-[.10rem] pb-[.10rem]">
                    <div
                      className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem] content-center"
                      data-tip={`Seleccionar`}
                      onClick={(evt) => tableAction(evt, item, "Seleccionar")}
                    >
                      <Image src={iconos.seleccionar} alt="Seleccionar" />
                    </div>
                  </th>
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
        ) : (
          <NoData />
        )}
      </div >
    </>
  ) : (
    <Loading />
  );
}

export default TablaPagos1;
