import React, { useRef, useState } from "react";
import Image from "next/image";
import iconos from "@/app/utils/iconos";
import TablaProcesaDatos from "@/app/components/tablaProcesarDatos";
import { FaSpinner } from "react-icons/fa";

function ModalProcesarDatos({
    id_modal, 
    session,
    buttonProcess,
    isLoadingButton, 
    isLoading, 
    title,
    dataJson,
    handleFileChange,
    itemHeaderTable,
    itemDataTable,
    classModal,
    setDataJson,
}) {
    const inputfileref = useRef(null);
    const openFileSelector = () => {
        if (inputfileref.current) {
            inputfileref.current.click();
        }
    };
    const resetModal = () => {
        setDataJson([]);
        // const fileInput = document.getElementById('excel_file');
        // fileInput.value = "";
        document.getElementById(id_modal).close();
    }
    return (
        <dialog id={id_modal} className="modal">
            <div className={`${classModal}`}>
                <div className="sticky -top-6 flex justify-between items-center bg-base-200 w-full h-10 z-10 mb-5">
                    <h3 className="font-bold text-lg text-black dark:text-white">{title}</h3>
                    <div className="flex space-x-2 items-center">
                        <div
                            className={`tooltip tooltip-bottom hover:cursor-pointer`}
                            data-tip="Guardar"
                        >
                            <button
                                type="submit"
                                id="btn_save"
                                className="bg-transparent hover:bg-slate-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-white rounded-lg btn btn-sm"
                                onClick={buttonProcess}
                                disabled={isLoadingButton}
                            >
                                {isLoadingButton ? (
                                    <FaSpinner className="animate-spin mx-2" />
                                ) : (
                                    <>
                                        <Image src={iconos.guardar} alt="Guardar" className="w-5 h-5 md:w-6 md:h-6 block dark:hidden" />
                                        <Image src={iconos.guardar_w} alt="Guardar" className="w-5 h-5 md:w-6 md:h-6 hidden dark:block" />
                                    </>
                                )}
                                {isLoadingButton ? " Cargando..." : " Guardar"}
                            </button>
                        </div>
                        <button
                            type="button"
                            className="btn btn-sm btn-circle btn-ghost text-black dark:text-white"
                            onClick={() => document.getElementById(id_modal).close()}
                            disabled={isLoadingButton}
                        >
                            ✕
                        </button>
                    </div>
                </div>
                <fieldset id="fs_data" disabled={isLoadingButton === true}>
                    <div className="container flex flex-col space-y-5">
                        <div className="bottom-0 left-0 w-full flex justify-center mb-4">
                            <button
                                type="button"
                                onClick={openFileSelector}
                                className="ml-4 btn hover:bg-transparent border-none shadow-md bg-transparent hover:bg-slate-200 dark:hover:bg-neutral-700 text-black dark:text-white font-bold px-4 rounded"
                            >
                                Seleccionar Archivo
                            </button>
                        </div>
                        <input
                            type="file"
                            name="excel_file"
                            accept=".xlsx, xls"
                            onChange={handleFileChange}
                            ref={inputfileref}
                            style={{ display: "none" }}
                            className="ml-4 btn hover:bg-transparent border-none shadow-md bg-transparent hover:bg-slate-200 dark:hover:bg-neutral-700 text-black dark:text-white font-bold px-4 rounded"
                        />
                        <TablaProcesaDatos
                            session={session}
                            isLoading={isLoading}
                            datosFiltrados={dataJson}
                            itemHeaderTable={itemHeaderTable}
                            itemDataTable={itemDataTable}
                        />
                    </div>
                </fieldset>
            </div>
        </dialog>
    );
}

export default ModalProcesarDatos;