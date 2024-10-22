"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Acciones from "./components/Acciones";
import { formatDate } from "../utils/globalfn";
import {
  Documentos,
  grupo_cobranza,
  Imprimir,
  ImprimirExcel,
} from "../utils/api/Rep_Femac_7/Rep_Femac_7";
import { useSession } from "next-auth/react";
import { ReportePDF } from "../utils/ReportesPDF";
import "@react-pdf-viewer/core/lib/styles/index.css";
import ModalVistaPreviaReporteAdeudoPendientes from "./components/modalVistaPreviaRepAdeudoPendiente";

function Repo_Femac_7() {
  const date = new Date();
  const dateStr = formatDate(date);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [fecha, setFecha] = useState(dateStr.replace(/\//g, "-"));
  const [documento, setDocumento] = useState(0);
  const [sinDeudores, setSinDeudores] = useState(true);
  const [grupoAlumno, setGrupoAlumno] = useState(false);
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const [animateLoading, setAnimateLoading] = useState(false);

  const home = () => {
    router.push("/");
  };
  const ImprimePDF = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Nombre de la Aplicación",
        Nombre_Reporte: `Reporte de Reporte de Adeudos Pendientes al ${fecha}`,
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
    };
    const { token } = session.user;
    Imprimir(configuracion, grupoAlumno, token, fecha, sinDeudores, documento);
  };
  const ImprimeExcel = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: `Reporte de Reporte de Adeudos Pendientes al ${fecha}`,
        Nombre_Usuario: `${session.user.name}`,
      },
      columns: [
        { header: "Alumno", dataKey: "alumno" },
        { header: "Nombre", dataKey: "nombre" },
        { header: "Producto", dataKey: "producto" },
        { header: "Descripción", dataKey: "descripcion" },
        { header: "Fecha", dataKey: "fecha" },
        { header: "Saldo", dataKey: "saldo" },
        { header: "Total", dataKey: "total" },
        { header: "Telefono", dataKey: "telefono" },
      ],
      nombre: "Reporte de Adeudos Pendientes",
    };
    const { token } = session.user;
    ImprimirExcel(
      configuracion,
      grupoAlumno,
      token,
      fecha,
      sinDeudores,
      documento
    );
  };
  const handleVerClick = async () => {
    setAnimateLoading(true);
    cerrarModalVista();
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Nombre de la Aplicación",
        Nombre_Reporte: `Reporte de Reporte de Adeudos Pendientes al ${fecha}`,
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
    };
    const orientacion = "landscape";
    const reporte = new ReportePDF(configuracion, orientacion);
    const Enca1 = (doc) => {
      if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalH();
        doc.nextRow(12);
        doc.ImpPosX("Alumno", 14, doc.tw_ren);
        doc.ImpPosX("Nombre", 28, doc.tw_ren);
        doc.ImpPosX("Producto", 108, doc.tw_ren);
        doc.ImpPosX("Descripcion", 128, doc.tw_ren);
        doc.ImpPosX("Fecha", 208, doc.tw_ren);
        doc.ImpPosX("Saldo", 228, doc.tw_ren);
        doc.ImpPosX("Total", 248, doc.tw_ren);
        doc.ImpPosX("Telefono", 268, doc.tw_ren);
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
    const { token } = session.user;
    if (grupoAlumno) {
      const data = await grupo_cobranza(token);
      let num_Ord = 0;
      let nom_grupo = "";
      let grupo_ant = "";
      let grupo_act = "";

      for (const dato of data) {
        if (dato.horario_1 > 0) {
          grupo_act = dato.horario_1;

          if (grupo_ant !== grupo_act) {
            num_Ord = 1;
            nom_grupo = dato.horario;
          }

          const res = await fetch(
            `${process.env.DOMAIN_API}api/documentoscobranza/grupo`,
            {
              method: "PUT",
              body: JSON.stringify({
                alumno: dato.id,
                nomGrupo: dato.horario,
                numOrd: num_Ord,
                baja: dato.baja,
              }),
              headers: new Headers({
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              }),
            }
          );
          if (res.status) break;
          grupo_ant = grupo_act;
        }
      }
    }
    let si_Imp;
    let alu_Ant = 0;
    let alu_Act = 0;
    let total_General = 0;
    let grupo_ant = "";
    let grupo_act = "";
    let nombre;
    let saldo;
    let saldoTotal = 0; // Inicializa saldoTotal a 0
    const data = await Documentos(token, fecha, grupoAlumno);
    const documentos = data.documentos;
    const indeces = data.indeces;
    const alumnos = data.alumnos;
    documentos.forEach((doc, index) => {
      grupo_act = doc.grupo;
      alu_Act = doc.alumno;
      if (grupoAlumno) {
        if (grupo_act !== grupo_ant) {
          reporte.ImpPosX("Grupo " + grupo_act, 14, reporte.tw_ren);
          reporte.nextRow(4);
        }
      }
      if (alu_Ant !== doc.alumno) {
        const incide = indeces.find((ind) => ind.Alumno === alu_Act);
        si_Imp = incide && incide.Incide >= documento;

        if (sinDeudores === true) {
          const estatus = alumnos.find((alu) => alu.numero === alu_Act);
          if (
            estatus.estatus.toUpperCase() === "DEUDOR" ||
            estatus.estatus.toUpperCase() === "CARTERA"
          ) {
            si_Imp = false;
          }
        }
      }
      if (si_Imp === true) {
        reporte.ImpPosX(alu_Act.toString(), 14, reporte.tw_ren);
        const data = alumnos.find((alu) => alu.numero === alu_Act);
        nombre = data.nombre;
        reporte.ImpPosX(nombre.toString(), 28, reporte.tw_ren);
        reporte.ImpPosX(doc.producto.toString(), 108, reporte.tw_ren);
        reporte.ImpPosX(doc.descripcion.toString(), 128, reporte.tw_ren);
        reporte.ImpPosX(doc.fecha.toString(), 208, reporte.tw_ren);
        saldo = doc.importe - doc.importe * (doc.descuento / 100);
        saldoTotal += saldo;
        total_General += saldo;
        reporte.ImpPosX(saldo.toFixed(2).toString(), 228, reporte.tw_ren);

        const isLastRecordForAlumno =
          index === documentos.length - 1 ||
          documentos[index + 1].alumno !== alu_Act;

        if (isLastRecordForAlumno) {
          reporte.ImpPosX(
            saldoTotal.toFixed(2).toString(),
            248,
            reporte.tw_ren
          );
          reporte.ImpPosX(
            data.telefono_1?.toString() ?? "",
            268,
            reporte.tw_ren
          );
          saldoTotal = 0;
          reporte.nextRow(5);
        }

        Enca1(reporte);
        if (reporte.tw_ren >= reporte.tw_endRen) {
          reporte.pageBreakH();
          Enca1(reporte);
        }
      }
      grupo_ant = grupo_act;
      alu_Ant = alu_Act;
    });
    reporte.ImpPosX("Total General", 208, reporte.tw_ren);
    reporte.ImpPosX(total_General.toFixed(2).toString(), 248, reporte.tw_ren);
    setTimeout(() => {
      const pdfData = reporte.doc.output("datauristring");
      setPdfData(pdfData);
      setPdfPreview(true);
      showModalVista(true);
      setAnimateLoading(false);
    }, 500);
  };

  const showModalVista = (show) => {
    show
      ? document.getElementById("modalVPRepAdeudosPendientes").showModal()
      : document.getElementById("modalVPRepAdeudosPendientes").close();
  };
  const cerrarModalVista = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalVPRepAdeudosPendientes").close();
  };
  return (
    <>
      <ModalVistaPreviaReporteAdeudoPendientes
        pdfPreview={pdfPreview}
        pdfData={pdfData}
        PDF={ImprimePDF}
        Excel={ImprimeExcel}
      />
      <div className="flex flex-col justify-start items-start bg-slate-100 shadow-xl rounded-xl dark:bg-slate-700 h-full max-[420px]:w-full w-11/12">
        <div className="w-full py-3">
          {/* Fila de la cabecera de la pagina */}
          <div className="flex flex-col justify-start p-3 max-[600px]:p-0">
            <div className="flex flex-wrap items-start md:items-center mx-auto">
              <div className="order-2 md:order-1 flex justify-between w-full md:w-auto mb-0">
                <Acciones home={home} Ver={handleVerClick} isLoading={animateLoading}/>
              </div>
              <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 mx-5">
                Reporte Adeudos Pendientes
              </h1>
            </div>
          </div>
        </div>
        <div className="w-full py-3 flex flex-col gap-y-4">
          {/* Fila del formulario de la pagina */} 
          <div className=" max-[600px]:w-full max-[768px]:w-full max-[1699px]:w-9/12 min-[1920px]:w-1/4 mx-auto ">
            <div className="flex max-[499px]:flex-col flex-row max-[499px]:gap-1 max-[500px]:gap-1 gap-4">
              <div className="lg:w-fit md:w-fit">
                <label className="input input-bordered input-md text-black dark:text-white flex items-center max-[430px]:gap-1 gap-3 w-auto lg:w-fit md:w-full">
                  Fecha Ini.
                  <input
                    type="date" 
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="rounded block grow text-black max-[500px]:w-[100px] w-auto dark:text-white border-b-2 border-slate-300 dark:border-slate-700 "
                  />
                </label>
              </div>
              <div className="lg:w-fit md:w-fit">
                <label className="input input-bordered input-md text-black dark:text-white flex items-center max-[430px]:gap-1 gap-3 w-auto lg:w-fit md:w-fit">
                  Documento
                  <input
                    type="text"
                    value={documento}
                    onChange={(e) => setDocumento(e.target.value)}
                    className="rounded block grow text-black w-full  max-w-[100px]  dark:text-white border-b-2 border-slate-300 dark:border-slate-700 "
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="flex flex-row">
            <div className=" max-[600px]:w-full max-[768px]:w-full max-[1699px]:w-9/12 min-[1920px]:w-1/4  mx-auto ">
              <div className="flex space-x-4">
                <label
                  htmlFor="ch_sinDeudores"
                  className="label cursor-pointer flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    id="ch_sinDeudores"
                    className="checkbox mx-2 checkbox-md"
                    checked={sinDeudores}
                    onClick={(evt) => setSinDeudores(evt.target.checked)}
                  />
                  <span className="label-text font-bold  sm:block text-neutral-600 dark:text-neutral-200">
                    Sin Deudores
                  </span>
                </label>
                <label
                  htmlFor="ch_grupoAlumno"
                  className="label cursor-pointer flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    id="ch_grupoAlumno"
                    className="checkbox mx-2 checkbox-md"
                    onClick={(evt) => setGrupoAlumno(evt.target.checked)}
                  />
                  <span className="label-text font-bold  sm:block text-neutral-600 dark:text-neutral-200">
                    Imprimir Grupo, Alumno
                  </span>
                </label>
                {/* </label> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Repo_Femac_7;
