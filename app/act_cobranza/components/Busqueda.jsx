import BuscarCat from '@/app/components/BuscarCat';
import { soloEnteros } from '@/app/utils/globalfn';
import iconos from '@/app/utils/iconos';
import Image from 'next/image';
import React from 'react'

function Busqueda({
    limpiarBusqueda,
    Buscar,
    handleBusquedaChange,
    busqueda,
    session,
    setAlumno
}) {
    const handleKeyDown = (evt) => {
        if (evt.key !== "Enter") return;
        Buscar();
    };
    return (
        <div className='grid grid-cols-4 md:grid-cols-12 gap-2'>
            <div className='col-span-6'>
                <BuscarCat
                    nameInput={["numero", "nombre"]}
                    fieldsToShow={["numero", "nombre"]}
                    table={"alumnos"}
                    titulo={"Alumnos"}
                    token={session.user.token}
                    modalId={"modal_alumnos"}
                    setItem={setAlumno}
                />
            </div>
            <div className='col-span-1 md:col-span-1/2'>
                <input
                    id="tb_id"
                    className="input input-bordered input-sm md:input-md w-full sm:w-full dark:bg-[#191e24] dark:text-neutral-200 text-neutral-600 text-right"
                    placeholder="Núm..."
                    onChange={(event) => handleBusquedaChange(event)}
                    onKeyDown={(evt) => {
                        soloEnteros(evt);
                        handleKeyDown(evt);
                    }}
                    value={busqueda.tb_id}
                />
            </div>
            <div className="col-span-3 md:col-span-4">
                <input
                    id="tb_desc"
                    className="input input-bordered input-sm md:input-md join-item w-full max-w-lg dark:bg-[#191e24] dark:text-neutral-200 text-neutral-600"
                    placeholder="Descripcion..."
                    onChange={(event) => handleBusquedaChange(event)}
                    onKeyDown={(evt) => handleKeyDown(evt)}
                    value={busqueda.tb_desc}
                />
            </div>
            <div className="col-span-1 md:col-span-1">
                <div className=" tooltip" data-tip="Limpiar">
                    <button
                        className=" join-item  dark:text-neutral-200 text-neutral-600 border-none shadow-none w-5 h-5 md:w-6 md:h-6 mt-4 "
                        onClick={(evt) => limpiarBusqueda(evt)}
                    >
                        <Image src={iconos.limpiar} alt="Limpiar" className='block dark:hidden' />
                        <Image src={iconos.limpiar_w} alt="Limpiar" className='hidden dark:block' />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Busqueda
