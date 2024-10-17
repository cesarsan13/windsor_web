import iconos from '@/app/utils/iconos';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import Inputs from './Inputs';
import { getUltimaSecuencia } from '@/app/utils/api/actividades/actividades';

function ModalActividades({
    accion,
    onSubmit,
    currentID,
    register,
    errors,
    setActividades,
    actividades,
    control,
    watch,
    setValue,
    session,
}) {
    const [error, setError] = useState(null);
    const [titulo, setTitulo] = useState("");
    const [isDisabled, setIsDisabled] = useState(true);
    const materia = watch("materia")
    useEffect(() => {
        const fetchSecuencia = async (materia) => {
            const { token } = session.user
            const secuencia = await getUltimaSecuencia(token, materia)
            setValue("secuencia", secuencia.data)
        }
        if (materia && accion==="Alta") {
            fetchSecuencia(materia)
        } else{
            setValue("secuencia","")
        }
    }, [materia])
    useEffect(() => {
        if (accion === "Eliminar" || accion === "Ver") {
            setIsDisabled(true);            
        }
        if (accion === "Alta" || accion === "Editar") {            
            setIsDisabled(false);
        }
        setTitulo(
            accion === "Alta"
                ? `Nuevo Actividad: ${currentID}`
                : accion === "Editar"
                    ? `Editar Actividad: ${currentID}`
                    : accion === "Eliminar"
                        ? `Eliminar Actividad: ${currentID}`
                        : `Ver Actividad: ${currentID}`
        );
    }, [accion])    
    return (
        <dialog className='modal' id='my_modal_3'>
            <div className='modal-box'>
                <form onSubmit={onSubmit}>
                    <div className='sticky -top-6 flex justify-between items-center bg-white dark:bg-[#1d232a] w-full h-10 z-10 mb-5'>
                        <h3 className='font-bold text-lg'>{titulo}</h3>
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
                                        src={iconos.guardar}
                                        alt="Guardar"
                                        className="w-5 h-5 md:w-6 md:h-6 mr-1"
                                    />
                                    <span className="hidden sm:inline">Guardar</span>
                                </button>
                            </div>
                            <button
                                className="btn btn-sm btn-circle btn-ghost"
                                onClick={(event) => {
                                    event.preventDefault();
                                    document.getElementById("my_modal_3").close();
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                    <fieldset id='fs_actividad'>
                        <div className='container flex flex-col space-y-5'>
                            <Inputs
                                dataType={"int"}
                                name={"materia"}
                                tamañolabel={"w-3/6"}
                                className={"w-3/6 text-right"}
                                Titulo={"Materia: "}
                                type={"text"}
                                requerido={true}
                                errors={errors}
                                register={register}
                                message={"materiaRequerido"}
                                isDisabled={isDisabled}
                            />
                            <Inputs
                                dataType={"int"}
                                name={"secuencia"}
                                tamañolabel={"w-3/6"}
                                className={"w-3/6 text-right"}
                                Titulo={"Secuencia: "}
                                requerido={true}
                                errors={errors}
                                register={register}
                                message={"secuenciaRequerido"}
                                isDisabled={true}
                            />
                            <Inputs
                                dataType={"string"}
                                name={"descripcion"}
                                tamañolabel={"w-5/6"}
                                Titulo={"Descripcion"}
                                type={"text"}
                                requerido={true}
                                register={register}
                                isDisabled={isDisabled}
                                message={"Descripcion requerido"}
                                maxLenght={30}
                                errors={errors}
                            />
                            <Inputs
                                dataType={"int"}
                                name={"EB1"}
                                tamañolabel={"w-3/6"}
                                className={"w-3/6 text-right"}
                                Titulo={"EB1: "}
                                requerido={true}
                                errors={errors}
                                register={register}
                                message={"EB1 Requerido"}
                                isDisabled={isDisabled}
                            />
                            <Inputs
                                dataType={"int"}
                                name={"EB2"}
                                tamañolabel={"w-3/6"}
                                className={"w-3/6 text-right"}
                                Titulo={"EB2: "}
                                requerido={true}
                                errors={errors}
                                register={register}
                                message={"EB2 Requerido"}
                                isDisabled={isDisabled}
                            />
                            <Inputs
                                dataType={"int"}
                                name={"EB3"}
                                tamañolabel={"w-3/6"}
                                className={"w-3/6 text-right"}
                                Titulo={"EB3: "}
                                requerido={true}
                                errors={errors}
                                register={register}
                                message={"EB3 Requerido"}
                                isDisabled={isDisabled}
                            />
                            <Inputs
                                dataType={"int"}
                                name={"EB4"}
                                tamañolabel={"w-3/6"}
                                className={"w-3/6 text-right"}
                                Titulo={"EB4: "}
                                requerido={true}
                                errors={errors}
                                register={register}
                                message={"EB4 Requerido"}
                                isDisabled={isDisabled}
                            />
                            <Inputs
                                dataType={"int"}
                                name={"EB5"}
                                tamañolabel={"w-3/6"}
                                className={"w-3/6 text-right"}
                                Titulo={"EB5: "}
                                requerido={true}
                                errors={errors}
                                register={register}
                                message={"EB5 Requerido"}
                                isDisabled={isDisabled}
                            />
                        </div>
                    </fieldset>
                </form>
            </div>
        </dialog>
    )
}

export default ModalActividades