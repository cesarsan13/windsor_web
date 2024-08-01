"use client";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/noData";
import React, { useState } from "react";

function TablaPagos1({
    pagosFiltrados,
    isLoading,
    setPagos,
    setAccion,
    setSelectedTable,
    deleteRow,
    // tableHeight,
}) {
    const [selectedRow, setSelectedRow] = useState(null);

    const tableAction = (evt, pago, accion) => {
        console.log(pago);
        setPagos(pago);
        setAccion(accion);
        setSelectedTable(pago);
        setSelectedRow(pago.numero);
        if (accion === 'Eliminar') { deleteRow(pago); }
    };

    return !isLoading ? (
        <>
            <div className="overflow-x-auto mt-3 text-black bg-white dark:bg-[#1d232a] dark:text-white m-2 w-full lg:w-5/8 h-auto" style={{ height: `auto` }}>
                {pagosFiltrados.length > 0 ? (
                    <table className='table table-xs  table-pin-rows table-pin-cols max-h-full'>
                        <thead className="relative z-[1] md:static">
                            <tr>
                                <th></th>
                                <td className="hidden">Clave</td>
                                <td>Descripción</td>
                                <td>Documento</td>
                                <td>Cantidad</td>
                                <td>Precio</td>
                                <td>Descuento</td>
                                <td>Neto</td>
                                <td>Total</td>
                                <td>Alumno</td>
                                <th className="w-[calc(20%)]">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pagosFiltrados.map((item) => (
                                <tr
                                    key={item.numero}
                                    className={`hover:cursor-pointer ${selectedRow === item.numero ? 'dark:bg-[#334155] bg-[#f1f5f9]' : ''}`}
                                    // className={`hover:cursor-pointer ${selectedRow === item.numero ? 'selected-row' : ''}`}
                                    onClick={() => setSelectedRow(item.numero)}
                                >
                                    <th className="text-right">{item.numero}</th>
                                    <td className="hidden">{item.numero}</td>
                                    <td>{item.descripcion}</td>
                                    <td>{item.documento}</td>
                                    <td>{item.cantidad_producto}</td>
                                    <td>{item.precio_base}</td>
                                    <td>{item.descuento}</td>
                                    <td>{item.neto}</td>
                                    <td>{item.total}</td>
                                    <td>{item.alumno}</td>
                                    <th>
                                        <div className="flex flex-row space-x-1">
                                            <div
                                                className="kbd tooltip tooltip-left hover:cursor-pointer bg-blue-500 hover:bg-blue-700 text-white"
                                                data-tip={`Eliminar ${item.numero}`}
                                                onClick={(evt) => tableAction(evt, item, "Eliminar")}
                                            >
                                                <i className="fa-solid fa-trash pt-2"></i>
                                            </div>
                                            <div
                                                className="kbd tooltip tooltip-left hover:cursor-pointer bg-blue-500 hover:bg-blue-700 text-white"
                                                data-tip={`Seleccionar ${item.numero}`}
                                                onClick={(evt) => tableAction(evt, item, "Seleccionar")}
                                            >
                                                <i className="fa-regular fa-hand-pointer pt-2"></i>
                                            </div>
                                        </div>
                                    </th>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th></th>
                                <td className="hidden">Clave</td>
                                <td>Descripción</td>
                                <td>Documento</td>
                                <td>Cantidad</td>
                                <td>Precio</td>
                                <td>Descuento</td>
                                <td>Neto</td>
                                <td>Total</td>
                                <td>Alumno</td>
                                <th>Acciones</th>
                            </tr>
                        </tfoot>
                    </table>
                ) : (
                    <NoData />
                )}
            </div>
        </>
    ) : (
        <Loading />
    );
}

export default TablaPagos1;


