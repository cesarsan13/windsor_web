"use client";
import React, { useEffect, useState } from 'react';
import Loading from "@/app/components/loading";
import NoData from "@/app/components/NoData";
import Image from "next/image";
import iconos from "@/app/utils/iconos";

function TablaProyectos({
    basesDeDatosFiltrados,
    isLoading,
    session,
    showModal,
    setBasesDeDatos,
    setAccion,
    setCurrentId,
}){
    const tableAction = (evt, formaBD, accion) => {
        setBasesDeDatos(formaBD);
        setAccion(accion);
        setCurrentId(formaBD.id);
        showModal(true);
      };
      const ActionButton = ({ tooltip, iconDark, iconLight, onClick }) => {
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
    
      const ActionColumn = ({ description}) => {
        return (
          <>
            <th className="w-[5%] pt-[.10rem] pb-[.10rem]">{description}</th>
          </>
        )
      }
    
      return !isLoading ? (
        <div className="overflow-y-auto mt-3 h-[calc(55vh)] md:h-[calc(65vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white w-full lg:w-full">
          {basesDeDatosFiltrados && basesDeDatosFiltrados.length > 0 ? (
            <table className="table table-xs table-zebra w-full">
              <thead className="sticky top-0 bg-white dark:bg-[#1d232a] z-[2]">
                <tr>
                  <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Id</td>
                  <td className="w-[45%]">Nombre</td>
                  <td className="w-[15%] hidden sm:table-cell">Host</td>
                  <td className="w-[10%] hidden sm:table-cell">Port</td>
                  <td className="w-[20%] hidden sm:table-cell">Database</td>
                  < ActionColumn
                    description={"Ver"}
                  />
                  < ActionColumn
                    description={"Editar"}
                  />
                  < ActionColumn
                    description={"Eliminar"}
                  />
                </tr>
              </thead>
              <tbody>
                {basesDeDatosFiltrados.map((item) => (
                  <tr key={item.id} className="hover:cursor-pointer">
                    <th
                      className={
                        typeof item.comision === "number"
                          ? "text-left"
                          : "text-right"
                      }
                    >
                      {item.id}
                    </th>
                    <td className="w-[45%]"> {item.nombre} </td>
                    <td className="w-[15%] hidden sm:table-cell">
                      {" "}
                      {item.host}{" "}
                    </td>
                    <td className="w-[10%] hidden sm:table-cell">
                      {" "}
                      {item.port}{" "}
                    </td>
                    <td className="w-[20%] hidden sm:table-cell">
                      {" "}
                      {item.database}{" "}
                    </td>

                    <ActionButton
                      tooltip="Ver"
                      iconDark={iconos.ver}
                      iconLight={iconos.ver_w}
                      onClick={(evt) => tableAction(evt, item, "Ver")}
                    />
                    <ActionButton
                      tooltip="Editar"
                      iconDark={iconos.editar}
                      iconLight={iconos.editar_w}
                      onClick={(evt) => tableAction(evt, item, "Editar")}
                    />
                    <ActionButton
                      tooltip="Eliminar"
                      iconDark={iconos.eliminar}
                      iconLight={iconos.eliminar_w}
                      onClick={(evt) => tableAction(evt, item, "Eliminar")}
                    />
                  </tr>
                ))}
              </tbody>
              <tfoot />
            </table>
          ) : basesDeDatosFiltrados != null &&
            session &&
            basesDeDatosFiltrados.length === 0 ? (
            <NoData></NoData>
          ) : (
            <Loading></Loading>
          )}
        </div>
      ) : (
        <Loading></Loading>
      );
}
export default TablaProyectos;