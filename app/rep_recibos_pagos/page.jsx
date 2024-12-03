"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Acciones from "@/app/rep_recibos_pagos/components/Acciones";
import {
    ImprimirPDF,
    Enca1,
    getCobranza,
} from "@/app/utils/api/rep_recibos_pagos/rep_recibos_pagos";
import { getAlumnos } from "@/app/utils/api/alumnos/alumnos";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import BuscarCat from "@/app/components/BuscarCat";
import { showSwal } from "@/app/utils/alerts";
import "jspdf-autotable";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import VistaPrevia from "@/app/components/VistaPrevia";
import { getHorarios } from "@/app/utils/api/horarios/horarios";
import { formatNumber, PoneCeros } from "../utils/globalfn";

function RecibosPagos() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [alumnoIni, setAlumnoIni] = useState({});
    const [alumnoFin, setAlumnoFin] = useState({});
    const [alumnosFiltrados, setAlumnosFiltrados] = useState([]);
    const [docsCobranza, setDocsCobranza] = useState([]);
    const [docsCobranzaFiltrados, setDocsCobranzaFiltrados] = useState([]);
    const [alumnos, setAlumnos] = useState([]);
    const [horarios, setHorarios] = useState([]);
    const [sinDeudores, setSinDeudores] = useState(false);
    const [grupoAlumno, setGrupoAlumno] = useState(false);
    const [pdfPreview, setPdfPreview] = useState(false);
    const [animateLoading, setAnimateLoading] = useState(false);
    const [pdfData, setPdfData] = useState("");
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const formattedToday = `${yyyy}-${mm}-${dd}`;
    const [fecha, setFecha] = useState(formattedToday);
    // const alumno1A = alumnos1 === undefined ? 0 : alumnos1.numero;
    // const alumno2A = alumnos2 === undefined ? 0 : alumnos2.numero;
    const configuracion = {
        Encabezado: {
            Nombre_Aplicacion: "Sistema de Control Escolar",
            Nombre_Reporte: "Reporte Recibo de Pagos",
            Nombre_Usuario: `Usuario: ${session?.user.name}`,
        },
        body: alumnosFiltrados,
    };

    useEffect(() => {
        if (status === "loading" || !session) {
            return;
        }
        const fetchData = async () => {
            const { token } = session.user;
            const [dataA, dataH] =
                await Promise.all([
                    // getCobranza(token),
                    getAlumnos(token, false),
                    getHorarios(token, false)
                ]);
            // setDocsCobranza(dataC);
            setAlumnos(dataA);
            setHorarios(dataH);
        };
        fetchData();
    }, [session, status]);

    // const calculateSaldo = (item) => {
    //     const importe = parseFloat(item.importe) || 0;
    //     const importePago = parseFloat(item.importe_pago) || 0;
    //     const descuento = parseFloat(item.descuento) || 0;
    //     const saldo = (importe - importePago) - (importe * (descuento / 100));
    //     return formatNumber(saldo);
    // };

    const handleVerClick = async () => {
        setAnimateLoading(true);
        CerrarView();
        const { token } = session.user;
        if (!alumnoIni.numero) {
            showSwal(
                "Oppss!",
                "Para imprimir, mínimo debe estar seleccionado un Alumno de 'Inicio'",
                "error"
            );
            setAnimateLoading(false);
            return;
        }
        if (!fecha) {
            showSwal(
                "Oppss!",
                "Para imprimir, debe tener seleccionado una 'Fecha'",
                "error"
            );
            setAnimateLoading(false);
            return;
        }
        // const newPDF = new ReportePDF(configuracion, "Landscape");
        const newPDF = new ReportePDF(configuracion, "Portraity");
        let alumnAnt = null;
        let siImp = false;
        let saldo_total = 0;
        let alumnoData = {};
        const docsCobranzaFiltrados = await getCobranza(
            token,
            fecha,
            alumnoIni.numero,
            alumnoFin.numero,
            sinDeudores,
        );
        setDocsCobranza(docsCobranzaFiltrados);
        docsCobranzaFiltrados.forEach((item, index) => {
            if (alumnAnt !== item.alumno) {
                if (alumnAnt !== null) {
                    const ref = "100910" + PoneCeros(parseInt(alumnAnt), 4);
                    newPDF.tw_ren = 260;
                    newPDF.ImpPosX(`C A N T I D A D    A    P A G A R           ${formatNumber(saldo_total)}`, 100, newPDF.tw_ren, 0, "C");
                    newPDF.nextRow(5);
                    newPDF.ImpPosX(`EL PAGO DEBERÁ HACERSE EN BBVA, S.A.   REFERENCIA...${ref}`, 100, newPDF.tw_ren, 0, "C");
                    newPDF.nextRow(5);
                    newPDF.ImpPosX("UNICAMENTE PARA TRANSFERENCIAS ELECTRONICAS CLABE 012180004505271730", 100, newPDF.tw_ren, 0, "C");
                    newPDF.nextRow(5);
                    newPDF.ImpPosX("PONER EN CONCEPTO NUMERO DE REFERENCIA", 100, newPDF.tw_ren, 0, "C");
                    newPDF.nextRow(5);
                    newPDF.ImpPosX("FAVOR DE NO HACER CORRECCIONES      REALIZAR PAGO EXACTO", 100, newPDF.tw_ren, 0, "C");
                    newPDF.nextRow(5);
                    saldo_total = 0
                }
                alumnoData = alumnos.find(alumno => alumno.numero === item.alumno);
                siImp = alumnoData && alumnoData.baja !== "*" && item.tw_saldo >= 0.09;
                if (siImp) {
                    newPDF.tw_ren = 280;
                    Enca1(newPDF, alumnoData.nombre, alumnoData.horario_1_nombre, fecha);
                };
            };

            Enca1(newPDF, alumnoData.nombre, alumnoData.horario_1_nombre, fecha);
            if (newPDF.tw_ren >= newPDF.tw_endRen - 30) {
                newPDF.pageBreak();
                Enca1(newPDF, alumnoData.nombre, alumnoData.horario_1_nombre, fecha);
            };

            if (siImp && item.tw_saldo >= 0.09) {
                newPDF.ImpPosX(item.producto.toString(), 25, newPDF.tw_ren, 0, "R");
                newPDF.ImpPosX(item.producto_descripcion.toString(), 40, newPDF.tw_ren, 0, "L");
                newPDF.ImpPosX(item.numero_doc.toString(), 135, newPDF.tw_ren, 0, "R");
                newPDF.ImpPosX(item.fecha.toString(), 140, newPDF.tw_ren, 0, "L");
                newPDF.ImpPosX(formatNumber(item.tw_saldo.toString()), 190, newPDF.tw_ren, 0, "R");
                saldo_total = saldo_total + item.tw_saldo;
            };
            alumnAnt = item.alumno;

            if (index === docsCobranzaFiltrados.length - 1) {
                const ref = "100910" + PoneCeros(parseInt(alumnAnt), 4);
                newPDF.tw_ren = 260;
                newPDF.ImpPosX(`C A N T I D A D    A    P A G A R           ${formatNumber(saldo_total)}`, 100, newPDF.tw_ren, 0, "C");
                newPDF.nextRow(5);
                newPDF.ImpPosX(`EL PAGO DEBERÁ HACERSE EN BBVA, S.A.   REFERENCIA...${ref}`, 100, newPDF.tw_ren, 0, "C");
                newPDF.nextRow(5);
                newPDF.ImpPosX("UNICAMENTE PARA TRANSFERENCIAS ELECTRONICAS CLABE 012180004505271730", 100, newPDF.tw_ren, 0, "C");
                newPDF.nextRow(5);
                newPDF.ImpPosX("PONER EN CONCEPTO NUMERO DE REFERENCIA", 100, newPDF.tw_ren, 0, "C");
                newPDF.nextRow(5);
                newPDF.ImpPosX("FAVOR DE NO HACER CORRECCIONES      REALIZAR PAGO EXACTO", 100, newPDF.tw_ren, 0, "C");
                newPDF.nextRow(5);
                saldo_total = 0
            }
        });
        const pdfData = newPDF.doc.output("datauristring");
        setPdfData(pdfData);
        setPdfPreview(true);
        showModalVista(true);
        setAnimateLoading(false);
    };

    const ImprimePDF = async () => {
        ImprimirPDF(configuracion);
    };

    const showModalVista = (show) => {
        show
            ? document.getElementById("modalReciboPagos").showModal()
            : document.getElementById("modalReciboPagos").close();
    };

    const CerrarView = () => {
        setPdfPreview(false);
        setPdfData("");
        document.getElementById("modalReciboPagos").close();
    };

    const home = () => {
        router.push("/");
    };

    if (status === "loading") {
        return (
            <div className="container skeleton w-full max-w-screen-xl shadow-xl rounded-xl"></div>
        );
    };

    return (
        <>
            <VistaPrevia
                id={"modalReciboPagos"}
                titulo={"Vista Previa Recibos de Pagos"}
                pdfPreview={pdfPreview}
                pdfData={pdfData}
                PDF={ImprimePDF}
                CerrarView={CerrarView}
            />
            <div className="flex flex-col justify-start items-start bg-base-200 shadow-xl rounded-xl dark:bg-slate-700 h-full max-[420px]:w-full w-11/12">
                <div className="w-full py-3">
                    <div className="flex flex-col justify-start p-3 max-[600px]:p-0">
                        <div className="flex flex-wrap items-start md:items-center mx-auto">
                            <div className="order-2 md:order-1 flex justify-between w-full md:w-auto mb-0">
                                <Acciones home={home} Ver={handleVerClick} isLoading={animateLoading} />
                            </div>
                            <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
                                Reporte Recibo de Pagos.
                            </h1>
                        </div>
                    </div>
                </div>
                <div className="w-full py-3 flex flex-col gap-y-4">
                    <div className=" max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4  w-1/2 mx-auto ">
                        <div className="flex min-[1920px]:flex-row flex-col min-[1920px]:space-x-4">
                            <div className="lg:w-fit md:w-fit pb-5">
                                <label className="input input-bordered input-md text-black dark:text-white flex items-center max-[430px]:gap-1 gap-3 w-auto lg:w-fit md:w-full">
                                    Fecha Ini.
                                    <input
                                        type="date"
                                        value={fecha}
                                        onChange={(e) => setFecha(e.target.value)}
                                        className="rounded block grow text-black max-[500px]:w-[100px] w-auto dark:text-white border-b-2 border-slate-300 dark:border-slate-700 "
                                    />
                                </label>
                            </div>
                            <div className="pb-5">
                                <BuscarCat
                                    table="alumnos"
                                    fieldsToShow={["numero", "nombre_completo"]}
                                    nameInput={["numero", "nombre_completo"]}
                                    titulo={"Alumno Inicio: "}
                                    setItem={setAlumnoIni}
                                    token={session.user.token}
                                    modalId="modal_alumnos1"
                                    alignRight={true}
                                    inputWidths={{ first: "50px", second: "400px" }}
                                    descClassName="md:mt-0 w-full"
                                    contClassName="flex flex-row md:flex-row justify-start gap-2 sm:flex-row w-full"
                                />
                            </div>
                            <BuscarCat
                                table="alumnos"
                                fieldsToShow={["numero", "nombre_completo"]}
                                nameInput={["numero", "nombre_completo"]}
                                titulo={"Alumno Fin:"}
                                setItem={setAlumnoFin}
                                token={session.user.token}
                                modalId="modal_alumnos2"
                                alignRight={true}
                                inputWidths={{ first: "50px", second: "400px" }}
                                descClassName="md:mt-0 w-full"
                                contClassName="flex flex-row md:flex-row justify-start gap-2 sm:flex-row w-full"
                            />
                        </div>
                    </div>
                    <div className="flex flex-row">
                        <div className=" max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4 w-1/2 mx-auto ">
                            <div className="flex space-x-4">
                                <div className="tooltip" data-tip="Sin Deudores">
                                    <label
                                        htmlFor="ch_sin_deudores"
                                        className="label cursor-pointer flex items-center space-x-2"
                                    >
                                        <input
                                            id="ch_sin_deudores"
                                            type="checkbox"
                                            className="checkbox checkbox-md"
                                            defaultChecked={true}
                                            onClick={(evt) => setSinDeudores(evt.target.checked)}
                                        />
                                        <span className="label-text font-bold hidden sm:block text-neutral-600 dark:text-neutral-200">
                                            Sin Deudores
                                        </span>
                                    </label>
                                </div>
                                <div className="tooltip" data-tip="Imprimir Grupo, Alumno">
                                    <label
                                        htmlFor="ch_impr_grupo_alumno"
                                        className="label cursor-pointer flex items-center space-x-2"
                                    >
                                        <input
                                            id="ch_impr_grupo_alumno"
                                            type="checkbox"
                                            className="checkbox checkbox-md"
                                            onClick={(evt) => setGrupoAlumno(evt.target.checked)}
                                        />
                                        <span className="label-text font-bold hidden sm:block text-neutral-600 dark:text-neutral-200">
                                            Imprimir Grupo, Alumno
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default RecibosPagos;
