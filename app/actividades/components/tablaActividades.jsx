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
}) {
  const tableAction = (evt, actividad, accion) => {
    setActividad(actividad);
    setAccion(accion);
    setCurrentId(actividad.materia);
    showModal(true);
  };
  return !isLoading ? (
    <div className="overflow-y-auto mt-3 h-[calc(55vh)] md:h-[calc(65vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white  w-full lg:w-full">
      {ActividadesFiltradas.length > 0 ? (
        <table>
          <thead className="sticky top-0 bg-white dark:bg-[#1d232a] z-[2]">
            <tr>
              <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Asignatura</td>
              <th className="w-[5%]">Actividad</th>
              <th className="w-[10%]">Bim 1</th>
              <th className="w-[10%]">Bim 2</th>
              <th className="w-[10%]">Bim 3</th>
              <th className="w-[10%]">Bim 4</th>
              <th className="w-[10%]">Bim 5</th>
              <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Ver</th>
              <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Editar</th>
              <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Eliminar</th>
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
                <td>{item.descripcion}</td>
                <td className="text-right">{item.EB1}</td>
                <td className="text-right">{item.EB2}</td>
                <td className="text-right">{item.EB3}</td>
                <td className="text-right">{item.EB4}</td>
                <td className="text-right">{item.EB5}</td>
                <th className="w-[5%] pt-[.10rem] pb-[.10rem]">
                  <div
                    className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem] content-center"
                    data-tip={`Ver`}
                    onClick={(evt) => tableAction(evt, item, `Ver`)}
                  >
                    <Image src={iconos.ver} alt="Ver" />
                  </div>
                </th>
                <th className="w-[5%] pt-[.10rem] pb-[.10rem]">
                  <div
                    className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem] content-center"
                    data-tip={`Editar`}
                    onClick={(evt) => tableAction(evt, item, `Editar`)}
                  >
                    <Image src={iconos.editar} alt="Editar" />
                  </div>
                </th>
                <th className="w-[5%] pt-[.10rem] pb-[.10rem]">
                  <div
                    className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem] content-center"
                    data-tip={`Eliminar`}
                    onClick={(evt) => tableAction(evt, item, "Eliminar")}
                  >
                    <Image src={iconos.eliminar} alt="Eliminar" />
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

export default TablaActividades;
