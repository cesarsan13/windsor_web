"use client";
import React from "react";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/NoData";
import iconos from "@/app/utils/iconos";
import Image from "next/image";
function TablaHorarios({
  HorariosFiltrados,
  isLoading,
  showModal,
  setHorario,
  setAccion,
  setCurrentId,
  session,
  permiso_cambio,
  permiso_baja,
}) {
  const tableAction = (evt, horario, accion) => {
    setHorario(horario);
    setAccion(accion);
    setCurrentId(horario.numero);
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
  };
  return !isLoading ? (
    <div className="overflow-y-auto mt-3 h-[calc(55vh)] md:h-[calc(65vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white  w-full lg:w-full">
      {HorariosFiltrados && HorariosFiltrados.length > 0 ? (
        <table className="table table-xs table-zebra w-full">
          <thead className="sticky top-0 bg-white dark:bg-[#1d232a] z-[2]">
            <tr>
              <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</td>
              <th className="w-[15%]">Horario</th>
              <th className="w-[5%]">Salón</th>
              <th className="w-[25%]">Dia</th>
              <th className="w-[5%]">Cancha</th>
              <th className="w-[10%]">Max Niños</th>
              <th className="w-[5%]">Sexo</th>
              <th className="w-[5%]">Edad Ini</th>
              <th className="w-[5%]">Edad Fin</th>
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
            {HorariosFiltrados.map((item) => (
              <tr key={item.numero}>
                <th
                  className={
                    typeof item.numero === "number" ? "text-left" : "text-right"
                  }
                >
                  {item.numero}
                </th>
                <td>{item.horario}</td>
                <td>{item.salon}</td>
                <td>{item.dia}</td>
                <td
                  className={
                    typeof item.numero === "number" ? "text-left" : "text-right"
                  }
                >
                  {item.cancha}
                </td>
                <td className="text-right">{item.max_niños}</td>
                <td>{item.sexo}</td>
                <td className="text-right">{item.edad_ini}</td>
                <td className="text-right">{item.edad_fin}</td>
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
      ) : HorariosFiltrados != null &&
        session &&
        HorariosFiltrados.length === 0 ? (
        <NoData></NoData>
      ) : (
        <Loading></Loading>
      )}
    </div>
  ) : (
    <Loading></Loading>
  );
}

export default TablaHorarios;
