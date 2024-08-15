"use client";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/noData";
import React from "react";

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
      <div className="overflow-x-auto mt-3 h-[calc(55vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white w-full lg:w-3/4">
        {cajerosFiltrados.length > 0 ? (
          <table className="table table-xs table-zebra w-full">
            <thead className="sticky top-0 bg-white dark:bg-[#1d232a] ">
              <tr>
                <th className="sm:w-[10%]"></th>
                <td className="sm:w-[45%]">Nombre</td>
                <td className="w-[20%] hidden sm:table-cell">Telefono</td>
                <td className="w-[30%] hidden sm:table-cell">Correo</td>
                <th className="w-[25%] sm:w-[10%]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cajerosFiltrados.map((item) => (
                <tr key={item.numero} className="hover:cursor-pointer">
                  <th className={
                    typeof item.comision === "number"
                    ? "text-right"
                    : "text-left"
                  }>{item.numero}</th>
                  <td className="w-[45%]">{item.nombre}</td>
                  <td className="w-[20%] hidden sm:table-cell">{item.telefono}</td>
                  <td className="w-[30%] hidden sm:table-cell">{item.mail}</td>
                  <th className="w-[25%] sm:w-[10%]">
                    <div className="flex flex-row space-x-1">
                      <div
                        className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white"
                        data-tip={`Ver ${item.numero}`}
                        onClick={(evt) => tableAction(evt, item, `Ver`)}
                      >
                        <i className="fa-solid fa-eye"></i>
                      </div>
                      <div
                        className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white"
                        data-tip={`Editar ${item.numero}`}
                        onClick={(evt) => tableAction(evt, item, `Editar`)}
                      >
                        <i className="fa-solid fa-file"></i>
                      </div>
                      <div
                        className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white"
                        data-tip={`Eliminar ${item.numero}`}
                        onClick={(evt) => tableAction(evt, item, "Eliminar")}
                      >
                        <i className="fa-solid fa-trash"></i>
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
