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
    <div className="overflow-x-auto mt-3  h-6/8  text-black bg-white dark:bg-[#1d232a] dark:text-white lg:w-5/8 ">
      {formaComentariosFiltrados.length > 0 ? (
        <table className="table table-xs table-zebra table-pin-rows table-pin-cols max-h-[calc(50%)]">
          <thead className=" relative z-[1] md:static">
            <tr>
              <th></th>
              <td>Comentario 1</td>
              <td>Comentario 2</td>
              <td>Comentario 3</td>
              <td>Generales</td>
              <th className="w-[calc(10%)]">Acciones</th>
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
              <td>Comentario 1</td>
              <td>Comentario 2</td>
              <td>Comentario 3</td>
              <td>Generales</td>
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
  );
}

export default TablaComentarios;
