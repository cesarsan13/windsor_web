"use client"
import React from "react"
import { useRouter } from "next/navigation";
import Acciones from "@/app/rep_femac_1/components/Acciones";
import Inputs from "@/app/rep_femac_1/components/Inputs";
import { useForm } from "react-hook-form";
import {
    Imprimir,
    ImprimirExcel,
} from "@/app/utils/api/rep_femac_1/rep_femac_1";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import BuscarCat from "@/app/components/BuscarCat";
import { getreportAlumn } from "@/app/utils/api/rep_femac_1/rep_femac_1";
import { showSwal } from "@/app/utils/alerts";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

function AlumnosPorClase() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [alumnos1, setAlumnos1] = useState({});
    const [alumnos2, setAlumnos2] = useState({});
    let [alumnosFiltrados, setAlumnosFiltrados] = useState([]);
    const nameInputs = ["id", "nombre_completo"];
    const columnasBuscaCat = ["id", "nombre_completo"];
    const [bajas, setBajas] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Nombre');

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const formaImprime = async () => {
        let data;
        const { token } = session.user;
        console.log('baja check', bajas);
        console.log('alumnos 1', alumnos1);
        console.log('alumnos 2', alumnos2);
        if (alumnos1) {
            data = await getreportAlumn(token, bajas, selectedOption, alumnos1.id, alumnos2.id);
        } else {
            showSwal("Oppss!", "Para imprimir, minimo debe estar seleccionado un alumno en 'Inicio' ", "error");
        }
        console.log('data get report', data);
        return data;
    }

    const ImprimePDF = async () => {
        alumnosFiltrados = await formaImprime();
        const configuracion = {
            Encabezado: {
                Nombre_Aplicacion: "Sistema de Control Escolar",
                Nombre_Reporte: "Reporte Relación General de Alumnos",
                Nombre_Usuario: `Usuario: ${session.user.name}`,
            },
            body: alumnosFiltrados,
        };
        Imprimir(configuracion);
    };

    const ImprimeExcel = async () => {
        alumnosFiltrados = await formaImprime();
        const configuracion = {
            Encabezado: {
                Nombre_Aplicacion: "Sistema de Control Escolar",
                Nombre_Reporte: "Reporte Relación General de Alumnos",
                Nombre_Usuario: `Usuario: ${session.user.name}`,
            },
            body: alumnosFiltrados,
            columns: [
                { header: "No", dataKey: "id" },
                { header: "Nombre", dataKey: "nombre_completo" },
                { header: "Estatus", dataKey: "estatus" },
                { header: "Fecha", dataKey: "fecha_nac" },
                { header: "Horario", dataKey: "horario_1_nombre" },
                { header: "Telefono", dataKey: "telefono_1" },
            ],
            nombre: "Alumnos",
        };
        ImprimirExcel(configuracion);
    };

    const home = () => {
        router.push("/");
    };

    if (status === "loading") {
        return (
            <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
        );
    }
    return (
        <div className="container w-full max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3">
            <div className="flex justify-start p-3">
                <h1 className="text-4xl font-xthin text-black dark:text-white md:px-12">
                    Relación General de Alumnos
                </h1>
            </div>
            <div className="container grid grid-cols-8 grid-rows-1 h-[calc(100%-20%)]">
                <div className="col-span-1 flex flex-col">
                    <Acciones ImprimePDF={ImprimePDF} ImprimeExcel={ImprimeExcel} home={home} />
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
                                </div>
                            </div>

                            <div className="tooltip" data-tip="Ver Bajas">
                                <label htmlFor="ch_bajas" className="label cursor-pointer flex items-center space-x-2">
                                    <input
                                        id="ch_bajas"
                                        type="checkbox"
                                        className="checkbox checkbox-md"
                                        onClick={(evt) => setBajas(evt.target.checked)}
                                    />
                                    <span className="label-text font-bold hidden sm:block text-neutral-600 dark:text-neutral-200">Incluir bajas</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex space-x-4">
                            <BuscarCat
                                table="alumnos"
                                itemData={[]}
                                fieldsToShow={columnasBuscaCat}
                                nameInput={nameInputs}
                                titulo={"Inicio: "}
                                setItem={setAlumnos1}
                                token={session.user.token}
                                modalId="modal_alumnos1"
                            />
                            <BuscarCat
                                table="alumnos"
                                itemData={[]}
                                fieldsToShow={columnasBuscaCat}
                                nameInput={nameInputs}
                                titulo={"Fin: "}
                                setItem={setAlumnos2}
                                token={session.user.token}
                                modalId="modal_alumnos2"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default AlumnosPorClase;