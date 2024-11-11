"use client";
import React from "react";
import Inputs from "@/app/pagos1/components/Inputs";
import BuscarCat from "@/app/components/BuscarCat";
import Image from "next/image";
import iconos from "@/app/utils/iconos";
function ModalParciales({
    session,
    register,
    errors,
    handleModalClick,
    setProductos1,
    accionB,
    btnParciales,
}) {
    const nameInputs3 = ["numero_producto", "descripcion"];
    const columnasBuscaCat3 = ["numero", "descripcion"];
    const Guardar = (evt) => {
        handleModalClick(evt);
        btnParciales(evt);
    };
    return (
        <dialog id="modal_parciales" className="modal">
            <div className="modal-box w-full md:w-3/4 max-w-2xl h-auto bg-base-200">
                <div className="sticky -top-6 flex justify-between items-center bg-base-200 dark:bg-[#1d232a] w-full h-10 z-10 mb-5">
                    <h3 className="font-bold text-lg text-neutral-600 dark:text-white">Añadir un Nuevo Parcial</h3>
                    <div className="flex space-x-2 items-center">
                        <div data-tip="Guardar">
                            <button
                                onClick={(evt) => Guardar(evt)}
                                id="btn_guardar"
                                className="bg-transparent hover:bg-slate-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-white rounded-lg btn btn-sm "
                            >
                                <Image
                                    src={iconos.guardar}
                                    alt="Guardar"
                                    className="w-5 h-5 md:w-6 md:h-6 mr-1"
                                />
                                <span className="hidden sm:inline">Guardar</span>
                            </button>
                        </div>
                        <button
                            className="btn btn-sm btn-circle btn-ghost bg-base-200 dark:bg-[#1d232a] text-neutral-600 dark:text-white"
                            onClick={(event) => {
                                event.preventDefault();
                                document.getElementById("modal_parciales").close();
                            }}
                        >
                            ✕
                        </button>
                    </div>
                </div>
                <fieldset id="fs_pagoimprime">
                    <div className="container flex flex-col ">
                        <div className="grid grid-flow-row gap-3">
                            <div className="w-full">
                                <div className="flex flex-row ">
                                    <Inputs
                                        tipoInput={""}
                                        dataType={"double"}
                                        name={"monto_parcial"}
                                        tamañolabel={""}
                                        className={"rounded block grow text-right"}
                                        Titulo={"Monto Parcial: "}
                                        type={"text"}
                                        requerido={false}
                                        register={register}
                                        errors={errors}
                                        maxLength={8}
                                        isDisabled={false}
                                    />
                                    <div className="pl-5">
                                        <Inputs
                                            tipoInput={""}
                                            dataType={"string"}
                                            name={"clave_acceso"}
                                            tamañolabel={""}
                                            className={"rounded block grow text-right"}
                                            Titulo={"Acceso: "}
                                            type={"password"}
                                            requerido={false}
                                            register={register}
                                            errors={errors}
                                            maxLength={15}
                                            isDisabled={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="pb-3"></div>
                    </div>
                </fieldset >
            </div >
        </dialog >
    );
}

export default ModalParciales;
