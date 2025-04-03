"use client";
import React, { useEffect, useState } from "react";
import Inputs from "@/app/pagos1/components/Inputs";
import Image from "next/image";
import iconos from "@/app/utils/iconos";

function ModalRecargos({
    register,
    errors,
    handleModalClick,
    dRecargo,
    PRecargo,
    btnRecargo,
    handleBlur,
    handleKeyDown,
    setPrecargo
}) {
    const Guardar = (evt) => {
        handleModalClick(evt);
        btnRecargo(evt);
    };
    return (
        <dialog id="modal_recargos" className="modal">
            <div className="modal-box w-full md:w-3/4 max-w-3xl h-auto bg-base-200">
                <div className="sticky -top-6 flex justify-between items-center bg-base-200 w-full h-10 z-10 mb-5">
                    <h3 className="font-bold text-lg  text-neutral-600 dark:text-white">Añadir un Nuevo Recargo</h3>
                    <div className="flex space-x-2 items-center">
                        <div data-tip="Guardar">
                            <button
                                onClick={(evt) => Guardar(evt)}
                                id="btn_guardar"
                                className="bg-transparent hover:bg-slate-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-white rounded-lg btn btn-sm "
                            >
                                <Image
                                    src={iconos.guardar_w}
                                    alt="Guardar"
                                    className="w-5 h-5 md:w-6 md:h-6 mr-1 hidden dark:block"
                                />
                                <Image
                                    src={iconos.guardar}
                                    alt="Guardar"
                                    className="w-5 h-5 md:w-6 md:h-6 mr-1 block dark:hidden"
                                />
                                <span className="hidden sm:inline">Guardar</span>
                            </button>
                        </div>
                        <button
                            className="btn btn-sm btn-circle btn-ghost bg-base-200 dark:bg-[#1d232a] text-neutral-600 dark:text-white"
                            onClick={(event) => {
                                event.preventDefault();
                                document.getElementById("modal_recargos").close();
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
                                <div className="flex flex-row">
                                    <Inputs
                                        tipoInput={"disabledInput"}
                                        name={"R_Articulo"}
                                        tamañolabel={""}
                                        className={""}
                                        Titulo={"Articulo: "}
                                        type={"text"}
                                        requerido={false}
                                        register={register}
                                        errors={errors}
                                        maxLength={10}
                                        isDisabled={true}
                                        valueInput={"9999"}
                                    />
                                    <div className="pl-5">
                                        <Inputs
                                            tipoInput={"disabledInput"}
                                            name={"D_Recargo"}
                                            tamañolabel={""}
                                            className={""}
                                            Titulo={"Articulo: "}
                                            type={"text"}
                                            requerido={false}
                                            register={register}
                                            errors={errors}
                                            maxLength={10}
                                            isDisabled={true}
                                            valueInput={dRecargo}
                                        />
                                    </div>
                                    <div className="pl-5">
                                        <Inputs
                                            tipoInput={"disabledInputRecargo"}
                                            dataType={"float"}
                                            name={"recargo"}
                                            tamañolabel={""}
                                            className={"w-[100%] text-right"}
                                            Titulo={" "}
                                            type={"text"}
                                            requerido={false}
                                            register={register}
                                            errors={errors}
                                            maxLength={8}
                                            isDisabled={false}
                                            valueInput={PRecargo}
                                            onChange={(e) => setPrecargo(e.target.value)}
                                            //eventInput={handleBlur}
                                            //handleKeyDown={handleKeyDown}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="pb-3"></div>
                    </div>
                </fieldset>
            </div>
        </dialog>
    );
}

export default ModalRecargos;
