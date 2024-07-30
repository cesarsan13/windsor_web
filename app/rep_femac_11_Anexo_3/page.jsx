"use client"
import React from "react"
import { useRouter } from "next/navigation";
import Acciones from "@/app/rep_femac_8_anexo_1/components/Acciones";
import Inputs from "@/app/rep_femac_8_anexo_1/components/Inputs";
import { useForm } from "react-hook-form";
import {
    getRelaciondeRecibos,
    Imprimir,
    ImprimirExcel,
    verImprimir,
} from "@/app/utils/api/rep_femac_11_Anexo_3/rep_femac_11_Anexo_3";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import BuscarCat from "@/app/components/BuscarCat";
import { showSwal } from "@/app/utils/alerts";
import "jspdf-autotable";
import { Worker, Viewer } from "@react-pdf-viewer/core";


function CobranzaPorAlumno(){
    const router = useRouter();
    const { data: session, status } = useSession();
    let [fecha_ini, setFecha_ini] = useState("");
    let [fecha_fin, setFecha_fin] = useState("");
    let [alumno_ini, setAlumnoIni] = useState("");
    let [alumno_fin, setAlumnoFin] = useState("");
    let [cajero_ini, setCajeroIni] = useState("");
    let [cajero_fin, setCajeroFin] = useState("");
    const [tomaFechas, setTomaFechas] = useState(true);
    const [pdfPreview, setPdfPreview] = useState(false);
    const [pdfData, setPdfData] = useState("");

    const {
        formState: { errors },
    } = useForm({});

    const home = () => {
        router.push("/");
    };

    const handleVerClick = async () => {
        console.log("a");
        console.log(fecha_ini, fecha_fin);
        console.log(alumno_ini, alumno_fin);
        console.log(cajero_ini, cajero_fin);
        console.log(tomaFechas);
    };

    const CerrarView = () => {
        setPdfPreview(false);
        setPdfData('');
    };

    const ImprimePDF = async () => {
        console.log("a");
    };

    const ImprimeExcel = async () => {
        console.log("a");       
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
                Relación de Recibos
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
                        
                        <div className="tooltip pt-1" data-tip="Tomar Fechas">
                            <label htmlFor="ch_tomaFechas" className="label cursor-pointer flex items-center space-x-2">
                                <input
                                    id="ch_tomaFechas"
                                    type="checkbox"
                                    className="checkbox checkbox-md"
                                    defaultChecked={true}
                                    onClick={(evt) => setTomaFechas(evt.target.checked)}
                                />
                                <span className="label-text font-bold hidden sm:block text-neutral-600 dark:text-neutral-200">Toma Fechas</span>
                            </label>
                        </div>
                    </div>
                  
                    <div className="flex space-x-4">
                        <BuscarCat
                            table="alumnos"
                            itemData={[]}
                            fieldsToShow={["id", "nombre_completo"]}
                            nameInput={["id", "nombre_completo"]}
                            titulo={"Inicio: "}
                            setItem={setAlumnoIni}
                            token={session.user.token}
                            modalId="modal_alumnos1"
                        />
                        <BuscarCat
                            table="alumnos"
                            itemData={[]}
                            fieldsToShow={["id", "nombre_completo"]}
                            nameInput={["id", "nombre_completo"]}
                            titulo={"Fin: "}
                            setItem={setAlumnoFin}
                            token={session.user.token}
                            modalId="modal_alumnos2"
                        />
                    </div>
                    <div className="flex space-x-4">
                        <BuscarCat
                            table="cajeros"
                            itemData={[]}
                            fieldsToShow={["numero", "nombre"]}
                            nameInput={["numero", "nombre"]}
                            titulo={"Inicio: "}
                            setItem={setCajeroIni}
                            token={session.user.token}
                            modalId="modal_cajeros1"
                        />
                        <BuscarCat
                            table="cajeros"
                            itemData={[]}
                            fieldsToShow={["numero", "nombre"]}
                            nameInput={["numero", "nombre"]}
                            titulo={"Fin: "}
                            setItem={setCajeroFin}
                            token={session.user.token}
                            modalId="modal_cajeros2"
                        />
                    </div>
                    <div className="col-span-7">
                        <div className="flex flex-col h-[calc(95%)] w-full bg-white dark:bg-white">
                            {pdfPreview && pdfData && (
                                <div className="pdf-preview flex overflow-auto border border-gray-300 rounded-lg shadow-lg">
                                    <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                                        <div style={{ height: "500px", width: "100%" }}>
                                            <Viewer fileUrl={pdfData} />
                                        </div>
                                    </Worker>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    );
}

export default CobranzaPorAlumno;