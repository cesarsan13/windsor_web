"use client";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/noData";
import React from "react";
import iconos from "@/app/utils/iconos";
import Image from "next/image";
function TablaCajeros({
  cajerosFiltrados,
  isLoading,
  showModal,
  setCajero,
  setAccion,
  setCurrentId,
}) {
  const tableAction = (evt, cajero, accion) => {
    setCajero(cajero);
    setAccion(accion);
    setCurrentId(cajero.numero);
    showModal(true);
  };

  return !isLoading ? (
    <>
      <div className="overflow-x-auto mt-3 h-[calc(55vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white w-full lg:w-12/12 justify-between">
        {cajerosFiltrados.length > 0 ? (
          <table className="table table-sm table-zebra w-full">
            <thead className="sticky top-0 bg-white dark:bg-[#1d232a] z-[2]">
              <tr>
                <th className="sm:w-[10%]"></th>
                <td className="sm:w-[35%]">Nombre</td>
                <td className="w-[20%]">Telefono</td>
                <td className="w-[30%]">Correo</td>
                <th className="w-[25%] sm:w-[10%]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cajerosFiltrados.map((item) => (
                <tr key={item.numero} className="hover:cursor-pointer">
                  <th className={
                    typeof item.comision === "number"
                    ? "text-left"
                    : "text-right"
                  }>{item.numero}</th>
                  <td className="sm:w-[35%]">{item.nombre}</td>
                  <td className="w-[20%]">{item.telefono}</td>
                  <td className="w-[30%]">{item.mail}</td>
                  <th className="w-[25%] sm:w-[10%]">
                    <div className="flex flex-row space-x-1">
                      <div
                        className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white"
                        data-tip={`Ver ${item.numero}`}
                        onClick={(evt) => tableAction(evt, item, `Ver`)}
                      >
                        <Image src={iconos.ver} alt="Editar" />
                        </div>
                      <div
                        className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white"
                        data-tip={`Editar ${item.numero}`}
                        onClick={(evt) => tableAction(evt, item, `Editar`)}
                      >
                        <Image src={iconos.editar} alt="Editar" />
                        </div>
                      <div
                        className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white"
                        data-tip={`Eliminar ${item.numero}`}
                        onClick={(evt) => tableAction(evt, item, "Eliminar")}
                      >
                        <Image src={iconos.eliminar} alt="Editar" />
                        </div>
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
    </>
  ) : (
    <Loading />
  );
}

export default TablaCajeros;
