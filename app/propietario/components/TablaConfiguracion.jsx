"use client";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/NoData";
import iconos from "@/app/utils/iconos";
import React from "react";
import Image from "next/image";

function TablaConfiguracion({
  session,
  dataConfiguracionFiltrados,
  isLoading,
  showModal,
  setDataConfiguracion,
  setAccion,
  setCurrentId
}) {
  const tableAction = async ( formaConfiguracion, accion) => {
    setDataConfiguracion(formaConfiguracion);
    setAccion(accion);
    setCurrentId(formaConfiguracion.numero_configuracion);
    showModal(true);
  };

  return !isLoading ? (
    <div className="overflow-y-auto mt-3 h-[calc(55vh)] md:h-[calc(65vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white  w-full lg:w-full">
      {dataConfiguracionFiltrados && dataConfiguracionFiltrados.length > 0 ? (
        <table className="table table-xs table-zebra w-full">
          <thead className="sticky top-0 bg-white dark:bg-[#1d232a] z-[2]">
            <tr>
              <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Sec</td>
              <td className="w-[40%] pt-[.10rem] pb-[.10rem]">Descripcion</td>
              <td className="sm:table-cell pt-[.10rem] pb-[.10rem]">Valor</td>
              <td className="sm:table-cell pt-[.10rem] pb-[.10rem]">Texto</td>
              <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Ver</th>
              <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Editar</th>
            </tr>
          </thead>
          <tbody>
            {dataConfiguracionFiltrados.map((item) => (
              <tr key={item.numero_configuracion} className="hover:cursor-pointer">
                <th
                  className={
                    typeof item.comision === "number"
                      ? "text-left"
                      : "text-right"
                  }
                >
                  {item.numero_configuracion}
                </th>
                <td className="w-[40%] max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap pt-[.10rem] pb-[.10rem]">
                  {`${item.descripcion_configuracion}`}
                </td>
                <td className=" sm:table-cell pt-[.10rem] pb-[.10rem] truncate">
                  {item.valor_configuracion}
                </td>
                <td className=" sm:table-cell pt-[.10rem] pb-[.10rem] truncate">
                  {item.texto_configuracion}
                </td>

                <th className="w-[5%] pt-[.10rem] pb-[.10rem]">
                  <div
                    className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem] content-center"
                    data-tip={`Ver`}
                    onClick={(evt) => tableAction(evt, item, `Ver`)}
                  >
                    <Image src={iconos.ver} alt="Ver" className="block dark:hidden" />
                    <Image src={iconos.ver_w} alt="Guardar en oscuro" className="hidden dark:block" />
                  </div>
                </th>
                <th className="w-[5%] pt-[.10rem] pb-[.10rem]">
                  <div
                    className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem] content-center"
                    data-tip={`Editar`}
                    onClick={(evt) => tableAction(evt, item, `Editar`)}
                  >
                    <Image src={iconos.editar} alt="Editar" className="block dark:hidden" />
                    <Image src={iconos.editar_w} alt="Editar" className="hidden dark:block" />
                  </div>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      ) : dataConfiguracionFiltrados != null &&
        session &&
        dataConfiguracionFiltrados.length === 0 ? (
        <NoData></NoData>
      ) : (
        <Loading></Loading>
      )}
    </div>
  ) : (
    <Loading></Loading>
  );
}

export default TablaConfiguracion;
