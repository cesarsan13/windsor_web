"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import TablaHorarios from './components/tablaHorarios'
import { getHorarios, getUltimoHorario, guardarHorario } from '../utils/api/horarios/horarios'
import ModalHorarios from './components/modalHorarios'
import { Tooltip } from 'react-tooltip'
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";



function Horarios() {

    const [horarios, setHorarios] = useState([])
    const [horario, setHorario] = useState({})
    const [horariosFiltrados, sethorariosFiltrados] = useState([])
    const [bajas, setBajas] = useState(false)
    const [openModal, setModal] = useState(false);
    const [accion, setAccion] = useState("");
    const [isLoading, setisLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentID, setCurrentId] = useState('');
    const [buscar, setBuscar] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setisLoading(true)
            setLoading(true)
            const data = await getHorarios(bajas)
            console.log(data)
            setHorarios(data)
            sethorariosFiltrados(data)
            setLoading(false)
            setisLoading(false)
        }
        fetchData();
    }, [bajas])

    const showInfo = (acc, id) => {
        console.log("id ", id)
        console.log("hora", horarios)
        const horario = horarios.find((horario) => horario.numero === id)
        console.log("horario", horario)
        if (horario) {
            setCurrentId(id)
            setModal(!openModal)
            setAccion(acc)
            setHorario(horario)
        }
    }
    const Alta = async (event) => {
        setCurrentId("")
        setHorario({})
        setModal(!openModal)
        setAccion("Alta")
        let siguienteId = await getUltimoHorario();
        siguienteId = Number(siguienteId)
        setCurrentId(siguienteId)
    }
    const handleModal = () => {
        setModal(!openModal)
    }
    const handleBusquedaChange = async (event) => {
        event.preventDefault();
        const valorBusqueda = event.target.value
        console.log(valorBusqueda)
        if (valorBusqueda === "") {
            sethorariosFiltrados(horarios)
            setBuscar(horarios)
            console.log(isLoading)
        } else {
            if (Number(valorBusqueda)) {
                const horariosFiltrados = horarios.filter(
                    (horario) => Number(horario.numero) === Number(valorBusqueda)
                )
                setBuscar(horariosFiltrados)
                console.log(horariosFiltrados)
                // sethorariosFiltrados(horariosFiltrados)                
            } else {
                const horariosFiltrados = horarios.filter((horario) =>
                    horario.horario.toLowerCase().includes(valorBusqueda.toLowerCase())
                )
                console.log(horariosFiltrados)
                setBuscar(horariosFiltrados)
                // sethorariosFiltrados(horariosFiltrados)                
            }
        }
    }
    const Buscar = () => {
        console.log(buscar)
        sethorariosFiltrados(buscar)
        console.log(horariosFiltrados)
    }
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleBusquedaChange(event)
            Buscar()
            console.log('Buscar:', event.target.value);
        }
    };
    const CreatePDF = () => {
        const doc = new jsPDF()
        // const { name } = session.user;
        doc.setFontSize(14);
        doc.text('Sistema de Control de Escolar', 14, 16);

        doc.setFontSize(10);
        doc.text('Reporte Datos de Horarios', 14, 22);

        // doc.setFontSize(10);
        // doc.text(`Usuario: ${name}`, 14, 28);

        const date = new Date();
        const dateStr = `${date.getFullYear()}/${('0' + (date.getMonth() + 1)).slice(-2)}/${('0' + date.getDate()).slice(-2)}`;
        const timeStr = `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}:${('0' + date.getSeconds()).slice(-2)}`;
        doc.text(`Fecha: ${dateStr}`, 150, 16);
        doc.text(`Hora: ${timeStr}`, 150, 22);
        doc.text(`Hoja: 1`, 150, 28);

        const columns = [
            { header: "Numero", dataKey: "numero" },
            { header: "Cancha", dataKey: "cancha" },
            { header: "Dia", dataKey: "dia" },
            { header: "horario", dataKey: "horario" },
            { header: "Max Niños", dataKey: "max_niños" },
            { header: "Sexo", dataKey: "sexo" },
            { header: "Edad Ini", dataKey: "edad_ini" },
            { header: "Edad Fin", dataKey: "edad_fin" }
        ]
        doc.autoTable({
            startY: 40,
            head: [columns.map(col => col.header)],
            body: horariosFiltrados.map(row => columns.map(col => row[col.dataKey] || "")),
            styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
            headStyles: { fillColor: [230, 230, 230], textColor: [0, 0, 0] },
            alternateRowStyles: { fillColor: [240, 240, 240] },
            theme: 'plain',
            margin: { top: 40 },
            columnStyles: {
                0: { halign: 'right' },
            }
        })
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
        doc.save("datos.pdf")
    }
    const CreateExcel = () => {
        const date = new Date();
        const dateStr = `${date.getFullYear()}/${('0' + (date.getMonth() + 1)).slice(-2)}/${('0' + date.getDate()).slice(-2)}`;
        const timeStr = `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}:${('0' + date.getSeconds()).slice(-2)}`;

        const headerInfo = [
            ["Sistema de Control de Escolar", "", "", "", `Fecha: ${dateStr}`],
            ["Reporte Datos de Cajero", "", "", "", `Hora: ${timeStr}`],
            ["", "", "", "", "Hoja: 1"],
            [],
        ];
        const columns = [
            { header: "Numero", dataKey: "numero" },
            { header: "Cancha", dataKey: "cancha" },
            { header: "Dia", dataKey: "dia" },
            { header: "Horario", dataKey: "horario" },
            { header: "Max Niños", dataKey: "max_niños" },
            { header: "Sexo", dataKey: "sexo" },
            { header: "Edad Ini", dataKey: "edad_ini" },
            { header: "Edad Fin", dataKey: "edad_fin" }
        ];
        const data = horariosFiltrados.map(row => {
            let rowData = {};
            columns.forEach(col => {
                rowData[col.header] = row[col.dataKey] || "";
            });
            return rowData;
        });

        // Convertir los datos en una hoja de cálculo
        const worksheetData = headerInfo.concat(XLSX.utils.sheet_to_json(XLSX.utils.json_to_sheet(data), { header: 1 }));
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

        // Ajustar automáticamente el ancho de las columnas basado en el contenido
        const columnWidths = columns.map(col => ({
            wch: Math.max(20, ...worksheetData.map(row => (row[col.header] || '').toString().length))  // Ajuste mínimo de ancho de columna a 20
        }));
        worksheet['!cols'] = columnWidths;

        // Crear libro y guardar el archivo Excel
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Horarios");
        XLSX.writeFile(workbook, "datos.xlsx");
    };

    return (
        <div className='flex w-full h-full bg-neutral-100 min-h-screen'>
            <div className='p-4 w-full '>
                {openModal && (
                    <ModalHorarios
                        accion={accion}
                        handleModal={handleModal}
                        id={currentID}
                        guardarHorarios={guardarHorario}
                        horario={horario}
                        horarios={horarios}
                        horariosFiltrados={horariosFiltrados}
                        setHorarios={setHorarios}
                        setHorariosFiltrados={sethorariosFiltrados}
                        bajas={bajas}
                        isLoading={loading}
                        setisLoading={setLoading}
                    />
                )}
                <div className='top-4 left-4'>
                    <Link href="../" data-tooltip-id={`tool`} data-tooltip-content="Cerrar menú" className="btn btn-xs btn-circle btn-warning rounded-full mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                        </svg>
                    </Link>
                    <Tooltip id="tool"></Tooltip>
                    <Link href="../" data-tooltip-id={`tool`} data-tooltip-content="Volver al inicio" className="btn btn-xs btn-circle btn-success rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                </div>
                <h1 className='text-3xl text-black font-semibold mb-4 text-center'>Cátalogo Horarios</h1>
                <div className='p-6 bg-white shadow-lg rounded-lg border border-gray-200 h-[calc(90%)]'>
                    <div className='flex flex-wrap'>
                        <label className="input input-bordered bg-[#f0f0f0] flex items-center gap-2 w-1/3">
                            <input type="text" onKeyDown={handleKeyDown} onChange={() => handleBusquedaChange(event)} className="grow text-neutral-900" placeholder="Buscar" />
                        </label>
                        <i
                            onClick={Buscar}
                            className='fas fa-search ml-2 pt-3 px-3 text-md font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                        ></i>

                        <div className='form-control bg-[#f0f0f0] ml-4 w-32 rounded-xl flex items-center space-x-2'>
                            <label className="label cursor-pointer flex items-center gap-2 pt-3">
                                <span className="label-text text-neutral-900 text-left">Bajas</span>
                                <input type="checkbox" className="checkbox checkbox-bordered border-2 border-neutral-400"
                                    onChange={(evt) => {
                                        setBajas(evt.target.checked);
                                    }}
                                    disabled={loading}
                                />
                            </label>
                        </div>
                        <div className='flex mt-4 md:mt-0'>
                            <button className='btn btn-outline btn-success  ml-4 rounded-xl flex items-center space-x-2' onClick={Alta}>Alta</button>
                            <button className='btn btn-outline btn-info  ml-4 rounded-xl flex items-center space-x-2' onClick={CreatePDF}>PDF</button>
                            <button className='btn btn-outline btn-info  ml-4 rounded-xl flex items-center space-x-2' onClick={CreateExcel}>Excel</button>
                        </div>
                    </div>
                    <div className='h-[calc(75%)] lg:h-[calc(90%)] w-[calc(100%)]'>
                        <TablaHorarios
                            horariosFiltrados={horariosFiltrados}
                            showInfo={showInfo}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Horarios
