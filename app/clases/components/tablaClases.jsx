"use client";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/NoData";
import React from "react";
import iconos from "@/app/utils/iconos";
import Image from "next/image";
function TablaClases({
  clasesFiltrados,
  isLoading,
  showModal,
  setClase,
  setAccion,
  setCurrentId,
}) {
  const tableAction = (evt, clase, accion) => {
    setClase(clase);
    setAccion(accion);
    setCurrentId({id_grupo:clase.id_grupo, id_materia:clase.id_materia});
    showModal(true);
  };

  return !isLoading ? (
    <>
      <div className="overflow-y-auto mt-3 h-[calc(55vh)] md:h-[calc(65vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white  w-full lg:w-full">
        {clasesFiltrados.length > 0 ? (
          <table className="table table-xs table-zebra w-full">
            <thead className="sticky top-0 bg-white dark:bg-[#1d232a] z-[2]">
              <tr>
              <td className="sm:w-[10%]">Asignatura</td>
                <td className="w-[10%]">Grupo</td>
                <td className="w-[10%]">Profesor</td>
                <td className="w-[10%]">Lunes</td>
                <td className="w-[10%]">Martes</td>
                <td className="w-[10%]">Miercoles</td>
                <td className="w-[10%]">Jueves</td>
                <td className="w-[10%]">Viernes</td>
                <td className="w-[10%]">Sabado</td>
                <td className="w-[10%]">Domingo</td>
                <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Ver</th>
                <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Editar</th>
                <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {clasesFiltrados.map((item,idx) => (
                <tr key={idx} className="hover:cursor-pointer">
                  <th
                    className={
                      typeof item.comision === "number"
                        ? "text-left"
                        : "text-right"
                    }
                  >
                    {item.grupo}
                  </th>
                  <td className="w-[10%]  text-right">
                    {item.materia}
                  </td>
                  <td className="w-[10%]  text-right">{item.profesor}</td>
                  <td className="w-[10%]">{item.lunes}</td>
                  <td className="w-[10%]">{item.martes}</td>
                  <td className="w-[10%]">{item.miercoles}</td>
                  <td className="w-[10%]">{item.jueves}</td>
                  <td className="w-[10%]">{item.viernes}</td>
                  <td className="w-[10%]">{item.sabado}</td>
                  <td className="w-[10%]">{item.domingo}</td>

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
          </table>
        ) : (
          <NoData />
        )}
      </div>
    </>
  ) : (
    <Loading />
  );
}

export default TablaClases;
