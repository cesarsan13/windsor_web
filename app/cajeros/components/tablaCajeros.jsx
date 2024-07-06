import React from "react";
import { Tooltip } from "react-tooltip";
import DataTable from "react-data-table-component";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/noData";

function TablaCajeros({ cajerosFiltrados, isLoading, showInfo }) {
    const columns = [
        {
            name: "Acciones",
            cell: (row) => (
                <div className="flex space-x-1">
                    <button
                        data-tooltip-place="right"
                        data-tooltip-id={`toolEdit${row.numero}`}
                        data-tooltip-content="Editar"
                        onClick={() => showInfo("Editar", row.numero)}
                        className="fas fa-edit py-1 px-2 text-sm font-medium text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none"
                    ></button>
                    <Tooltip id={`toolEdit${row.numero}`} />
                    <button
                        data-tooltip-place="left"
                        data-tooltip-id={`toolDelete${row.numero}`}
                        data-tooltip-content="Eliminar"
                        onClick={() => showInfo("Eliminar", row.numero)}
                        className="fas fa-trash py-1 px-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none"
                    ></button>
                    <Tooltip id={`toolDelete${row.numero}`} />
                </div>
            ),
            minWidth: '10px', 
            maxWidth: '100px', 

        },
        {
            name: "Numero",
            selector: (cajerosFiltrados) => cajerosFiltrados.numero,
            sortable: true,
            minWidth: '60px', 
            maxWidth: '100px', 
        },
        {
            name: "Nombre",
            selector: (cajerosFiltrados) => cajerosFiltrados.nombre,
            sortable: true,
            minWidth: '100px',
            maxWidth: '170px',
        },
        {
            name: "Clave_Cajero",
            selector: (cajerosFiltrados) => cajerosFiltrados.clave_cajero,
            sortable: true,
            minWidth: '100px',
            maxWidth: '150px',
        },
    ];

    const customStyles = {
        rows: {
            style: {
                minHeight: '32px',
                padding: '2px 0', 
            },
        },
        headCells: {
            style: {
                paddingLeft: '8px',
                paddingRight: '8px',
            },
        },
        cells: {
            style: {
                paddingLeft: '8px',
                paddingRight: '8px',
            },
        },
    };

    const paginationComponentOptions = {
        rowsPerPageText: "Filas por página",
        rangeSeparatorText: "de",
        selectAllRowsItem: true,
        selectAllRowsItemText: "Todos",
    };

    return (
        <DataTable
            columns={columns}
            data={cajerosFiltrados}
            pagination
            paginationPerPage={5}
            paginationComponentOptions={paginationComponentOptions}
            fixedHeader
            progressPending={isLoading}
            progressComponent={<Loading />}
            noDataComponent={<NoData />}
            customStyles={customStyles}
        />
    );
}

export default TablaCajeros;
