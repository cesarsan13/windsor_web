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
  setShowSheet,
  fetchFacturasFormato,
}) {
  const tableAction = (evt, formFact, accion) => {
    setFormFact(formFact);
    setAccion(accion);
    setCurrentId(formFact.numero);

    if (evt.target.attributes.name.value !== "btn_actualiza_formato") {
      showModal(true);
    } else {
      fetchFacturasFormato(formFact.numero);
      setShowSheet(true);
    }
  };

  return !isLoading ? (
    <>
      <div className="overflow-x-auto mt-3 h-[calc(55vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white w-full lg:w-3/4">
        {formFactsFiltrados.length > 0 ? (
          <table className="table table-xs table-zebra w-full">
            <thead className="sticky top-0 bg-white dark:bg-[#1d232a]">
              <tr>
                <th></th>
                <td className="w-[60%]">Nombre</td>
                <td className="w-[40%]">Longitud</td>
                <th className="w-[calc(20%)]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {formFactsFiltrados.map((item) => (
                <tr key={item.numero} className="hover:cursor-pointer">
                  <th className="text-left">{item.numero}</th>
                  <td className="text-left w-50">{item.nombre}</td>
                  <td>{item.longitud}</td>
                  <th>
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
                      <div
                        className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white"
                        data-tip={`Actualizar Formato`}
                        name="btn_actualiza_formato"
                        onClick={(evt) =>
                          tableAction(evt, item, "ActualizaFormato")
                        }
                      >
                        <i
                          className="fa-regular fa-file-lines"
                          name="btn_actualiza_formato"
                        ></i>
                      </div>
                    </div>
                  </th>
                </tr>
              ))}
            </tbody>
            <tfoot/>
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
