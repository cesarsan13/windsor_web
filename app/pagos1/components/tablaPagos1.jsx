"use client";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/noData";
import React from "react";

function TablaPagos1({
    pagosFiltrados,
    isLoading,
    showModal,
    setPagos,
    setAccion,
    setCurrentId,
}) {
    const tableAction = (evt, pago, accion) => {
        setPagos(pago);
        setAccion(accion);
        setCurrentId(pago.numero);
        showModal(true);
    };

    return !isLoading ? (
        <>
            <div className="overflow-x-auto mt-3  h-6/8 text-black bg-white dark:bg-[#1d232a] dark:text-white m-2 w-full  lg:w-5/8 ">
                {pagosFiltrados.length > 0 ? (
                    <table className='table table-xs table-zebra  table-pin-rows table-pin-cols max-h-[calc(50%)]'>
                        <thead className="relative z-[1] md:static">
                            <tr>
                                <th></th>
                                <td>Clave</td>
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
                                <tr key={item.numero} className="hover:cursor-pointer">
                                    <th className="text-right">{item.numero}</th>
                                    <td >{item.descripcion}</td>
                                    <td>{item.documento}</td>
                                    <td>{item.cantidad_producto}</td>
                                    <td>{item.precio}</td>
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
                                                <i className="fa-solid fa-trash"></i>
                                            </div>
                                        </div>
                                    </th>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th></th>
                                <td>Clave</td>
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
