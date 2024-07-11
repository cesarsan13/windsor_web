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
}) {
    const tableAction = (evt, producto, accion) => {
        setProducto(producto);
        setAccion(accion);
        setCurrentId(producto.id);
        showModal(true);
    };

    return !isLoading ? (
        <div className="overflow-x-auto mt-3  h-6/8 text-white bg-white m-2 w-full  lg:w-5/8 ">
            {productosFiltrados.length > 0 ? (
                <table className="table table-xs bg-[#1d232a] table-pin-rows table-pin-cols max-h-[calc(50%)]">
                    <thead className=" relative z-[1] md:static">
                        <tr>
                            <th></th>
                            <td>Descripcion</td>
                            <td>Aplicacion</td>
                            <td>Costo</td>
                            <td>Recargo</td>
                            <td>Condición</td>
                            <td>IVA</td>
                            <th className="w-[calc(10%)]">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productosFiltrados.map((item) => (
                            <tr key={item.id} className="hover:cursor-pointer">
                                <th
                                    className={
                                        typeof item.comision === "number"
                                            ? "text-right"
                                            : "text-left"
                                    }
                                >
                                    {item.id}
                                </th>
                                <td>{item.descripcion}</td>
                                <td>{item.aplicacion}</td>
                                <td>{formatNumber(item.costo)}</td>
                                <td>{formatNumber(item.pro_recargo)}</td>
                                <td>{item.cond_1}</td>
                                <td>{formatNumber(item.iva)}</td>
                                <th>
                                    <div className="flex flex-row space-x-3">
                                        <div
                                            className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-blue-500 hover:bg-blue-700 text-white"
                                            data-tip={`Ver ${item.id}`}
                                            onClick={(evt) => tableAction(evt, item, `Ver`)}
                                        >
                                            <i className="fa-solid fa-eye"></i>
                                        </div>
                                        <div
                                            className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-blue-500 hover:bg-blue-700 text-white"
                                            data-tip={`Editar ${item.id}`}
                                            onClick={(evt) => tableAction(evt, item, `Editar`)}
                                        >
                                            <i className="fa-solid fa-file"></i>
                                        </div>
                                        <div
                                            className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-blue-500 hover:bg-blue-700 text-white"
                                            data-tip={`Eliminar  ${item.id}`}
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
                            <td>Descripcion</td>
                            <td>Aplicacion</td>
                            <td>Costo</td>
                            <td>Recargo</td>
                            <td>Condición</td>
                            <td>IVA</td>
                            <th>Acciones</th>
                        </tr>
                    </tfoot>
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
