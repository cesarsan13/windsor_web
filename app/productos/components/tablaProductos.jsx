import React from "react";
import { Tooltip } from "react-tooltip";
import DataTable from "react-data-table-component";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/noData";
import Style from "@/app/productos/styles.module.css"

function TablaProductos({ productosFiltrados, isLoading, showInfo }) {
    const columns = [
        {
            name: "Acciones",
            cell: (row) => (
                <>
                    <button className="btn btn-outline mr-2 btn-info w-14"
                        data-tooltip-place="right"
                        data-tooltip-id={`toolEdit${row.id}`}
                        data-tooltip-content="Editar"
                        onClick={() => showInfo("Editar", row.id)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-4 w-4"
                        >
                            <path
                                d="M5 21H19C19.5523 21 20 20.5523 20 20V8.82843C20 8.29825 19.7893 7.78929 19.4142 7.41421L13.5858 1.58579C13.2107 1.21071 12.7018 1 12.1716 1H5C4.44772 1 4 1.44772 4 2V20C4 20.5523 4.44772 21 5 21ZM6 3H11V8C11 8.55228 11.4477 9 12 9H17V19H6V3ZM14 3.5L18.5 8H14V3.5ZM7 15H9V17H7V15ZM7 11H13V13H7V11Z"
                            />
                        </svg>
                    </button>
                    <Tooltip id={`toolEdit${row.id}`} />
                    <button className="btn btn-outline btn-error w-14"
                        data-tooltip-place="left"
                        data-tooltip-id={`toolDelete${row.id}`}
                        data-tooltip-content="Eliminar"
                        onClick={() => showInfo("Eliminar", row.id)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-4 w-4"
                        >
                            <path
                                d="M9 3V4H4V6H5V20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V6H20V4H15V3H9ZM7 6H17V20H7V6ZM9 8H11V18H9V8ZM13 8H15V18H13V8Z"
                            />
                        </svg>
                    </button>
                    <Tooltip id={`toolDelete${row.id}`} />
                </>
            ),
        },
        {
            name: "ID",
            selector: (productosFiltrados) => productosFiltrados.id,
            sortable: true,
        },
        {
            name: "Descripción",
            selector: (productosFiltrados) => productosFiltrados.descripcion,
            sortable: true,
        },
        {
            name: "Frecuencia",
            selector: (productosFiltrados) => productosFiltrados.frecuencia,
            sortable: true,
        },
        {
            name: "Aplicación",
            selector: (productosFiltrados) => productosFiltrados.aplicacion,
            sortable: true,
        },
        {
            name: "Cargo",
            selector: (productosFiltrados) => productosFiltrados.pro_recargo,
            sortable: true,
        },
        {
            name: "Costo",
            selector: (productosFiltrados) => productosFiltrados.costo,
            sortable: true,
        },
    ];

    const paginationComponentOptions = {
        rowsPerPageText: "Filas por página",
        rangeSeparatorText: "de",
        selectAllRowsItem: true,
        selectAllRowsItemText: "Todos",
    };

    return (
        isLoading ? (
            <div className="w-full py-44 h-full flex justify-center items-center">
                <div className={Style.loader}></div>
            </div>
        ) : (
            <>
                <div className="overflow-x-auto mt-8 rounded">
                    <DataTable
                        columns={columns}
                        data={productosFiltrados}
                        pagination
                        paginationPerPage={6}
                        paginationComponentOptions={paginationComponentOptions}
                        fixedHeader
                        progressPending={isLoading}
                        progressComponent={<Loading />}
                        noDataComponent={<NoData />}
                        customStyles={{
                            header: {
                                style: {
                                    minHeight: '56px',
                                    backgroundColor: '#efefef',
                                    color: "#000000",
                                },
                            },
                            headRow: {
                                style: {
                                    backgroundColor: '#efefef',
                                    borderBottomWidth: '1px',
                                    borderBottomColor: '#efefef',
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                },
                            },
                            headCells: {
                                style: {
                                    color: '#000000',
                                },
                            },
                            rows: {
                                style: {
                                    backgroundColor: '#efefef',
                                    borderBottomColor: '#efefef',
                                    color: '#000000',
                                    '&:nth-of-type(odd)': {
                                        backgroundColor: '#efefef',
                                    },
                                    paddingBottom: "10px",
                                    paddingTop: "10px"
                                },
                            },
                            pagination: {
                                style: {
                                    backgroundColor: '#efefef',
                                    color: '#000000',
                                },
                            },
                        }}
                    />
                </div>
            </>
        )
    );
}


export default TablaProductos;
