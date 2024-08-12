"use client";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/noData";
import React from "react";
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
    setCurrentId(formaPago.id);
    showModal(true);
  };

  return !isLoading ? (
    <div className="overflow-x-auto mt-3 h-[calc(55vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white w-full lg:w-3/4">
      {formaPagosFiltrados.length > 0 ? (
        <table className="table table-xs table-zebra w-full">
          <thead className="sticky top-0 bg-white dark:bg-[#1d232a]">
            <tr>
              <th className="w-[10%]">id</th>
              <td className="w-[50%]">Descripcion</td>
              <td className="w-[8%]">Comision</td>
              <td className="w-[15%]">Aplicacion</td>
              <td className="w-[20%]">Cuenta Banco</td>
              <th className="w-[calc(10%)]">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {formaPagosFiltrados.map((item) => (
              <tr key={item.id} className="hover:cursor-pointer">
                <th className={"text-right"}>{item.id}</th>
                <td>{item.descripcion}</td>
                <td className={`text-right w-11`}>{item.comision}</td>
                <td>{item.aplicacion}</td>
                <td>{item.cue_banco}</td>
                <th className="w-[30%] sm:w-[10%]">
                  <div className="flex flex-row space-x-1 sm:space-x-3">
                    <div
                      className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white"
                      data-tip={`Ver ${item.id}`}
                      onClick={(evt) => tableAction(evt, item, `Ver`)}
                    >
                      <i className="fa-solid fa-eye"></i>
                    </div>
                    <div
                      className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white"
                      data-tip={`Editar ${item.id}`}
                      onClick={(evt) => tableAction(evt, item, `Editar`)}
                    >
                      <i className="fa-solid fa-file"></i>
                    </div>
                    <div
                      className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white"
                      data-tip={`Eliminar  ${item.id}`}
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
  ) : (
    <Loading></Loading>
    // <div className="flex justify-center items-center pt-10">
    //   <span className="loading loading-ring loading-lg text-4xl"></span>
    // </div>
  );
}

export default TablaFormaPago;
