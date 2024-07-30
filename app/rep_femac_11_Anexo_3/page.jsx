"use client"
import React from "react"
import { useRouter } from "next/navigation";
import Acciones from "@/app/rep_femac_8_anexo_1/components/Acciones";
import Inputs from "@/app/rep_femac_8_anexo_1/components/Inputs";
import { calculaDigitoBvba } from "../utils/globalfn";
import { useForm } from "react-hook-form";
import {
    getReporteCobranzaporAlumno,
    Imprimir,
    ImprimirExcel,
} from "@/app/utils/api/rep_femac_11_Anexo_3/rep_femac_11_Anexo_3";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import BuscarCat from "@/app/components/BuscarCat";
import "jspdf-autotable";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { ReportePDF } from "@/app/utils/ReportesPDF";


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
    const [FormaRepCobranzaporAlumno, setFormaReporteCobranzaporAlumno] =  useState([]);

    useEffect(()=> {
        if(status === "loading" || !session) {
          return;
        }
        const fetchData = async () => {
          const { token } = session.user
  
          const data = await getReporteCobranzaporAlumno(token, fecha_ini, fecha_fin, alumno_ini.id, alumno_fin.id, cajero_ini.numero, cajero_fin.numero, tomaFechas);
          setFormaReporteCobranzaporAlumno(data);
          console.log("ver", FormaRepCobranzaporAlumno);
          console.log("dtaos",  FormaRepCobranzaporAlumno.data);
        }
        fetchData()
      }, [session, status, fecha_ini, fecha_fin, alumno_ini.id, alumno_fin.id, cajero_ini.numero, cajero_fin.numero, tomaFechas]);
  

    const {
        formState: { errors },
    } = useForm({});

    const home = () => {
        router.push("/");
    };

    const handleVerClick = () => {
        const configuracion = {
            Encabezado: {
              Nombre_Aplicacion: "Sistema de Control Escolar",
              Nombre_Reporte: "Relación de Recibos",
              Nombre_Usuario: `Usuario: ${session.user.name}`,
            },
            body: FormaRepCobranzaporAlumno,
        };
        
        const reporte = new ReportePDF(configuracion);
        const { body } = configuracion;
        const Enca1 = (doc) => {
          if (!doc.tiene_encabezado) {
            doc.imprimeEncabezadoPrincipalV();
            doc.nextRow(8);
            if(tomaFechas === true)
            {
                if(fecha_fin == '')
                {
                    doc.ImpPosX(`Reporte de cobranza del ${fecha_ini} `,15,doc.tw_ren),
                    doc.nextRow(5);
                }
                else{
                    doc.ImpPosX(`Reporte de cobranza del ${fecha_ini} al ${fecha_fin}`,15,doc.tw_ren),
                    doc.nextRow(5);
                }
            }

            if(cajero_fin.numero === undefined)
                {
                    doc.ImpPosX(`Cajero seleccionado: ${cajero_ini.numero} `,15,doc.tw_ren),
            doc.nextRow(10);
                }
                else{
                    doc.ImpPosX(`Cajeros seleccionado de ${cajero_ini.numero} al ${cajero_fin.numero}`,15,doc.tw_ren),
                    doc.nextRow(10);
                }
            
            doc.ImpPosX("No.",15,doc.tw_ren),
            doc.ImpPosX("Nombre",50,doc.tw_ren),
            doc.nextRow(5);
            doc.ImpPosX("Producto",15,doc.tw_ren),
            doc.ImpPosX("Descripcion",30,doc.tw_ren),
            doc.ImpPosX("Documento",70,doc.tw_ren),
            doc.ImpPosX("Fecha P",90,doc.tw_ren),
            doc.ImpPosX("Importe",110,doc.tw_ren),
            doc.ImpPosX("Recibo",130,doc.tw_ren),
            doc.ImpPosX("Pago 1",143,doc.tw_ren),
            doc.ImpPosX("Pago 2",163,doc.tw_ren),
            doc.ImpPosX("Cajero",183,doc.tw_ren),
            doc.nextRow(4);
            doc.printLineV();
            doc.nextRow(4);
            doc.tiene_encabezado = true;
          } else {
            doc.nextRow(6);
            doc.tiene_encabezado = true;
          }
        };
        let alumno_Ant = "";
        let total_importe = 0;
        let total_general = 0;

        const Cambia_Alumno = (doc, total_importe) => {
            doc.ImpPosX("TOTAL", 108, doc.tw_ren);
            doc.ImpPosX(total_importe.toString(), 128, doc.tw_ren);
            doc.nextRow(4);
        }

        Enca1(reporte);

        Object.keys(body).forEach((reporte1) => {
            console.log("dentro del foreach",reporte1);
            const arregloA = body[reporte1];

            arregloA.forEach((reporte2) => {

            if(reporte2.id !== alumno_Ant && alumno_Ant !== ""){
                Cambia_Alumno(reporte, total_importe);
                total_importe = 0;
            }

            if(reporte2.id !== alumno_Ant){
                reporte.ImpPosX(reporte2.id_al.toString() +"-"+ calculaDigitoBvba(reporte2.id_al.toString()),15, reporte.tw_ren);
                reporte.ImpPosX(reporte2.toString().nom_al,50, reporte.tw_ren);
                Enca1(reporte);
                if (reporte.tw_ren >= reporte.tw_endRen) {
                    reporte.pageBreak();
                    Enca1(reporte);
                }
            }

            reporte.ImpPosX(reporte2.articulo.toString(),15, reporte.tw_ren);
            reporte.ImpPosX(reporte2.descripcion.toString(),30, reporte.tw_ren);
            reporte.ImpPosX(reporte2.numero_doc.toString(),70, reporte.tw_ren);
            reporte.ImpPosX(reporte2.fecha.toString(),90, reporte.tw_ren);
            reporte.ImpPosX(reporte2.importe.toString(),110, reporte.tw_ren);
            reporte.ImpPosX(reporte2.recibo.toString(),130, reporte.tw_ren);
            reporte.ImpPosX(reporte2.desc_Tipo_Pago_1.toString(),143, reporte.tw_ren);
            reporte.ImpPosX(reporte2.desc_Tipo_Pago_1.toString(),163, reporte.tw_ren);
            reporte.ImpPosX(reporte2.nombre.toString(),183, reporte.tw_ren);
            reporte.nextRow(5);

          Enca1(reporte);
          if (reporte.tw_ren >= reporte.tw_endRen) {
            reporte.pageBreak();
            Enca1(reporte);
          }
            total_importe = total_importe + reporte2.importe;
            total_general = total_general + reporte2.importe;
            alumno_Ant = reporte2.id_al;

        });
        });
        Cambia_Alumno(reporte, total_importe);
        reporte.ImpPosX(`Total importe: ${total_general.toString()}` || '', 88, reporte.tw_ren);
        const pdfData = reporte.doc.output("datauristring");
        setPdfData(pdfData);
        setPdfPreview(true);
    };


    const CerrarView = () => {
        setPdfPreview(false);
        setPdfData('');
        console.log(fecha_fin,fecha_ini);
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
            Reporte Cobranza por Alumno
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
                    {pdfPreview && pdfData && (
                        <div className="pdf-preview ">
                            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                                <div style={{ height: "550px", width: "100%"}}>
                                    <Viewer fileUrl={pdfData} />
                                </div>
                            </Worker>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>

    );
}

export default CobranzaPorAlumno;