"use client";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/NoData";
import React from "react";
import { formatNumber } from "@/app/utils/globalfn";
function TablaProcesaDatos({
    session,
    isLoading,
    datosFiltrados,
    itemHeaderTable,
    itemDataTable, 
}) {
    return !isLoading ? (
        <div className="overflow-y-auto mt-3 h-[calc(55vh)] md:h-[calc(65vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white  w-full lg:w-full">
            {datosFiltrados && datosFiltrados.length > 0 ? (
                <table className="table table-xs table-zebra w-full">
                    <thead className="sticky top-0 bg-white dark:bg-[#1d232a] z-[2]">
                        <tr> 
                            {itemHeaderTable()}
                        </tr>
                    </thead>
                    <tbody> 
                        {datosFiltrados.map((item) => (
                            itemDataTable(item) 
                        ))}
                    </tbody>
                    <tfoot />
                </table>
            ) : datosFiltrados != null &&
                session &&
                datosFiltrados.length === 0 ? (
                <NoData></NoData>
            ) : (
                <Loading></Loading>
            )}
        </div>
    ) : (
        <Loading></Loading>
    );
}

export default TablaProcesaDatos;
