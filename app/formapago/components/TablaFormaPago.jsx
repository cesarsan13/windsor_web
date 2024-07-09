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
    console.log("filtrados", evt);
    setFormaPago(formaPago);
    setAccion(accion);
    setCurrentId(formaPago.id);
    showModal(true);
  };

  return !isLoading ? (
    <div className="overflow-x-auto mt-3  h-5/8 text-black bg-white m-2 ">
      {formaPagosFiltrados.length > 0 ? (
        <table className="table table-xs table-zebra table-pin-rows table-pin-cols">
          <thead className=" relative z-[1] md:static">
            <tr>
              <th></th>
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
                <th>{item.id}</th>
                <td>{item.descripcion}</td>
                <td
                  className={
                    typeof item.comision === "number"
                      ? "text-right"
                      : "text-left"
                  }
                >
                  {item.comision}
                </td>
                <td>{item.aplicacion}</td>
                <td>{item.cue_banco}</td>
                <th>
                  <div className="flex flex-row space-x-3">
                    <div
                      className="kbd tooltip tooltip-left hover:cursor-pointer"
                      data-tip="Ver"
                      onClick={(evt) => tableAction(evt, item, "Ver")}
                    >
                      <i className="fa-solid fa-eye"></i>
                    </div>
                    <div
                      className="kbd tooltip tooltip-left hover:cursor-pointer"
                      data-tip="Editar"
                      onClick={(evt) => tableAction(evt, item, "Editar")}
                    >
                      <i className="fa-solid fa-file"></i>
                    </div>
                    <div
                      className="kbd tooltip tooltip-left hover:cursor-pointer"
                      data-tip="Eliminar"
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
