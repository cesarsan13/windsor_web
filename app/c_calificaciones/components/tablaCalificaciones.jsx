"use client";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/NoData";
import Image from "next/image";
import iconos from "@/app/utils/iconos";
import React from "react";
function TablaCalificaciones({
  calificacionesFiltrados,
  isLoading,
  // showModal,
  setCalificacion,
  setAccion,
  setCurrentId,
}) {
  const tableAction = (evt, calificacion, accion) => {
    setCalificacion(calificacion);
    setAccion(accion);
    setCurrentId(calificacion.numero);
    // showModal(true);
  };

  return !isLoading ? (
    <div className="overflow-y-auto mt-3 h-[calc(55vh)] md:h-[calc(65vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white w-full lg:w-full">
      {calificacionesFiltrados.length > 0 ? (
        <table className="table table-xs table-zebra w-full">
          <thead className="sticky top-0 bg-white dark:bg-[#1d232a] z-[2]">
            <tr>
              <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</td>
              <td className="w-[45%]">Alumno</td>
              <td className="w-[25%] hidden sm:table-cell">Calificación</td>
              <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Ver</th>
              <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Editar</th>
              <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {calificacionesFiltrados.map((item) => (
              <tr key={item.numero} className="hover:cursor-pointer">
                <th className="w-[5%]">{item.numero}</th>
                <td className="w-[45%]"> {item.alumno} </td>
                <td className="w-[45%]"> {item.calificacion} </td>
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
  );
}

export default TablaCalificaciones;
