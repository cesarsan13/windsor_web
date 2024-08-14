"use client"
import React from 'react'
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Acciones from './components/Acciones';
import BuscarCat from '../components/BuscarCat';
import { useRouter } from "next/navigation";
import { Cobranza, Imprimir, ImprimirExcel } from '../utils/api/Rep_Femac_6/Rep_Femac_6';
import { formatDate } from '../utils/globalfn';
import { ReportePDF } from '../utils/ReportesPDF';
import { Worker, Viewer } from "@react-pdf-viewer/core";
import ModalVistaPreviaRep6 from './components/modalVistaPreviaRep6';
import Swal from 'sweetalert2'; // Importa SweetAlert2


function Rep_Femac_6() {
    const date = new Date();
    const dateStr = formatDate(date);
    const router = useRouter();
    const { data: session, status } = useSession();
    const [cajero, setCajero] = useState({})
    const [fechaIni, setFechaIni] = useState(dateStr.replace(/\//g, '-'));
    const [fechaFin, setFechaFin] = useState(dateStr.replace(/\//g, '-'));
    const [dataCobranza, setDataCobranza] = useState([])
    const [isLoading, setisLoading] = useState(false);
    const [pdfPreview, setPdfPreview] = useState(false);
    const [pdfData, setPdfData] = useState("");
    useEffect(() => {
        if (status === "loading" || !session) {
            return;
        }
        const fetchData = async () => {
            setisLoading(true);
            const { token } = session.user
            console.log(token)
            console.log(fechaFin)
            console.log(fechaIni)

            const id = cajero.numero
            console.log(id)
            const data = await Cobranza(token, fechaIni, fechaFin, id)
            setDataCobranza(data)
            setisLoading(false);
        }
        fetchData()
    }, [session, status, cajero, fechaFin, fechaIni])
    console.log(dataCobranza)
    if (status === "loading") {
        return (
            <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
        );
    }
    const home = () => {
        router.push("/");
    };
    const CerrarView = () => {
        setPdfPreview(false);
        setPdfData('');
    };
    const ImprimePDF = () => {
        const configuracion = {
            Encabezado: {
                Nombre_Aplicacion: "Nombre de la Aplicación",
                Nombre_Reporte: `Reporte de Cobranza Rango de Fecha del ${fechaIni} al ${fechaFin}`,
                Nombre_Usuario: `Usuario: ${session.user.name}`,
            },
            body: dataCobranza
        }
        Imprimir(configuracion, cajero.numero)
    }
    const ImprimeExcel = () => {
        const configuracion = {
            Encabezado: {
                Nombre_Aplicacion: "Sistema de Control Escolar",
                Nombre_Reporte: `Reporte de Cobranza Rango de Fecha del ${fechaIni} al ${fechaFin}`,
                Nombre_Usuario: `${session.user.name}`,
            },
            body1: dataCobranza.producto,
            body2: dataCobranza.tipo_pago,
            body3: dataCobranza.cajeros,
            columns1: [
                { header: "Producto", dataKey: "articulo" },
                { header: "Descripcion", dataKey: "descripcion" },
                { header: "Importe", dataKey: "precio_unitario" }
            ],
            columns2: [
                { header: "Tipo Cobro", dataKey: "tipo_pago" },
                { header: "Descripcion", dataKey: "descripcion" },
                { header: "Importe", dataKey: "importe" }
            ],
            columns3: [
                { header: "Cajero", dataKey: "cajero" },
                { header: "Descripcion", dataKey: "descripcion" },
                { header: "Importe", dataKey: "importe" }
            ],
            nombre: "Reporte de Cobranza"
        }
        console.log("hohoho", configuracion)
        ImprimirExcel(configuracion, cajero.numero);
    }
    console.log(cajero)
    const handleVerClick = () => {
        if (cajero.numero === 0 || cajero.numero === undefined) {
            Swal.fire({
                title: 'Opps',
                text: 'Por favor selecciona un cajero antes de continuar.',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
            return;
        }
        const configuracion = {
            Encabezado: {
                Nombre_Aplicacion: "Nombre de la Aplicación",
                Nombre_Reporte: `Reporte de Cobranza Rango de Fecha del ${fechaIni} al ${fechaFin}`,
                Nombre_Usuario: `Usuario: ${session.user.name}`,
            },
            body: dataCobranza
        }
        const reporte = new ReportePDF(configuracion)
        const Enca1 = (doc) => {
            if (!doc.tiene_encabezado) {
                doc.imprimeEncabezadoPrincipalV();
                doc.nextRow(4);
                doc.printLineV();
                doc.nextRow(4);
                doc.tiene_encabezado = true;
            } else {
                doc.nextRow(6);
                doc.tiene_encabezado = true;
            }
        };
        Enca1(reporte)
        //Productos
        const Tw_Pago = Array.from({ length: 100 }, () => Array(2).fill(0));
        if (cajero.numero === 0 || cajero.numero === undefined) {
            if (configuracion.body.producto.length > 0) {
                reporte.ImpPosX("Producto", 14, reporte.tw_ren);
                reporte.ImpPosX("Descripcion", 34, reporte.tw_ren);
                reporte.ImpPosX("Importe", 154, reporte.tw_ren);
                reporte.nextRow(4);
                let atr_ant = 0;
                let tot_ant = 0;
                let atr_des_ant = "";
                let importe_cobro = 0;
                let total_productos = 0;
                configuracion.body.producto.forEach((producto) => {
                    if (atr_ant !== producto.articulo && atr_ant !== 0) {
                        reporte.ImpPosX(atr_ant.toString(), 14, reporte.tw_ren);
                        reporte.ImpPosX(atr_des_ant.toString(), 34, reporte.tw_ren);
                        reporte.ImpPosX(tot_ant.toString(), 154, reporte.tw_ren);
                        total_productos = total_productos + tot_ant;
                        Enca1(reporte);
                        if (reporte.tw_ren >= reporte.tw_endRen) {
                            reporte.pageBreak();
                            Enca1(reporte);
                        }
                    }
                    importe_cobro = roundNumber(
                        producto.precio_unitario -
                        producto.precio_unitario * (producto.descuento / 100),
                        2
                    );
                    importe_cobro = importe_cobro * producto.cantidad;
                    tot_ant = tot_ant + importe_cobro;
                    atr_ant = producto.articulo;
                    atr_des_ant = producto.descripcion;
                })
                total_productos = total_productos + tot_ant;
                reporte.ImpPosX(atr_ant.toString(), 14, reporte.tw_ren);
                reporte.ImpPosX(atr_des_ant.toString(), 34, reporte.tw_ren);
                reporte.ImpPosX(tot_ant.toString(), 154, reporte.tw_ren);
                reporte.nextRow(5);
                reporte.ImpPosX("Total Productos", 34, reporte.tw_ren);
                reporte.ImpPosX(total_productos.toString(), 154, reporte.tw_ren);
                reporte.nextRow(15);
            } else {
                reporte.ImpPosX("Producto", 14, reporte.tw_ren);
                reporte.ImpPosX("Descripcion", 34, reporte.tw_ren);
                reporte.ImpPosX("Importe", 154, reporte.tw_ren);
                reporte.nextRow(5);
                let total_productos = 0;
                reporte.ImpPosX("Total Productos", 34, reporte.tw_ren);
                reporte.ImpPosX(total_productos.toString(), 154, reporte.tw_ren);
                reporte.nextRow(15);
            }
        }
        //tipo Cobro
        for (let Tw_count = 0; Tw_count < 20; Tw_count++) {
            Tw_Pago[Tw_count][0] = 0;
            Tw_Pago[Tw_count][1] = 0;
            Tw_Pago[Tw_count][2] = "";
        }
        if (configuracion.body.tipo_pago.length > 0) {
            reporte.ImpPosX("Tipo Pago", 14, reporte.tw_ren);
            reporte.ImpPosX("Descripcion", 34, reporte.tw_ren);
            reporte.ImpPosX("Importe", 154, reporte.tw_ren);
            reporte.nextRow(4);
            configuracion.body.tipo_pago.forEach((tipoPago) => {
                for (let Tw_count = 0; Tw_count < 20; Tw_count++) {
                    if (tipoPago.tipo_pago_1 === 0) break;
                    if (Tw_Pago[Tw_count][0] === tipoPago.tipo_pago_1) {
                        Tw_Pago[Tw_count][1] =
                            Number(Tw_Pago[Tw_count][1]) + Number(tipoPago.importe_pago_1);
                        break;
                    }
                    if (Tw_Pago[Tw_count][0] === 0) {
                        Tw_Pago[Tw_count][0] = tipoPago.tipo_pago_1;
                        Tw_Pago[Tw_count][1] = tipoPago.importe_pago_1;
                        Tw_Pago[Tw_count][2] = tipoPago.descripcion1;
                        break;
                    }
                    console.log("tipo_pago_1", Tw_Pago[Tw_count][0]);
                    console.log("importe_pago_1", Tw_Pago[Tw_count][1]);
                }
                for (let Tw_count = 0; Tw_count < 20; Tw_count++) {
                    if (tipoPago.tipo_pago_2 === 0) break;
                    if (Tw_Pago[Tw_count][0] === tipoPago.tipo_pago_2) {
                        Tw_Pago[Tw_count][1] =
                            Number(Tw_Pago[Tw_count][1]) + Number(tipoPago.importe_pago_2);
                        break;
                    }
                    if (Tw_Pago[Tw_count][0] === 0) {
                        Tw_Pago[Tw_count][0] = tipoPago.tipo_pago_2;
                        Tw_Pago[Tw_count][1] = tipoPago.importe_pago_2;
                        Tw_Pago[Tw_count][2] = tipoPago.descripcion2;
                        break;
                    }
                    console.log("tipo_pago_2", Tw_Pago[Tw_count][0]);
                    console.log("importe_pago_2", Tw_Pago[Tw_count][1]);
                }
            })
            let total_tipo_pago = 0;
            for (let Tw_count = 0; Tw_count < 20; Tw_count++) {
                if (Tw_Pago[Tw_count][0] === 0) break;
                reporte.ImpPosX(Tw_Pago[Tw_count][0].toString(), 14, reporte.tw_ren);
                reporte.ImpPosX(Tw_Pago[Tw_count][2].toString(), 34, reporte.tw_ren);
                reporte.ImpPosX(Tw_Pago[Tw_count][1].toString(), 154, reporte.tw_ren);
                total_tipo_pago = total_tipo_pago + Number(Tw_Pago[Tw_count][1]);
                Enca1(reporte);
                if (reporte.tw_ren >= reporte.tw_endRen) {
                    reporte.pageBreak();
                    Enca1(reporte);
                }
            }
            reporte.ImpPosX("Total Tipo Pago", 34, reporte.tw_ren);
            reporte.ImpPosX(total_tipo_pago.toString(), 154, reporte.tw_ren);
            reporte.nextRow(15);
        } else {
            reporte.ImpPosX("Tipo Pago", 14, reporte.tw_ren);
            reporte.ImpPosX("Descripcion", 34, reporte.tw_ren);
            reporte.ImpPosX("Importe", 154, reporte.tw_ren);
            reporte.nextRow(5);
            let total_tipo_pago = 0;
            reporte.ImpPosX("Total Tipo Pago", 34, reporte.tw_ren);
            reporte.ImpPosX(total_tipo_pago.toString(), 154, reporte.tw_ren);
            reporte.nextRow(15);
        }
        if (configuracion.body.cajeros.length > 0) {
            reporte.ImpPosX("Cajero", 14, reporte.tw_ren);
            reporte.ImpPosX("Descripcion", 34, reporte.tw_ren);
            reporte.ImpPosX("Importe", 154, reporte.tw_ren);
            reporte.nextRow(4);
            let cajero_ant = 0;
            let tot_cajero = 0;
            let cajero_desc_ant = "";
            let total_cajero = 0;
            configuracion.body.cajeros.forEach((cajero) => {
                if (cajero_ant !== cajero.cajero && cajero_ant !== 0) {
                    reporte.ImpPosX(cajero_ant.toString(), 14, reporte.tw_ren);
                    reporte.ImpPosX(cajero_desc_ant.toString(), 34, reporte.tw_ren);
                    reporte.ImpPosX(tot_cajero.toString(), 154, reporte.tw_ren);
                    total_cajero = total_cajero + tot_cajero;
                    Enca1(reporte);
                    if (reporte.tw_ren >= reporte.tw_endRen) {
                        reporte.pageBreak();
                        Enca1(reporte);
                    }
                }
                tot_cajero = Number(tot_cajero) + Number(cajero.importe_cobro);
                cajero_ant = cajero.cajero;
                cajero_desc_ant = cajero.nombre;
            })
            total_cajero = total_cajero + tot_cajero;
            reporte.ImpPosX(cajero_ant.toString(), 14, reporte.tw_ren);
            reporte.ImpPosX(cajero_desc_ant.toString(), 34, reporte.tw_ren);
            reporte.ImpPosX(tot_cajero.toString(), 154, reporte.tw_ren);
            reporte.nextRow(5);
            reporte.ImpPosX("Total Cajeros", 34, reporte.tw_ren);
            reporte.ImpPosX(total_cajero.toString(), 154, reporte.tw_ren);
        } else {
            reporte.ImpPosX("Cajero", 14, reporte.tw_ren);
            reporte.ImpPosX("Descripcion", 34, reporte.tw_ren);
            reporte.ImpPosX("Importe", 154, reporte.tw_ren);
            reporte.nextRow(4);
            let total_cajero = 0;
            reporte.ImpPosX("Total Cajeros", 34, reporte.tw_ren);
            reporte.ImpPosX(total_cajero.toString(), 154, reporte.tw_ren);
        }
        const pdfData = reporte.doc.output("datauristring")
        setPdfData(pdfData)
        setPdfPreview(true)
        showModalVista(true)

    }
    const showModalVista = (show) => {
        show
            ? document.getElementById("modalVRep6").showModal()
            : document.getElementById("modalVRep6").close();
    }
    function roundNumber(value, decimals) {
        const factor = Math.pow(10, decimals);
        return Math.round(value * factor) / factor;
    }
    return (
        <>
            <ModalVistaPreviaRep6 pdfPreview={pdfPreview} pdfData={pdfData} PDF={ImprimePDF} Excel={ImprimeExcel} />

            <div className='container w-full max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3'>
                <div className='flex justify-start p-3'>
                    <h1 className='text-4xl font-xthin text-black dark:text-white md:px-12'>
                        Reporte Resumen de Cobranza
                    </h1>
                </div>
                <div className="flex flex-col md:grid md:grid-cols-8 md:grid-rows-1 h-full">
                <div className="md:col-span-1 flex flex-col">
                        <Acciones home={home} ImprimePDF={ImprimePDF} Ver={handleVerClick} ImprimeExcel={ImprimeExcel} CerrarView={CerrarView} />
                    </div>
                    <div className='col-span-7'>
                        <div className='flex flex-col h-[calc(100%)]'>
                            <div className='flex flex-col md:flex-row gap-4'>
                                <div className='w-11/12 md:w-4/12 lg:w-3/12'>
                                    <label className='input input-bordered input-md text-black dark:text-white flex items-center gap-3'>
                                        Fecha Inicial
                                        <input
                                            type="date"
                                            value={fechaIni}
                                            onChange={(e) => setFechaIni(e.target.value)}
                                            className='rounded block grow text-black dark:text-white'
                                        />
                                    </label>
                                </div>
                                <div className='w-11/12 md:w-4/12 lg:w-3/12'>
                                    <label className={`input input-bordered input-md text-black dark:text-white flex items-center gap-3`}>
                                        Fecha Final
                                        <input
                                            type="date"
                                            value={fechaFin}
                                            onChange={(e) => setFechaFin(e.target.value)}
                                            className='rounded block grow text-black dark:text-white'
                                        />
                                    </label>
                                </div>
                            </div>
                            <div className='mt-4'>
                                <BuscarCat
                                    table={"cajeros"}
                                    titulo={"Cajeros: "}
                                    token={session.user.token}
                                    fieldsToShow={["numero", "nombre"]}
                                    nameInput={["numero", "nombre"]}
                                    setItem={setCajero}
                                    modalId={"modal_Cajeros"}
                                    />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

}

export default Rep_Femac_6
