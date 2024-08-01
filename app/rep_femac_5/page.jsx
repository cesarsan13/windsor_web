"use client"
import React from "react"
import { useRouter } from "next/navigation";
import Acciones from "@/app/rep_femac_5/components/Acciones";
import Inputs from "@/app/rep_femac_5/components/Inputs";
import { useForm } from "react-hook-form";
import {
    getReportAltaBajaAlumno,
    Imprimir,
    ImprimirExcel,
    verImprimir,
} from "@/app/utils/api/rep_femac_5/rep_femac_5";
import ModalVistaPreviaRep5 from "./components/modalVistaPreviaRep5";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import BuscarCat from "@/app/components/BuscarCat";
import { showSwal } from "@/app/utils/alerts";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { Worker, Viewer } from "@react-pdf-viewer/core";
// import { calculaDigitoBvba } from "@/app/utils/globalfn";

function AltasBajasAlumnos() {
    const router = useRouter();
    const { data: session, status } = useSession();
    let [fecha_ini, setFecha_ini] = useState("");
    let [fecha_fin, setFecha_fin] = useState("");
    let [alumnosFiltrados, setAlumnosFiltrados] = useState([]);
    // const nameInputs = ["id", "nombre_completo"];
    // const columnasBuscaCat = ["id", "nombre_completo"];
    // const [bajas, setBajas] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Nombre');
    const [selectedOptionAB, setSelectedOptionAB] = useState('Alta');
    const [pdfPreview, setPdfPreview] = useState(false);
    const [pdfData, setPdfData] = useState("");
    const {
        formState: { errors },
    } = useForm({});
    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };
    const handleOptionChangeAB = (event) => {
        setSelectedOptionAB(event.target.value);
    };

    const formaImprime = async () => {
        let data;
        const { token } = session.user;
        const fechaIniFormateada = fecha_ini ? fecha_ini.replace(/-/g, '/') : 0;
        const fechaFinFormateada = fecha_fin ? fecha_fin.replace(/-/g, '/') : 0;
        if (fechaIniFormateada) {
            if (!fechaFinFormateada) {
                fecha_fin = 0;
            }
            data = await getReportAltaBajaAlumno(token, selectedOptionAB, selectedOption, fechaIniFormateada, fechaFinFormateada);
        } else {
            showSwal("Oppss!", "Para imprimir, mínimo debe estar seleccionada una fecha de 'Inicio'", "error");
        }
        console.log('data get report', data);
        return data;
    };
    const ImprimePDF = async () => {
        alumnosFiltrados = await formaImprime();
        const configuracion = {
            Encabezado: {
                Nombre_Aplicacion: "Sistema de Control Escolar",
                Nombre_Reporte: "Reporte Altas Bajas de Alumnos por Periodo",
                Nombre_Usuario: `Usuario: ${session.user.name}`,
            },
            body: alumnosFiltrados,
        };
        Imprimir(configuracion, selectedOptionAB);
    };

    const ImprimeExcel = async () => {
        alumnosFiltrados = await formaImprime();
        const configuracion = {
            Encabezado: {
                Nombre_Aplicacion: "Sistema de Control Escolar",
                Nombre_Reporte: "Reporte Altas Bajas de Alumnos por Periodo",
                Nombre_Usuario: `Usuario: ${session.user.name}`,
            },
            body: alumnosFiltrados,
            columns: [
                { header: "Nombre", dataKey: "nombre_completo" },
                { header: "Dia", dataKey: "dia" },
                { header: "Mes", dataKey: "mes" },
                { header: "Año", dataKey: "año" },
            ],
            nombre: "Reporte Altas Bajas Alumnos por Periodo",
        };
        ImprimirExcel(configuracion);
    };

    const home = () => {
        router.push("/");
    };

    const handleVerClick = async () => {
        console.log(session);
        const alumnosFiltrados = await formaImprime();
        const configuracion = {
            Encabezado: {
                Nombre_Aplicacion: "Sistema de Control Escolar",
                Nombre_Reporte: "Reporte Altas Bajas de Alumnos por Periodo",
                Nombre_Usuario: `Usuario: ${session.user.name}`,
            },
            body: alumnosFiltrados,
        };
        const pdfData = await verImprimir(configuracion, selectedOptionAB);
        setPdfData(pdfData);
        setPdfPreview(true);
        showModalVista(true);
    };

    const CerrarView = () => {
        setPdfPreview(false);
        setPdfData('');
    };
    const showModalVista = (show) => {
        show
          ? document.getElementById("modalVRep5").showModal()
          : document.getElementById("modalVRep5").close();
      }
    if (status === "loading") {
        return (
            <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
        );
    }
    return (
        <>
              <ModalVistaPreviaRep5 pdfPreview={pdfPreview} pdfData={pdfData} PDF={ImprimePDF} Excel={ImprimeExcel}/>      
        <div className="container w-full max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3">
            <div className="flex justify-start p-3">
                <h1 className="text-4xl font-xthin text-black dark:text-white md:px-12">
                    Relación General de Alumnos
                </h1>
            </div>
            <div className="container grid grid-cols-8 grid-rows-1 h-[calc(100%-20%)]">
                <div className="col-span-1 flex flex-col">
                    <Acciones
                        ImprimePDF={ImprimePDF}
                        ImprimeExcel={ImprimeExcel}
                        home={home}
                        Ver={handleVerClick}
                        CerrarView={CerrarView}
                    />
                </div>
                <div className="col-span-7">
                    <div className="flex flex-col h-full space-y-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-full max-w-sm p-4 border dark:border-gray-300 border-black rounded-lg">
                                <h2 className="text-lg font-bold mb-4 dark:text-white text-black">Ordenado por...</h2>
                                <div className="flex flex-col space-y-2">
                                    <label className="flex items-center space-x-2 dark:text-white text-black">
                                        <input
                                            type="radio"
                                            name="options"
                                            value="Nombre"
                                            checked={selectedOption === 'Nombre'}
                                            onChange={handleOptionChange}
                                            className="form-radio"
                                        />
                                        <span>Nombre</span>
                                    </label>
                                    <label className="flex items-center space-x-2 dark:text-white text-black">
                                        <input
                                            type="radio"
                                            name="options"
                                            value="Numero"
                                            checked={selectedOption === 'Numero'}
                                            onChange={handleOptionChange}
                                            className="form-radio"
                                        />
                                        <span>Número</span>
                                    </label>
                                    <label className="flex items-center space-x-2 dark:text-white text-black">
                                        <input
                                            type="radio"
                                            name="options"
                                            value="Fecha_nac"
                                            checked={selectedOption === 'Fecha_nac'}
                                            onChange={handleOptionChange}
                                            className="form-radio"
                                        />
                                        <span>Fecha nacimiento</span>
                                    </label>
                                </div>
                            </div>
                            <label className="flex items-center space-x-2 dark:text-white text-black">
                                <input
                                    type="radio"
                                    name="optionsAB"
                                    value="Alta"
                                    checked={selectedOptionAB === 'Alta'}
                                    onChange={handleOptionChangeAB}
                                    className="form-radio"
                                />
                                <span>Altas</span>
                            </label>
                            <label className="flex items-center space-x-2 dark:text-white text-black">
                                <input
                                    type="radio"
                                    name="optionsAB"
                                    value="Bajas"
                                    checked={selectedOptionAB === 'Bajas'}
                                    onChange={handleOptionChangeAB}
                                    className="form-radio"
                                />
                                <span>Bajas</span>
                            </label>
                        </div>


                        <div className="flex space-x-4">
                            <Inputs
                                name={"fecha_ini"}
                                tamañolabel={""}
                                className={"rounded block grow"}
                                Titulo={"Fecha Inicial: "}
                                type={"date"}
                                errors={errors}
                                maxLength={15}
                                isDisabled={false}
                                setValue={setFecha_ini}
                            />
                            <Inputs
                                name={"fecha_fin"}
                                tamañolabel={""}
                                className={"rounded block grow"}
                                Titulo={"Fecha Final: "}
                                type={"date"}
                                errors={errors}
                                maxLength={15}
                                isDisabled={false}
                                setValue={setFecha_fin}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
                                    </>
    );



}

export default AltasBajasAlumnos;