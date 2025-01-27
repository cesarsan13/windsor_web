import Loading from "@/app/components/loading";
import iconos from "@/app/utils/iconos";
import Image from "next/image";
import React from "react";
import NoData from "@/app/components/NoData";
function TablaActividades({
  ActividadesFiltradas,
  isLoading,
  showModal,
  setActividad,
  setAccion,
  setCurrentId,
  permiso_cambio,
  permiso_baja,
  session
}) {
  const tableAction = (evt, actividad, accion) => {
    setActividad(actividad);
    setAccion(accion);
    setCurrentId(actividad.materia);
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
    <div className="overflow-y-auto mt-3 h-[calc(55vh)] md:h-[calc(65vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white  w-full lg:w-full">
      {ActividadesFiltradas && ActividadesFiltradas.length > 0 ? (
        <table className="table table-xs table-zebra w-full">
          <thead className="sticky top-0 bg-white dark:bg-[#1d232a] z-[2]">
            <tr>
              <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Asignatura</td>
              <td className="w-[10%]">Descripción</td>
              <th className="w-[5%]">Actividad</th>
              <th className="w-[10%]">Bim 1</th>
              <th className="w-[10%]">Bim 2</th>
              <th className="w-[10%]">Bim 3</th>
              <th className="w-[10%]">Bim 4</th>
              <th className="w-[10%]">Bim 5</th>
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
            {ActividadesFiltradas.map((item, index) => (
              <tr key={index}>
                <th
                  className={
                    typeof item.materia === "number"
                      ? "text-left"
                      : "text-right"
                  }
                >
                  {item.materia}
                </th>
                <td>{item.matDescripcion}</td>
                <td>{item.descripcion}</td>
                <td className="text-right">{item.EB1}</td>
                <td className="text-right">{item.EB2}</td>
                <td className="text-right">{item.EB3}</td>
                <td className="text-right">{item.EB4}</td>
                <td className="text-right">{item.EB5}</td>
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
          <tfoot/>
        </table>
      ) : ActividadesFiltradas != null && session && ActividadesFiltradas.length === 0 ?
      (
        <NoData />
      ) : (
        <Loading/>
      )}
    </div>
  ) : (
    <Loading></Loading>
  );
}

export default TablaActividades;
