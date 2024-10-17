"use client";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/NoData";
import React from "react";
import Image from "next/image";
import iconos from "@/app/utils/iconos";

function TablaFormFact({
  formFactsFiltrados,
  isLoading,
  showModal,
  setFormFact,
  setAccion,
  setCurrentId,
  setShowSheet,
  fetchFacturasFormato,
}) {
  const tableAction = (evt, formFact, accion) => {
    setFormFact(formFact);
    setAccion(accion);
    setCurrentId(formFact.numero_forma);
    if (evt.target.attributes.name.value !== "btn_actualiza_formato") {
      showModal(true);
    } else {
      fetchFacturasFormato(formFact.numero_forma);
      setShowSheet(true);
    }
  };

  return !isLoading ? (
    <>
      <div className="overflow-y-auto mt-3 h-[calc(55vh)] md:h-[calc(65vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white  w-full lg:w-full">
        {formFactsFiltrados.length > 0 ? (
          <table className="table table-xs table-zebra w-full">
            <thead className="sticky top-0 bg-white dark:bg-[#1d232a] z-[2]">
              <tr>
                <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</td>
                <td className="w-[60%]">Nombre</td>
                <td className="w-[40%]">Longitud</td>
                <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Ver</th>
                <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Editar</th>
                <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Eliminar</th>
                <th className="w-[5%] pt-[.10rem] pb-[.10rem]">A Formato</th>
              </tr>
            </thead>
            <tbody>
              {formFactsFiltrados.map((item) => (
                <tr key={item.numero} className="hover:cursor-pointer">
                  <th className="text-left">{item.numero_forma}</th>
                  <td className="text-left w-50">{item.nombre_forma}</td>
                  <td>{item.longitud}</td>
                  <th className="w-[5%] pt-[.10rem] pb-[.10rem]">
                    <div
                      className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem] content-center"
                      data-tip={`Ver`}
                      name="btn_ver"
                      onClick={(evt) => tableAction(evt, item, `Ver`)}
                    >
                      <Image src={iconos.ver} alt="Ver" />
                    </div>
                  </th>
                  <th className="w-[5%] pt-[.10rem] pb-[.10rem]">
                    <div
                      className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem] content-center"
                      data-tip={`Editar`}
                      name="btn_editar"
                      onClick={(evt) => tableAction(evt, item, `Editar`)}
                    >
                      <Image src={iconos.editar} alt="Editar" />
                    </div>
                  </th>
                  <th className="w-[5%] pt-[.10rem] pb-[.10rem]">
                    <div
                      className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem] content-center"
                      data-tip={`Eliminar ${item.numero_forma}`}
                      name="btn_elimina"
                      onClick={(evt) => tableAction(evt, item, "Eliminar")}
                    >
                      <Image src={iconos.eliminar} alt="Eliminar" />
                    </div>
                  </th>
                  <th className="w-[5%] pt-[.10rem] pb-[.10rem]">
                    <div
                      className="hidden sm:hidden md:block lg:block kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem] content-center"
                      data-tip={`Actualizar Formato`}
                      name="btn_actualiza_formato"
                      onClick={(evt) =>
                        tableAction(evt, item, "ActualizaFormato")
                      }
                    >
                      <Image src={iconos.editar} alt="Editar" />
                    </div>
                  </th>
                </tr>
              ))}
            </tbody>
            <tfoot />
          </table>
        ) : (
          <NoData />
        )}
      </div>
    </>
  ) : (
    <Loading />
  );
}

export default TablaFormFact;
