"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Acciones from "@/app/rep_femac_13/components/Acciones";
import ModalVistaPreviaRepFemac13 from "./components/modalVistaPreviaRepFemac13";
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
import { showSwal } from "@/app/utils/alerts";

function Rep_Femac_13() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const date = new Date();
  const dateStr = formatDate(date);
  const [fecha, setFecha] = useState(dateStr.replace(/\//g, '-'));
  const [FormaRepASem, setFormaRepASem] = useState([]);
  const [Formahorario, setFormahorario] = useState([]);
  const [horario, setHorario] = useState({});
  const [sOrdenar, ssetordenar] = useState('nombre');

  useEffect(() => {
    if (status === "loading" || !session) {
      return;
    }
    const fetchData = async () => {
      const { token } = session.user
      const data = await getRepASem(token, horario, sOrdenar);
      setFormaRepASem(data.data);

    }
    fetchData()
  }, [session, status, horario, sOrdenar]);


  const handleCheckChange = (event) => {
    ssetordenar(event.target.value);
  }

  const home = () => {
    router.push("/");
  };

  const handleClickVer = () => {
    if (horario.numero === undefined) {
      showSwal("Oppss!", "Para imprimir, debes seleccionar el horario", "error");
    } else {

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
          doc.ImpPosX(`Clase: ${horario.horario}`, 15, doc.tw_ren),
            doc.nextRow(5);
          doc.ImpPosX("Profesor: _________________________________________", 15, doc.tw_ren),
            doc.nextRow(5);
          doc.ImpPosX(`Fecha emisión: ${fecha}`, 15, doc.tw_ren),
            doc.nextRow(10);
          doc.ImpPosX("No.", 15, doc.tw_ren),
            doc.ImpPosX("No. A", 25, doc.tw_ren),
            doc.ImpPosX("Nombre", 35, doc.tw_ren),
            doc.ImpPosX("Año", 120, doc.tw_ren),
            doc.ImpPosX("Mes", 130, doc.tw_ren),
            doc.ImpPosX("OBSERVACIONES", 145, doc.tw_ren),
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
        reporte.ImpPosX(reporte1.Num_Renglon.toString(), 15, reporte.tw_ren);
        reporte.ImpPosX(reporte1.Numero_1.toString(), 25, reporte.tw_ren);
        reporte.ImpPosX(reporte1.Nombre_1.toString(), 35, reporte.tw_ren);
        reporte.ImpPosX(reporte1.Año_Nac_1.toString().substring(0, 4), 120, reporte.tw_ren);
        reporte.ImpPosX(reporte1.Mes_Nac_1.toString().substring(4, 2), 130, reporte.tw_ren);
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
    }

  };

  const showModalVista = (show) => {
    show
      ? document.getElementById("modalVPRepFemac13").showModal()
      : document.getElementById("modalVPRepFemac13").close();
  }

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
        doc.ImpPosX(`Clase: ${horario.horario}`, 15, doc.tw_ren),
          doc.nextRow(5);
        doc.ImpPosX("Profesor: _________________________________________", 15, doc.tw_ren),
          doc.nextRow(5);
        doc.ImpPosX(`Fecha emisión: ${fecha}`, 15, doc.tw_ren),
          doc.nextRow(10);
        doc.ImpPosX("No.", 15, doc.tw_ren),
          doc.ImpPosX("No. A", 25, doc.tw_ren),
          doc.ImpPosX("Nombre", 35, doc.tw_ren),
          doc.ImpPosX("Año", 120, doc.tw_ren),
          doc.ImpPosX("Mes", 130, doc.tw_ren),
          doc.ImpPosX("OBSERVACIONES", 145, doc.tw_ren),
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
      reporte.ImpPosX(reporte1.Num_Renglon.toString(), 15, reporte.tw_ren);
      reporte.ImpPosX(reporte1.Numero_1.toString(), 25, reporte.tw_ren);
      reporte.ImpPosX(reporte1.Nombre_1.toString(), 35, reporte.tw_ren);
      reporte.ImpPosX(reporte1.Año_Nac_1.toString().substring(0, 4), 120, reporte.tw_ren);
      reporte.ImpPosX(reporte1.Mes_Nac_1.toString().substring(4, 2), 130, reporte.tw_ren);
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
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Lista de Alumnos por clase semanal",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
        Clase: `Clase: ${horario.horario}`,
        Profesor: "Profesor: ",
        FechaE: `Fecha: ${fecha}`,
      },
      body: FormaRepASem,

      columns: [
        { header: "No.", dataKey: "Num_Renglon" },
        { header: "No. A", dataKey: "Numero_1" },
        { header: "Nombre", dataKey: "Nombre_1" },
        { header: "Año", dataKey: "Año_Nac_1" },
        { header: "Mes", dataKey: "Mes_Nac_1" },
        { header: "OBSERVACIONES" },
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
      <ModalVistaPreviaRepFemac13
        pdfPreview={pdfPreview}
        pdfData={pdfData}
        PDF={ImprimePDF}
        Excel={ImprimeExcel}
      />
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
              home={home}
            />
          </div>
          <div className="col-span-7">
            <div className="flex flex-col h-[calc(100%)] space-y-4">
              <div className='flex flex-col md:flex-row gap-3'>
                <label className='input input-bordered input-md text-black dark:text-white flex items-center gap-3 w-auto'>
                  Fecha emisión
                  <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className='text-black dark:text-white rounded block flex-grow'
                  />
                </label>

                <div className='w-full md:w-auto'>
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
              </div>
              <div className="col-8 flex flex-col">
                <label className="text-black dark:text-white flex flex-col gap-3 md:flex-row">
                  <span className="text-black dark:text-white">Ordenar por:</span>
                  <label className="flex items-center gap-3">
                    <span className="text-black dark:text-white">Nombre</span>
                    <input
                      type="radio"
                      name="ordenar"
                      value="nombre"
                      onChange={handleCheckChange}
                      checked={sOrdenar === "nombre"}
                      className="radio checked:bg-blue-500"
                    />
                  </label>
                  <label className="flex items-center gap-3">
                    <span className="text-black dark:text-white">Número</span>
                    <input
                      type="radio"
                      name="ordenar"
                      value="id"
                      onChange={handleCheckChange}
                      checked={sOrdenar === "id"}
                      className="radio checked:bg-blue-500"
                    />
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

export default Rep_Femac_13;
