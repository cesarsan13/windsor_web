"use client";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/NoData";
import React from "react";
import iconos from "@/app/utils/iconos";
import Image from "next/image";

function TablaDoc({ docFiltrados, isLoading, tableSelect }) {
  return !isLoading ? (
    <div className="overflow-x-auto mt-3 text-black bg-white dark:bg-[#1d232a] dark:text-white m-2 w-full lg:w-5/8 h-auto">
      {docFiltrados.length > 0 ? (
        <table className="table table-xs table-pin-rows table-pin-cols max-h-full">
          <thead className="relative z-[1] md:static">
            <tr>
              <td>Documento</td>
              <td>Paquete</td>
              <td>Fecha</td>
              <td>Saldo</td>
              <td>Desc</td>
              <td className="hidden">nombre_producto</td>
              <td className="hidden">alumno</td>
              <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Seleccionar</th>
            </tr>
          </thead>
          <tbody>
            {docFiltrados.map((item) => (
              <tr key={item.numero} className="hover:cursor-pointer">
                <td className="text-right">{item.numero}</td>
                <td>{item.paquete}</td>
                <td>{item.fecha}</td>
                <td>{item.saldo}</td>
                <td>{item.descuento}</td>
                <td className="hidden">{item.nombre_producto}</td>
                <td className="hidden">{item.alumno}</td>
                <th className="w-[5%] pt-[.10rem] pb-[.10rem]">
                  <div
                    className="hidden sm:hidden md:block lg:block kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-6 h-6 md:w-[2rem] md:h-[2rem] content-center"
                    data-tip={`Seleccionar`}
                    onClick={(evt) => tableSelect(evt, item)}
                  >
                    <Image src={iconos.documento} alt="Seleccionar" />
                  </div>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <NoData />
      )}
    </div>
  ) : (
    <Loading />
  );
}

export default TablaDoc;
