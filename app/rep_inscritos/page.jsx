"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Acciones from "@/app/rep_femac_8_anexo_1/components/Acciones";
import Inputs from "@/app/rep_femac_8_anexo_1/components/Inputs";
import { useForm } from "react-hook-form";
import {
    getConsultasInscripcion,
    Imprimir,
    ImprimirExcel,
    verImprimir,
} from "@/app/utils/api/rep_inscritos/rep_inscritos";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { showSwal } from "@/app/utils/alerts";
import BuscarCat from "@/app/components/BuscarCat";
import "jspdf-autotable";
import ModalVistaPreviaRepInsc from "@/app/rep_inscritos/components/ModalVistaPreviaRepInsc";

function AltasBajasAlumnos() {
    const router = useRouter();
    const { data: session, status } = useSession();
    let [fecha_ini, setFecha_ini] = useState("");
    let [fecha_fin, setFecha_fin] = useState("");
    let [alumnosFiltrados, setAlumnosFiltrados] = useState([]);
    const [pdfPreview, setPdfPreview] = useState(false);
    const [pdfData, setPdfData] = useState("");
    const {
        formState: { errors },
    } = useForm({});

    const formaImprime = async () => {
        let res;
        let si_inscrito = false;
        let si_suma = false;
        let alumnos = 0;
        let det_inscripcion = 0;
        let total_inscripcion = 0;
        let fecha_inscripcion = "";
        let fecha_inscrip = "";
        let horario_1 = 0;
        const { token } = session.user;
        const data = [];
        const fechaIni = fecha_ini ? fecha_ini.replace(/-/g, "/") : 0;
        const fechaFin = fecha_fin ? fecha_fin.replace(/-/g, "/") : 0;

        res = await getConsultasInscripcion(token);
        // if (res.status) {
        let dataAlumnos = res.data_alumnos;
        let dataDetalles = res.data_detalle;
        let dataProductos = res.data_productos;
        let dataHorarios = res.data_horarios;

        for (const item of dataAlumnos) {
            const detalleEncontrado = dataDetalles.find(detalle =>
                detalle.alumno === item.id &&
                detalle.fecha >= fechaIni &&
                detalle.fecha <= fechaFin
            );
            if (detalleEncontrado) {
                for (const pedido of dataPedidos) {
                    const productoEncontrado = dataProductos.find(producto =>
                        producto.ref === 'INS' &&
                        producto.id === pedido.articulo
                    );
                    if (productoEncontrado) {
                        si_inscrito = true;
                        si_suma = true;
                        det_inscripcion += pedido.precio_unitario * pedido.cantidad;
                        total_inscripcion += pedido.precio_unitario * pedido.cantidad;
                    }; fecha_inscripcion = pedido.fecha;
                }
                if (si_suma) {
                    const horarioEncontrado = dataHorarios.fin(
                        horario => horario.numero === item.horario_1
                    );
                    if (horarioEncontrado) {
                        //imprime algo imp_pos 70, AllTrim(RsHorario!Horario), 3
                    }
                    //imprime otro algo  imp_pos 90, Fecha_Inscripcion, 4
                    //imprime otro algo  imp_pos_Izq 120, Formato_Imprime(Det_Inscripcion, 2), 5
                    alumnos += 1;
                }
                det_inscripcion = 0;
            }
        }
        // } else { showSwal(res.alert_title, res.alert_text, res.alert_icon); }

        // return data;
    };
    const ImprimePDF = async () => {
        res = await getConsultasInscripcion(token);
        // let dataAlumnos = res.data_alumnos;
        // let dataDetalles = res.data_detalle;
        // let dataProductos = res.data_productos;
        // let dataHorarios = res.data_horarios;
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
        };
        Imprimir(configuracion);
    };

    const ImprimeExcel = async () => {
        alumnosFiltrados = await formaImprime();
        const configuracion = {
            Encabezado: {
                Nombre_Aplicacion: "Sistema de Control Escolar",
                Nombre_Reporte: "Reporte Relación de Recibos",
                Nombre_Usuario: `Usuario: ${session.user.name}`,
            },
            body: alumnosFiltrados,
            columns: [
                { header: "Recibo", dataKey: "recibo" },
                { header: "Factura", dataKey: "factura" },
                { header: "Fecha P", dataKey: "fecha" },
                { header: "No.", dataKey: "alumno" },
                { header: "Nombre Alumno", dataKey: "nombre_alumno" },
                { header: "Total Rec.", dataKey: "importe_total" },
            ],
            nombre: "Reporte Relación Recibos",
        };
        ImprimirExcel(configuracion);
    };

    const home = () => {
        router.push("/");
    };

    const handleVerClick = async () => {
        alumnosFiltrados = await formaImprime();
        // const configuracion = {
        //     Encabezado: {
        //         Nombre_Aplicacion: "Sistema de Control Escolar",
        //         Nombre_Reporte: "Reporte Relación de Recibos",
        //         Nombre_Usuario: `Usuario: ${session.user.name}`,
        //     },
        //     body: alumnosFiltrados,
        // };
        // const pdfData = await verImprimir(configuracion);
        // setPdfData(pdfData);
        // setPdfPreview(true);
        // showModalVista(true);
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
                <div className="container grid grid-cols-8 grid-rows-1 h-[calc(100%-20%)]">
                    <div className="col-span-1 flex flex-col">
                        <Acciones home={home} Ver={handleVerClick} />
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
                            </div>
                            {/* <div className="flex space-x-4">
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
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AltasBajasAlumnos;
