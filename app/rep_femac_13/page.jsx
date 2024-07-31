"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Acciones from "@/app/rep_femac_13/components/Acciones";
import { 
  getRepASem,
  ImprimirExcel,
 } from "../utils/api/Rep_Femac_13/Rep_Femac_13";
import { useSession } from "next-auth/react";
import "jspdf-autotable";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import BuscarCat from "../components/BuscarCat";
import { formatDate } from '../utils/globalfn';

function Rep_Femac_13() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const date = new Date();
  const dateStr = formatDate(date);
  const [fecha, setFecha] = useState(dateStr.replace(/\//g, '-'));
  const [FormaRepASem, setFormaRepASem] =  useState([]);
  const [Formahorario, setFormahorario] =  useState([]);
  const [horario, setHorario] = useState({});
  const [sOrdenar, ssetordenar] = useState('');

    useEffect(()=> {
      if(status === "loading" || !session) {
        return;
      }
      const fetchData = async () => {
        const { token } = session.user
        console.log(horario, sOrdenar);

        const data = await getRepASem(token, horario, sOrdenar);
        setFormaRepASem(data.data);
        setFormahorario(data.horario[0].horario);
        console.log("ver", Formahorario);
        console.log("dtaos", FormaRepASem);
      }
      fetchData()
    }, [session, status, horario, sOrdenar]);

    const handleCheckChange = (event) =>{
      event.preventDefault;
      ssetordenar(event.target.value);
    }
  
    const home = () => {
      router.push("/");
    };

    const CerrarView = () => {
      setPdfPreview(false);
      setPdfData('');
  };

  const handleClickVer = () => {

    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Lista de Alumnos por clase semanal",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: FormaRepASem,
    };
    const reporte = new ReportePDF(configuracion);
    const { body } = configuracion;
    const Enca1 = (doc) => {
      if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalV();
        doc.nextRow(8);
        doc.ImpPosX(`Clase: ${Formahorario}`,15,doc.tw_ren),
        doc.nextRow(5);
        doc.ImpPosX("Profesor: _________________________________________",15,doc.tw_ren),
        doc.nextRow(5);
        doc.ImpPosX(`Fecha emisión: ${fecha}`,15,doc.tw_ren),
        doc.nextRow(10);
        doc.ImpPosX("No.",15,doc.tw_ren),
        doc.ImpPosX("No. A",25,doc.tw_ren),
        doc.ImpPosX("Nombre",35,doc.tw_ren),
        doc.ImpPosX("Año",120,doc.tw_ren),
        doc.ImpPosX("Mes",130,doc.tw_ren),
        doc.ImpPosX("OBSERVACIONES",145,doc.tw_ren),
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
      reporte.ImpPosX(reporte1.Num_Renglon.toString(),15, reporte.tw_ren);
      reporte.ImpPosX(reporte1.Numero_1.toString(),25, reporte.tw_ren);
      reporte.ImpPosX(reporte1.Nombre_1.toString(),35, reporte.tw_ren);
      reporte.ImpPosX(reporte1.Año_Nac_1.toString().substring(0,4),120, reporte.tw_ren);
      reporte.ImpPosX(reporte1.Mes_Nac_1.toString().substring(4,2),130, reporte.tw_ren);
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

  const ImprimePDF = () => {

    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Lista de Alumnos por clase semanal",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: FormaRepASem,
    };

    const reporte = new ReportePDF(configuracion);

    const { body } = configuracion;
    const Enca1 = (doc) => {
      if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalV();
        doc.nextRow(8);
        doc.ImpPosX(`Clase: ${Formahorario}`,15,doc.tw_ren),
        doc.nextRow(5);
        doc.ImpPosX("Profesor: _________________________________________",15,doc.tw_ren),
        doc.nextRow(5);
        doc.ImpPosX(`Fecha emisión: ${fecha}`,15,doc.tw_ren),
        doc.nextRow(10);
        doc.ImpPosX("No.",15,doc.tw_ren),
        doc.ImpPosX("No. A",25,doc.tw_ren),
        doc.ImpPosX("Nombre",35,doc.tw_ren),
        doc.ImpPosX("Año",120,doc.tw_ren),
        doc.ImpPosX("Mes",130,doc.tw_ren),
        doc.ImpPosX("OBSERVACIONES",145,doc.tw_ren),
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
      reporte.ImpPosX(reporte1.Num_Renglon.toString(),15, reporte.tw_ren);
      reporte.ImpPosX(reporte1.Numero_1.toString(),25, reporte.tw_ren);
      reporte.ImpPosX(reporte1.Nombre_1.toString(),35, reporte.tw_ren);
      reporte.ImpPosX(reporte1.Año_Nac_1.toString().substring(0,4),120, reporte.tw_ren);
      reporte.ImpPosX(reporte1.Mes_Nac_1.toString().substring(4,2),130, reporte.tw_ren);
      Enca1(reporte);
      if (reporte.tw_ren >= reporte.tw_endRen) {
        reporte.pageBreak();
        Enca1(reporte);
      }
    });
      reporte.guardaReporte("RepAlumSem");
  };

  const ImprimeExcel = () => {
    const configuracion = {
      Encabezado:{
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Lista de Alumnos por clase semanal",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
        Clase: `Clase: ${Formahorario}`,
        Profesor: "Profesor: ",
        FechaE: `Fecha: ${fecha}`,
      },
      body: FormaRepASem,
      
      columns:[
        { header: "No.", dataKey: "Num_Renglon" },
        { header: "No. A", dataKey: "Numero_1" },
        { header: "Nombre", dataKey: "Nombre_1" },
        { header: "Año", dataKey: "Año_Nac_1" },
        { header: "Mes", dataKey: "Mes_Nac_1" },
        { header: "OBSERVACIONES"},
    ],
    nombre: "RepAlumSem"
  }
  ImprimirExcel(configuracion)
  };

  if (status === "loading") {
    return (
      <div className="container skeleton w-full max-w-screen-xl shadow-xl rounded-xl"></div>
    );
  }

  return (
    <>
      <div className="container w-full max-w-screen-xl  bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3">
        <div className="flex justify-start p-3">
          <h1 className="text-4xl font-xthin  text-black dark:text-white md:px-12">
            Reporte de Alumnos por clase semanal.
          </h1>
        </div>
        <div className="container grid grid-cols-8 grid-rows-1 h-[calc(100%-20%)]">
          <div className="col-span-1 flex flex-col">
            <Acciones 
            Ver={handleClickVer}
            ImprimePDF={ImprimePDF}
            ImprimeExcel={ImprimeExcel}
            home={home}
            CerrarView={CerrarView}
            />
          </div>
          <div className="col-span-7">
            <div className="flex flex-col h-[calc(100%)]">
            <div className='flex flex-row gap-3'>
              <label className='input input-bordered input-md text-black dark:text-white flex items-center gap-3'>
                Fecha emisión
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className='text-black dark:text-white'
                />
              </label>
              <BuscarCat
                table="horarios"
                titulo={"horario: "}
                token={session.user.token}
                nameInput={["horario", "horario_nombre"]}
                fieldsToShow={["numero", "horario"]}
                setItem={setHorario}
                modalId="modal_horarios"
              />
            </div>
              <div className=" col-8">
                <label className={` input-md text-black dark:text-white flex items-center gap-3`}>
                    <span className="text-black dark:text-white">Ordenar por:</span>
                    <label className={` input-md text-black dark:text-white flex items-center gap-3`} onChange={(event) => handleCheckChange(event)} >
                        <span className="text-black dark:text-white">Nombre</span>
                        <input type="radio" name="ordenar" value="nombre" className="radio checked:bg-blue-500" />
                    </label>
                    <label className={` input-md text-black dark:text-white flex items-center gap-3`} onChange={(event) => handleCheckChange(event)}>
                        <span className="text-black dark:text-white">Número</span>
                        <input type="radio" name="ordenar" value="id" className="radio checked:bg-blue-500" />
                    </label>
                </label>
              </div>
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

export default Rep_Femac_13;