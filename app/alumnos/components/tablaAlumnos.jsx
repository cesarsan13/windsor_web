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
    const imagenUrl = await getFotoAlumno(session.user.token, alumno.ruta_foto);
    if (imagenUrl) {
      setCapturedImage(imagenUrl);
    }
    let ref = "100910" + poneCeros(alumno.numero, 4);
    let digitoBvba = calculaDigitoBvba(ref);
    let resultado = `${ref}${digitoBvba}`;
    alumno.referencia = resultado;
    console.log("holaaaaa", alumno.sexo);
    setAlumno(alumno);
    setAccion(accion);
    setCurrentId(alumno.numero);
    showModal(true);
    setcondicion(false);
  };

  return !isLoading ? (
    <div className="overflow-x-auto mt-3 h-[calc(65vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white  w-full lg:w-full">
      {alumnosFiltrados.length > 0 ? (
        <table className="table table-xs table-zebra w-full">
          <thead className="sticky top-0 bg-white dark:bg-[#1d232a] z-[2]">
            <tr>
              <th className="sm:w-[10%] pt-[.10rem] pb-[.10rem]"></th>
              <td className="w-[40%] pt-[.10rem] pb-[.10rem]">Nombre</td>
              <td className="sm:table-cell pt-[.10rem] pb-[.10rem]">Grado</td>
              <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Ver</th>
              <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Editar</th>
              <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {alumnosFiltrados.map((item) => (
              <tr key={item.numero} className="hover:cursor-pointer">
                <th
                  className={
                    typeof item.comision === "number"
                      ? "text-left"
                      : "text-right"
                  }
                >
                  {item.numero}
                </th>
                <td className="w-[40%] max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap pt-[.10rem] pb-[.10rem]">
                {`${item.a_nombre} ${item.a_paterno} ${item.a_materno}`}</td>
                <td className=" sm:table-cell pt-[.10rem] pb-[.10rem] truncate">{item.horario_1_nombre}</td>

                      <th className="w-[5%] pt-[.10rem] pb-[.10rem]">
                        <div
                      className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem]"
                      data-tip={`Ver`}
                      onClick={(evt) => tableAction(evt, item, `Ver`)}
                    >
                      <Image src={iconos.ver} alt="Editar" />
                    </div>
                    </th>
                    <th className="w-[5%] pt-[.10rem] pb-[.10rem]">

                    <div
                      className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem]"
                      data-tip={`Editar`}
                      onClick={(evt) => tableAction(evt, item, `Editar`)}
                    >
                      <Image src={iconos.editar} alt="Editar" />
                    </div>
                    </th>
                    <th className="w-[5%] pt-[.10rem] pb-[.10rem]">

                    <div
                      className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem]"
                      data-tip={`Eliminar`}
                      onClick={(evt) => tableAction(evt, item, "Eliminar")}
                    >
                      <Image src={iconos.eliminar} alt="Editar" />
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
