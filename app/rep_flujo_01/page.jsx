"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Inputs from "./components/Inputs";
import { useForm } from "react-hook-form";
import Acciones from "./components/Acciones";
import { Fecha_de_Ctod, formatDate, permissionsComponents, formatFecha, formatNumber} from "../utils/globalfn";
import {
  DocumentosCobranza,
  ImprimirExcel,
  ImprimirPDF,
} from "../utils/api/rep_flujo_01/rep_flujo_01";
import VistaPrevia from "../components/VistaPrevia";
import { ReportePDF } from "../utils/ReportesPDF";

function Rep_Flujo_01() {
  const date = new Date();

  const router = useRouter();
  const { data: session, status } = useSession();
  let [fecha_ini, setFecha_ini] = useState(date.toISOString().split("T")[0]); //date.toISOString().split("T")[0]
  let [fecha_fin, setFecha_fin] = useState(date.toISOString().split("T")[0]); //date.toISOString().split("T")[0]
  const [selectedOption, setSelectedOption] = useState("sin_deudores");
  const [dataDocumentoCobranza, setDataDocumentoCobranza] = useState([]);
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const [permissions, setPermissions] = useState({});
  const [animateLoading, setAnimateLoading] = useState(false);
  const {
    formState: { errors },
  } = useForm({});

  useEffect(() => {
    if (status === "loading" || !session) {
      return;
    }
    const fetchData = async () => {
      const { token, permissions } = session.user;
      const es_admin = session.user.es_admin;
      const menu_seleccionado = Number(localStorage.getItem("puntoMenu"));
      const permisos = permissionsComponents(es_admin, permissions, session.user.id, menu_seleccionado);
      setPermissions(permisos);
      
      //const fecha_ciclo = Fecha_de_Ctod(fecha_ini, -63);
      //const data = await DocumentosCobranza(token, fecha_ciclo, fecha_fin);
      //setDataDocumentoCobranza(data);
    };
    fetchData();
  }, [session, status, fecha_ini, fecha_fin]);

  if (status === "loading") {
    return (
      <div className="container skeleton w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  const handleCheckChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const home = () => {
    router.push("/");
  };
  const handleVerClick = async () => {
    setAnimateLoading(true);

    const fecha_ciclo = Fecha_de_Ctod(fecha_ini, -63);
      const data = await DocumentosCobranza(session.user.token, fecha_ciclo, fecha_fin);
      setDataDocumentoCobranza(data);

    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: `Reporte de Adeudos Pendientes al ${fecha_ini}`,
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: data,
    };
    const reporte = new ReportePDF(configuracion);
    const { body } = configuracion;
    const documentosCobranza = body.documentos_cobranza;
    const alumnos = body.alumnos;
    let Tw_Col = Array.from({ length: 14 }, () => Array(9).fill(0.0));
    let Tw_TGe = Array(9).fill(0.0);
    let Tw_Per = Array(14).fill("");
    let per_str;
    const Enca1 = (doc) => {
      if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalV();
        doc.nextRow(12);
        doc.ImpPosX("Periodo", 14, doc.tw_ren);
        doc.ImpPosX("Coleg.", 34, doc.tw_ren);
        doc.ImpPosX("Desc.", 54, doc.tw_ren);
        doc.ImpPosX("Inscrip.", 74, doc.tw_ren);
        doc.ImpPosX("Recargo", 94, doc.tw_ren);
        doc.ImpPosX("Taller", 114, doc.tw_ren);
        doc.ImpPosX("Total", 134, doc.tw_ren);
        doc.ImpPosX("Cobro", 154, doc.tw_ren);
        doc.ImpPosX("Saldo", 174, doc.tw_ren);
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
    let Pos_Act;
    for (Pos_Act = 0; Pos_Act <= 13; Pos_Act++) {
      Tw_Per[Pos_Act] = "";
      Tw_Col[Pos_Act][1] = 0;
      Tw_Col[Pos_Act][2] = 0;
      Tw_Col[Pos_Act][3] = 0;
      Tw_Col[Pos_Act][4] = 0;
      Tw_Col[Pos_Act][5] = 0;
      Tw_Col[Pos_Act][6] = 0;
      Tw_Col[Pos_Act][7] = 0;
      Tw_Col[Pos_Act][8] = 0;
    }
    for (Pos_Act = 1; Pos_Act <= 8; Pos_Act++) {
      Tw_TGe[Pos_Act] = 0;
    }
    Tw_Per[1] = (fecha_ini.slice(0, 7)).replace(/-/g, "/");
    Tw_Per[12] = (fecha_fin.slice(0, 7)).replace(/-/g, "/");
    let adiciona;
    
    documentosCobranza.forEach((documento) => {
      const alumno = alumnos.find((alu) => alu.numero === documento.alumno);
      if (alumno) {
        adiciona = true;
        if (selectedOption === "sin_deudor") {
          if (alumno.estatus.toUpperCase() === "Cartera") {
            adiciona = false;
          } else {
            adiciona = true;
          }
        }
        if (selectedOption === "solo_deudores") {
          if (alumno.estatus.toUpperCase() === "Cartera") {
            adiciona = true;
          } else {
            adiciona = false;
          }
        }
      } else {
        adiciona = false;
      }
      if (adiciona === true) {
        per_str = documento.fecha.toString().slice(0, 7);
        if (per_str < Tw_Per[1]) {
          Pos_Act = 0;
        } else if (per_str > Tw_Per[12]) {
          Pos_Act = 13;
        } else {
          for (Pos_Act = 1; Pos_Act <= 13; Pos_Act++) {
            if (Tw_Per[Pos_Act] === per_str) break;
            if (Tw_Per[Pos_Act] === "") {
              Tw_Per[Pos_Act] = per_str;
              break;
            }
          }
        }
        if (Pos_Act < 13) { 
          if (documento.ref.toString().toUpperCase() === "COL") {
            Tw_Col[Pos_Act][1] = Number(Tw_Col[Pos_Act][1]) + documento.importe;
            Tw_Col[Pos_Act][2] = Number(Tw_Col[Pos_Act][2]) + documento.importe * (documento.descuento / 100);
          } 
          if (documento.ref.toString().toUpperCase() === "INS") {
            Tw_Col[Pos_Act][3] = Number(Tw_Col[Pos_Act][3]) + documento.importe;
            Tw_Col[Pos_Act][4] = Number(Tw_Col[Pos_Act][4]) + documento.importe * (documento.descuento / 100);
          }
          if (documento.ref.toString().toUpperCase() === "REC") {
            Tw_Col[Pos_Act][4] = Number(Tw_Col[Pos_Act][4]) + documento.importe;
          }
          if (documento.ref.toString().toUpperCase() == "TAL") {
            Tw_Col[Pos_Act][5] = Number(Tw_Col[Pos_Act][5]) + documento.importe;
          }
          Tw_Col[Pos_Act][8] = Number(Tw_Col[Pos_Act][8]) + documento.importe_pago;
        }
      }
    });
    let imp_total;
    for(Pos_Act = 0; Pos_Act <= 13; Pos_Act++) {
      imp_total =
        Number(Tw_Col[Pos_Act][1]) -
        Number(Tw_Col[Pos_Act][2]) +
        Number(Tw_Col[Pos_Act][3]) +
        Number(Tw_Col[Pos_Act][4]) +
        Number(Tw_Col[Pos_Act][5]);
      Tw_TGe[1] = Number(Tw_TGe[1]) + Number(Tw_Col[Pos_Act][1]);
      Tw_TGe[2] = Number(Tw_TGe[2]) + Number(Tw_Col[Pos_Act][2]);
      Tw_TGe[3] = Number(Tw_TGe[3]) + Number(Tw_Col[Pos_Act][3]);
      Tw_TGe[4] = Number(Tw_TGe[4]) + Number(Tw_Col[Pos_Act][4]);
      Tw_TGe[5] = Number(Tw_TGe[5]) + Number(Tw_Col[Pos_Act][5]);
      Tw_TGe[6] = Number(Tw_TGe[6]) + Number(Tw_Col[Pos_Act][6]);
      Tw_TGe[7] = Number(Tw_TGe[7]) + Number(imp_total);
      Tw_TGe[8] = Number(Tw_TGe[8]) + Number(Tw_Col[Pos_Act][8]);
      reporte.ImpPosX(Tw_Per[Pos_Act].toString(), 14, reporte.tw_ren);
      reporte.ImpPosX(formatNumber(Tw_Col[Pos_Act][1].toString()), 34, reporte.tw_ren);
      reporte.ImpPosX(formatNumber(Tw_Col[Pos_Act][2].toString()), 54, reporte.tw_ren);
      reporte.ImpPosX(formatNumber(Tw_Col[Pos_Act][3].toString()), 74, reporte.tw_ren);
      reporte.ImpPosX(formatNumber(Tw_Col[Pos_Act][4].toString()), 94, reporte.tw_ren);
      reporte.ImpPosX(formatNumber(Tw_Col[Pos_Act][5].toString()), 114, reporte.tw_ren);
      reporte.ImpPosX(formatNumber(imp_total.toString()), 134, reporte.tw_ren);
      reporte.ImpPosX(formatNumber(Tw_Col[Pos_Act][8].toString()), 154, reporte.tw_ren);
      const sum = Number(imp_total) - Number(Tw_Col[Pos_Act][8].toString());
      reporte.ImpPosX(formatNumber(sum.toString()), 174, reporte.tw_ren);
      Enca1(reporte);
      if (reporte.tw_ren >= reporte.tw_endRen) {
        reporte.pageBreak();
        Enca1(reporte);
      }
    }
    reporte.ImpPosX("Total", 14, reporte.tw_ren);
    reporte.ImpPosX(formatNumber(Tw_TGe[1].toString()), 34, reporte.tw_ren);
    reporte.ImpPosX(formatNumber(Tw_TGe[2].toString()), 54, reporte.tw_ren);
    reporte.ImpPosX(formatNumber(Tw_TGe[3].toString()), 74, reporte.tw_ren);
    reporte.ImpPosX(formatNumber(Tw_TGe[4].toString()), 94, reporte.tw_ren);
    reporte.ImpPosX(formatNumber(Tw_TGe[5].toString()), 114, reporte.tw_ren);
    reporte.ImpPosX(formatNumber(Tw_TGe[7].toString()), 134, reporte.tw_ren);
    reporte.ImpPosX(formatNumber(Tw_TGe[8].toString()), 154, reporte.tw_ren);
    const sum = Number(Tw_TGe[7].toString()) - Number(Tw_TGe[8].toString());
    reporte.ImpPosX(formatNumber(sum.toString()), 174, reporte.tw_ren);
    const pdfData = reporte.doc.output("datauristring");
    setPdfData(pdfData);
    setPdfPreview(true);
    showModalVista(true);
    setAnimateLoading(false);
  };

  const ImprimePDF = async () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: `Reporte de Adeudos Pendientes  al ${fecha_ini}`,
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: dataDocumentoCobranza,
    };
    ImprimirPDF(configuracion, fecha_ini, fecha_fin, selectedOption);
  };
  const ImprimeExcel = async () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: `Reporte Adeudos Pendientes  al ${fecha_ini}`,
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: dataDocumentoCobranza,
      columns: [
        { header: "Periodo", dataKey: "periodo" },
        { header: "Coleg", dataKey: "coleg" },
        { header: "Desc", dataKey: "desc" },
        { header: "Inscrip", dataKey: "inscrip" },
        { header: "Recargo", dataKey: "recargo" },
        { header: "Taller", dataKey: "taller" },
        { header: "Total", dataKey: "total" },
        { header: "Cobro", dataKey: "cobro" },
        { header: "Saldo", dataKey: "saldo" },
      ],
      nombre: "Reporte de Adeudos Pendientes",
    };
    ImprimirExcel(configuracion, fecha_ini, fecha_fin, selectedOption);
  };
  const showModalVista = (show) => {
    show
      ? document.getElementById("modalVPRepFlujo01").showModal()
      : document.getElementById("modalVPRepFlujo01").close();
  };
  const CerrarView = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalVPRepFlujo01").close();
  };
  return (
    <>
      <VistaPrevia
        id={"modalVPRepFlujo01"}
        titulo={"Vista Previa de Adeudos Pendientes"}
        pdfPreview={pdfPreview}
        pdfData={pdfData}
        PDF={ImprimePDF}
        Excel={ImprimeExcel}
        CerrarView={CerrarView}
      />

      <div className="flex flex-col justify-start items-start bg-base-200 shadow-xl rounded-xl dark:bg-slate-700 h-full max-[420px]:w-full w-11/12">
        <div className="w-full py-3">
          <div className="flex flex-col justify-start p-3 max-[600px]:p-0">
            <div className="flex flex-wrap items-start md:items-center mx-auto">
              <div className="order-2 md:order-1 flex justify-between w-full md:w-auto mb-0">
                <Acciones
                  home={home}
                  Ver={handleVerClick}
                  isLoading = {animateLoading}
                  permiso_imprime = {permissions.impresion}
                />
              </div>
                <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
                  Reporte Adeudos Pendientes
                </h1>
            </div>
          </div>
        </div>
        <div className="w-full py-3 flex flex-col gap-y-4">
          <div className=" max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4 min-[1920px]:w-1/4 w-1/2 mx-auto ">
            <div className="flex flex-row max-[300px]:gap-1 gap-4 justify-center" >
                <Inputs
                name={"fecha_ini"}
                tamañolabel={""}
                //className={"rounded block grow"}
                Titulo={"Fecha Inicial: "}
                type={"date"}
                errors={errors}
                maxLength={11}
                isDisabled={false}
                setValue={setFecha_ini}
                value={fecha_ini}
                conteClassName="lg:w-fit md:w-fit"
                labelClassName="input input-bordered input-md text-black dark:text-white flex items-center max-[430px]:gap-1 gap-3 w-auto lg:w-fit md:w-full"
                inputClassName="rounded block grow text-black max-[500px]:w-[100px] w-auto dark:text-white border-b-2 border-slate-300 dark:border-slate-700"
                />

                <Inputs
                name={"fecha_fin"}
                tamañolabel={""}
                //className={"rounded block grow "}
                Titulo={"Fecha Final: "}
                type={"date"}
                errors={errors}
                maxLength={11}
                isDisabled={false}
                setValue={setFecha_fin}
                value={fecha_fin}
                conteClassName="lg:w-fit md:w-fit"
                labelClassName="input input-bordered input-md text-black dark:text-white flex items-center max-[430px]:gap-1 gap-3 w-auto lg:w-fit md:w-full"
                inputClassName="rounded block grow text-black max-[500px]:w-[100px] w-auto dark:text-white border-b-2 border-slate-300 dark:border-slate-700"
                />
            </div>
          </div>
          <div className="flex flex-row ">
            <div className=" max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4 min-[1920px]:w-1/4 w-1/2 mx-auto ">
              <div className="flex space-x-4 justify-center">
              <label className="flex items-center space-x-2 dark:text-white text-black">
                  <input
                    type="radio"
                    name="options"
                    value="sin_deudores"
                    checked={selectedOption === "sin_deudores"}
                    onChange={handleCheckChange}
                    className="radio checked:bg-blue-500"
                  />
                  <span>Sin Deudores</span>
                </label>
                <label className="flex items-center space-x-2 dark:text-white text-black">
                  <input
                    type="radio"
                    name="options"
                    value="solo_deudores"
                    checked={selectedOption === "solo_deudores"}
                    onChange={handleCheckChange}
                    className="radio checked:bg-blue-500"
                  />
                  <span>Solo Deudores</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Rep_Flujo_01;
