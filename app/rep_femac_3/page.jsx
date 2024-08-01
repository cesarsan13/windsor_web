"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Acciones from "@/app/rep_femac_3/components/Acciones";
import ModalVistaPreviaRepFemac3 from "./components/modalVistaPreviaRepFemac3";
import {
  getAlumnosPorMes,
  Imprimir,
  ImprimirExcel
} from "@/app/utils/api/rep_femac_3/rep_femac_3";
import { useSession } from "next-auth/react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import "jspdf-autotable";
import BuscarCat from "../components/BuscarCat";

function Rep_Femac_3() {
  const router = useRouter();
  const {data: session, status} = useSession();
  const [sOrdenar, ssetordenar] = useState('nombre');
  const [FormaRepDosSel, setFormaRepDosSel] =  useState([]);
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [horario, setHorario] = useState({});
  const [token, setToken] = useState("");

  useEffect(()=> {
    if(status === "loading" || !session) {
      return;
    }
    const fetchData = async () => {
      setisLoading(true);
      const { token } = session.user
      setToken(token);
      const data = await getAlumnosPorMes(token, horario, sOrdenar);
      console.log("envia", horario, sOrdenar);
      setFormaRepDosSel(data.data);
      setisLoading(false);
    }
    fetchData()
  }, [session, status, horario, sOrdenar]);

  const home = () => {
    router.push("/");
  };

  const ImprimePDF = () => {
    const configuracion = {
      Encabezado:{
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de Alumnos por clase mensual",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: FormaRepDosSel,
    }
    Imprimir(configuracion)
  }

  const ImprimeExcel = () => {
    const configuracion = {
      Encabezado:{
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de Alumnos por clase mensual",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: FormaRepDosSel,
      columns:[
        { header: "No.", dataKey: "Num_Renglon" },
        { header: "No. 1", dataKey: "Numero_1" },
        { header: "Nombre", dataKey: "Nombre_1" },
        { header: "Año", dataKey: "Año_Nac_1" },
        { header: "Mes", dataKey: "Mes_Nac_1" },
    ],
    nombre: "ReportePorMes"
  }
    ImprimirExcel(configuracion)
  }

  const handleCheckChange = (event) =>{
    ssetordenar(event.target.value);
  }

  const handleVerClick = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Lista de Alumnos por clase mensual",
        Nombre_Reporte: "Reporte de Alumnos",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: FormaRepDosSel,
    };

    const reporte = new ReportePDF(configuracion, "Portrait");
    const { body } = configuracion;
    const Enca1 = (doc) => {
      if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalV();
        doc.nextRow(12);
        doc.ImpPosX("No.",15,doc.tw_ren),
        doc.ImpPosX("No. 1",25,doc.tw_ren),
        doc.ImpPosX("Nombre",35,doc.tw_ren),
        doc.ImpPosX("Año",120,doc.tw_ren),
        doc.ImpPosX("Mes",130,doc.tw_ren),
        doc.nextRow(4);
        doc.printLineV();
        doc.nextRow(4);
        doc.tiene_encabezado = true;
      } else {
        doc.nextRow(6);
        doc.tiene_encabezado = true;
      }
    };

    Enca1(reporte);
    
    body.forEach((reporte1) => {
      reporte.ImpPosX(reporte1.Num_Renglon.toString() !== "0" ? reporte1.Num_Renglon.toString() : "", 15, reporte.tw_ren);
      reporte.ImpPosX(reporte1.Numero_1.toString() !== "0" ? reporte1.Numero_1.toString() : "", 25, reporte.tw_ren);
      reporte.ImpPosX(reporte1.Nombre_1.toString() !== "0" ? reporte1.Nombre_1.toString() : "", 35, reporte.tw_ren);
      reporte.ImpPosX(reporte1.Año_Nac_1.toString().substring(0, 4) !== "0" ? reporte1.Año_Nac_1.toString().substring(0, 4) : "", 120, reporte.tw_ren);
      reporte.ImpPosX(reporte1.Mes_Nac_1.toString().substring(4, 2) !== "0" ? reporte1.Mes_Nac_1.toString().substring(4, 2) : "", 130, reporte.tw_ren);
      
      Enca1(reporte);
      if (reporte.tw_ren >= reporte.tw_endRen) {
        reporte.pageBreak();
        Enca1(reporte);
      }
    });
    
    const pdfData = reporte.doc.output("datauristring");
    setPdfData(pdfData);
    setPdfPreview(true);

    showModalVista(true);
  };

  const showModalVista = (show) => {
    show
      ? document.getElementById("modalVPRepFemac3").showModal()
      : document.getElementById("modalVPRepFemac3").close();
  }
  
  return (
    <>
    <ModalVistaPreviaRepFemac3
      pdfPreview={pdfPreview} 
      pdfData={pdfData} 
      PDF={ImprimePDF} 
      Excel = {ImprimeExcel}
    />
  <div className="container  w-full  max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3 ">
        <div className="flex justify-start p-3">
          <h1 className="text-4xl font-xthin text-black dark:text-white md:px-12">
            Reporte de Alumnos por clase mensual.
          </h1>
        </div>
        <div className="container grid grid-cols-8 grid-rows-1 h-[calc(100%-20%)]">
          <div className="col-span-1 flex flex-col">
          <Acciones Ver={handleVerClick}  home={home}></Acciones>
          </div>
          <div className="col-span-7">
            <div className="flex flex-col h-[calc(100%)]">
              {token &&
              <BuscarCat
                table={"horarios"}
                titulo={"Horario: "}
                token={token}
                nameInput={["horario_1", "horario_1_nombre"]}
                fieldsToShow={["numero", "horario"]}
                setItem={setHorario}
                modalId={"modal_horarios"}
                />
                }
              <div className=" col-8">
                <label className={` input-md text-black dark:text-white flex items-center gap-3`}>
                    <span className="text-black dark:text-white">Ordenar por:</span>
                    <label className={` input-md text-black dark:text-white flex items-center gap-3`}>
                        <span className="text-black dark:text-white">Nombre</span>
                        <input type="radio" name="ordenar" value="nombre" onChange={handleCheckChange} checked={sOrdenar === "nombre"} className="radio checked:bg-blue-500" />
                    </label>
                    <label className={` input-md text-black dark:text-white flex items-center gap-3`}>
                        <span className="text-black dark:text-white">Número</span>
                        <input type="radio" name="ordenar" value="id" onChange={handleCheckChange} checked={sOrdenar === "id"} className="radio checked:bg-blue-500" />
                    </label>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Rep_Femac_3;