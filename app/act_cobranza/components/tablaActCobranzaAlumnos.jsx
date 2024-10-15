"use client"
import Loading from '@/app/components/loading'
import NoData from '@/app/components/nodata'
import iconos from '@/app/utils/iconos'
import Image from 'next/image'
import React from 'react'

function tablaActCobranzaAlumnos({    
    alumnosFiltrados,
    isLoading,    
    setAlumno,
    setAccion,
    documentosAlumno, 
    setCurrentId   
}) {
    const tableAction = (evt,alumno)=>{
        setAlumno(alumno)        
        documentosAlumno(alumno.numero)
        setCurrentId(alumno.numero)      
    }
    return !isLoading ? (
        <div className='overflow-y-auto mt-3 h-[calc(55vh)] md:h-[calc(65vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white  w-full lg:w-full'>
            {alumnosFiltrados.length > 0 ? (
                <table className='table table-xs table-zebra w-full'>
                    <thead className="sticky top-0 bg-white dark:bg-[#1d232a] z-[2]">
                        <tr>
                            <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</td>
                            <td className="w-[40%] pt-[.10rem] pb-[.10rem]">Nombre</td>
                            <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Ver</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alumnosFiltrados.map((item) => (
                            <tr key={item.numero} className="hover:cursor-pointer">
                                <th
                                    className={
                                        typeof item.comision === "number"
                                            ? "text-left"
                                            : "text-right"
                                    }
                                >
                                    {item.numero}
                                </th>
                                <td className="w-[40%] max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap pt-[.10rem] pb-[.10rem]">
                                    {`${item.a_nombre} ${item.a_paterno} ${item.a_materno}`}
                                </td>
                                <th className='w-[5%] pt-[.10rem] pb-[.10rem]'>
                                    <div
                                        data-tip={`Ver`}
                                        onClick={(evt) => tableAction(evt, item)}
                                        className='kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem] content-center'>
                                        <Image src={iconos.ver} alt="Editar" />
                                    </div>
                                </th>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (<NoData />)}
        </div>
    ) : (<Loading></Loading>)
}

export default tablaActCobranzaAlumnos
