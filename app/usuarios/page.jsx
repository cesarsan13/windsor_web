"use client";
import React from "react";
import ModalComponent from "@/app/components/Catalogs_Components/modalComponent";
import TableComponent from "@/app/components/Catalogs_Components/tableComponent";
import Busqueda from "@/app/usuarios/components/Busqueda";
import Acciones from "@/app/usuarios/components/Acciones";
import VistaPrevia from "@/app/components/VistaPrevia";
import { useUsuariosABC } from "@/app/usuarios/Hooks/useUsuariosABC";
import { useUsuariosPdfExcel } from "/app/usuarios/Hooks/useUsuariosPdfExcel";
import { useUsuariosUI } from "/app/usuarios/Hooks/useUsuariosUI";
import "jspdf-autotable";
import "@react-pdf-viewer/core/lib/styles/index.css";

function Usuarios() {
  const {
    onSubmitModal,
    Buscar,
    Alta,
    home,
    setBajas,
    limpiarBusqueda,
    handleBusquedaChange,
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
    usuariosFiltrados,
    titulo,
    isDisabled,
    errors,
  } = useUsuariosABC();

  const{
    handleVerClick,
    CerrarView,
    ImprimePDF,
    ImprimeExcel,
    pdfPreview,
    pdfData,
    animateLoading,
  } = useUsuariosPdfExcel(
    usuariosFiltrados,
    session,
  );

  const{
    tableColumns,
    tableBody,
    modalBody,
    sinZebra
  } = useUsuariosUI(
    tableAction,
    register,
    permissions,
    isDisabled,
    errors,
    accion
  );

  if (status === "loading" && !session) {
    return (
      <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
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
        id="modalVPUsuario"
        titulo={"Vista Previa de Usuarios"}
        pdfPreview={pdfPreview}
        pdfData={pdfData}
        PDF={ImprimePDF}
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
                Ver={handleVerClick}
                animateLoading={animateLoading}
                permiso_alta={permissions.altas}
                permiso_imprime={permissions.impresion}
              />
            </div>

            <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
              Usuarios
            </h1>
            <h3 className="ml-auto order-3">{`Usuarios activos: ${
              active || 0
              }\nUsuarios inactivos: ${inactive || 0}`}
            </h3>
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
              data={usuariosFiltrados}
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

export default Usuarios;
