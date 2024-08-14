"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Acciones from "@/app/rep_inscritos/components/Acciones";
import Inputs from "@/app/rep_inscritos/components/Inputs";
import { useForm } from "react-hook-form";
import {
    getConsultasInscripcion,
    Imprimir,
    ImprimirExcel,
    verImprimir,
} from "@/app/utils/api/rep_inscritos/rep_inscritos";
import { formatDate } from "@/app/utils/globalfn";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { showSwal } from "@/app/utils/alerts";
import BuscarCat from "@/app/components/BuscarCat";
import "jspdf-autotable";
import ModalVistaPreviaRepInsc from "@/app/rep_inscritos/components/ModalVistaPreviaRepInsc";

function AltasBajasAlumnos() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const date = new Date();
    const dateStr = formatDate(date);
    let [fecha_ini, setFecha_ini] = useState(dateStr.replace(/\//g, '-'));
    let [fecha_fin, setFecha_fin] = useState(dateStr.replace(/\//g, '-'));
    let [alumnosFiltrados, setAlumnosFiltrados] = useState([]);
    const [pdfPreview, setPdfPreview] = useState(false);
    const [pdfData, setPdfData] = useState("");
    const [isLoading, setisLoading] = useState(false);
    const {
        formState: { errors },
    } = useForm({});

    // const formaImprime = async () => {
    //     let res;
    //     let si_inscrito = false;
    //     let si_suma = false;
    //     let alumnos = 0;
    //     let det_inscripcion = 0;
    //     let total_inscripcion = 0;
    //     let fecha_inscripcion = "";
    //     let fecha_inscrip = "";
    //     let horario_1 = 0;
    //     const { token } = session.user;
    //     const fechaIni = fecha_ini ? fecha_ini.replace(/-/g, "/") : 0;
    //     const fechaFin = fecha_fin ? fecha_fin.replace(/-/g, "/") : 0;

    //     // res = await getConsultasInscripcion(token);
    //     // if (res.status) {
    //     let dataAlumnos = res.data_alumnos;
    //     let dataDetalles = res.data_detalle;
    //     let dataProductos = res.data_productos;
    //     let dataHorarios = res.data_horarios;

    //     for (const item of dataAlumnos) {
    //         const detalleEncontrado = dataDetalles.find(detalle =>
    //             detalle.alumno === item.id &&
    //             detalle.fecha >= fechaIni &&
    //             detalle.fecha <= fechaFin
    //         );
    //         if (detalleEncontrado) {
    //             for (const producto of dataProductos) {
    //                 const productoEncontrado = dataProductos.find(producto =>
    //                     producto.ref === 'INS' &&
    //                     producto.id === producto.articulo
    //                 );
    //                 if (productoEncontrado) {
    //                     si_inscrito = true;
    //                     si_suma = true;
    //                     det_inscripcion += producto.precio_unitario * producto.cantidad;
    //                     total_inscripcion += producto.precio_unitario * producto.cantidad;
    //                 }; fecha_inscripcion = producto.fecha;
    //             }
    //             if (si_suma) {
    //                 const horarioEncontrado = dataHorarios.fin(
    //                     horario => horario.numero === item.horario_1
    //                 );
    //                 if (horarioEncontrado) {
    //                     //imprime algo imp_pos 70, AllTrim(RsHorario!Horario), 3
    //                 }
    //                 //imprime otro algo  imp_pos 90, Fecha_Inscripcion, 4
    //                 //imprime otro algo  imp_pos_Izq 120, Formato_Imprime(Det_Inscripcion, 2), 5
    //                 alumnos += 1;
    //             }
    //             det_inscripcion = 0;
    //         }
    //     }
    //     // } else { showSwal(res.alert_title, res.alert_text, res.alert_icon); }

    //     // return data;
    // };

    const handleVerClick = async () => {
        setisLoading(true);
        const { token } = session.user;
        const res = await getConsultasInscripcion(token);
        const configuracion = {
            Encabezado: {
                Nombre_Aplicacion: "Sistema de Control Escolar",
                Nombre_Reporte: "Reporte Relación de Recibos",
                Nombre_Usuario: `Usuario: ${session.user.name}`,
            },
            bodyAlumnos: res.data_alumnos,
            bodyDetalles: res.data_detalle,
            bodyProductos: res.data_productos,
            bodyHorarios: res.data_horarios,
            fecha_ini: fecha_ini,
            fecha_fin: fecha_fin,
        };
        const pdfData = await verImprimir(configuracion);
        setPdfData(pdfData);
        setPdfPreview(true);
        setisLoading(false);
        showModalVista(true);
    };

    const ImprimePDF = async () => {
        const { token } = session.user;
        const res = await getConsultasInscripcion(token);
        const configuracion = {
            Encabezado: {
                Nombre_Aplicacion: "Sistema de Control Escolar",
                Nombre_Reporte: "Reporte Relación de Recibos",
                Nombre_Usuario: `Usuario: ${session.user.name}`,
            },
            bodyAlumnos: res.data_alumnos,
            bodyDetalles: res.data_detalle,
            bodyProductos: res.data_productos,
            bodyHorarios: res.data_horarios,
            fecha_ini: fecha_ini,
            fecha_fin: fecha_fin,
        };
        Imprimir(configuracion);
    };

    const ImprimeExcel = async () => {
        const { token } = session.user;
        const res = await getConsultasInscripcion(token);
        const configuracion = {
            Encabezado: {
                Nombre_Aplicacion: "Sistema de Control Escolar",
                Nombre_Reporte: "Reporte Relación de Recibos",
                Nombre_Usuario: `Usuario: ${session.user.name}`,
            },
            bodyAlumnos: res.data_alumnos,
            bodyDetalles: res.data_detalle,
            bodyProductos: res.data_productos,
            bodyHorarios: res.data_horarios,
            fecha_ini: fecha_ini,
            fecha_fin: fecha_fin,
            columns: [
                { header: "No.", dataKey: "id" },
                { header: "Nombre", dataKey: "nombre" },
                { header: "Grado", dataKey: "horario" },
                { header: "Fecha", dataKey: "fecha_inscripcion" },
                { header: "Importe", dataKey: "det_inscripcion" },
            ],
            nombre: "Reporte Alumnos Inscritos",
        };
        ImprimirExcel(configuracion);
    };

    const home = () => {
        router.push("/");
    };

    const showModalVista = (show) => {
        show
            ? document.getElementById("modalVPRepInsc").showModal()
            : document.getElementById("modalVPRepInsc").close();
    };

    if (status === "loading") {
        return (
            <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
        );
    }
    return (
        <>
            <ModalVistaPreviaRepInsc
                pdfPreview={pdfPreview}
                pdfData={pdfData}
                PDF={ImprimePDF}
                Excel={ImprimeExcel}
            />
            <div className="container w-full max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3">
                <div className="flex justify-start p-3">
                    <h1 className="text-4xl font-xthin text-black dark:text-white md:px-12">
                        Relación de Alumnos Inscritos
                    </h1>
                </div>
                <div className="flex flex-col md:grid md:grid-cols-8 md:grid-rows-1">
                    <div className="md:col-span-1 flex flex-col">
                        <Acciones
                            home={home}
                            Ver={handleVerClick}
                            isLoading={isLoading} />
                    </div>
                    <div className="overflow-y-auto lg:col-span-7 md:col-span-7 sm:col-span-full h-[calc(45vh)] space-y-3">
                        <div className="flex flex-col lg:flex-row md:flex-row sm:col-span-1 lg:col-span-10 md:space-x-1">
                                <Inputs
                                    name={"fecha_ini"}
                                    tamañolabel={""}
                                    className={"rounded block grow"}
                                    Titulo={"Fecha Inicial: "}
                                    type={"date"}
                                    errors={errors}
                                    maxLength={11}
                                    isDisabled={false}
                                    setValue={setFecha_ini}
                                    value={fecha_ini}
                                />
                                <Inputs
                                    name={"fecha_fin"}
                                    tamañolabel={""}
                                    className={"rounded block grow"}
                                    Titulo={"Fecha Final: "}
                                    type={"date"}
                                    errors={errors}
                                    maxLength={11}
                                    isDisabled={false}
                                    setValue={setFecha_fin}
                                    value={fecha_fin}
                                />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AltasBajasAlumnos;
