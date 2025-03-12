import iconos from '@/app/utils/iconos';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import Inputs from '@/app/cobranza_diaria/components/Inputs';


function ModalCobranzaDiaria({
    accion,
    currentID,
    onSubmit,
    register,
    errors,
    handleBlur,
    handleInputClick,
    obtenerCuenta,
    obtenerImporte
}) {
    const [titulo, setTitulo] = useState("");
    const [isDisabled, setIsDisabled] = useState(true);
    useEffect(() => {
        if (accion === "Eliminar" || accion === "Ver") {
            setIsDisabled(true);
        }
        if (accion === "Alta" || accion === "Editar") {
            setIsDisabled(false);
        }
        setTitulo(
            accion === "Alta"
                ? `Nuevo Cobranza`
                : accion === "Editar"
                    ? `Editar Cobranza: ${currentID}`
                    : accion === "Eliminar"
                        ? `Eliminar Cobranza: ${currentID}`
                        : `Ver Cobranza: ${currentID}`
        );
    }, [accion, currentID])
    return (
        <dialog id="my_modal_3" className="modal">
            <div className='modal-box bg-base-200'>
                <form onSubmit={onSubmit}>
                    <div className="sticky -top-6 flex justify-between items-center bg-base-200 dark:bg-[#191e24] w-full h-10 z-10 mb-5">
                        <h3 className="font-bold text-lg dark:text-white text-black">{titulo}</h3>
                        <div className='flex space-x-2 items-center'>
                            <div
                                className={`tooltip tooltip-bottom ${accion === "Ver"
                                    ? "hover:cursor-not-allowed hidden"
                                    : "hover:cursor-pointer"
                                    }`}
                                data-tip="Guardar"
                            >
                                <button
                                    type="submit"
                                    id="btn_guardar"
                                    className="bg-transparent hover:bg-slate-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-white rounded-lg btn btn-sm"
                                >
                                    <Image src={iconos.guardar} alt="Guardar" className="w-5 h-5 md:w-6 md:h-6 block dark:hidden" />
                                    <Image src={iconos.guardar_w} alt="Guardar" className="w-5 h-5 md:w-6 md:h-6 hidden dark:block" />
                                    <span className="hidden sm:inline">Guardar</span>
                                </button>
                            </div>
                            <button
                                type="button"
                                className="btn btn-sm btn-circle btn-ghost dark:text-white text-black"
                                onClick={() => document.getElementById("my_modal_3").close()}
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                    <fieldset id='fs_cobranza_diaria'>
                        <div className='container flex flex-col space-y-5'>
                            <div className='flex flex-row space-x-4'>
                                <Inputs
                                    dataType={"string"}
                                    name={"cue_banco"}
                                    tamañolabel={""}
                                    className={"grow"}
                                    Titulo={"Cuenta Banco: "}
                                    type={"text"}
                                    requerido={false}
                                    isNumero={false}
                                    errors={errors}
                                    register={register}
                                    message={"Cuenta Banco requerido"}
                                    maxLenght={20}
                                    isDisabled={isDisabled}
                                />
                                <button
                                    type="button"
                                    className="bg-transparent hover:bg-slate-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-white rounded-lg btn btn-sm"
                                    onClick={obtenerCuenta}
                                >
                                    Obtener Cuenta
                                </button>
                            </div>
                            <Inputs
                                dataType={"string"}
                                name={"referencia"}
                                tamañolabel={""}
                                className={"grow"}
                                Titulo={"Referencia: "}
                                type={"text"}
                                requerido={false}
                                isNumero={false}
                                errors={errors}
                                register={register}
                                message={"referencia requerido"}
                                maxLenght={20}
                                isDisabled={isDisabled}
                            />
                            <div className='flex flex-row space-x-4'>
                                <Inputs
                                    dataType={"float"}
                                    name={"importe"}
                                    tamañolabel={""}
                                    className={"grow text-right"}
                                    Titulo={"Importe: "}
                                    type={"text"}
                                    requerido={false}
                                    isNumero={false}
                                    errors={errors}
                                    register={register}
                                    message={"importe requerido"}
                                    maxLenght={20}
                                    isDisabled={isDisabled}
                                    handleBlur={handleBlur}
                                    onClick={handleInputClick}
                                />
                                <button
                                    type="button"
                                    className="bg-transparent hover:bg-slate-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-white rounded-lg btn btn-sm"
                                    onClick={obtenerImporte}
                                >
                                    Obtener Importe
                                </button>
                            </div>
                        </div>
                    </fieldset>
                </form>

            </div>
        </dialog>
    )
}

export default ModalCobranzaDiaria
