"use client"
import React from "react"
import { useRouter } from "next/navigation";
import Acciones from "./components/Acciones";
import Inputs from "./components/Inputs";
import ImpElementos from "./components/ImpElementos";
import { useForm } from "react-hook-form";
import { 
  ImprimirPDF,
  ImprimirExcel,
  getHorariosAPC,
  getRepDosSel,
} from "../utils/api/Rep_Femac_2/Rep_Femac_2";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import "jspdf-autotable";
import * as XLSX from "xlsx";

function AlumnosPorClase(){
  const router = useRouter();
  const {data: session, status} = useSession();
  const [isLoading, setisLoading] = useState(false);
  const [formaHorarioAPC, setFormaHorarioAPC] = useState([]);
  const [shorario1, ssethorario1] = useState('');
  const [shorario2, ssethorario2] = useState('');
  const [sOrdenar, ssetordenar] = useState('');
  const [FormaRepDosSel, setFormaRepDosSel] =  useState([]);

  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");


  useEffect(()=> {
    if(status === "loading" || !session) {
      return;
    }
    const fetchData = async () => {
      setisLoading(true);
      const { token } = session.user;
      const data = await getHorariosAPC(token);
      setFormaHorarioAPC(data);
      setisLoading(false); 
    };
    const fetchDataImp = async () =>{
      const { token } = session.user;
      const dataImp = await getRepDosSel(token, shorario1, shorario2, sOrdenar);
      console.log(dataImp, shorario1, shorario2, sOrdenar);
      setFormaRepDosSel(dataImp);
    };
    fetchDataImp();
    fetchData();
    
  }, [session, status, shorario1, shorario2, sOrdenar]);

  const ImprimePDF = () => {
    const configuracion = {
      Encabezado:{
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de Alumnos por clase",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: FormaRepDosSel,
    }
    ImprimirPDF(configuracion)
  }

  const ImprimeExcel = () => {

    const configuracion = {
      Encabezado:{
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de Alumnos por clase",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      
      body: FormaRepDosSel,
      columns:[
        { header: "No.", dataKey: "numero" },
        { header: "Nombre", dataKey: "nombre_1" },
        { header: "No. 1", dataKey: "numero_1" },
        { header: "Año", dataKey: "año_nac_1" },
        { header: "Mes", dataKey: "mes_nac_1" },
        { header: "Telefono", dataKey: "telefono_1" },
        { header: "Nombre", dataKey: "nombre_2" },
        { header: "No. 2", dataKey: "numero_2" },
        { header: "Año", dataKey: "año_nac_2" },
        { header: "Mes", dataKey: "mes_nac_2" },
        { header: "Telefono", dataKey: "telefono_2" },
    ],

    nombre: "RepDosSec"
  }
  ImprimirExcel(configuracion)
}

  const home = () => {
    router.push("/");
  };

  const handleSelectionChange1 = (event) =>{
    event.preventDefault;    
    ssethorario1(event.target.value);
    console.log(event.target.value);
  }
  const handleSelectionChange2 = (event) =>{
    event.preventDefault;    
    ssethorario2(event.target.value);
    console.log(event.target.value);
  }

  const handleVerClick = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Nombre de la Aplicación",
        Nombre_Reporte: "Reporte de Alumnos",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: FormaRepDosSel,
    };
    const reporte = new ReportePDF(configuracion, "Landscape");
    reporte.imprimeEncabezadoPrincipalH();
    
    /*const table = document.getElementById("table");

      reporte.doc.autoTable({
        head: [FormaRepDosSel[0]], // Encabezado de la tabla
        body: FormaRepDosSel.slice(1) // Datos de la tabla
    });*/

   /* Enca1(newPDF);
        body.forEach((repdossel) => {
        
          newPDF.ImpPosX(repdossel.numero.toString(),15,newPDF.tw_ren, 10);
          newPDF.ImpPosX(repdossel.nombre_1.toString(),30,newPDF.tw_ren, 50);
          newPDF.ImpPosX(repdossel.numero_1.toString(),80,newPDF.tw_ren, 10);
          newPDF.ImpPosX(repdossel.año_nac_1.toString(),95,newPDF.tw_ren, 15);
          newPDF.ImpPosX(repdossel.mes_nac_1.toString(),110,newPDF.tw_ren, 15);
          newPDF.ImpPosX(repdossel.telefono_1.toString(),130,newPDF.tw_ren, 10);
          newPDF.ImpPosX(repdossel.nombre_2.toString(),155,newPDF.tw_ren, 50);
          newPDF.ImpPosX(repdossel.numero_2.toString(),205,newPDF.tw_ren, 10);
          newPDF.ImpPosX(repdossel.año_nac_2.toString(),220,newPDF.tw_ren, 15);
          newPDF.ImpPosX(repdossel.mes_nac_2.toString(),235,newPDF.tw_ren, 15);
          newPDF.ImpPosX(repdossel.telefono_2.toString(),250,newPDF.tw_ren, 10);


          Enca1(newPDF);
          if (newPDF.tw_ren >= newPDF.tw_endRen) {
            newPDF.pageBreak();
            Enca1(newPDF);
          }
        });*/

        reporte.doc.autoTable({
          head: [["No.","Nombre","No. 1","Año","Mes","Telefono","Nombre","No. 2","Año","Mes","Telefono"]],
          body: FormaRepDosSel.slice(1),
          styles: {
            fillColor: [255, 255, 255], // Color de fondo de las celdas
            textColor: [0, 0, 0], // Color del texto
            fontSize: 10, // Tamaño de la fuente
            halign: 'center', // Alineación horizontal
            valign: 'left' // Alineación vertical
        },
        headStyles: {
          fillColor: [255, 255, 255], // Color de fondo de las celdas
          textColor: [0, 0, 0], // Color del texto
          margin: 34 ,
        },
      });

    const pdfData = reporte.doc.output("datauristring");
    setPdfData(pdfData);
    setPdfPreview(true);
  };

  const handleCheckChange = (event) =>{
    event.preventDefault;
    ssetordenar(event.target.value);
    console.log(event.target.value);
  }
  
  if (status === "loading") {
    return (
      <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  return (
    <>
      <div className="container  w-full  max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3 ">
        <div className="flex justify-start p-3 ">
          <h1 className="text-4xl font-xthin text-black dark:text-white md:px-12">
          Lista de Alumnos por clase.
          </h1>
        </div>
        <div className="container grid grid-cols-8 grid-rows-1 h-[calc(100%-20%)] ">
          <div className="col-span-1 flex flex-col ">
            <Acciones Ver={handleVerClick} ImprimePDF={ImprimePDF} ImprimeExcel={ImprimeExcel} home={home}></Acciones>
          </div>
        
        <div className="col-span-7">
        <div className="flex flex-col h-[calc(100%)]">
            <ImpElementos
              setFormaHorarioAPC={formaHorarioAPC}
              sOrdenar={sOrdenar}
              shorario1={shorario1}
              shorario2={shorario2}
              handleSelectionChange1 = {handleSelectionChange1}
              handleSelectionChange2 = {handleSelectionChange2}
              handleCheckChange = {handleCheckChange}
            />

            {pdfPreview && pdfData && (
                <div className="pdf-preview">
                  <Worker
                    workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
                  >
                    <div style={{ height: "600px"}}>
                      <Viewer fileUrl={pdfData}  />
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

export default AlumnosPorClase;