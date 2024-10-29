import React, { useState } from "react";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/NoData";
import Image from "next/image";
import iconos from "@/app/utils/iconos";
import { formatNumber, globalVariables, loadGlobalVariables, soloDecimales } from "@/app/utils/globalfn";
import { showSwal } from "@/app/utils/alerts";

function TablaConcentradoCal({
    materiasEncabezado,
}){
    return  (
        <div className="overflow-y-auto mt-3 h-[calc(55vh)] md:h-[calc(65vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white w-full lg:w-full">
           
                <table className="table table-xs table-zebra w-full">
                    <thead className="sticky top-0 bg-white dark:bg-[#1d232a] z-[2]">
                        <tr>
                            <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</td>
                            <td className="w-[45%]">Alumno</td>

                            {materiasEncabezado.length > 0 ? (
                                materiasEncabezado.map((item, index) => {
                                    // Verificar si es el último elemento de su área y el siguiente tiene un área diferente
                                    const esUltimoDeArea =
                                        (item.area === 1 || item.area === 4) &&
                                        (index === materiasEncabezado.length - 1 || materiasEncabezado[index + 1].area !== item.area);
                                
                                    return (
                                        <React.Fragment key={index}>
                                            <th id={item.numero} className="w-[15%]">
                                                {item.descripcion}
                                            </th>

                                            {/* Insertar encabezado de promedio solo después del último elemento del área 1 o 4 */}
                                            {esUltimoDeArea && (
                                                <td colSpan={2} className="text-left font-semibold">
                                                    {`Promedio de ${item.area === 1 ? "Español" : item.area === 4 ? "Inglés" : ""}`}
                                                </td>
                                            )}
                                        </React.Fragment>
                                    );
                                })
                            ) : (
                                <td className="w-[45%]">Sin datos</td>
                            )}

                            <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Editar</th>
                        </tr>
                    </thead>
                    <tbody>
                        





                       {/* {calificacionesFiltrados.map((item, index) => (
                            <tr key={`${item.numero}-${index}`} className="hover:cursor-pointer">
                                <th className="w-[5%]">{item.numero}</th>
                                <td className="w-[45%]"> {item.nombre} </td>
                                <td className="w-[25%]">
                                    {editMode === item.numero ? (
                                        <input
                                            type="number"
                                            value={editedCalificaciones[item.numero] || item.calificacion || ""}
                                            onChange={(e) => handleEditChange(item.numero, e.target.value)}
                                            className="input input-bordered w-full"
                                        />
                                    ) : (
                                        item.calificacion || "N/A"
                                    )}
                                </td>
                                <th className="w-[5%] pt-[.10rem] pb-[.10rem]">
                                    {editMode === item.numero ? (
                                        <>
                                            <button
                                                className="btn btn-xs"
                                                onClick={() => saveCalificacion(item.numero)}
                                            >
                                                Guardar
                                            </button>
                                            <button
                                                className="btn btn-xs"
                                                onClick={() => setEditMode(null)}
                                            >
                                                Cancelar
                                            </button>
                                        </>
                                    ) : (
                                        <div
                                            className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem] content-center"
                                            data-tip={`Editar`}
                                            onClick={(evt) => tableAction(evt, item, "Editar")}
                                        >
                                            <Image src={iconos.editar} alt="Editar" />
                                        </div>
                                    )}
                                </th>
                            </tr>
                        ))}*/}
                    </tbody>
                </table>
        </div>
       
    );


}

export default TablaConcentradoCal;