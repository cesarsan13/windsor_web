"use client";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/noData";
import React from "react";
function TablaProductos({
    productosFiltrados,
    isLoading,
    showModal,
    setProducto,
    setAccion,
    setCurrentId,
    formatNumber,
    tableAction,
}) {


    return !isLoading ? (
        <div className="overflow-x-auto mt-3 h-[calc(55vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white w-full lg:w-3/4">
            {productosFiltrados.length > 0 ? (
                <table className='table table-xs table-zebra w-full'>
                    <thead className="sticky top-0 bg-white dark:bg-[#1d232a]">
                        <tr>
                            <th></th>
                            <td className="w-[40%]" >Descripcion</td>
                            <td className="w-[15%]">Aplicacion</td>
                            <td className="w-[15%]">Costo</td>
                            <td className="w-[10%]">Recargo</td>
                            <td className="w-[10%]">Condición</td>
                            <td className="w-[10%]">IVA</td>
                            <th className="w-[calc(10%)]">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productosFiltrados.map((item) => (
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
                                <td>{item.descripcion}</td>
                                <td>{item.aplicacion}</td>
                                <td className="text-right">{formatNumber(item.costo)}</td>
                                <td className="text-right">{formatNumber(item.por_recargo)}</td>
                                <td className="text-right">{item.cond_1}</td>
                                <td className="text-right">{formatNumber(item.iva)}</td>
                                <th>
                                    <div className="flex flex-row space-x-3">
                                        <div
                                            className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white"
                                            data-tip={`Ver ${item.numero}`}
                                            onClick={(evt) => tableAction(`Ver`, item.numero)}
                                        >
                                            <i className="fa-solid fa-eye"></i>
                                        </div>
                                        <div
                                            className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white"
                                            data-tip={`Editar ${item.numero}`}
                                            onClick={(evt) => tableAction(`Editar`, item.numero)}
                                        >
                                            <i className="fa-solid fa-file"></i>
                                        </div>
                                        <div
                                            className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white"
                                            data-tip={`Eliminar  ${item.numero}`}
                                            onClick={(evt) => tableAction("Eliminar", item.numero)}
                                        >
                                            <i className="fa-solid fa-trash"></i>
                                        </div>
                                    </div>
                                </th>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot />
                </table>
            ) : (
                <NoData />
            )}
        </div>
    ) : (
        <Loading></Loading>
        // <div className="flex justify-center items-center pt-10">
        //   <span className="loading loading-ring loading-lg text-4xl"></span>
        // </div>
    );
}

export default TablaProductos;
