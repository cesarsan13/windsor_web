"use client";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/noData";
import { getFotoAlumno } from "@/app/utils/api/alumnos/alumnos";
import { calculaDigitoBvba, poneCeros } from "@/app/utils/globalfn";
import React from "react";
function TablaAlumnos({
  session,
  alumnosFiltrados,
  isLoading,
  showModal,
  setAlumno,
  setAccion,
  setCurrentId,
  formatNumber,
  setCapturedImage,
  setcondicion,
}) {
  const tableAction = async (evt, alumno, accion) => {
    const imagenUrl = await getFotoAlumno(session.user.token, alumno.imagen);
    if (imagenUrl) {
      setCapturedImage(imagenUrl);
    }
    let ref = "100910" + poneCeros(alumno.id, 4);
    let digitoBvba = calculaDigitoBvba(ref);
    let resultado = `${ref}${digitoBvba}`;
    alumno.referencia = resultado;
    setAlumno(alumno);
    setAccion(accion);
    setCurrentId(alumno.id);
    showModal(true);
    setcondicion(false);
  };

  return !isLoading ? (
    <div className="overflow-x-auto mt-3  h-6/8 text-black bg-white dark:bg-[#1d232a] dark:text-white m-2 w-full  lg:w-5/8 ">
      {alumnosFiltrados.length > 0 ? (
        <table className="table table-xs table-zebra  table-pin-rows table-pin-cols max-h-[calc(50%)]">
          <thead className=" relative z-[1] md:static">
            <tr>
              <th></th>
              <td>Nombre</td>
              <td>Grado</td>
              {/* <td>Grado</td> */}
              <th className="w-[calc(10%)]">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {alumnosFiltrados.map((item) => (
              <tr key={item.id} className="hover:cursor-pointer">
                <th
                  className={
                    typeof item.comision === "number"
                      ? "text-right"
                      : "text-left"
                  }
                >
                  {item.id}
                </th>
                <td>{`${item.nombre} ${item.a_paterno} ${item.a_materno}`}</td>
                <td>{item.horario_1_nombre}</td>
                {/* <td>{item.grado}</td> */}
                <th>
                  <div className="flex flex-row space-x-3">
                    <div
                      className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-blue-500 hover:bg-blue-700 text-white"
                      data-tip={`Ver ${item.id}`}
                      onClick={(evt) => tableAction(evt, item, `Ver`)}
                    >
                      <i className="fa-solid fa-eye"></i>
                    </div>
                    <div
                      className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-blue-500 hover:bg-blue-700 text-white"
                      data-tip={`Editar ${item.id}`}
                      onClick={(evt) => tableAction(evt, item, `Editar`)}
                    >
                      <i className="fa-solid fa-file"></i>
                    </div>
                    <div
                      className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-blue-500 hover:bg-blue-700 text-white"
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
              <td>Nombre</td>
              <td>Grado</td>
              {/* <td>Grado</td>*/}
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

export default TablaAlumnos;
