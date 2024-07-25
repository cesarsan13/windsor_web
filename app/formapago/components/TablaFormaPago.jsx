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
    <div className='overflow-x-auto mt-3  h-6/8 text-black bg-white dark:bg-[#1d232a] dark:text-white m-2 w-full  lg:w-5/8 '>
      {formaPagosFiltrados.length > 0 ? (
        <table className="table table-xs table-zebra table-pin-rows table-pin-cols max-h-[calc(50%)]">
          <thead className=" relative z-[1] md:static">
            <tr>
              <th>id</th>
              <td>Descripcion</td>
              <td>Comision</td>
              <td>Aplicacion</td>
              <td>Cuenta Banco</td>
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
                <th>
                  <div className="flex flex-row space-x-3">
                    <div
                      className="kbd tooltip tooltip-left hover:cursor-pointer bg-blue-500 hover:bg-blue-700 text-white"
                      data-tip={`Ver ${item.id}`}
                      onClick={(evt) => tableAction(evt, item, `Ver`)}
                    >
                      <i className="fa-solid fa-eye"></i>
                    </div>
                    <div
                      className="kbd tooltip tooltip-left hover:cursor-pointer bg-blue-500 hover:bg-blue-700 text-white"
                      data-tip={`Editar ${item.id}`}
                      onClick={(evt) => tableAction(evt, item, `Editar`)}
                    >
                      <i className="fa-solid fa-file"></i>
                    </div>
                    <div
                      className="kbd tooltip tooltip-left hover:cursor-pointer bg-blue-500 hover:bg-blue-700 text-white"
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
          <tfoot>
            <tr>
              <th></th>
              <td>Descripcion</td>
              <td>Comision</td>
              <td>Aplicacion</td>
              <td>Cuenta Banco</td>
              <th>Acciones</th>
            </tr>
          </tfoot>
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
