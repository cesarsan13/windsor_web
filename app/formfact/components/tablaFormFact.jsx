"use client";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/noData";
import React from "react";

function TablaFormFact({
  formFactsFiltrados,
  isLoading,
  showModal,
  setFormFact,
  setAccion,
  setCurrentId,
}) {
  const tableAction = (evt, formFact, accion) => {
    setFormFact(formFact);
    setAccion(accion);
    setCurrentId(formFact.numero);
    showModal(true);
  };

  return !isLoading ? (
    <>
      <div className="tabla-formfact-container overflow-x-auto mt-3 bg-white m-3 w-full lg:w-5/8">
        {formFactsFiltrados.length > 0 ? (
          <table className="table table-xs table-zebra table-compact w-full">
            <thead className="relative z-[1] md:static">
              <tr>
                <th></th>
                <td>Nombre</td>
                <td>Longitud</td>
                <th className="w-[calc(20%)]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {formFactsFiltrados.map((item) => (
                <tr key={item.numero} className="hover:cursor-pointer">
                  <th className="text-left">
                    {item.numero}
                  </th>
                  <td className="text-left w-50">
                    {item.nombre}
                  </td>
                  <td>{item.longitud}</td>
                  <th>
                    <div className="flex flex-row space-x-1">
                      <div
                        className="kbd tooltip tooltip-left hover:cursor-pointer bg-blue-500 hover:bg-blue-700 text-white"
                        data-tip={`Ver ${item.numero}`}
                        onClick={(evt) => tableAction(evt, item, `Ver`)}
                      >
                        <i className="fa-solid fa-eye"></i>
                      </div>
                      <div
                        className="kbd tooltip tooltip-left hover:cursor-pointer bg-blue-500 hover:bg-blue-700 text-white"
                        data-tip={`Editar ${item.numero}`}
                        onClick={(evt) => tableAction(evt, item, `Editar`)}
                      >
                        <i className="fa-solid fa-file"></i>
                      </div>
                      <div
                        className="kbd tooltip tooltip-left hover:cursor-pointer bg-blue-500 hover:bg-blue-700 text-white"
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
            <tfoot>
              <tr>
                <th></th>
                <td>Nombre</td>
                <td>Longitud</td>
                <th>Acciones</th>
              </tr>
            </tfoot>
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

export default TablaFormFact;
