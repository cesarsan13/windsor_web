"use client";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/NoData";
import Image from "next/image";
import iconos from "@/app/utils/iconos";
import React from "react";
function TablaUsuarios({
  usuariosFiltrados,
  isLoading,
  showModal,
  setUsuario,
  setAccion,
  setCurrentId,
}) {
  const tableAction = (evt, formaUsuarios, accion) => {
    setUsuario(formaUsuarios);
    setAccion(accion);
    setCurrentId(formaUsuarios.id);
    showModal(true);
  };

  return !isLoading ? (
    <div className="overflow-y-auto mt-3 h-[calc(55vh)] md:h-[calc(65vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white w-full lg:w-full">
      {usuariosFiltrados.length > 0 ? (
        <table className="table table-xs table-zebra w-full">
          <thead className="sticky top-0 bg-white dark:bg-[#1d232a] z-[2]">
            <tr>
              <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</td>
              <td className="w-[20%]">Usuario</td>
              <td className="w-[35%] hidden sm:table-cell">Nombre</td>
              <td className="w-[25%] hidden sm:table-cell">Email</td>

              <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Ver</th>
              <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Editar</th>
              <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map((item) => (
              <tr key={item.id} className="hover:cursor-pointer">
                <th
                  className={
                    typeof item.comision === "number"
                      ? "text-left"
                      : "text-right"
                  }
                >
                  {item.id}
                </th>
                <td className="w-[25%]"> {item.name} </td>
                <td className="w-[35%] hidden sm:table-cell">
                  {" "}
                  {item.nombre}{" "}
                </td>
                <td className="w-[25%] hidden sm:table-cell">
                  {" "}
                  {item.email}{" "}
                </td>

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

export default TablaUsuarios;
