"use client";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/NoData";
import React from "react";
import iconos from "@/app/utils/iconos";
import Image from "next/image";
function TablaClases({
  session,
  clasesFiltrados,
  isLoading,
  showModal,
  setClase,
  setAccion,
  setCurrentId,
}) {
  const tableAction = (evt, clase, accion) => {
    setClase(clase);
    setAccion(accion);
    setCurrentId({ id_grupo: clase.id_grupo, id_materia: clase.id_materia });
    showModal(true);
  };

  return !isLoading ? (
    <>
      <div className="overflow-y-auto mt-3 h-[calc(55vh)] md:h-[calc(65vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white  w-full lg:w-full">
        {clasesFiltrados && clasesFiltrados.length > 0 ? (
          <table className="table table-xs table-zebra w-full">
            <thead className="sticky top-0 bg-white dark:bg-[#1d232a] z-[2]">
              <tr>
                <td className="sm:w-[20%]">Asignatura</td>
                <td className="w-[20%]">Grupo</td>
                <td className="w-[50%]">Profesor</td>
                <td className="w-[10%]">Lunes</td>
                <td className="w-[10%]">Martes</td>
                <td className="w-[10%]">Miercoles</td>
                <td className="w-[10%]">Jueves</td>
                <td className="w-[10%]">Viernes</td>
                <td className="w-[10%]">Sabado</td>
                <td className="w-[10%]">Domingo</td>
                <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Ver</th>
                <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Editar</th>
                <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {clasesFiltrados.map((item, idx) => (
                <tr key={idx} className="w-[20%] hover:cursor-pointer">
                  <th>
                    {item.grupo_descripcion}
                  </th>
                  <td className="w-[20%]  text-left">
                    {item.materia_descripcion}
                  </td>
                  <td className="w-[50%]  text-left">{item.profesor_nombre}</td>
                  <td className="w-[10%]">{item.lunes}</td>
                  <td className="w-[10%]">{item.martes}</td>
                  <td className="w-[10%]">{item.miercoles}</td>
                  <td className="w-[10%]">{item.jueves}</td>
                  <td className="w-[10%]">{item.viernes}</td>
                  <td className="w-[10%]">{item.sabado}</td>
                  <td className="w-[10%]">{item.domingo}</td>

                  <th className="w-[5%] pt-[.10rem] pb-[.10rem]">
                    <div
                      className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem] content-center"
                      data-tip={`Ver`}
                      onClick={(evt) => tableAction(evt, item, `Ver`)}
                    >
                      <Image src={iconos.ver}  className="block dark:hidden" alt="Ver" />
                      <Image src={iconos.ver_w} className="hidden dark:block"  alt="Ver" />
                    </div>
                  </th>
                  <th className="w-[5%] pt-[.10rem] pb-[.10rem]">
                    <div
                      className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem] content-center"
                      data-tip={`Editar`}
                      onClick={(evt) => tableAction(evt, item, `Editar`)}
                    >                      
                      <Image src={iconos.editar}  className="block dark:hidden" alt="Editar" />
                      <Image src={iconos.editar_w} className="hidden dark:block"  alt="Editar" />
                    </div>
                  </th>
                  <th className="w-[5%] pt-[.10rem] pb-[.10rem]">
                    <div
                      className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem] content-center"
                      data-tip={`Eliminar`}
                      onClick={(evt) => tableAction(evt, item, "Eliminar")}
                    >                      
                      <Image src={iconos.eliminar}  className="block dark:hidden" alt="Eliminar" />
                      <Image src={iconos.eliminar_w} className="hidden dark:block"  alt="Eliminar" />
                    </div>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        ) : clasesFiltrados != null &&
          session &&
          clasesFiltrados.length === 0 ? (
          <NoData></NoData>
        ) : (
          <Loading></Loading>
        )}
      </div>
    </>
  ) : (
    <Loading />
  );
}

export default TablaClases;
