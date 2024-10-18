import BuscarCat from '@/app/components/BuscarCat'
import { soloDecimales, soloEnteros } from '@/app/utils/globalfn'
import React from 'react'

function Busqueda({
    setItem1,
    item1,
    setItem2,
    item2,
    session,
    handleBusquedaChange
}) {
    const ciclos = []
    for (let Tw_Ciclo = 2050; Tw_Ciclo >= 1970; Tw_Ciclo--) {
        ciclos.push(`${Tw_Ciclo} - ${Tw_Ciclo + 1}`);
    }
    const currentYear = new Date().getFullYear();
    return (
        <div className='flex flex-col space-y-4'>
            <div className='w-full flex flex-col md:flex-row gap-2 flex-wrap'>
                <label className='input input-bordered input-sm md:input-md flex items-center gap-3 w-full md:w-1/6 text-black dark:text-white'>
                    Bimestre
                    <input
                        type="text"
                        name="bimestre"
                        id="bimestre"
                        className='text-black dark:text-white border-b-2 border-slate-300 w-full md:w-2/6 dark:border-slate-700 input-xs md:input-sm'
                        onKeyDown={soloEnteros}
                        onChange={(event)=> handleBusquedaChange(event)}
                        maxLength={1}
                    />
                </label>
                <div className='flex flex-col md:flex-row gap-4 w-full md:w-auto'>
                    {/* Fila de botones de radio */}
                    <div className='flex flex-wrap gap-4 items-center'>
                        <label className="flex items-center gap-2">
                            <span className="text-black dark:text-white">Asig. Español</span>
                            <input
                                type="radio"
                                name="ordenar"
                                value="espanol"
                                className="radio checked:bg-blue-500"
                            />
                        </label>

                        <label className="flex items-center gap-2">
                            <span className="text-black dark:text-white">Asig. Inglés</span>
                            <input
                                type="radio"
                                name="ordenar"
                                value="ingles"
                                className="radio checked:bg-blue-500"
                            />
                        </label>

                        <label className="flex items-center gap-2">
                            <span className="text-black dark:text-white">Ambos</span>
                            <input
                                type="radio"
                                name="ordenar"
                                value="ambos"
                                className="radio checked:bg-blue-500"
                            />
                        </label>
                    </div>

                    {/* Fila de checkboxes */}
                    <div className='flex flex-wrap gap-4 items-center'>
                        <label className="flex items-center gap-2">
                            <input
                                id="ch_promedio"
                                type="checkbox"
                                className="checkbox checkbox-md"
                            />
                            <span className="label-text font-bold text-neutral-600 dark:text-neutral-200">
                                Imprime promedio
                            </span>
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                id="ch_letra"
                                type="checkbox"
                                className="checkbox checkbox-md"
                            />
                            <span className="label-text font-bold text-neutral-600 dark:text-neutral-200">
                                Calificación en letra
                            </span>
                        </label>
                    </div>
                </div>
            </div>

            <div className='flex flex-col md:flex-row gap-2 flex-wrap'>
                <BuscarCat
                    table="horarios"
                    itemData={[]}
                    fieldsToShow={["numero", "horario"]}
                    nameInput={["numero", "horario"]}
                    titulo={"Asignatura: "}
                    setItem={setItem1}
                    token={session.user.token}
                    modalId="modal_horario1"
                    alignRight={"text-right"}
                    inputWidths={{ contdef: "180px", first: "70px", second: "150px" }}
                />
                <BuscarCat
                    nameInput={["numero", "nombre"]}
                    fieldsToShow={["numero", "nombre"]}
                    titulo={"alumnos"}
                    modalId={"modal_alumno"}
                    table={"alumnogrupo"}
                    setItem={setItem2}
                    idBusqueda={item1.numero}
                    token={session.user.token}
                />
            </div>

            <div className='flex flex-col md:flex-row gap-2 flex-wrap'>
                <label className='input input-bordered input-sm md:input-md flex items-center gap-3 w-full md:w-3/12 text-black dark:text-white'>
                    Ciclo
                    <select
                        name="ciclo"
                        id="ciclo"
                        className='text-black dark:text-white bg-transparent p-1.5 grow bg-[#ffffff]'
                        defaultValue={`${currentYear} - ${currentYear + 1}`}
                    >
                        {ciclos.map(ciclo => (
                            <option className="bg-transparent text-black dark:text-white dark:bg-[#1d232a]" key={ciclo} value={ciclo}>
                                {ciclo}
                            </option>
                        ))}
                    </select>
                </label>
                <label className='input input-bordered input-sm md:input-md flex items-center gap-3 w-full md:w-1/6 text-black dark:text-white'>
                    Prom. Gral
                    <input
                        type="text"
                        name="bimestre"
                        id="bimestre"
                        className='text-black dark:text-white border-b-2 border-slate-300 w-full dark:border-slate-700 input-xs md:input-sm'
                        onKeyDown={soloDecimales}
                        maxLength={10}
                        readOnly={true}
                    />
                </label>
            </div>
        </div>

    )
}

export default Busqueda
