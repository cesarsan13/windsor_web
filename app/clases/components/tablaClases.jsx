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
  permiso_cambio,
  permiso_baja,
}) {
  const tableAction = (evt, clase, accion) => {
    setClase(clase);
    setAccion(accion);
    setCurrentId({ id_grupo: clase.id_grupo, id_materia: clase.id_materia });
    showModal(true);
  };
  const ActionButton = ({ tooltip, iconDark, iconLight, onClick, permission }) => {
    if (!permission) return null;
    return (
      <th>
        <div
          className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem] content-center"
          data-tip={tooltip}
          onClick={onClick}
        >
          <Image src={iconDark} alt={tooltip} className="block dark:hidden" />
          <Image src={iconLight} alt={tooltip} className="hidden dark:block" />
        </div>
      </th>
    );
  };
  const ActionColumn = ({ description, permission }) => {
    if (!permission) return null;
    return (
      <>
        <th className="w-[5%] pt-[.10rem] pb-[.10rem]">{description}</th>
      </>
    )
  }

  return !isLoading ? (
    <>
      <div className="overflow-y-auto mt-3 h-[calc(55vh)] md:h-[calc(65vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white  w-full lg:w-full">
        {clasesFiltrados && clasesFiltrados.length > 0 ? (
          <table className="table table-xs table-zebra w-full">
            <thead className="sticky top-0 bg-white dark:bg-[#1d232a] z-[2]">
              <tr>
                <td className="w-[20%]">Grupo</td>
                <td className="sm:w-[20%]">Materia</td>
                <td className="w-[50%]">Profesor</td>
                <td className="w-[10%]">Lunes</td>
                <td className="w-[10%]">Martes</td>
                <td className="w-[10%]">Miercoles</td>
                <td className="w-[10%]">Jueves</td>
                <td className="w-[10%]">Viernes</td>
                <td className="w-[10%]">Sabado</td>
                <td className="w-[10%]">Domingo</td>
                < ActionColumn
                description={"Ver"}
                permission={true}
              />
              < ActionColumn
                description={"Editar"}
                permission={permiso_cambio}
              />
              < ActionColumn
                description={"Eliminar"}
                permission={permiso_baja}
              />
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

                  <ActionButton
                  tooltip="Ver"
                  iconDark={iconos.ver}
                  iconLight={iconos.ver_w}
                  onClick={(evt) => tableAction(evt, item, "Ver")}
                  permission={true}
                />
                <ActionButton
                  tooltip="Editar"
                  iconDark={iconos.editar}
                  iconLight={iconos.editar_w}
                  onClick={(evt) => tableAction(evt, item, "Editar")}
                  permission={permiso_cambio}
                />
                <ActionButton
                  tooltip="Eliminar"
                  iconDark={iconos.eliminar}
                  iconLight={iconos.eliminar_w}
                  onClick={(evt) => tableAction(evt, item, "Eliminar")}
                  permission={permiso_baja}
                />
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
