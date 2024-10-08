"use client";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/noData";
import { getFotoAlumno } from "@/app/utils/api/alumnos/alumnos";
import { calculaDigitoBvba, poneCeros } from "@/app/utils/globalfn";
import Image from "next/image";
import iconos from "@/app/utils/iconos";
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
    <div className="overflow-x-auto mt-3 h-[calc(55vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white  w-full lg:w-full">
      {alumnosFiltrados.length > 0 ? (
        <table className="table table-sm table-zebra w-full">
          <thead className="sticky top-0 bg-white dark:bg-[#1d232a] z-[2]">
            <tr>
            <th className="sm:w-[10%]"></th>
              <td className="w-[40%]">Nombre</td>
              <td className="sm:table-cell">Grado</td>
              <th className="w-[30%] sm:w-[10%]">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {alumnosFiltrados.map((item) => (
              <tr key={item.id} className="hover:cursor-pointer">
                <th className={
                    typeof item.comision === "number"
                      ? "text-left"
                      : "text-right"
                  }
                >
                  {item.id}
                </th>
                <td className="w-[40%]">{`${item.a_nombre} ${item.a_paterno} ${item.a_materno}`}</td>
                <td className=" sm:table-cell">
                  {item.horario_1_nombre}
                </td>
                <th className="w-[25%] sm:w-[10%]">
                  <div className="flex flex-row space-x-1 sm:space-x-3">
                    <div
                      className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white"
                      data-tip={`Ver ${item.id}`}
                      onClick={(evt) => tableAction(evt, item, `Ver`)}
                    >
                        <Image src={iconos.ver} alt="Editar" />
                        </div>
                    <div
                      className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white"
                      data-tip={`Editar ${item.id}`}
                      onClick={(evt) => tableAction(evt, item, `Editar`)}
                    >
                        <Image src={iconos.editar} alt="Editar" />
                        </div>
                    <div
                      className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white"
                      data-tip={`Eliminar  ${item.id}`}
                      onClick={(evt) => tableAction(evt, item, "Eliminar")}
                    >
                        <Image src={iconos.eliminar} alt="Editar" />
                        </div>
                  </div>
                </th>
              </tr>
            ))}
          </tbody>
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
