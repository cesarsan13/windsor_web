'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import Acciones from './components/Acciones'
import { formatDate } from '../utils/globalfn';
import { Documentos, grupo_cobranza, Imprimir, ImprimirExcel } from '../utils/api/Rep_Femac_7/Rep_Femac_7';
import { useSession } from 'next-auth/react';
import { ReportePDF } from '../utils/ReportesPDF';
import '@react-pdf-viewer/core/lib/styles/index.css';
import ModalVistaPreviaReporteAdeudoPendientes from './components/modalVistaPreviaRepAdeudoPendiente';


function Repo_Femac_7() {
    const date = new Date();
    const dateStr = formatDate(date);
    const router = useRouter();
    const { data: session, status } = useSession();
    const [fecha, setFecha] = useState(dateStr.replace(/\//g, '-'));
    const [documento, setDocumento] = useState(0);
    const [sinDeudores, setSinDeudores] = useState(true);
    const [grupoAlumno, setGrupoAlumno] = useState(false);
    const [pdfPreview, setPdfPreview] = useState(false);
    const [pdfData, setPdfData] = useState("");
    const home = () => {
        router.push("/");
    };
    const ImprimePDF = () => {
        const configuracion = {
            Encabezado: {
                Nombre_Aplicacion: "Nombre de la Aplicación",
                Nombre_Reporte: `Reporte de Reporte de Adeudos Pendientes al ${fecha}`,
                Nombre_Usuario: `Usuario: ${session.user.name}`,
            },
        }
        const { token } = session.user
        Imprimir(configuracion, grupoAlumno, token, fecha, sinDeudores, documento)
    }
    const ImprimeExcel = () => {
        const configuracion = {
            Encabezado: {
                Nombre_Aplicacion: "Sistema de Control Escolar",
                Nombre_Reporte: `Reporte de Reporte de Adeudos Pendientes al ${fecha}`,
                Nombre_Usuario: `${session.user.name}`,
            },
            columns: [
                { header: "Alumno", dataKey: "alumno" },
                { header: "Nombre", dataKey: "nombre" },
                { header: "Producto", dataKey: "producto" },
                { header: "Descripción", dataKey: "descripcion" },
                { header: "Fecha", dataKey: "fecha" },
                { header: "Saldo", dataKey: "saldo" },
                { header: "Total", dataKey: "total" },
                { header: "Telefono", dataKey: "telefono" },
            ],
            nombre: "Reporte de Adeudos Pendientes"
        }
        const { token } = session.user
        ImprimirExcel(configuracion, grupoAlumno, token, fecha, sinDeudores, documento)
    }
    const handleVerClick = async () => {
        const configuracion = {
            Encabezado: {
                Nombre_Aplicacion: "Nombre de la Aplicación",
                Nombre_Reporte: `Reporte de Reporte de Adeudos Pendientes al ${fecha}`,
                Nombre_Usuario: `Usuario: ${session.user.name}`,
            },
        }
        const orientacion = "landscape";
        const reporte = new ReportePDF(configuracion, orientacion);
        const Enca1 = (doc) => {
            if (!doc.tiene_encabezado) {
                doc.imprimeEncabezadoPrincipalH();
                doc.nextRow(12);
                doc.ImpPosX("Alumno", 14, doc.tw_ren);
                doc.ImpPosX("Nombre", 28, doc.tw_ren);
                doc.ImpPosX("Producto", 108, doc.tw_ren);
                doc.ImpPosX("Descripcion", 128, doc.tw_ren);
                doc.ImpPosX("Fecha", 208, doc.tw_ren);
                doc.ImpPosX("Saldo", 228, doc.tw_ren);
                doc.ImpPosX("Total", 248, doc.tw_ren);
                doc.ImpPosX("Telefono", 268, doc.tw_ren);
                doc.nextRow(4);
                doc.printLineH();
                doc.nextRow(4);
                doc.tiene_encabezado = true;
            } else {
                doc.nextRow(6);
                doc.tiene_encabezado = true;
            }
        };
        Enca1(reporte)
        const { token } = session.user
        if (grupoAlumno) {
            const data = await grupo_cobranza(token)
            let num_Ord = 0;
            let nom_grupo = "";
            let grupo_ant = "";
            let grupo_act = "";

            for (const dato of data) {
                if (dato.horario_1 > 0) {
                    grupo_act = dato.horario_1;

                    if (grupo_ant !== grupo_act) {
                        num_Ord = 1;
                        nom_grupo = dato.horario;
                    }

                    const res = await fetch(
                        `${process.env.DOMAIN_API}api/documentoscobranza/grupo`,
                        {
                            method: "PUT",
                            body: JSON.stringify({
                                alumno: dato.id,
                                nomGrupo: dato.horario,
                                numOrd: num_Ord,
                                baja: dato.baja,
                            }),
                            headers: new Headers({
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            }),
                        }
                    );
                    if (res.status) break;
                    grupo_ant = grupo_act;
                }
            }
        }
        let si_Imp;
        let alu_Ant = 0;
        let alu_Act = 0;
        let total_General = 0;
        let grupo_ant = "";
        let grupo_act = "";
        let nombre;
        let saldo;
        let saldoTotal = 0; // Inicializa saldoTotal a 0
        const data = await Documentos(token, fecha, grupoAlumno);
        const documentos = data.documentos;
        const indeces = data.indeces;
        const alumnos = data.alumnos;
        documentos.forEach((doc, index) => {
            grupo_act = doc.grupo;
            alu_Act = doc.alumno;
            if (grupoAlumno) {
                if (grupo_act !== grupo_ant) {
                    reporte.ImpPosX("Grupo " + grupo_act, 14, reporte.tw_ren);
                    reporte.nextRow(4);
                }
            }
            if (alu_Ant !== doc.alumno) {
                const incide = indeces.find((ind) => ind.Alumno === alu_Act);
                si_Imp = incide && incide.Incide >= documento;

                if (sinDeudores === true) {
                    const estatus = alumnos.find((alu) => alu.id === alu_Act);
                    if (
                        estatus.estatus.toUpperCase() === "DEUDOR" ||
                        estatus.estatus.toUpperCase() === "CARTERA"
                    ) {
                        si_Imp = false;
                    }
                }
            }
            if (si_Imp === true) {
                reporte.ImpPosX(alu_Act.toString(), 14, reporte.tw_ren);
                const data = alumnos.find((alu) => alu.id === alu_Act);
                nombre = data.nombre;
                reporte.ImpPosX(nombre.toString(), 28, reporte.tw_ren);
                reporte.ImpPosX(doc.producto.toString(), 108, reporte.tw_ren);
                reporte.ImpPosX(doc.descripcion.toString(), 128, reporte.tw_ren);
                reporte.ImpPosX(doc.fecha.toString(), 208, reporte.tw_ren);
                saldo = doc.importe - doc.importe * (doc.descuento / 100);
                saldoTotal += saldo;
                total_General += saldo;
                reporte.ImpPosX(saldo.toFixed(2).toString(), 228, reporte.tw_ren);

                const isLastRecordForAlumno =
                    index === documentos.length - 1 ||
                    documentos[index + 1].alumno !== alu_Act;

                if (isLastRecordForAlumno) {
                    reporte.ImpPosX(saldoTotal.toFixed(2).toString(), 248, reporte.tw_ren);
                    reporte.ImpPosX(data.telefono_1.toString(), 268, reporte.tw_ren);
                    saldoTotal = 0;
                    reporte.nextRow(5);
                }

                Enca1(reporte);
                if (reporte.tw_ren >= reporte.tw_endRen) {
                    reporte.pageBreakH();
                    Enca1(reporte);
                }
            }
            grupo_ant = grupo_act;
            alu_Ant = alu_Act;
        });
        reporte.ImpPosX("Total General", 208, reporte.tw_ren);
        reporte.ImpPosX(total_General.toFixed(2).toString(), 248, reporte.tw_ren);
        const pdfData = reporte.doc.output("datauristring")
        setPdfData(pdfData);
        setPdfPreview(true);
        showModalVista(true);
    }

    const showModalVista = (show) => {
        show
          ? document.getElementById("modalVPRepAdeudosPendientes").showModal()
          : document.getElementById("modalVPRepAdeudosPendientes").close();
      }
    return (
        <>
        <ModalVistaPreviaReporteAdeudoPendientes
           pdfPreview={pdfPreview} 
           pdfData={pdfData} 
           PDF={ImprimePDF} 
           Excel = {ImprimeExcel} 
        />
            <div className='container w-full  max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3'>
                <div className='flex justify-start p-3 '>
                    <h1 className='text-4xl font-xthin text-black dark:text-white md:px-12'>
                        Reporte Adeudos Pendientes
                    </h1>
                </div>
                <div className="flex flex-col md:grid md:grid-cols-8 md:grid-rows-1 h-full">
                <div className="md:col-span-1 flex flex-col">
                        <Acciones home={home} Ver={handleVerClick} />
                    </div>
                    <div className='col-span-7'>
                        <div className='flex flex-col h-[calc(100%)]'>
                            <div className='flex flex-col gap-4 md:flex-row'>
                                    <label className='input input-bordered input-md text-black dark:text-white flex items-center gap-3'>
                                        Fecha
                                        <input
                                            type="date"
                                            value={fecha}
                                            onChange={(e) => setFecha(e.target.value)}
                                            className='text-black dark:text-white'
                                        />
                                    </label>

                                    <label className='input input-bordered input-md text-black dark:text-white flex items-center gap-3'>
                                        Documento
                                        <input
                                            type="text"
                                            value={documento}
                                            onChange={(e) => setDocumento(e.target.value)}
                                            className='text-black dark:text-white'
                                        />
                                    </label>

                                <div className='w-full sm:w-full m:w-full lg:w-7/12 flex flex-col sm:flex-col md:flex-row lg:flex-row items-start gap-2'>
                                    <label htmlFor="ch_sinDeudores" className="label cursor-pointer flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="ch_sinDeudores"
                                            className="checkbox mx-2 checkbox-md"
                                            checked={sinDeudores}
                                            onClick={(evt) => setSinDeudores(evt.target.checked)}
                                        />
                                        <span className="label-text font-bold  sm:block text-neutral-600 dark:text-neutral-200">Sin Deudores</span>
                                    </label>
                                    <label htmlFor="ch_grupoAlumno" className="label cursor-pointer flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="ch_grupoAlumno"
                                            className="checkbox mx-2 checkbox-md"
                                            onClick={(evt) => setGrupoAlumno(evt.target.checked)}
                                        />
                                        <span className="label-text font-bold  sm:block text-neutral-600 dark:text-neutral-200">Imprimir Grupo, Alumno</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Repo_Femac_7
