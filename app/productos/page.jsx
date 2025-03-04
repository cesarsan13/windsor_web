"use client";
import React from "react";
import ModalComponent from "../components/Catalogs_Components/modalComponent";
import TableComponent from "../components/Catalogs_Components/tableComponent";
import Busqueda from "@/app/productos/components/Busqueda";
import Acciones from "@/app/productos/components/Acciones";
import VistaPrevia from "@/app/components/VistaPrevia";
import ModalProcesarDatos from "@/app/components/modalProcesarDatos";
import BarraCarga from "@/app/components/BarraCarga";
import { useProductosABC } from "./hooks/useProductosABC";
import { useProductosPdfExcel } from "./hooks/useProductosPdfExcel";
import { useProductosUI } from "./hooks/useProductosUI";
import "jspdf-autotable";
import "@react-pdf-viewer/core/lib/styles/index.css";

function Productos() {
  const {
    onSubmitModal,
    Buscar,
    Alta,
    home,
    setBajas,
    limpiarBusqueda,
    handleBusquedaChange,
    fetchProductoStatus,
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
    formaProductosFiltrados,
    titulo,
    reload_page,
    isDisabled,
    errors,
    inactiveActive,
  } = useProductosABC();

  const {
    handleVerClick,
    CerrarView,
    imprimirPDF,
    imprimirEXCEL,
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
  } = useProductosPdfExcel(
    formaProductosFiltrados,
    session,
    reload_page,
    inactiveActive,
    busqueda,
    fetchProductoStatus,
    setReloadPage,
    setisLoadingButton
  );

  const { itemHeaderTable, itemDataTable, tableColumns, tableBody, modalBody, sinZebra } =
    useProductosUI(tableAction, register, permissions, isDisabled, errors, accion);
  if (status === "loading" && !session) {
    return (
      <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
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
        id={"modalVProducto"}
        titulo={"Vista Previa de Productos"}
        pdfPreview={pdfPreview}
        pdfData={pdfData}
        PDF={imprimirPDF}
        Excel={imprimirEXCEL}
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
                Ver={handleVerClick}
                procesarDatos={procesarDatos}
                animateLoading={animateLoading}
                permiso_alta={permissions.altas}
                permiso_imprime={permissions.impresion}
                es_admin={session?.user?.es_admin || false}
              />
            </div>

            <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
              Productos
            </h1>
            <h3 className="ml-auto order-3">{`Productos activos: ${
              active || 0
            }\nProductos inactivos: ${inactive || 0}`}</h3>
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
                  data={formaProductosFiltrados}
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

export default Productos;
