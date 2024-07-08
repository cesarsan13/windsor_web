"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getCajeros, guardaCajero, siguiente } from "@/app/utils/api/cajeros/cajeros";
import ModalCajero from "@/app/cajeros/components/modalCajeros";
import { showSwal } from "@/app/utils/alerts";
import { Tooltip } from "react-tooltip";
import TablaCajeros from "@/app/cajeros/components/tablaCajeros";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";


function Cajeros() {
    const { data: session, status } = useSession();
    const [cajero, setCajero] = useState({});
    const [cajeros, setCajeros] = useState([]);
    const [cajerosFiltrados, setCajerosFiltrados] = useState([]);
    const [error, setError] = useState(null);
    const [currentID, setCurrentId] = useState(0);
    const [openModal, setModal] = useState(false);
    const [isLoading, setisLoading] = useState(false);
    const [accion, setAccion] = useState("");
    const [baja, setBaja] = useState(false);

    useEffect(() => {
        if (status === "loading" || !session) {
            return;
        }
        const fetchCajeros = async () => {
            try {
                setisLoading(true);
                const { token } = session.user;
                const data = await getCajeros(token, baja);
                setCajeros(data);
                setCajerosFiltrados(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setisLoading(false);
            }
        };
        fetchCajeros();
    }, [session, status, baja]);

    if (!session) {
        return <></>;
    }

    const Alta = async () => {
        setCurrentId("");
        setCajero({});
        setModal(!openModal);
        setAccion("Alta");
        const { token } = session.user;
        let siguienteId = await siguiente(token);
        siguienteId = Number(siguienteId) + 1;
        setCurrentId(siguienteId);
    };

    const Imprimir = () => {
        const doc = new jsPDF();
        const { name } = session.user;
    
        doc.setFontSize(14);
        doc.text('Sistema de Control de Escolar', 14, 16);
    
        doc.setFontSize(10);
        doc.text('Reporte Datos de Cajero', 14, 22);
    
        doc.setFontSize(10);
        doc.text(`Usuario: ${name}`, 14, 28);
    
        const date = new Date();
        const dateStr = `${date.getFullYear()}/${('0' + (date.getMonth() + 1)).slice(-2)}/${('0' + date.getDate()).slice(-2)}`;
        const timeStr = `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}:${('0' + date.getSeconds()).slice(-2)}`;
        doc.text(`Fecha: ${dateStr}`, 150, 16);
        doc.text(`Hora: ${timeStr}`, 150, 22);
        doc.text(`Hoja: 1`, 150, 28);
    
        const columns = [
            { header: "Número", dataKey: "numero" },
            { header: "Nombre", dataKey: "nombre" },
            //{ header: "Clave_Cajero", dataKey: "clave_cajero" },
            { header: "Dirección", dataKey: "direccion" },
            { header: "Colonia", dataKey: "colonia" },
            //{ header: "Fax", dataKey: "fax" },
            { header: "Teléfono", dataKey: "telefono" },
            { header: "Mail", dataKey: "mail" },
            //{ header: "Estado", dataKey: "estado" },
        ];
    
        // Agregar tabla
        doc.autoTable({
            startY: 40,
            head: [columns.map(col => col.header)],
            body: cajerosFiltrados.map(row => columns.map(col => row[col.dataKey] || "")),
            styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
            headStyles: { fillColor: [230, 230, 230], textColor: [0, 0, 0] },
            alternateRowStyles: { fillColor: [240, 240, 240] },
            theme: 'plain',
            margin: { top: 40 },
            columnStyles: {
                0: { halign: 'right' },
            },
        });
    
        // Agregar número de página al pie de página
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            const pageText = `Página ${i} de ${pageCount}`;
            const textWidth = doc.getTextWidth(pageText);
            const pageHeight = doc.internal.pageSize.height;
            const pageWidth = doc.internal.pageSize.width;
            doc.text(pageText, pageWidth - textWidth - 10, pageHeight - 10);
        }
    
        doc.save("cajeros.pdf");
    };
    
    const exportToExcel = () => {
        const { name } = session.user;
        const date = new Date();
        const dateStr = `${date.getFullYear()}/${('0' + (date.getMonth() + 1)).slice(-2)}/${('0' + date.getDate()).slice(-2)}`;
        const timeStr = `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}:${('0' + date.getSeconds()).slice(-2)}`;
    
        const headerInfo = [
            ["Sistema de Control de Escolar", "", "", "", `Fecha: ${dateStr}`],
            ["Reporte Datos de Cajero", "", "", "", `Hora: ${timeStr}`],
            [`Usuario: ${name}`, "", "", "", "Hoja: 1"],
            [],
        ];
    
        const columns = [
            { header: "Número", dataKey: "numero" },
            { header: "Nombre", dataKey: "nombre" },
            { header: "Dirección", dataKey: "direccion" },
            { header: "Colonia", dataKey: "colonia" },
            { header: "Teléfono", dataKey: "telefono" },
            { header: "Mail", dataKey: "mail" },
        ];
    
        const data = cajerosFiltrados.map(row => {
            let rowData = {};
            columns.forEach(col => {
                rowData[col.header] = row[col.dataKey] || "";
            });
            return rowData;
        });
    
        const worksheetData = headerInfo.concat(XLSX.utils.sheet_to_json(XLSX.utils.json_to_sheet(data), { header: 1 }));
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Cajeros");
        XLSX.writeFile(workbook, "cajeros.xlsx");
        
    };

    const showInfo = (acc, numero) => {
        const cajero = cajeros.find((cajero) => cajero.numero === numero);
        if (cajero) {
            setCurrentId(numero);
            setModal(!openModal);
            setAccion(acc);
            setCajero(cajero);
        }
    };

    const handleBusquedaChange = (event) => {
        const valorBusqueda = event.target.value;
        if (valorBusqueda === "") {
            setCajerosFiltrados(cajeros);
        } else {
            const infoFiltrada = cajeros.filter((cajero) =>
                Object.values(cajero).some(
                    (valor) =>
                        typeof valor === "string" &&
                        valor.toLowerCase().includes(valorBusqueda.toLowerCase())
                )
            );
            setCajerosFiltrados(infoFiltrada);
        }
    };

    const buscarCajeros = async () => {
        try {
            setisLoading(true);
            const { token } = session.user;
            const data = await getCajeros(token, baja);
            setCajeros(data);
            setCajerosFiltrados(data);
        } catch (error) {
            showSwal("Error", error, "error");
        } finally {
            setisLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-start h-screen max-w-5xl w-5/6">
            {openModal && (
                <ModalCajero
                    accion={accion}
                    handleModal={handleModal}
                    numero={currentID}
                    guardaCajero={guardaCajero}
                    session={session}
                    cajero={cajero}
                    cajeros={cajeros}
                    cajerosFiltrados={cajerosFiltrados}
                    setCajerosFiltrados={setCajerosFiltrados}
                    setCajeros={setCajeros}
                    baja={baja}
                />
            )}
            <div className="bg-white shadow rounded-lg p-9 w-full max-w-full mt-10">
                <h2 className="text-gray-800 text-2xl font-semibold mb-4">Cajeros</h2>
                <div className="flex items-center space-x-2 mb-4">
                    <input
                        className="border border-gray-300 rounded-lg px-4 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="search"
                        placeholder="Nombre"
                        onChange={handleBusquedaChange}
                    />
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-blue-600"
                            onChange={(evt) => setBaja(evt.target.checked)}
                        />
                        <span className="ml-2 text-gray-700">Bajas</span>
                    </label>
                    <button
                        onClick={Alta}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 ml-auto"
                    >
                        Añadir
                    </button>
                    <button
                        onClick={Imprimir}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 ml-auto"
                    >
                        Imprimir
                    </button>
                    <button
                        onClick={exportToExcel}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none"
                    >
                        Excel
                    </button>
                </div>
                <TablaCajeros
                    cajerosFiltrados={cajerosFiltrados}
                    isLoading={isLoading}
                    showInfo={showInfo}
                    className="text-sm" 
                />
            </div>
        </div>
    );
}

export default Cajeros;
