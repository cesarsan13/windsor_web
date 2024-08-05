"use client"
import React from "react"
import { useRouter } from "next/navigation";
import Acciones from "./components/Acciones";
import { 
  ImprimirPDF,
  ImprimirExcel,
  getBecas,
} from "../utils/api/rep_w_becas/rep_w_becas";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import "jspdf-autotable";
import BuscarCat from "../components/BuscarCat";
import ModalVistaPreviaRepWBecas from "./components/modalVistaPreviaRepWBecas";
import { showSwal } from "@/app/utils/alerts";

function RepBecas(){
    const router = useRouter();
    const {data: session, status} = useSession();
    const [sOrdenar, ssetordenar] = useState('nombre');
    const [formaBecas, setFormaBecas] =  useState([]);
    const [pdfPreview, setPdfPreview] = useState(false);
    const [pdfData, setPdfData] = useState("");
    const [isLoading, setisLoading] = useState(false);
    //guarda el valor
    const [horario1, setHorario1] = useState({});
    const [horario2, setHorario2] = useState({});
  
    useEffect(()=> {
      if(status === "loading" || !session) {
        return;
      }
      const fetchData = async () => {
        setisLoading(true);
        const { token } = session.user
        const data = await getBecas(token, horario1, horario2, sOrdenar);
        console.log(data);
        setFormaBecas(data.data);
        setisLoading(false);
      }
      fetchData()
    }, [session, status, horario1, horario2, sOrdenar]);
    const home = () => {
        router.push("/");
      };
      const CerrarView = () => {
        setPdfPreview(false);
        setPdfData('');
    };
    
      const ImprimePDF = () => {
        const configuracion = {
          Encabezado:{
            Nombre_Aplicacion: "Sistema de Control Escolar",
            Nombre_Reporte: "Reporte de Becas",
            Nombre_Usuario: `Usuario: ${session.user.name}`,
          },
          body: formaBecas,
        }
        ImprimirPDF(configuracion)
      }
      const ImprimeExcel = () => {
        const configuracion = {
          Encabezado:{
            Nombre_Aplicacion: "Sistema de Control Escolar",
            Nombre_Reporte: "Reporte de Becas",
            Nombre_Usuario: `Usuario: ${session.user.name}`,
          },
          body: formaBecas,
          columns:[
            { header: "No.", dataKey: "numero" },
            { header: "Nombre", dataKey: "alumno" },
            { header: "Grado", dataKey: "grado" },
            { header: "Beca", dataKey: "colegiatura" },
            { header: "Colegiatura", dataKey: "descuento" },
            { header: "Descuento", dataKey: "costo_final" },
        ],
        nombre: "ReporteBecas"
      }
        ImprimirExcel(configuracion)
      }
      const handleCheckChange = (event) =>{
        ssetordenar(event.target.value);
      }
    
      const handleVerClick = () => {
        console.log(formaBecas);
        if (horario1.numero === undefined && horario2.numero == undefined){
          showSwal("Oppss!", "Para imprimir, mínimo debe estar seleccionada una fecha de 'Inicio'", "error");
        } else {
    
        const configuracion = {
          Encabezado: {
            Nombre_Aplicacion: "Sistema de Control Escolar",
            Nombre_Reporte: "Reporte de Becas",
            Nombre_Usuario: `Usuario: ${session.user.name}`,
          },
          body: formaBecas,
        };
        const reporte = new ReportePDF(configuracion, "Landscape");
    const { body } = configuracion;
    const Enca1 = (doc) => {
      if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalH();
        doc.nextRow(12);
        doc.ImpPosX("No.",15,doc.tw_ren),
        doc.ImpPosX("Nombre",25,doc.tw_ren),
        doc.ImpPosX("Grado",115,doc.tw_ren),
        doc.ImpPosX("Colegiatura",160,doc.tw_ren),
        doc.ImpPosX("Descuento",190,doc.tw_ren),
        doc.ImpPosX("Saldo",210,doc.tw_ren),
        doc.nextRow(4);
        doc.printLineH();
        doc.nextRow(4);
        doc.tiene_encabezado = true;
      } else {
        doc.nextRow(6);
        doc.tiene_encabezado = true;
      }
    };
    Enca1(reporte);
    console.log(body);
    body.forEach((reporte1) => {
      reporte.ImpPosX(reporte1.numero.toString(),15, reporte.tw_ren);
      reporte.ImpPosX(reporte1.alumno.toString(),25, reporte.tw_ren);
      reporte.ImpPosX(reporte1.grado.toString(),115, reporte.tw_ren);
      reporte.ImpPosX(reporte1.colegiatura.toString().substring(0,4),160, reporte.tw_ren);
      reporte.ImpPosX(reporte1.descuento.toString().substring(4,2),190, reporte.tw_ren);
      reporte.ImpPosX(reporte1.costo_final.toString(),210, reporte.tw_ren);
      //reporte.ImpPosX(reporte1.Saldo.toString(),155, reporte.tw_ren);
      Enca1(reporte);
      if (reporte.tw_ren >= reporte.tw_endRenH) {
        reporte.pageBreakH();
        Enca1(reporte);
      }
    });
    const pdfData = reporte.doc.output("datauristring");
    setPdfData(pdfData);
    setPdfPreview(true);
    showModalVista(true);
  }
  };
  const showModalVista = (show) => {
    show
      ? document.getElementById("modalVPRepWBecas").showModal()
      : document.getElementById("modalVPRepWBecas").close();
  }

  if (status === "loading") {
    return (
      <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  return (
    <>
    <ModalVistaPreviaRepWBecas
        pdfPreview={pdfPreview}
        pdfData={pdfData}
        PDF={ImprimePDF}
        Excel={ImprimeExcel}
    />

    <div className="container w-full max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3">
        <div className="flex justify-start p-3">
            <h1 className="text-4xl font-xthin text-black dark:text-white md:px-12">
                Reporte de Becas.
            </h1>
        </div>
        <div className="container grid grid-cols-8 grid-rows-1 h-[calc(100%-20%)]">
            <div className="col-span-1 flex flex-col">
                <Acciones
                    Ver={handleVerClick}
                    ImprimePDF={ImprimePDF}
                    ImprimeExcel={ImprimeExcel}
                    home={home}
                    CerrarView={CerrarView}>
                </Acciones>
            </div>

            <div className="col-span-7 flex flex-col space-y-4">
                <div className="flex flex-col space-y-4">
                    <div className="w-full">
                        <label className="text-sm text-black dark:text-white">Horario 1:</label>
                        <BuscarCat
                            table="horarios"
                            token={session.user.token}
                            nameInput={["horario_1", "horario_1_nombre"]}
                            fieldsToShow={["numero", "horario"]}
                            setItem={setHorario1}
                            modalId="modal_horarios"
                        />
                    </div>
                    <div className="w-full">
                        <label className="text-sm text-black dark:text-white">Horario 2:</label>
                        <BuscarCat
                            table="horarios"
                            token={session.user.token}
                            nameInput={["horario_2", "horario_2_nombre"]}
                            fieldsToShow={["numero", "horario"]}
                            setItem={setHorario2}
                            modalId="modal_horarios2"
                        />
                    </div>
                </div>
                <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:items-center md:space-x-4">
                    <span className="text-black dark:text-white">Ordenar por:</span>
                    <div className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="ordenar"
                            value="nombre"
                            onChange={handleCheckChange}
                            checked={sOrdenar === "nombre"}
                            className="radio checked:bg-blue-500"
                        />
                        <span className="text-black dark:text-white">Nombre</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="ordenar"
                            value="id"
                            onChange={handleCheckChange}
                            checked={sOrdenar === "id"}
                            className="radio checked:bg-blue-500"
                        />
                        <span className="text-black dark:text-white">Número</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</>
);
}

export default RepBecas;
