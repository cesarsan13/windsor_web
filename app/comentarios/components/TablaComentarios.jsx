"use client";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/noData";
import React from "react";
function TablaComentarios({
  formaComentariosFiltrados,
  isLoading,
  showModal,
  setFormaComentarios,
  setAccion,
  setCurrentId,
}) {
  const tableAction = (evt, formaComentarios, accion) => {
    setFormaComentarios(formaComentarios);
    setAccion(accion);
    setCurrentId(formaComentarios.id);
    showModal(true);
  };

  return !isLoading ? (
    <div className="overflow-x-auto mt-3 h-[calc(75vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white m-2 w-full lg:w-3/4">
      {formaComentariosFiltrados.length > 0 ? (
        <table className="table table-xs table-zebra w-full">
          <thead className="sticky top-0 bg-white dark:bg-[#1d232a] ">
            <tr>
              <th></th>
              <td className="w-[30%]">Comentario 1</td>
              <td className="w-[30%]">Comentario 2</td>
              <td className="w-[30%]">Comentario 3</td>
              <td className="w-[10%]">Generales</td>
              <th className="w-[30%] sm:w-[10%]">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {formaComentariosFiltrados.map((item) => (
              <tr key = {item.id} class="hover: cursor-pointer">
                  <th className={"text-right"}>{item.id}</th>
                  <td> {item.comentario_1 } </td>
                  <td> {item.comentario_2 } </td>
                  <td> {item.comentario_3 } </td>
                  <td> {item.generales} </td>
                  <th>
                  <div className="flex flex-row space-x-3">
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
          <tfoot/>
        </table>
      ) : (
        <NoData />
      )}
    </div>
  ) : (
    <Loading></Loading>
  );
}

export default TablaComentarios;
