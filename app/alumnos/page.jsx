"use client";
import React from "react";
import ModalComponent from "@/app/components/Catalogs_Components/modalComponent";
import TableComponent from "@/app/components/Catalogs_Components/tableComponent";
import Busqueda from "@/app/alumnos/components/Busqueda";
import Acciones from "@/app/alumnos/components/Acciones";
import VistaPrevia from "@/app/components/VistaPrevia";
import ModalProcesarDatos from "@/app/components/modalProcesarDatos";
import BarraCarga from "@/app/components/BarraCarga";
import { useAlumnosABC } from "@/app/alumnos/hooks/useAlumnosABC";
import { useAlumnosPdfExcel } from "@/app/alumnos/hooks/useAlumnosPdfExcel";
import { useAlumnosUI } from "@/app/alumnos/hooks/useAlumnosUI";
import "jspdf-autotable"
import "@react-pdf-viewer/core/lib/styles/index.css"


function Alumnos() {
  const {
    onSubmitModal,
    Buscar,
    Alta,
    home,
    setBajas,
    limpiarBusqueda,
    handleBusquedaChange,
    fetchAlumnoStatus,
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
    formaAlumnosFiltrados,
    titulo,
    reload_page,
    isDisabled,
    errors,
    inactiveActive,
  } = useAlumnosABC();

  const {
    handleVerClick,
    CerrarView,
    imprimePDF,
    ImprimeExcel,
    handleFileChange,
    buttonProcess,
    procesarDatos,
    setDataJson,
    pdfPreview,
    pdfData,
    animateLoading,
    porcentaje,
    cerrarTO,
    dataJson,
  } = useAlumnosPdfExcel(
    formaAlumnosFiltrados,
    session,
    reload_page,
    inactiveActive,
    busqueda,
    fetchAlumnoStatus,
    setReloadPage,
    setisLoadingButton
  );

const { itemHeaderTable, itemDataTable, tableColumns, tableBody, modalBody, sinZebra} =
  useAlumnosUI(tableAction, register, permissions, isDisabled, errors);
  if (status === "loading" && !session) {
    return (
      <div className="container skeleton w-full max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  return (
    <>
      <BarraCarga porcentaje={porcentaje} cerrarTO={cerrarTO} />
      
      <ModalProcesarDatos
        id_modal={"my_modal_4"}
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
        classModal={"modal-box w-full max-w-5xl h-full bg-base-200"}
      />
      <ModalComponent
        accion={accion}
        onSubmit={onSubmitModal}
        isLoadingButton={isLoadingButton}
        titulo={titulo}
        modalBody={modalBody}
        size="4xl"
      />
      <VistaPrevia
        id="modalVPAlumno"
        titulo="Vista Previa de Alumnos"
        pdfPreview={pdfPreview}
        pdfData={pdfData}
        PDF={imprimePDF}
        Excel={ImprimeExcel}
        CerrarView={CerrarView}
      />
      <div className="container h-[85vh] w-full max-w-[1800px] bg-base-200 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y-hidden">
        <div className="flex flex-col justify-start p-3">
          <div className="flex flex-wrap md:flex-nowrap items-start md:items-center">
            <div className="order-2 md:order-1 flex justify-around w-full md:w-auto md:justify-start mb-0 md:mb-0">
              <Acciones
                Buscar={Buscar}
                Alta={Alta}
                home={home}
                PDF={imprimePDF}
                Excel={ImprimeExcel}
                Ver={handleVerClick}
                procesarDatos={procesarDatos}
                animateLoading={animateLoading}
                permiso_alta={permissions.altas}
                permiso_imprime={permissions.impresion}
                es_admin={session?.user?.es_admin || false}
              />
            </div>
            <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
              Alumnos
            </h1>
            <h3 className="ml-auto order-3">{`Alumnos activos: ${
              active || 0
            }\nAlumnos inactivos: ${inactive || 0}`}</h3>
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
                  data={formaAlumnosFiltrados}
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

export default Alumnos;
