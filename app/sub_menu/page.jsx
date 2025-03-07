"use client";
import React from "react";
import ModalComponent from "@/app/components/Catalogs_Components/modalComponent";
import TableComponent from "@/app/components/Catalogs_Components/tableComponent";
import Acciones from "@/app/sub_menu/components/Acciones";
import Busqueda from "@/app/sub_menu/components/Busqueda";
import { useSubMenusABC } from "@/app/sub_menu/hooks/useSubMenusABC";
import { useSubMenusUI } from "@/app/sub_menu/hooks/useSubMenusUI";

export default function Sub_Menus() {
  const {
    onSubmitModal,
    tableAction,
    addSubMenu,
    register,
    setInactive,
    clearSearch,
    handleSearchingChange,
    Search,
    Home,
    setMenu,
    errors,
    session,
    status,
    isLoading,
    subMenusFiltered,
    permissions,
    isDisabled,
    currentAction,
    title,
    isLoadingButton,
    searching,
    subMenu,
  } = useSubMenusABC();
  const { tableColumns, tableBody, modalBody } = useSubMenusUI(
    tableAction,
    register,
    setMenu,
    permissions,
    isDisabled,
    errors,
    subMenu,
    currentAction,
    session
  );
  if (status === "loading" && !session) {
    return (
      <div className="container skeleton w-full max-w-screen-xl shadow-xl rounded-xl"></div>
    );
  }
  return (
    <>
      <ModalComponent
        accion={currentAction}
        onSubmit={onSubmitModal}
        isLoadingButton={isLoadingButton}
        titulo={title}
        modalBody={modalBody}
        size={"lg"}
      />
      <div className="container h-[85vh] w-full max-w-[1800px] bg-base-200 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y-hidden">
        <div className="flex flex-col justify-start p-3">
          <div className="flex flex-wrap md:flex-nowrap items-start md:items-center">
            <div className="order-2 md:order-1 flex justify-around w-full md:w-auto md:justify-start mb-0 md:mb-0">
              <Acciones
                Buscar={Search}
                Alta={addSubMenu}
                home={Home}
                permiso_alta={permissions.altas}
                permiso_imprime={permissions.impresion}
              />
            </div>

            <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
              Accesos Sub Menus.
            </h1>
          </div>
        </div>
        <div className="flex flex-col items-center h-full">
          <div className="w-full max-w-full">
            <Busqueda
              setBajas={setInactive}
              limpiarBusqueda={clearSearch}
              Buscar={Search}
              handleBusquedaChange={handleSearchingChange}
              busqueda={searching}
            />
            {status === "loading" || !session ? (
              <></>
            ) : (
              <TableComponent
                data={subMenusFiltered}
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
