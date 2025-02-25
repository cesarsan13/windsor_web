"use client";
import React from "react";
import ModalComponent from "@/app/components/Catalogs_Components/modalComponent";
import TableComponent from "@/app/components/Catalogs_Components/tableComponent";
import Busqueda from "@/app/accesos_menu/components/Busqueda";
import Acciones from "@/app/accesos_menu/components/Acciones";
import { useAccesoMenuABC } from "@/app/accesos_menu/hooks/useAccesoMenuABC";
import { useAccesoMenuUI } from "@/app/accesos_menu/hooks/useAccesoMenuUI";

function Accesos_Menu() {
  const {
    Alta,
    onSubmitModal,
    limpiarBusqueda,
    handleBusquedaChange,
    setBajas,
    home,
    Buscar,
    register,
    tableAction,
    session,
    status,
    subMenu,
    menussel,
    errors,
    menusFiltrados,
    permissions,
    busqueda,
    isLoading,
    accion,
    isDisabled,
    titulo,
    isLoadingButton,
  } = useAccesoMenuABC();
  const { tableColumns, tableBody, modalBody } = useAccesoMenuUI(
    tableAction,
    register,
    subMenu,
    permissions,
    isDisabled,
    errors,
    menussel
  );
  if (status === "loading" && !session) {
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
      <div className="container h-[80vh] w-full max-w-screen-xl bg-base-200 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y-hidden">
        <div className="flex flex-col justify-start p-3">
          <div className="flex flex-wrap md:flex-nowrap items-start md:items-center">
            <div className="order-2 md:order-1 flex justify-around w-full md:w-auto md:justify-start mb-0 md:mb-0">
              <Acciones
                Buscar={Buscar}
                Alta={Alta}
                home={home}
                permiso_alta={permissions.altas}
                permiso_imprime={permissions.impresion}
              />
            </div>

            <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
              Accesos Menu.
            </h1>
          </div>
        </div>
        <div className="flex flex-col items-center h-full">
          <div className="w-full max-w-4xl">
            <Busqueda
              setBajas={setBajas}
              limpiarBusqueda={limpiarBusqueda}
              Buscar={Buscar}
              handleBusquedaChange={handleBusquedaChange}
              busqueda={busqueda}
            />
            {status === "loading" || !session ? (
              <></>
            ) : (
              <TableComponent
                data={menusFiltrados}
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

export default Accesos_Menu;
