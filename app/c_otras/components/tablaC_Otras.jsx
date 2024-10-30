"use client";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/NoData";
import React from "react";
import iconos from "@/app/utils/iconos";
import Image from "next/image";
function TablaC_Otras({
  c_OtrasFiltrados,
  setC_OtrasFiltrados,
  isLoading,
  showModal,
  setC_Otras,
  setC_Otra,
  setAccion,
  setCurrentId,
  formatNumber,
  tableAction,
  materiaDesc
}) {
  return !isLoading ? (
    <div className="overflow-y-auto mt-3 h-[calc(55vh)] md:h-[calc(65vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white  w-full lg:w-full">
      {c_OtrasFiltrados.length > 0 ? (
        <table className="table table-xs table-zebra w-full">
          <thead className="sticky top-0 bg-white dark:bg-[#1d232a] z-[2]">
            <tr>
              <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Numero</td>
              <td className="w-[40%]">Alumno</td>
              <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">{materiaDesc || "Tareas y Trabajos Omitidos"}</td>
              {/* <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Ver</th> */}
              <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Editar</th>
              {/* <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Eliminar</th> */}
            </tr>
          </thead>
          <tbody>
            {c_OtrasFiltrados.map((item) => (
              <tr key={item.numero} className="hover:cursor-pointer">
                <th
                  className={
                    typeof item.numero === "number" ? "text-right" : "text-left"
                  }
                >
                  {item.numero}
                </th>
                <td>{item.nombre}</td>
                <td className={
                    typeof parseFloat(item.calificacion) === "number" && !isNaN(parseFloat(item.calificacion)) ? "text-right" : "text-left"
                  }
                    >{item.calificacion}</td>
                {/* <th className="w-[5%] pt-[.10rem] pb-[.10rem]">
                  <div
                    className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem] content-center"
                    data-tip={`Ver`}
                    onClick={(evt) => tableAction(`Ver`, item.numero)}
                  >
                    <Image src={iconos.ver} alt="Ver" />
                  </div>
                </th> */}
                <th className="w-[5%] pt-[.10rem] pb-[.10rem]">
                  <div
                    className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem] content-center"
                    data-tip={`Editar`}
                    onClick={(evt) => tableAction(`Editar`, item.numero)}
                  >
                    <Image src={iconos.editar} alt="Editar" />
                  </div>
                </th>
                {/* <th className="w-[5%] pt-[.10rem] pb-[.10rem]">
                  <div
                    className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem] content-center"
                    data-tip={`Eliminar`}
                    onClick={(evt) => tableAction("Eliminar", item.numero)}
                  >
                    <Image src={iconos.eliminar} alt="Eliminar" />
                  </div>
                </th> */}
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

export default TablaC_Otras;
