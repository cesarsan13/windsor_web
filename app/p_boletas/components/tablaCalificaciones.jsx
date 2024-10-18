import Loading from '@/app/components/loading'
import NoData from '@/app/components/NoData'
import React from 'react'

function TablaCalificaciones({
    isLoading,    
    Calificaciones
}) {
    console.log("calificaciones:",Calificaciones)
    return !isLoading ? (
        <div className='overflow-y-auto mt-3 h-[calc(55vh)] md:h-[calc(65vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white  w-full lg:w-full'>
            {Calificaciones.length > 0 ? (
                <table className='table table-xs table-zebra w-full'>
                    <thead className='sticky top-0 bg-white dark:bg-[#1d232a] z-[2]'>
                        <tr>
                            <td>Asignaturas</td>
                            <td>1er Bimestre</td>
                            <td>2do Bimestre</td>
                            <td>3er Bimestre</td>
                            <td>4to Bimestre</td>
                            <td>5to Bimestre</td>
                            <td>Promedio</td>
                        </tr>
                    </thead>
                    <tbody>
                        {Calificaciones.map((item)=>(
                            <tr key={item.numero} className="hover:cursor-pointer">
                                <td>{item.descripcion}</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ):(<NoData/>)}
        </div>) : (<Loading />)
}

export default TablaCalificaciones
