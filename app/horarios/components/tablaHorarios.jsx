import React from 'react'
import { Tooltip } from 'react-tooltip'
import DataTable from 'react-data-table-component'
import Loading from "@/app/components/loading";
import NoData from "@/app/components/noData";

function TablaHorarios({ horariosFiltrados, isLoading, showInfo }) {
    const columns = [
        {
            name: "ID",
            selector: (row) => row.numero,
            sortable: true,
        },
        {
            name: "Cancha",
            selector: (row) => row.cancha,
            sortable: true
        },
        {
            name: "Dia",
            selector: (row) => row.dia,
            sortable: true
        },
        {
            name: "Horario",
            selector: (row) => row.horario,
            sortable: true
        },
        {
            name: "Max Niños",
            selector: (row) => row.max_niños,
            sortable: true
        },
        {
            name: "Sexo",
            selector: (row) => row.sexo,
            sortable: true
        },
        {
            name: "Edad Ini",
            selector: (row) => row.edad_ini,
            sortable: true
        },
        {
            name: "Edad Fin",
            selector: (row) => row.edad_fin,
            sortable: true
        },
        {
            name: "Editar",
            cell: (row) => (
                <>
                    <button className="btn btn-outline btn-info"
                        onClick={() => showInfo("Editar", row.numero)}
                    >Editar</button>
                </>
            ),
        },
        {
            name: "Eliminar",
            cell: (row) => (
                <>
                    <button className="btn btn-outline btn-error"
                    onClick={() => showInfo("Eliminar", row.numero)}
                > Eliminar</button>
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
        <div className='overflow-x-auto mt-8 rounded h-[calc(95%)]'>
            <DataTable
                columns={columns}
                data={horariosFiltrados}
                pagination
                paginationPerPage={20}
                paginationComponentOptions={paginationComponentOptions}
                // fixedHeade
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
            ></DataTable>
        </div>
    )
}

export default TablaHorarios
