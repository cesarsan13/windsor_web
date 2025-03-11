"use client";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/NoData";
import React from "react";
function TablaPromedioIngles({
    session,
    promediosEsFiltrados,
    isLoading,
}) {
    return !isLoading ? (
        <div className="overflow-y-auto mt-3 h-[calc(55vh)] md:h-[calc(65vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white  w-full lg:w-full">
            {promediosEsFiltrados && promediosEsFiltrados.length > 0 ? (
                <table className="table table-xs table-zebra w-full">
                    <thead className="sticky top-0 bg-white dark:bg-[#1d232a] z-[2]">
                        <tr>
                            <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Numero</td>
                            <td className="w-[5%]">Asignaturas</td>
                            <td className="w-[5%]">1er Trimestre</td>
                            <td className="w-[5%]">2do Trimestre</td>
                            <td className="w-[5%]">3er Trimestre</td>
                            <td className="w-[5%]">Promedio</td>
                        </tr>
                    </thead>
                    <tbody>
                        {promediosEsFiltrados.map((item, index) => (
                            <tr key={`${item.numero}-${index}`} className="hover:cursor-pointer">
                                <th className="w-[5%] text-right">{item.numero}</th>
                                <th className="w-[45%]">{item.descripcion}</th>
                                <td className="w-[5%] text-right"> {item.bimestre1} </td>
                                <td className="w-[5%] text-right"> {item.bimestre2} </td>
                                <td className="w-[5%] text-right"> {item.bimestre3} </td>
                                <td className="w-[5%] text-right"> {item.promedio} </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : promediosEsFiltrados != null &&
                session &&
                promediosEsFiltrados.length === 0 ? (
                <NoData></NoData>
            ) : (
                <Loading></Loading>
            )}
        </div >
    ) : (
        <Loading></Loading>
    );
}

export default TablaPromedioIngles;
