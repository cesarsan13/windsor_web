import iconos from '@/app/utils/iconos';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import Inputs from './Inputs';

function ModalAccesosUsuarios({
    accion,
    onSubmit,
    session,
    accesoUsuario,
    errors,
    register,

}) {
    const [titulo, setTitulo] = useState("");
    const [isDisabled, setIsDisabled] = useState(true);
    useEffect(() => {
        if (accion === "Eliminar" || accion === "ver") {
            setIsDisabled(true)
        }
        if (accion === "Alta" || accion === "Editar") {
            setIsDisabled(false)
        }
        setTitulo(
            accion === "Alta"
                ? `Nueva Accesos Usuarios`
                : accion === "Editar"
                    ? `Editar Accesos Usuarios`
                    : accion === "Eliminar"
                        ? `Eliminar Accesos Usuarios`
                        : `Ver Accesos Usuarios`
        );
    }, [accion])
    return (
        <dialog className='modal' id='my_modal_3'>
            <div className='modal-box bg-base-200'>
                <form onSubmit={onSubmit}>
                    <div className='sticky -top-6 flex justify-between items-center bg-base-200 w-full h-10 z-10 mb-5'>
                        <h3 className='font-bold text-lg text-neutral-600 dark:text-white'>{titulo}</h3>
                        <div className='flex space-x-2 items-center'>
                            <div className={`tooltip tooltip-bottom ${accion === "Ver"
                                ? "hover:cursor-not-allowed hidden"
                                : "hover:cursor-pointer"
                                }`} data-tip="Guardar">
                                <button
                                    type="submit"
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
                                className="btn btn-sm btn-circle btn-ghost text-neutral-600 dark:text-white"
                                onClick={(event) => {
                                    event.preventDefault();
                                    document.getElementById("my_modal_3").close();
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                    <fieldset id='fs_accesosusuario'>
                        <div className='container flex flex-col space-y-5'>
                            <Inputs
                            Titulo={"Tiene Acceso"}
                            register={register}
                            errors={errors}
                            message={"T_A Requerido"}
                            name={"t_a"}
                            requerido={true}
                            tamañolabel={"w-full"}
                            className={"md:w-1/3 w-3/6"}
                            arreglos={[
                                {id:1,descripcion:"Si"},{id:0,descripcion:"No"}
                            ]}
                            />
                            <Inputs
                            Titulo={"Altas"}
                            register={register}
                            errors={errors}
                            message={"Altas Requerido"}
                            name={"altas"}
                            requerido={true}
                            className={"md:w-1/3 w-3/6"}
                            arreglos={[
                                {id:1,descripcion:"Si"},{id:0,descripcion:"No"}
                            ]}
                            />
                            <Inputs
                            Titulo={"Bajas"}
                            register={register}
                            errors={errors}
                            message={"Baja Requerido"}
                            name={"bajas"}
                            requerido={true}
                            className={"md:w-1/3 w-3/6"}
                            arreglos={[
                                {id:1,descripcion:"Si"},{id:0,descripcion:"No"}
                            ]}
                            />
                            <Inputs
                            Titulo={"Cambios"}
                            register={register}
                            errors={errors}
                            message={"Cambios Requerido"}
                            name={"cambios"}
                            requerido={true}
                            className={"md:w-1/3 w-3/6"}
                            arreglos={[
                                {id:1,descripcion:"Si"},{id:0,descripcion:"No"}
                            ]}
                            />
                            <Inputs
                            Titulo={"Impresion"}
                            register={register}
                            errors={errors}
                            message={"Impresion Requerido"}
                            name={"impresion"}
                            requerido={true}
                            className={"md:w-1/3 w-3/6"}
                            arreglos={[
                                {id:1,descripcion:"Si"},{id:0,descripcion:"No"}
                            ]}
                            />
                        </div>
                    </fieldset>
                </form>
            </div>
        </dialog>
    )
}

export default ModalAccesosUsuarios
