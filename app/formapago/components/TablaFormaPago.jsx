"use client";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/noData";
import React from "react";
import iconos from "@/app/utils/iconos";
import Image from "next/image";
function TablaFormaPago({
  formaPagosFiltrados,
  isLoading,
  showModal,
  setFormaPago,
  setAccion,
  setCurrentId,
}) {
  const tableAction = (evt, formaPago, accion) => {
    setFormaPago(formaPago);
    setAccion(accion);
    setCurrentId(formaPago.numero);
    showModal(true);
  };

  return !isLoading ? (
    <div className="overflow-y-auto mt-3 h-[calc(55vh)] md:h-[calc(65vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white w-full lg:w-full">
      {formaPagosFiltrados.length > 0 ? (
        <table className="table table-xs table-zebra w-full">
          <thead className="sticky top-0 bg-white dark:bg-[#1d232a]">
            <tr>
              <th className="w-[10%]">id</th>
              <td className="w-[50%]">Descripcion</td>
              <td className="w-[8%]">Comision</td>
              <td className="w-[15%]">Aplicacion</td>
              <td className="w-[20%]">Cuenta Banco</td>
              <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Ver</th>
              <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Editar</th>
              <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Eliminar</th>
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
                <th className="w-[5%] pt-[.10rem] pb-[.10rem]">
                  <div
                    className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem] content-center"
                    data-tip={`Ver`}
                    onClick={(evt) => tableAction(evt, item, `Ver`)}
                  >
                    <Image src={iconos.ver} alt="Ver" />
                  </div>
                </th>
                <th className="w-[5%] pt-[.10rem] pb-[.10rem]">
                  <div
                    className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem] content-center"
                    data-tip={`Editar`}
                    onClick={(evt) => tableAction(evt, item, `Editar`)}
                  >
                    <Image src={iconos.editar} alt="Editar" />
                  </div>
                </th>
                <th className="w-[5%] pt-[.10rem] pb-[.10rem]">
                  <div
                    className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem] content-center"
                    data-tip={`Eliminar`}
                    onClick={(evt) => tableAction(evt, item, "Eliminar")}
                  >
                    <Image src={iconos.eliminar} alt="Eliminar" />
                  </div>
                </th>
              </tr>
            ))}
          </tbody>
          <tfoot />
        </table>
      ) : (
        <NoData />
      )}
    </div>
  ) : (
    <Loading></Loading>
    // <div className="flex justify-center items-center pt-10">
    //   <span className="loading loading-ring loading-lg text-4xl"></span>
    // </div>
  );
}

export default TablaFormaPago;
