"use client";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/NoData";
import Image from "next/image";
import iconos from "@/app/utils/iconos";
import React from "react";
function TablaComentarios({
  formaComentariosFiltrados,
  session,
  isLoading,
  showModal,
  setFormaComentarios,
  setAccion,
  setCurrentId,
  permiso_cambio,
  permiso_baja,
}) {
  const tableAction = (evt, formaComentarios, accion) => {
    setFormaComentarios(formaComentarios);
    setAccion(accion);
    setCurrentId(formaComentarios.numero);
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
    <div className="overflow-y-auto mt-3 h-[calc(55vh)] md:h-[calc(65vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white w-full lg:w-full">
      {formaComentariosFiltrados && formaComentariosFiltrados.length > 0 ? (
        <table className="table table-xs table-zebra w-full">
          <thead className="sticky top-0 bg-white dark:bg-[#1d232a] z-[2]">
            <tr>
              <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</td>
              <td className="w-[45%]">Comentario 1</td>
              <td className="w-[25%] hidden sm:table-cell">Comentario 2</td>
              <td className="w-[25%] hidden sm:table-cell">Comentario 3</td>
              {/* <th className="w-[30%] sm:w-[10%]">Acciones</th> */}
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
            {formaComentariosFiltrados.map((item) => (
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
                <td className="w-[45%]"> {item.comentario_1} </td>
                <td className="w-[25%] hidden sm:table-cell">
                  {" "}
                  {item.comentario_2}{" "}
                </td>
                <td className="w-[25%] hidden sm:table-cell">
                  {" "}
                  {item.comentario_3}{" "}
                </td>
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
          <tfoot />
        </table>
      ) : formaComentariosFiltrados != null &&
        session &&
        formaComentariosFiltrados.length === 0 ? (
        <NoData></NoData>
      ) : (
        <Loading></Loading>
      )}
    </div>
  ) : (
    <Loading></Loading>
  );
}

export default TablaComentarios;
