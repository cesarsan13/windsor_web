"use client";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/NoData";
import React from "react";
import iconos from "@/app/utils/iconos";
import Image from "next/image";

function TablaMenu({
  session,
  menusFiltrados,
  isLoading,
  showModal,
  setMenu,
  setAccion,
  setCurrentId,
  permiso_cambio,
  permiso_baja,
  subMenu,
}) {
  const tableAction = (evt, menu, accion) => {
    setMenu(menu);
    setAccion(accion);
    setCurrentId(menu.numero);
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

  return !isLoading ? (
    <div className="overflow-y-auto mt-3 h-[calc(55vh)] md:h-[calc(65vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white w-full lg:w-full">
      {menusFiltrados && menusFiltrados.length > 0 ? (
        <table className="table table-xs table-zebra w-full">
          <thead className="sticky top-0 bg-white dark:bg-[#1d232a] z-[2]">
            <tr>
              <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</td>
              <td className="sm:w-[25%]">Descripción</td>
              <td className="w-[20%]">Menú</td>
              <td className="w-[25%]">Submenú</td>
              <td className="w-[5%]">Ver</td>
              <td className="w-[5%]">Editar</td>
              <td className="w-[5%]">Eliminar</td>
            </tr>
          </thead>
          <tbody>
            {menusFiltrados.map((menu) => {
              // Filtrar todos los submenús que pertenecen a este menú
              const submenus = subMenu?.filter((sub) => sub.id_acceso === menu.numero) || [];

              // Unir las descripciones con una coma
              const submenuDescripcion = submenus.length > 0
                ? submenus.map((sub) => sub.descripcion).join(", ")
                : "";

              return (
                <tr key={menu.numero} className="hover:cursor-pointer">
                  <th className="text-left">{menu.numero}</th>
                  <td className="w-[25%]">{menu.descripcion}</td>
                  <td className="w-[20%]">{menu.menu}</td>
                  <td className="w-[25%]">{submenuDescripcion}</td>
                  <td>
                    <ActionButton
                      tooltip="Ver"
                      iconDark={iconos.ver}
                      iconLight={iconos.ver_w}
                      onClick={(evt) => tableAction(evt, menu, "Ver")}
                      permission={true}
                    />
                  </td>
                  <td>
                    <ActionButton
                      tooltip="Editar"
                      iconDark={iconos.editar}
                      iconLight={iconos.editar_w}
                      onClick={(evt) => tableAction(evt, menu, "Editar")}
                      permission={permiso_cambio}
                    />
                  </td>
                  <td>
                    <ActionButton
                      tooltip="Eliminar"
                      iconDark={iconos.eliminar}
                      iconLight={iconos.eliminar_w}
                      onClick={(evt) => tableAction(evt, menu, "Eliminar")}
                      permission={permiso_baja}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : menusFiltrados.length === 0 ? (
        <NoData />
      ) : (
        <Loading />
      )}
    </div>
  ) : (
    <Loading />
  );
}

export default TablaMenu;
