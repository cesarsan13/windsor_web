import React from "react";
import { Tooltip } from "react-tooltip";
import DataTable from "react-data-table-component";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/noData";

function TablaProductos({ productosFiltrados, isLoading, showInfo }) {
    const columns = [
        {
            name: "ID",
            selector: (row) => row.id,
            sortable: true,
        },
        {
            name: "Descripción",
            selector: (row) => row.descripcion,
            sortable: true,
        },
        {
            name: "Editar",
            cell: (row) => (
                <>
                    <button className="btn btn-outline btn-info"
                        onClick={() => showInfo("Editar", row.id)}
                    >Editar</button>
                </>
            ),
        },
        {
            name: "Eliminar",
            cell: (row) => (
                <>
                    <button className="btn btn-outline btn-error"
                        onClick={() => showInfo("Eliminar", row.id)}
                    >Eliminar</button>
                </>
            ),
        },
    ];

    const paginationComponentOptions = {
        rowsPerPageText: "Filas por página",
        rangeSeparatorText: "de",
        selectAllRowsItem: true,
        selectAllRowsItemText: "Todos",
    };

    return (
        <div className="overflow-x-auto mt-8 rounded h-[calc(85%)]">
            <DataTable
                columns={columns}
                data={productosFiltrados}
                pagination
                paginationPerPage={20}
                paginationComponentOptions={paginationComponentOptions}
                fixedHeader
                progressPending={isLoading}
                progressComponent={<Loading />}
                noDataComponent={<NoData />}
                customStyles={{
                    header: {
                        style: {
                            minHeight: '56px',
                            backgroundColor: '#171717',
                            color: "#ffff",
                        },
                    },
                    headRow: {
                        style: {
                            backgroundColor: '#171717',
                            borderBottomWidth: '1px',
                            borderBottomColor: '#171717',
                            fontSize: "16px",
                            fontWeight: "bold",
                        },
                    },
                    headCells: {
                        style: {
                            color: '#ffff',
                        },
                    },
                    rows: {
                        style: {
                            backgroundColor: '#171717',
                            borderBottomColor: '#171717',
                            color: '#ffff',
                            '&:nth-of-type(odd)': {
                                backgroundColor: '#171717',
                            },
                            paddingBottom: "10px",
                            paddingTop: "10px"
                        },
                    },
                    pagination: {
                        style: {
                            backgroundColor: '#171717',
                            color: '#ffff',
                        },
                    },
                }}
            />
        </div>
    );
}

export default TablaProductos;
