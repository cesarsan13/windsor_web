"use client";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/noData";
import React from "react";

function TablaDoc({ docFiltrados, isLoading }) {
    return !isLoading ? (
        <div className="overflow-x-auto mt-3 text-black bg-white dark:bg-[#1d232a] dark:text-white m-2 w-full lg:w-5/8 h-auto">
            {docFiltrados.length > 0 ? (
                <table className="table table-xs table-pin-rows table-pin-cols max-h-full">
                    <thead className="relative z-[1] md:static">
                        <tr>
                            <td>Documento</td>
                            <td>Paquete</td>
                            <td>Fecha</td>
                            <td>Saldo</td>
                            <td>Desc</td>
                        </tr>
                    </thead>
                    <tbody>
                        {docFiltrados.map((item) => (
                            <tr key={item.numero} className="hover:cursor-pointer">
                                <td className="text-right">{item.numero}</td>
                                <td>{item.paquete}</td>
                                <td>{item.fecha}</td>
                                <td>{item.saldo}</td>
                                <td>{item.descuento}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td>Documento</td>
                            <td>Paquete</td>
                            <td>Fecha</td>
                            <td>Saldo</td>
                            <td>Desc</td>
                        </tr>
                    </tfoot>
                </table>
            ) : (
                <NoData />
            )}
        </div>
    ) : (
        <Loading />
    );
}

export default TablaDoc;
