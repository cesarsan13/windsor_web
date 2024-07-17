"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { showSwal, confirmSwal } from "../utils/alerts";
import Busqueda from "@/app/rep_femac_3/components/Busqueda";
import Acciones from "@/app/rep_femac_3/components/Acciones";
import { useForm } from "react-hook-form";
import {
  guardaRep, 
  Imprimir, 
  ImprimirExcel 
} from "@/app/utils/api/rep_femac_3/rep_femac_3";
import { useSession } from "next-auth/react";
import { siguiente } from "@/app/utils/api/rep_femac_3/rep_femac_3";
import "jspdf-autotable";
import jsPDF from "jspdf";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { ReportePDF } from '@/app/utils/ReportesPDF';

function Reportes() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [reportes, setReportes] = useState([]);
    const [reporte, setReporte] = useState({});
    const [reportesFiltrados, setReportesFiltrados] = useState([]);
    const [bajas, setBajas] = useState(false);
    const [openModal, setModal] = useState(false);
    const [accion, setAccion] = useState("");
    const [isLoading, setisLoading] = useState(false);
    const [currentID, setCurrentId] = useState("");
    const [filtro, setFiltro] = useState("");
    const [TB_Busqueda, setTB_Busqueda] = useState("");
    const [pdfPreview, setPdfPreview] = useState(false); 
    const [pdfData, setPdfData] = useState('');

    useEffect(() => {
        if (status === "loading" || !session) {
            return;
        }
    }, [session, status, bajas]);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            numero: reporte.numero,
            numero_1: reporte.numero_1,
            nombre_1: reporte.nombre_1,
            año_nac_1: reporte.año_nac_1,
            mes_nac_1: reporte.mes_nac_1,
            telefono_1: reporte.telefono_1,
            numero_2: reporte.numero_2,
            nombre_2: reporte.nombre_2,
            año_nac_2: reporte.año_nac_2,
            mes_nac_2: reporte.mes_nac_2,
            telefono_2: reporte.telefono_2,
        },
    });

    useEffect(() => {
        reset({
            numero: reporte.numero,
            numero_1: reporte.numero_1,
            nombre_1: reporte.nombre_1,
            año_nac_1: reporte.año_nac_1,
            mes_nac_1: reporte.mes_nac_1,
            telefono_1: reporte.telefono_1,
            numero_2: reporte.numero_2,
            nombre_2: reporte.nombre_2,
            año_nac_2: reporte.año_nac_2,
            mes_nac_2: reporte.mes_nac_2,
            telefono_2: reporte.telefono_2,
        });
    }, [reporte, reset]);

    const Buscar = () => {
        console.log(TB_Busqueda, filtro);
        if (TB_Busqueda === "" || filtro === "") {
            setReportesFiltrados(reportes);
            return;
        }
        const infoFiltrada = reportes.filter((reporte) => {
            const valorCampo = reporte[filtro];
            if (typeof valorCampo === "number") {
                return valorCampo.toString().includes(TB_Busqueda);
            }
            return valorCampo
                ?.toString()
                .toLowerCase()
                .includes(TB_Busqueda.toLowerCase());
        });
        setReportesFiltrados(infoFiltrada);
    };

    const limpiarBusqueda = (evt) => {
        evt.preventDefault;
        setTB_Busqueda("");
    };

    const Alta = async (event) => {
        setCurrentId("");
        const { token } = session.user;
        reset({
            numero: "",
            numero_1: "",
            nombre_1: "",
            año_nac_1: "",
            mes_nac_1: "",
            telefono_1: "",
            numero_2: "",
            nombre_2: "",
            año_nac_2: "",
            mes_nac_2: "",
            telefono_2: "",
        });
        let siguienteId = await siguiente(token);
        siguienteId = Number(siguienteId) + 1;
        setCurrentId(siguienteId);
        setReporte({ numero: siguienteId });
        setModal(!openModal);
        setAccion("Alta");
        showModal(true);

        document.getElementById("nombre").focus();
    };

    const onSubmitModal = handleSubmit(async (data) => {
        event.preventDefault;
        const dataj = JSON.stringify(data);
        data.id = currentID;
        let res = null;
        if (accion === "Eliminar") {
            showModal(false);
            const confirmed = await confirmSwal(
                "¿Desea Continuar?",
                "Se eliminara el cajero seleccionado",
                "warning",
                "Aceptar",
                "Cancelar"
            );
            if (!confirmed) {
                showModal(true);
                return;
            }
        }
        res = await guardaRep(session.user.token, data, accion);
        if (res.status) {
            if (accion === "Alta") {
                const nuevaRep = { currentID, ...data };
                setReportes([...reportes, nuevaRep]);
                if (!bajas) {
                    setReportesFiltrados([...reportesFiltrados, nuevaRep]);
                }
            }
            showSwal(res.alert_title, res.alert_text, res.alert_icon);
            showModal(false);
        }
    });

    const home = () => {
        router.push("/");
    };

    const handleBusquedaChange = (event) => {
        event.preventDefault;
        setTB_Busqueda(event.target.value);
    };

    const ImprimePDF = () => {
        const configuracion = {
            Encabezado: {
                Nombre_Aplicacion: "Sistema de Control Escolar",
                Nombre_Reporte: "Reporte Alumnos Mensual",
                Nombre_Usuario: `Usuario: ${session.user.name}`,
            },
            body: reportesFiltrados,
        };
        Imprimir(configuracion);
    };

    /*const handleVerClick = () => {
        const doc = new jsPDF();
        doc.text("Reporte de Alumnosde", 10, 10);
        doc.autoTable({ html: '#table' });
        const pdfData = doc.output('datauristring');
        setPdfData(pdfData);
        setPdfPreview(true);
    };*/
    const handleVerClick = () => {
        const configuracion = {
          Encabezado: {
            Nombre_Aplicacion: "Nombre de la Aplicación",
            Nombre_Reporte: "Reporte de Alumnos",
            Nombre_Usuario: `Usuario: ${session.user.name}`,
        }
        };
        const reporte = new ReportePDF(configuracion);
        reporte.imprimeEncabezadoPrincipal();
        const table = document.getElementById('table');
        reporte.doc.autoTable({ html: table });
        const pdfData = reporte.doc.output('datauristring');
        setPdfData(pdfData);
        setPdfPreview(true);
      };

    if (status === "loading") {
        return (
            <div className="container skeleton w-full max-w-screen-xl shadow-xl rounded-xl"></div>
        );
    }

    return (
        <>
            <div className="container w-full max-w-screen-xl bg-slate-100 shadow-xl rounded-xl px-3">
                <div className="flex justify-start p-3">
                    <h1 className="text-4xl font-xthin text-black md:px-12">
                        Reporte de Alumnos por Mes.
                    </h1>
                </div>
                <div className="container grid grid-cols-8 grid-rows-1 h-[calc(100%-20%)]">
                    <div className="col-span-1 flex flex-col">
                        <Acciones Buscar={Buscar} Alta={Alta} home={home} Ver={handleVerClick} imprimir={ImprimePDF}/>
                    </div>
                    <div className="col-span-7">
                        <div className="flex flex-col h-[calc(100%)]">
                            <Busqueda
                                setBajas={setBajas}
                                setFiltro={setFiltro}
                                limpiarBusqueda={limpiarBusqueda}
                                Buscar={Buscar}
                                handleBusquedaChange={handleBusquedaChange}
                                TB_Busqueda={TB_Busqueda}
                            />
                            {pdfPreview && pdfData && (
                                <div className="pdf-preview">
                                    <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                                        <div style={{ height: '600px' }}>
                                            <Viewer fileUrl={pdfData} />
                                        </div>
                                    </Worker>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Reportes;
