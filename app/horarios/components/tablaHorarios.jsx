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
        <div className='overflow-x-auto mt-3  h-6/8 text-white  m-2 w-full  lg:w-5/8 '>
            {HorariosFiltrados.length > 0 ? (
                <table className='table table-xs table-zebra bg-[#1d232a] table-pin-rows table-pin-cols max-h-[calc(50%)]'>
                    <thead className='relative z-[1] md:static'>
                        <tr>
                            <th></th>
                            <th>Cancha</th>
                            <th>Dia</th>
                            <th>Horario</th>
                            <th>Max Niños</th>
                            <th>Sexo</th>
                            <th>Edad Ini</th>
                            <th>Edad Fin</th>
                            <th className='w-[calc(10%)]'>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {HorariosFiltrados.map((item) => (
                            <tr>
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
                                            className="kbd tooltip tooltip-left hover:cursor-pointer bg-blue-500 hover:bg-blue-700 text-white"
                                            data-tip={`Ver ${item.numero}`}
                                            onClick={(evt) => tableAction(evt, item, `Ver`)}
                                        >
                                            <i className="fa-solid fa-eye"></i>
                                        </div>
                                        <div
                                            className="kbd tooltip tooltip-left hover:cursor-pointer bg-blue-500 hover:bg-blue-700 text-white"
                                            data-tip={`Editar ${item.numero}`}
                                            onClick={(evt) => tableAction(evt, item, `Editar`)}
                                        >
                                            <i className="fa-solid fa-file"></i>
                                        </div>
                                        <div
                                            className="kbd tooltip tooltip-left hover:cursor-pointer bg-blue-500 hover:bg-blue-700 text-white"
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
                    <tfoot>
                        <tr>
                            <th></th>
                            <th>Cancha</th>
                            <th>Dia</th>
                            <th>Horario</th>
                            <th>Max Niños</th>
                            <th>Sexo</th>
                            <th>Edad Ini</th>
                            <th>Edad Fin</th>
                            <th>Acciones</th>
                        </tr>
                    </tfoot>
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
