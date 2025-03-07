import Loading from '@/app/components/loading'
import NoData from '@/app/components/NoData'
import { formatNumber } from '@/app/utils/globalfn'
import iconos from '@/app/utils/iconos'
import Image from 'next/image'
import React from 'react'

function TablaAplicacion1({
    aplicaciones,
    isLoading,
    showModal,
    setAplicacion,
    setCurrentID,
    setAccion
}) {
    const tableAction = (evt, aplicacion, accion) => {
        setAplicacion(aplicacion)
        setAccion(accion)
        setCurrentID(aplicacion.numero)
        showModal(true)
    }
    return !isLoading ? (
        <div className='overflow-y-auto mt-3 h-[calc(55vh)] md:h-[calc(65vh)] text-black bg-base-200 dark:bg-[#1d232a] dark:text-white w-full lg:w-full'>
            {aplicaciones.length > 0 ? (
                <table className='table table-xs table-zebra w-full'>
                    <thead className='sticky top-0 bg-base-200 dark:bg-[#1d232a] z-[2]'>
                        <tr>
                            <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Sec.</td>
                            <td className="w-[10%]">Cuenta</td>
                            <td className="w-[10%]">Cargo</td>
                            <td className="w-[10%]">Abono</td>
                            <td className="w-[10%]">Referencia</td>
                            <td className="w-[10%]">Fecha Referencia</td>
                            <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Ver</th>
                            <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Editar</th>
                            <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {aplicaciones.map((item) => (
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
                                <td>{item.numero_cuenta}</td>
                                {item.cargo_abono === "C" ? <td className='text-right'>{formatNumber(item.importe_movimiento, 2)}</td> : <td className='text-right'>{0}</td>}
                                {item.cargo_abono === "A" ? <td className='text-right'>{formatNumber(item.importe_movimiento, 2)}</td> : <td className='text-right'>{0}</td>}
                                <td>{item.referencia}</td>
                                <td>{item.fecha_referencia}</td>
                                <th className="w-[5%] pt-[.10rem] pb-[.10rem]">
                                    <div
                                        className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem] content-center"
                                        data-tip={`Ver`}
                                        onClick={(evt) => tableAction(evt, item, `Ver`)}
                                    >
                                        <Image src={iconos.ver} alt="Ver" className="block dark:hidden" />
                                        <Image src={iconos.ver_w} alt="Guardar en oscuro" className="hidden dark:block" />
                                    </div>
                                </th>
                                <th className="w-[5%] pt-[.10rem] pb-[.10rem]">
                                    <div
                                        className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem] content-center"
                                        data-tip={`Editar`}
                                        onClick={(evt) => tableAction(evt, item, `Editar`)}
                                    >
                                        <Image src={iconos.editar} alt="Editar" className="block dark:hidden" />
                                        <Image src={iconos.editar_w} alt="Editar" className="hidden dark:block" />
                                    </div>
                                </th>
                                <th className="w-[5%] pt-[.10rem] pb-[.10rem]">
                                    <div
                                        className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem] content-center"
                                        data-tip={`Eliminar`}
                                        onClick={(evt) => tableAction(evt, item, "Eliminar")}
                                    >
                                        <Image src={iconos.eliminar} alt="Eliminar" className="block dark:hidden" />
                                        <Image src={iconos.eliminar_w} alt="Eliminar" className="hidden dark:block" />
                                    </div>
                                </th>
                            </tr>
                        ))}
                    </tbody>
                </table>) : (<NoData />)}
        </div>) : (<Loading />)
}

export default TablaAplicacion1
