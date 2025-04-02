"use client";
import React from "react";
import ModalComponent from "@/app/components/Catalogs_Components/modalComponent";
import TableComponent from "@/app/components/Catalogs_Components/tableComponent";
import VistaPrevia from "@/app/components/VistaPrevia";
import Busqueda from "@/app/profesores/components/Busqueda";
import Acciones from "@/app/profesores/components/Acciones";
import ModalProcesarDatos from "@/app/components/modalProcesarDatos";
import BarraCarga from "@/app/components/BarraCarga";
import { useProfesoresABC } from "@/app/profesores/Hooks/useProfesoresABC";
import { useProfesoresUI } from "@/app/profesores/Hooks/useProfesoresUI";
import { useProfesoresPdfExcel } from "@/app/profesores/Hooks/useProfesoresPdfExcel";
import "jspdf-autotable";
import "@react-pdf-viewer/core/lib/styles/index.css";

function Profesores() {
  const {
    onSubmitModal,
    Buscar,
    Alta,
    home,
    setBajas,
    limpiarBusqueda,
    handleBusquedaChange,
    fetchProfesorStatus,
    setReloadPage,
    setisLoadingButton,
    tableAction,
    register,
    status,
    session,
    isLoadingButton,
    isLoading,
    accion,
    permissions,
    active,
    inactive,
    busqueda,
    profesoresFiltrados,
    titulo,
    reload_page,
    isDisabled,
    errors,
    inactiveActive,
  } = useProfesoresABC();

  const {
    handleVerClick,
    CerrarView,
    ImprimePDF,
    ImprimeExcel,
    handleFileChange,
    buttonProcess,
    procesarDatos,
    setDataJson,
    excelPreviewData,
    pdfPreview,
    pdfData,
    animateLoading,
    porcentaje,
    cerrarTO,
    dataJson,
  } = useProfesoresPdfExcel(
    profesoresFiltrados,
    session,
    reload_page,
    inactiveActive,
    busqueda,
    fetchProfesorStatus,
    setReloadPage,
    setisLoadingButton
  );

  const {
    itemHeaderTable,
    itemDataTable,
    tableColumns,
    tableBody,
    modalBody,
    sinZebra,
  } = useProfesoresUI(
    tableAction,
    register,
    permissions,
    isDisabled,
    errors,
    accion
  );

  if (status === "loading") {
    return (
      <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  return (
    <>
      <BarraCarga porcentaje={porcentaje} cerrarTO={cerrarTO} />

      <ModalProcesarDatos
        id_modal={"my_modal_profesores"}
        session={session}
        buttonProcess={buttonProcess}
        isLoadingButton={isLoadingButton}
        isLoading={isLoading}
        title={"Procesar Datos desde Excel."}
        setDataJson={setDataJson}
        dataJson={dataJson}
        handleFileChange={handleFileChange}
        itemHeaderTable={itemHeaderTable}
        itemDataTable={itemDataTable}
        //clase para mover al tamaño del modal a preferencia (max-w-4xl)
        classModal={"modal-box w-full max-w-4xl h-full bg-base-200"}
      />

      <ModalComponent
        accion={accion}
        onSubmit={onSubmitModal}
        isLoadingButton={isLoadingButton}
        titulo={titulo}
        modalBody={modalBody}
      />

      <VistaPrevia
        id={"modalVPProfesor"}
        titulo={"Vista Previa de Profesores"}
        pdfPreview={pdfPreview}
        pdfData={pdfData}
        excelPreviewData={excelPreviewData}
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
                procesarDatos={procesarDatos}
                animateLoading={animateLoading}
                permiso_alta={permissions.altas}
                permiso_imprime={permissions.impresion}
                es_admin={session?.user?.es_admin || false}
              ></Acciones>
            </div>

            <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
              Profesores.
            </h1>
            <h3 className="ml-auto order-3  text-black dark:text-white">{`Profesores activos: ${
              active || 0
            }\nProfesores inactivos: ${inactive || 0}`}</h3>
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
                  data={profesoresFiltrados}
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

export default Profesores;
