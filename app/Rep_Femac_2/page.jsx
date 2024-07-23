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
import jsPDF from "jspdf";
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
  const [accion, setAccion] = useState("");
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const [reporte, setReporte] = useState({});
  const [reportes, setReportes] = useState([]);


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
      console.log("set", FormaRepDosSel);
    };
    fetchDataImp();
    fetchData();
    
  }, [session, status, shorario1, shorario2, sOrdenar]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
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

  const onSubmitModal = handleSubmit(async (data) => {
    event.preventDefault;
    const dataj = JSON.stringify(data);
    data.id = currentID;
    let res = null;
    res = await guardaRep(session.user.token, data, accion);
    if (res.status) {
      if (accion === "Alta") {
        const nuevaRep = { currentID, ...data };
        setReportes([...reportes, nuevaRep]);
        if (!bajas) {
          setFormaRepDosSel([...FormaRepDosSel, nuevaRep]);
        }
      }
      showSwal(res.alert_title, res.alert_text, res.alert_icon);
      showModal(false);
    }
  });

  
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
      
      body: FormaRepDosSel1,
      columns:[
        { header: "No.", dataKey: "numero" },
        { header: "Nombre", dataKey: "nombre" },
        { header: "No. 1", dataKey: "id" },
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
        Nombre_Aplicacion: "Lista de Alumnos por clase",
        Nombre_Reporte: "Reporte de Alumnos",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: FormaRepDosSel,
    };
    const reporte = new ReportePDF(configuracion, "Landscape");
    
    const Enca1 = (doc) => {
      if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalH();
        doc.nextRow(12);
        doc.ImpPosX("No.",15,doc.tw_ren),
        doc.ImpPosX("Nombre",30,doc.tw_ren),
        doc.ImpPosX("No. 1",80,doc.tw_ren),
        doc.ImpPosX("Año",95,doc.tw_ren),
        doc.ImpPosX("Mes",110,doc.tw_ren),
        doc.ImpPosX("Telefono",130,doc.tw_ren),
        doc.ImpPosX("Nombre",155,doc.tw_ren),
        doc.ImpPosX("No. 2",205,doc.tw_ren),
        doc.ImpPosX("Año",220,doc.tw_ren),
        doc.ImpPosX("Mes",235,doc.tw_ren),
        doc.ImpPosX("Telefono",250,doc.tw_ren),

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
    configuracion.body.data1.foreach((reporte) => {
      //reporte.ImpPosX(reporte.numero.toString(),15,reporte.tw_ren, 10);
      reporte.ImpPosX(reporte.nombre.toString(),30,reporte.tw_ren, 50);
      reporte.ImpPosX(reporte.id.toString(),80,reporte.tw_ren, 10);
      reporte.ImpPosX(reporte.año_nac.toString(),95,reporte.tw_ren, 15);
      reporte.ImpPosX(reporte.mes_nac.toString(),110,reporte.tw_ren, 15);
      reporte.ImpPosX(reporte.telefono_1.toString(),130,reporte.tw_ren, 10);
     
      Enca1(reporte);
      if (reporte.tw_ren >= reporte.tw_endRen) {
        reporte.pageBreak();
        Enca1(reporte);
      }
    });
    configuracion.body.data2.foreach((reporte) => {
      reporte.ImpPosX(reporte.nombre.toString(),155,reporte.tw_ren, 50);
      reporte.ImpPosX(reporte.id.toString(),205,reporte.tw_ren, 10);
      reporte.ImpPosX(reporte.año_nac.toString(),220,reporte.tw_ren, 15);
      reporte.ImpPosX(reporte.mes_nac.toString(),235,reporte.tw_ren, 15);
      reporte.ImpPosX(reporte.telefono_1.toString(),250,reporte.tw_ren, 10);
      Enca1(reporte);
      if (reporte.tw_ren >= reporte.tw_endRen) {
        reporte.pageBreak();
        Enca1(reporte);
      }
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
                    <div style={{ height: "600px" }}>
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