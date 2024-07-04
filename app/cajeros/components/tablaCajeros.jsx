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
          <>
            <button
              data-tooltip-place="right"
              data-tooltip-id={`toolEdit${row.numero}`}
              data-tooltip-content="Editar"
              onClick={() => showInfo("Editar", row.numero)}
              className={`fas fa-edit py-2 px-4 ms-2 text-md font-medium text-white focus:outline-none bg-green-500 rounded-lg border border-green-200 hover:bg-green-100 hover:text-white-700  focus:ring-4 focus:ring-green-100 dark:focus:ring-green-700 dark:bg-green-800 dark:text-green-400 dark:border-green-600 dark:hover:text-white dark:hover:bg-green-700`}
            ></button>
            <Tooltip numero={`toolEdit${row.numero}`} />
            <button
              data-tooltip-place="left"
              data-tooltip-id={`toolDelete${row.numero}`}
              data-tooltip-content="Eliminar"
              onClick={() => showInfo("Eliminar", row.numero)}
              className={`fas fa-trash py-2 px-4 ms-2 text-md font-medium text-white focus:outline-none bg-red-500 rounded-lg border border-red-200 hover:bg-red-100 hover:text-white-700  focus:ring-4 focus:ring-red-100 dark:focus:ring-red-700 dark:bg-red-800 dark:text-red-400 dark:border-red-600 dark:hover:text-white dark:hover:bg-red-700`}
            ></button>
            <Tooltip numero={`toolDelete${row.numero}`} />
          </>
        ),
      },
      {
        name: "Numero",
        selector: (cajerosFiltrados) => cajerosFiltrados.numero,
        sortable: true,
      },
      ,
      {
        name: "Nombre",
        selector: (cajerosFiltrados) => cajerosFiltrados.nombre,
        sortable: true,
      },
      {
        name: "Clave_Cajero",
        selector: (cajerosFiltrados) => cajerosFiltrados.clave_cajero,
        sortable: true,
      },
      {
        name: "Mail",
        selector: (cajerosFiltrados) => cajerosFiltrados.mail,
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
      <DataTable
        title="Cajeros"
        columns={columns}
        data={cajerosFiltrados}
        pagination
        paginationPerPage={5}
        paginationComponentOptions={paginationComponentOptions}
        fixedHeader
        progressPending={isLoading}
        progressComponent={<Loading />}
        noDataComponent={<NoData />}
        highlightOnHover
        pointerOnHover
      />
    );
  }
  
  export default TablaCajeros;
  