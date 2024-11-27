import Loading from '@/app/components/loading'
import NoData from '@/app/components/NoData'
import iconos from '@/app/utils/iconos'
import Image from 'next/image'
import React from 'react'

function TablaAccesosUsuario({
    accesosUsuarioFiltrados,
    isLoading,
    tableAction
}) {
    return !isLoading ? (
        <>
            <div className='overflow-y-auto mt-3 h-[calc(55vh)] md:h-[calc(65vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white  w-full lg:w-full'>
                {accesosUsuarioFiltrados.length > 0 ? (
                    <table className='table table-xs table-zebra w-full'>
                        <thead className='sticky top-0 bg-white dark:bg-[#1d232a] z-[2]'>
                            <tr>
                                <th className='sm:w-[5%] pt-[.5rem] pb-[.5rem]'>punto menu</th>
                                <th className='sm:w-[35%]'>T A</th>
                                <th className='w-[20%]'>Altas</th>
                                <th className='w-[20%]'>Bajas</th>
                                <th className='w-[20%]'>Cambios</th>
                                <th className='w-[20%]'>Impresion</th>
                                <th className='w-[5%] pt-[.10rem] pb-[.10rem]'>Editar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accesosUsuarioFiltrados.map((item) => (
                                <tr key={item.id_punto_menu} className="hover:cursor-pointer">
                                    <th>{item.descripcion}</th>
                                    <th>{item.t_a === 1 || item.t_a === '1' ? "Si" : "No"}</th>
                                    <th>{item.altas === 1 || item.altas === '1' ? "Si" : "No"}</th>
                                    <th>{item.bajas === 1 || item.bajas === '1' ? "Si" : "No"}</th>
                                    <th>{item.cambios === 1 || item.cambios === '1' ? "Si" : "No"}</th>
                                    <th>{item.impresion === 1 || item.impresion === '1' ? "Si" : "No"}</th>
                                    <th className="w-[5%] pt-[.10rem] pb-[.10rem]">
                                        <div
                                            className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem] content-center"
                                            data-tip={`Editar`}
                                            onClick={(evt) => tableAction(evt, item, `Editar`)}
                                        >
                                            <Image src={iconos.editar} alt="Editar" />
                                        </div>
                                    </th>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <NoData />
                )}
            </div>
        </>
    ) : (
        <Loading></Loading>
    )
}

export default TablaAccesosUsuario
