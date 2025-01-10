"use client";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/NoData";
import React from "react";
import iconos from "@/app/utils/iconos";
import Image from "next/image";
function TablaMenus({
  session,
  menusFiltrados,
  isLoading,
  tableAction,
  permiso_cambio,
  permiso_baja,
}) {
  const ActionButton = ({
    tooltip,
    iconDark,
    iconLight,
    onClick,
    permission,
  }) => {
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
    );
  };
  return !isLoading ? (
    <>
      <div className="overflow-y-auto mt-3 h-[calc(55vh)] md:h-[calc(65vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white  w-full lg:w-full">
        {menusFiltrados && menusFiltrados.length > 0 ? (
          <table className="table table-xs table-zebra w-full">
            <thead className="sticky top-0 bg-white dark:bg-[#1d232a] z-[2]">
              <tr>
                <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</td>
                <td className="sm:w-[35%]">Nombre</td>
                <ActionColumn description={"Ver"} permission={true} />
                <ActionColumn
                  description={"Editar"}
                  permission={permiso_cambio}
                />
                <ActionColumn
                  description={"Eliminar"}
                  permission={permiso_baja}
                />
              </tr>
            </thead>
            <tbody>
              {menusFiltrados.map((item) => (
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
                  <td className="w-[35%] max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap pt-[.10rem] pb-[.10rem]">
                    {item.nombre}
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
          </table>
        ) : menusFiltrados != null &&
          session &&
          menusFiltrados.length === 0 ? (
          <NoData></NoData>
        ) : (
          <Loading></Loading>
        )}
      </div>
    </>
  ) : (
    <Loading></Loading>
  );
}

export default TablaMenus;
