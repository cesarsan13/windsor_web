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
        <div className='overflow-x-auto mt-3  h-6/8 text-black bg-white dark:bg-[#1d232a] dark:text-white m-2 w-full  lg:w-5/8 '>
        {cajerosFiltrados.length > 0 ? (
          <table className="table table-xs table-zebra table-compact w-full">
            <thead className="relative z-[1] md:static">
              <tr>
                <th></th>
                <td>Nombre</td>
                <td>Telefono</td>
                <td>Correo</td>
                <th className="w-[calc(20%)]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cajerosFiltrados.map((item) => (
                <tr key={item.numero} className="hover:cursor-pointer">
                  <th className="text-left">
                    {item.numero}
                  </th>
                  <td className="text-left w-50">
                    {item.nombre}
                  </td>
                  <td>{item.telefono}</td>
                  <td>{item.mail}</td>
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
                <td>Telefono</td>
                <td>Correo</td>
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

export default TablaCajeros;
