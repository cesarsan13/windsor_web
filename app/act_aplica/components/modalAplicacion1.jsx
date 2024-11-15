import iconos from '@/app/utils/iconos';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import Inputs from './Inputs';

function ModalAplicacion1({
    accion,
    currentID,
    onSubmit,
    register,
    errors,
    handleBlur,
    handleInputClick,
}) {
    const [titulo, setTitulo] = useState("");
    const [isDisabled, setIsDisabled] = useState(true);
    useEffect(() => {
        if (accion === "Eliminar" || accion === "Ver") {
            setIsDisabled(true);
            // accion === "Ver" &&
            //   document.getElementById("btn_guardar").setAttribute("disabled", true);
        }
        if (accion === "Alta" || accion === "Editar") {
            // alert(accion);
            setIsDisabled(false);
        }
        setTitulo(
            accion === "Alta"
                ? `Nueva Aplicacion`
                : accion === "Editar"
                    ? `Editar Aplicacion: ${currentID}`
                    : accion === "Eliminar"
                        ? `Eliminar Aplicacion: ${currentID}`
                        : `Ver Aplicacion: ${currentID}`
        );
    }, [accion, currentID])

    return (
        <dialog id="my_modal_3" className="modal">
            <div className='modal-box bg-base-200'>
                <form onSubmit={onSubmit}>
                    <div className='sticky -top-6 flex justify-between items-center bg-base-200 dark:bg-[#1d232a] w-full h-10 z-10 mb-5'>
                        <h3 className='font-bold text-lg dark:text-white text-black'>{titulo}</h3>
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
                    <fieldset id='fs_Aplicacion_1'>
                        <div className='container flex flex-col space-y-5'>
                            <Inputs
                                dataType={"string"}
                                name={"numero"}
                                tamañolabel={""}
                                className={"grow"}
                                Titulo={"Numero: "}
                                type={"text"}
                                requerido={false}
                                isNumero={false}
                                errors={errors}
                                register={register}
                                message={"numero requerido"}
                                maxLenght={20}
                                isDisabled={true}
                            />
                            <Inputs
                                dataType={"string"}
                                name={"numero_cuenta"}
                                tamañolabel={""}
                                className={"grow"}
                                Titulo={"cuenta: "}
                                type={"text"}
                                requerido={false}
                                isNumero={false}
                                errors={errors}
                                register={register}
                                message={"numero cuenta requerido"}
                                maxLenght={35}
                                isDisabled={isDisabled}
                            />
                            <Inputs
                                dataType={"string"}
                                name={"cargo_abono"}
                                tamañolabel={""}
                                className={"fyo8m-select p-1.5 grow bg-[#ffffff] "}
                                Titulo={"Cargo Abono: "}
                                type={"select"}
                                requerido={true}
                                isNumero={false}
                                errors={errors}
                                register={register}
                                message={"cargo_abono requerido"}
                                maxLenght={25}
                                isDisabled={isDisabled}
                                handleBlur={handleBlur}
                                arreglos={[
                                    { id: "A", descripcion: "Abono" },
                                    { id: "C", descripcion: "Cargo" },
                                ]}
                            />
                            <Inputs
                                dataType={"float"}
                                name={"importe_movimiento"}
                                tamañolabel={""}
                                className={"grow"}
                                Titulo={"Importe: "}
                                type={"text"}
                                requerido={false}
                                isNumero={false}
                                errors={errors}
                                register={register}
                                message={"referencia requerido"}
                                maxLenght={11}
                                isDisabled={isDisabled}
                                handleBlur={handleBlur}
                                onClick={handleInputClick}
                            />
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
                                maxLenght={11}
                                isDisabled={isDisabled}
                            />
                            <Inputs
                                dataType={"string"}
                                name={"fecha_referencia"}
                                tamañolabel={"w-3/6"}
                                className={"rounded block grow"}
                                Titulo={"Fecha: "}
                                type={"date"}
                                maxLenght={15}
                                errors={errors}
                                register={register}
                                message={"Fecha Requerido"}
                                isDisabled={isDisabled}
                            />
                        </div>
                    </fieldset>
                </form>
            </div>
        </dialog>
    )
}

export default ModalAplicacion1
