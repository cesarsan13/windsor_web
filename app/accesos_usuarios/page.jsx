"use client";
import React from "react";
import Acciones from "./components/Acciones";
import BuscarCat from "../components/BuscarCat";
import ModalComponent from "@/app/components/Catalogs_Components/modalComponent";
import TableComponent from "@/app/components/Catalogs_Components/tableComponent";
import { useAccesosUsuariosABC } from "@/app/accesos_usuarios/Hooks/useAccesosUsuariosABC";
import { useAccesosUsuariosUI } from "@/app/accesos_usuarios/Hooks/useAccesosUsuariosUI";

function Accesos_Usuarios() {
  
  const {
    TodosSiNo,
    onSubmitModal,
    home,
    setUsuario,
    tableAction,
    register,
    setValue,
    watch,
    isLoadingButton,
    status,
    titulo,
    accion,
    errors,
    session, 
    isLoading,
    accesosUsuariosFiltrados
  } = useAccesosUsuariosABC();

  const {
    tableColumns,
    tableBody,
    modalBody,
  } = useAccesosUsuariosUI(
    tableAction,
    register,
    setValue,
    watch,
    errors
  );
  
  if (status === "loading" && !session) {
    return (
      <div className="container skeleton w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
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

      <div className="container h-[85vh] w-full max-w-[1800px] bg-base-200 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y-hidden">
        <div className="flex flex-col justify-start p-3">
          <div className="flex flex-wrap md:flex-nowrap items-start md:items-center">
            <div className="order-2 md:order-1 flex justify-around w-full md:w-auto md:justify-start mb-0 md:mb-0">
              <Acciones 
                home={home}
              />
            </div>
            <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
              Accesos Usuarios.
            </h1>
          </div>
        </div>
        <div className="flex flex-col items-center h-full">
          <div className="w-full max-w-full">
            <BuscarCat
              nameInput={["id", "name"]}
              fieldsToShow={["id", "nombre"]}
              table={"usuarios"}
              token={session.user.token}
              modalId={"modal_usuarios"}
              setItem={setUsuario}
              titulo={"Usuarios"}
              alignRight
            />
            <div className="flex flex-row space-x-4 mt-4">
              <button
                className="btn btn-sm btn-success w-24"
                name="si"
                onClick={(evt) => TodosSiNo(evt)}
              >
                Todos Si
              </button>
              <button
                className="btn btn-sm btn-error w-24"
                name="no"
                onClick={(evt) => TodosSiNo(evt)}
              >
                Todos No
              </button>
            </div>
            <TableComponent
               data={accesosUsuariosFiltrados}
               session={session}
               isLoading={isLoading}
               tableColumns={tableColumns}
               tableBody={tableBody} 
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Accesos_Usuarios;
