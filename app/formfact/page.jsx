"use client";
import React from "react";
import ModalComponent from "@/app/components/Catalogs_Components/modalComponent";
import TableComponent from "@/app/components/Catalogs_Components/tableComponent";
import Busqueda from "@/app/formfact/components/Busqueda";
import Acciones from "@/app/formfact/components/Acciones";
import BarraCarga from "@/app/components/BarraCarga";
import ModalProcesarDatos from "@/app/components/modalProcesarDatos";
import ConfigReporte from "@/app/formfact/components/configReporte";
import "jspdf-autotable";
import { useFormFactABC } from "@/app/formfact/Hooks/useFormFactABC";
import { useFormFactPdfExcel } from "@/app/formfact/Hooks/useFormFactPdfExcel";
import { useFormFactUI } from "@/app/formfact/Hooks/useFormFactUI";

function FormFact() {
  const{
    onSubmitModal,
    Buscar,
    Alta,
    home,
    setBajas,
    limpiarBusqueda,
    handleBusquedaChange,
    fetchFormFactStatus,
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
    formFactsFiltrados,
    titulo,
    reload_page,
    isDisabled,
    errors,
    inactiveActive,
    showSheet,
    labels,
    propertyData,
    formato,
    setFormato,
    setLabels,
    setShowSheet,
    currentID
  } = useFormFactABC();

  const{
    handleFileChange,
    buttonProcess,
    procesarDatos,
    setDataJson,
    porcentaje,
    cerrarTO,
    dataJson
  } = useFormFactPdfExcel(
    session,
    reload_page,
    inactiveActive,
    busqueda,
    fetchFormFactStatus,
    setReloadPage,
    setisLoadingButton
  );

  const{
    itemHeaderTable,
    itemDataTable,
    tableColumns,
    tableBody,
    modalBody
  } = useFormFactUI(
    tableAction,
    register,
    permissions,
    isDisabled,
    errors
  );

  if (status === "loading" && !session) {
    return (
      <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  return (
    <>
      <BarraCarga 
        porcentaje={porcentaje} 
        cerrarTO={cerrarTO}
      />

      <ModalComponent
        accion={accion}
        onSubmit={onSubmitModal}
        isLoadingButton={isLoadingButton}
        titulo={titulo}
        modalBody={modalBody}
      />

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
        classModal={"modal-box w-full max-w-4xl h-full bg-base-200"}
      />

      <div className="container h-[85vh] w-full max-w-[1800px] bg-base-200 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y-hidden">
        <div className="flex flex-col justify-start p-3">
          <div className="flex flex-wrap md:flex-nowrap items-start md:items-center">
            <div className="order-2 md:order-1 flex justify-around w-full md:w-auto md:justify-start mb-0 md:mb-0">
              <Acciones
                Buscar={Buscar}
                Alta={Alta}
                procesarDatos={procesarDatos}
                home={home}
                permiso_alta={permissions.altas}
                es_admin={session?.user?.es_admin || false}
              />
            </div>
            <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-16">
              Formas Facturas
            </h1>
            <h3 className="ml-auto order-3">{`Formas activas: ${active || 0}\nFormas inactivas: ${inactive || 0}`}</h3>
          </div>
        </div>

        <div className="flex flex-col items-center h-full">
          <div className="w-full max-w-full overflow-scroll">
            <Busqueda
              setBajas={setBajas}
              limpiarBusqueda={limpiarBusqueda}
              Buscar={Buscar}
              handleBusquedaChange={handleBusquedaChange}
              setFormato={setFormato}
              busqueda={busqueda}
            />
            {showSheet ? (
              <ConfigReporte
                labels={labels}
                setLabels={setLabels}
                formato={formato}
                propertyData={propertyData}
                setShowSheet={setShowSheet}
                currentID={currentID}
              ></ConfigReporte>
            ) : status === "loading" || !session ? (
              <></>
            ) : (
              <TableComponent
                data={formFactsFiltrados}
                session={session}
                isLoading={isLoading}
                tableColumns={tableColumns}
                tableBody={tableBody}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default FormFact;