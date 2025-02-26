"use client";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/NoData";
import { calculaDigitoBvba, poneCeros } from "@/app/utils/globalfn";
import Image from "next/image";
import iconos from "@/app/utils/iconos";
import React from "react";

function TablaAlumnos({
  session,
  alumnosFiltrados,
  isLoading,
  showModal,
  setAlumno,
  setAccion,
  setCurrentId,
  formatNumber,
  setCapturedImage,
  setcondicion,
  permiso_cambio,
  permiso_baja,
}) {


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
      {alumnosFiltrados && alumnosFiltrados.length > 0 ? (
        <table className="table table-xs table-zebra w-full">


        </table>
      ) : alumnosFiltrados != null &&
        session &&
        alumnosFiltrados.length === 0 ? (
        <NoData></NoData>
      ) : (
        <Loading></Loading>
      )}
    </div>
  ) : (
    <Loading></Loading>
  );
}

export default TablaAlumnos;
