"use client";
import React from "react";
import ModalComponent from "@/app/components/Catalogs_Components/modalComponent";
import TableComponent from "@/app/components/Catalogs_Components/tableComponent";
import Acciones from "@/app/clases/components/Acciones";
import Busqueda from "@/app/clases/components/Busqueda";
import VistaPrevia from "@/app/components/VistaPrevia";
import { useClasesABC } from "@/app/clases/Hooks/useClasesABC";
import { useClasesPdfExcel } from "@/app/clases/Hooks/useClasesPdfExcel";
import { useClasesUI } from "@/app/clases/Hooks/useClasesUI";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "jspdf-autotable";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { useState } from "react";

function Clases() {
  const {
    onSubmitModal,
    Buscar,
    Alta,
    home,
    setBajas,
    limpiarBusqueda,
    handleBusquedaChange,
    fetchClasesStatus,
    setReloadPage,
    setisLoadingButton,
    tableAction,
    register,
    setGrado,
    setMateria,
    setProfesor,
    control,
    status,
    session,
    isLoadingButton,
    isLoading,
    accion,
    permissions,
    active,
    inactive,
    busqueda,
    clasesFiltrados,
    titulo,
    reload_page,
    isDisabled,
    errors,
    inactiveActive,
    clase,
    contador,
    isDisabledBusca,
    vGrado,
    vMateria,
    vProfesor,
  } = useClasesABC();

  const {
    handleVerClick,
    CerrarView,
    ImprimePDF,
    ImprimeExcel,
    excelPreviewData,
    pdfPreview,
    pdfData,
    animateLoading,
  } = useClasesPdfExcel(clasesFiltrados, session);

  const { tableColumns, tableBody, modalBody, sinZebra } = useClasesUI(
    tableAction,
    register,
    setGrado,
    permissions,
    isDisabled,
    isDisabledBusca,
    errors,
    accion,
    contador,
    clase,
    setMateria,
    setProfesor,
    vGrado,
    vMateria,
    vProfesor
  );

  if (status === "loading") {
    return (
      <div className="container skeleton w-full max-w-screen-xl shadow-xl rounded-xl"></div>
    );
  }
  return (
    <>
      <ModalComponent
        accion={accion}
        onSubmit={onSubmitModal}
        isLoadingButton={isLoadingButton}
        titulo={titulo}
        modalBody={modalBody}
      />
      <VistaPrevia
        id="modalVPClase"
        titulo={"Vista Previa de Clases"}
        excelPreviewData={excelPreviewData}
        pdfPreview={pdfPreview}
        pdfData={pdfData}
        PDF={ImprimePDF}
        Excel={ImprimeExcel}
        CerrarView={CerrarView}
        seeExcel={true}
        seePDF={true}
      />
      <div className="container h-[85vh] w-full max-w-[1800px] bg-base-200 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y-hidden">
        <div className="flex flex-col justify-start p-3">
          <div className="flex flex-wrap md:flex-nowrap items-start md:items-center">
            <div className="order-2 md:order-1 flex justify-around w-full md:w-auto md:justify-start mb-0 md:mb-0">
              <Acciones
                Buscar={Buscar}
                Alta={Alta}
                home={home}
                Ver={handleVerClick}
                animateLoading={animateLoading}
                contador={contador}
                permiso_alta={permissions.altas}
                permiso_imprime={permissions.impresion}
              />
            </div>

            <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
              Clases
            </h1>
            <h3 className="ml-auto order-3 text-black dark:text-white">{`Clases activas: ${
              active || 0
            }\nClases inactivas: ${inactive || 0}`}</h3>
          </div>
        </div>
        <div className="flex flex-col items-center h-full">
          <div className="w-full max-w-full">
            <Busqueda
              setBajas={setBajas}
              limpiarBusqueda={limpiarBusqueda}
              Buscar={Buscar}
              handleBusquedaChange={handleBusquedaChange}
              busqueda={busqueda}
            />
            {status === "loading" ||
              (!session ? (
                <></>
              ) : (
                <TableComponent
                  data={clasesFiltrados}
                  session={session}
                  isLoading={isLoading}
                  tableColumns={tableColumns}
                  tableBody={tableBody}
                  sinZebra={sinZebra}
                />
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Clases;
