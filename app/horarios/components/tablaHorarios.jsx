"use client"
import React from 'react';
import Loading from "@/app/components/loading";
import NoData from "@/app/components/noData";

function TablaHorarios({
    HorariosFiltrados,
    isLoading,
    showModal,
    setHorario,
    setAccion,
    setCurrentId,
}) {    
    const tableAction = (evt, horario, accion) => {
        setHorario(horario)
        setAccion(accion)        
        setCurrentId(horario.numero)
        showModal(true)
    }
    return !isLoading ? (
        <div className='overflow-x-auto mt-3 h-[calc(75vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white m-2 w-full lg:w-3/4'>
            {HorariosFiltrados.length > 0 ? (
                <table className='table table-xs table-zebra w-full'>
                    <thead className='sticky top-0 bg-white dark:bg-[#1d232a] '>
                        <tr>
                            <th></th>
                            <th className="w-[5%]">Cancha</th>
                            <th className="w-[45%]">Dia</th>
                            <th className="w-[15%]">Horario</th>
                            <th className="w-[10%]">Max Niños</th>
                            <th className="w-[5%]">Sexo</th>
                            <th className="w-[5%]">Edad Ini</th>
                            <th className="w-[5%]">Edad Fin</th>
                            <th className='w-[calc(10%)]'>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {HorariosFiltrados.map((item) => (
                            <tr key={item.numero}>
                                <th className={
                                    typeof item.numero === "number"
                                        ? "text-right"
                                        : "text-left"
                                }>{item.numero}</th>
                                <td className={typeof item.numero === "number"
                                    ? "text-right"
                                    : "text-left"}>{item.cancha}</td>
                                <td>{item.dia}</td>
                                <td>{item.horario}</td>
                                <td>{item.max_niños}</td>
                                <td>{item.sexo}</td>
                                <td>{item.edad_ini}</td>
                                <td>{item.edad_fin}</td>
                                <th>
                                    <div className="flex flex-row space-x-3">
                                        <div
                                            className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white"
                                            data-tip={`Ver ${item.numero}`}
                                            onClick={(evt) => tableAction(evt, item, `Ver`)}
                                        >
                                            <i className="fa-solid fa-eye"></i>
                                        </div>
                                        <div
                                            className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white"
                                            data-tip={`Editar ${item.numero}`}
                                            onClick={(evt) => tableAction(evt, item, `Editar`)}
                                        >
                                            <i className="fa-solid fa-file"></i>
                                        </div>
                                        <div
                                            className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white"
                                            data-tip={`Eliminar  ${item.numero}`}
                                            onClick={(evt) => tableAction(evt, item, "Eliminar")}
                                        >
                                            <i className="fa-solid fa-trash"></i>
                                        </div>
                                    </div>
                                </th>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot/>
                </table>
            ) : (
                <NoData />
            )}
        </div>
    ) : (
        <Loading></Loading>
    )
}

export default TablaHorarios
