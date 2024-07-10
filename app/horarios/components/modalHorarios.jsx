"use client"
import React from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Textcomponent from './textComponent'
import Loading from '@/app/components/loading'

function ModalHorarios({
    accion,
    handleModal,
    id,
    guardarHorarios,
    horario,
    horarios,
    horariosFiltrados,
    setHorariosFiltrados,
    setHorarios,
    setisLoading,
    isLoading,
    bajas,
}) {
    const [error, setError] = useState(null);
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: {
            numero: horario.numero,
            cancha: horario.cancha,
            dia: horario.dia,
            horario: horario.horario,
            max_niños: horario.max_niños,
            sexo: horario.sexo,
            edad_ini: horario.edad_ini,
            edad_fin: horario.edad_fin,
        }
    })
    console.log(horario)
    const options = [
        { value: "LU", label: "Lunes" },
        { value: "MA", label: "Martes" },
        { value: "MI", label: "Miércoles" },
        { value: "JU", label: "Jueves" },
        { value: "VI", label: "Viernes" },
        { value: "SA", label: "Sábado" },
        { value: "DO", label: "Domingo" },
    ]
    const [selectedDias, setSelectedDias] = useState(
        (horario.dia ?? "").split("/")
    )
    const handleSelectChange = (selectedOptions) => {
        setSelectedDias(selectedOptions.map((option) => option.value).join("/"))
        console.log("s", selectedDias, "a", selectedOptions)
    }
    const onSubmit = handleSubmit(async (data) => {
        setisLoading(true)
        event.preventDefault()
        data.numero = id
        let res = null

        if (Array.isArray(selectedDias)) {
            data.dia = selectedDias.join("/")
        } else {
            data.dia = selectedDias
        }
        res = await guardarHorarios(data, accion)
        if (res.status) {
            if (accion === 'Alta') {
                const nuevoHorario = { id, ...data }
                setHorarios([...horarios, nuevoHorario])
                if (!bajas) {
                    setHorariosFiltrados([...horariosFiltrados, nuevoHorario])
                }
            }
            if (accion === 'Eliminar' || accion === 'Editar') {
                const index = horarios.findIndex(
                    (horario) => horario.numero === data.numero
                );
                const indexFiltrados = horariosFiltrados.findIndex(
                    (horario) => horario.numero === data.numero
                );
                if (index !== -1) {
                    if (accion === 'Eliminar') {
                        const horarioFiltrados = horarios.filter((p) => p.numero !== id);
                        setHorarios(horarioFiltrados)
                        setHorariosFiltrados(horarioFiltrados)
                    } else {
                        if (bajas) {
                            const matFiltrados = horarios.filter((p) => p.numero !== id);
                            setHorarios(matFiltrados);
                            setHorariosFiltrados(matFiltrados);
                        } else {
                            const horarioActualizados = horarios.map((p) =>
                                p.numero === id ? { ...p, ...data } : p
                            );
                            setHorarios(horarioActualizados);
                            setHorariosFiltrados(horarioActualizados)
                        }
                    }
                }
            }
            setisLoading(false)
            handleModal()
        }
    })
    return (
        <>
            <div className='fixed inset-0 bg-slate-900 bg-opacity-75 flex items-center justify-center z-10'>
                <div className='w-3/4 bg-slate-200 shadow-lg rounded-md overflow-y-scroll xl:overflow-y-hidden lg:overflow-y-hidden h-[75%] lg:h-auto'>
                    <div className='ssticky top-0 bg-slate-200'>
                        <h1 className='font-medium text-gray-900 border-b border-gray-300 py-3 px-4 mb-4 '>
                            {accion} Horario {id}
                        </h1>
                    </div>
                    <div className='px-4 pb-4'>
                        <form action="" encType="multipart/form-data" onSubmit={onSubmit}>
                            {error && (
                                <p className="bg-red-500 text-white text-xs p-3 rounded-md text-center">
                                    {error}
                                </p>
                            )}
                            {isLoading ? (
                                <div className='flex items-center justify-center p-10 w-full h-full'>
                                     <span class="loading loading-ring h-52 w-52"></span>
                                </div>
                            ) : (
                                <fieldset disabled={accion === 'Eliminar'}>
                                    <div className='flex flex-wrap -mx-3 mb-6'>
                                        <Textcomponent
                                            titulo={"Cancha"}
                                            name={"cancha"}
                                            message={"cancha requerido"}
                                            register={register}
                                            errors={errors}
                                            type={"number"}
                                            requerido={true}
                                        />
                                        <Textcomponent
                                            titulo={"Dias de la semana"}
                                            name={"dia"}
                                            message={"dia requerido"}
                                            register={register}
                                            errors={errors}
                                            requerido={true}
                                            type={"multi-select"}
                                            options={options}
                                            control={control}
                                            value={options.filter((option) =>
                                                selectedDias.includes(option.value)
                                            )}
                                            onChange={handleSelectChange}
                                        />
                                        <Textcomponent
                                            titulo={"Horario"}
                                            name={"horario"}
                                            message={"horario requerido"}
                                            register={register}
                                            errors={errors}
                                            type={"text"}
                                            requerido={true}
                                        />
                                        <Textcomponent
                                            titulo={"Maximo de Niños"}
                                            name={"max_niños"}
                                            message={"max_niños requerido"}
                                            register={register}
                                            errors={errors}
                                            type={"number"}
                                            requerido={true}
                                        />
                                        <Textcomponent
                                            titulo={"Sexo"}
                                            name={"sexo"}
                                            message={"sexo requerido"}
                                            register={register}
                                            errors={errors}
                                            requerido={true}
                                            type={"select"}
                                        />
                                        <Textcomponent
                                            titulo={"Edad ini"}
                                            name={"edad_ini"}
                                            message={"edad_ini requerido"}
                                            register={register}
                                            errors={errors}
                                            type={"number"}
                                            requerido={true}
                                        />
                                        <Textcomponent
                                            titulo={"Edad Fin"}
                                            name={"edad_fin"}
                                            message={"edad_fin requerido"}
                                            register={register}
                                            errors={errors}
                                            type={"number"}
                                            requerido={true}
                                        />
                                    </div>
                                </fieldset>
                            )}
                            <div className='border-t border-gray-300 flex justify-between items-center px-4 pt-2 mt-5'>
                                <button
                                    type="submit"
                                    className=" bg-green-800 text-white text-md h-8 px-3 rounded-md"
                                >
                                    Guardar
                                </button>
                                <button
                                    type="button"
                                    className="h-8 px-2 text-md rounded-md bg-red-700 text-white "
                                    onClick={handleModal}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        </>
    )
}

export default ModalHorarios
