"use client";
import React from "react";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/noData";
import iconos from "@/app/utils/iconos";
import Image from "next/image";
function TablaHorarios({
  HorariosFiltrados,
  isLoading,
  showModal,
  setHorario,
  setAccion,
  setCurrentId,
}) {
  const tableAction = (evt, horario, accion) => {
    setHorario(horario);
    setAccion(accion);
    setCurrentId(horario.numero);
    showModal(true);
  };
  return !isLoading ? (
    <div className="overflow-y-auto mt-3 h-[calc(55vh)] md:h-[calc(65vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white  w-full lg:w-full">
      {HorariosFiltrados.length > 0 ? (
        <table className="table table-xs table-zebra w-full">
            <thead className="sticky top-0 bg-white dark:bg-[#1d232a] z-[2]">
            <tr>
            <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</td>
            <th className="w-[5%]">Cancha</th>
              <th className="w-[40%]">Dia</th>
              <th className="w-[15%]">Horario</th>
              <th className="w-[10%]">Max Niños</th>
              <th className="w-[5%]">Sexo</th>
              <th className="w-[5%]">Edad Ini</th>
              <th className="w-[5%]">Edad Fin</th>
                <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Ver</th>
              <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Editar</th>
              <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {HorariosFiltrados.map((item) => (
              <tr key={item.numero}>
                <th
                  className={
                    typeof item.numero === "number" ? "text-left" : "text-right"
                  }
                >
                  {item.numero}
                </th>
                <td
                  className={
                    typeof item.numero === "number" ? "text-left" : "text-right"
                  }
                >
                  {item.cancha}
                </td>
                <td>{item.dia}</td>
                <td>{item.horario}</td>
                <td className="text-right">{item.max_niños}</td>
                <td>{item.sexo}</td>
                <td className="text-right">{item.edad_ini}</td>
                <td className="text-right">{item.edad_fin}</td>

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

export default TablaHorarios;
