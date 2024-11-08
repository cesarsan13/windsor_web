import Loading from '@/app/components/loading'
import NoData from '@/app/components/NoData'
import iconos from '@/app/utils/iconos'
import Image from 'next/image'
import React from 'react'

function TablaCobranzaDiaria({
    isLoading,
    cobranzaDiaria,
    showModal,
    setCurrentId,
    setCobranza,
    setAccion,
}) {
    const tableAction = (evt, cobranzaDiaria, accion) => {
        setCobranza(cobranzaDiaria);
        setAccion(accion);
        setCurrentId(cobranzaDiaria.recibo);
        showModal(true);
      };
    return !isLoading ? (
        <>
            <div className='overflow-y-auto mt-3 h-[calc(55vh)] md:h-[calc(65vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white  w-full lg:w-full'>
                {cobranzaDiaria.length > 0 ? (
                    <table className='table table-xs table-zebra w-full'>
                        <thead className='sticky top-0 bg-white dark:bg-[#1d232a] z-[2]'>
                            <tr>
                                <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Editar</th>
                                <td>Recibo</td>
                                <td>Fecha</td>
                                <td>Alumno</td>
                                <td>Nombre</td>
                                <td>TP 1</td>
                                <td>Importe 1</td>
                                <td>Referencia 1</td>
                                <td>TP 2</td>
                                <td>Importe 2</td>
                                <td>Referencia 2</td>
                                <td>Cuenta Banco</td>
                                <td>Referencia</td>
                                <td>Importe</td>
                            </tr>
                        </thead>
                        <tbody>
                            {cobranzaDiaria.map((item) => (
                                <tr key={item.recibo} className="hover:cursor-pointer">
                                    <th className="w-[5%] pt-[.10rem] pb-[.10rem]">
                                        <div
                                            className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem] content-center"
                                            data-tip={`Editar`}
                                            onClick={(evt) => tableAction(evt, item, `Editar`)}
                                        >
                                            <Image src={iconos.editar} alt="Editar" />
                                        </div>
                                    </th>
                                    <td>{item.recibo}</td>
                                    <td>{item.fecha_cobro}</td>
                                    <td>{item.alumno}</td>
                                    <td>{item.nombre}</td>
                                    <td>{item.tipo_pago_1}</td>
                                    <td>{item.importe_pago_1}</td>
                                    <td>{item.referencia_1}</td>
                                    <td>{item.tipo_pago_2}</td>
                                    <td>{item.importe_pago_2}</td>
                                    <td>{item.referencia_2}</td>
                                    <td>{item.cue_banco}</td>
                                    <td>{item.referencia}</td>
                                    <td>{item.importe}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (<NoData />)}
            </div>
        </>
    ) : (<Loading />)
}

export default TablaCobranzaDiaria
