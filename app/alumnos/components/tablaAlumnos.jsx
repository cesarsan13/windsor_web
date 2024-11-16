"use client";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/NoData";
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
    setAlumno(alumno);
    setAccion(accion);
    setCurrentId(alumno.numero);
    showModal(true);
    setcondicion(false);
  };

  return !isLoading ? (
    <div className="overflow-y-auto mt-3 h-[calc(55vh)] md:h-[calc(65vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white  w-full lg:w-full">
      {alumnosFiltrados && alumnosFiltrados.length > 0 ? (
        <table className="table table-xs table-zebra w-full">
          <thead className="sticky top-0 bg-white dark:bg-[#1d232a] z-[2]">
            <tr>
              <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</td>
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
                  {`${item.a_nombre} ${item.a_paterno} ${item.a_materno}`}
                </td>
                <td className=" sm:table-cell pt-[.10rem] pb-[.10rem] truncate">
                  {item.horario_1_nombre}
                </td>

                <th className="w-[5%] pt-[.10rem] pb-[.10rem]">
                  <div
                    className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem] content-center"
                    data-tip={`Ver`}
                    onClick={(evt) => tableAction(evt, item, `Ver`)}
                  >
                    <Image src={iconos.ver} alt="Ver" className="block dark:hidden" />
                    <Image src={iconos.ver_w} alt="Guardar en oscuro" className="hidden dark:block" />
                  </div>
                </th>
                <th className="w-[5%] pt-[.10rem] pb-[.10rem]">
                  <div
                    className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem] content-center"
                    data-tip={`Editar`}
                    onClick={(evt) => tableAction(evt, item, `Editar`)}
                  >
                    <Image src={iconos.editar} alt="Editar" className="block dark:hidden" />
                    <Image src={iconos.editar_w} alt="Editar" className="hidden dark:block" />
                  </div>
                </th>
                <th className="w-[5%] pt-[.10rem] pb-[.10rem]">
                  <div
                    className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem] content-center"
                    data-tip={`Eliminar`}
                    onClick={(evt) => tableAction(evt, item, "Eliminar")}
                  >
                    <Image src={iconos.eliminar} alt="Eliminar" className="block dark:hidden" />
                    <Image src={iconos.eliminar_w} alt="Eliminar" className="hidden dark:block" />
                  </div>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      ) : alumnosFiltrados != null &&
        session &&
        alumnosFiltrados.length === 0 ? (
        <NoData></NoData>
      ) : (
        <Loading></Loading>
      )}
    </div>
  ) : (
    <Loading></Loading>
  );
}

export default TablaAlumnos;
