"use client";
import React from "react";
import { useState } from "react";
import { calculaDigitoBvba, formatDate, formatDate_NewDate, format_Fecha_String } from "../utils/globalfn";
import BuscarCat from "../components/BuscarCat";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Acciones from "./components/Acciones";
import {
  getDetallePedido,
  getTrabRepCob,
  ImprimirExcel,
  ImprimirPDF,
  insertTrabRepCobr,
} from "../utils/api/rep_femac_12_anexo_4/rep_femac_12_anexo";
import { ReportePDF } from "../utils/ReportesPDF";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import ModalVistaPreviaRepFemac12Anexo4 from "./components/ModalVistaPreviaRepFemac12Anexo4";
import { useEffect } from "react";

function RepFemac12Anexo() {
  const date = new Date();
  console.log(date)
  const dateStr = formatDate(date);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [fecha1, setFecha1] = useState("");
  const [fecha2, setFecha2] = useState("");
  const [producto1, setProducto1] = useState({});
  const [producto2, setProducto2] = useState({});
  const [sOrdenar, ssetordenar] = useState("nombre");
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const [isLoading, setisLoading] = useState(false);

  const getPrimerDiaDelMes = () => {
    const fechaActual = new Date();
    return new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1)
      .toISOString()
      .split('T')[0];
  };

  const getUltimoDiaDelMes = () => {
    const fechaActual = new Date();
    return new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0)
      .toISOString()
      .split('T')[0];
  };

  useEffect(() => {
    setFecha1(getPrimerDiaDelMes());
    setFecha2(getUltimoDiaDelMes());
  }, []);

  if (status === "loading") {
    return (
      <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  const handleCheckChange = (event) => {
    event.preventDefault;
    ssetordenar(event.target.value);
  };
  const home = () => {
    router.push("/");
  };
  const ImprimePDF = () => {
    setisLoading(true);
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de Cobranza por Producto",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
    };
    const { token } = session.user;
    ImprimirPDF(
      configuracion,
      token,
      fecha1,
      fecha2,
      producto1.numero,
      producto2.numero,
      sOrdenar
    );
    setisLoading(false);
  };
  const ImprimeExcel = () => {
    setisLoading(true);
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de Cobranza por Producto",
        Nombre_Usuario: `${session.user.name}`,
      },
      columns: [
        { header: "Producto", dataKey: "articulo" },
        { header: "Descripcion", dataKey: "descripcion" },
      ],
      columns2: [
        { header: "Alumno", dataKey: "alumno" },
        { header: "Nombre", dataKey: "nombre" },
        { header: "Importe", dataKey: "importe" },
        { header: "Fecha Pago", dataKey: "fecha" },
      ],
      nombre: "Reporte de Cobranza por Producto",
    };
    const { token } = session.user;
    ImprimirExcel(
      configuracion,
      token,
      fecha1,
      fecha2,
      producto1.numero,
      producto2.numero,
      sOrdenar
    );
    setisLoading(false);
  };

  const handleVerClick = async () => {
    setisLoading(true);
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de Cobranza por Producto",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
    };
    const { token } = session.user;
    const reporte = new ReportePDF(configuracion);
    const Enca1 = (doc) => {
      if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalV();
        doc.nextRow(12);
        doc.ImpPosX("Producto", 24, doc.tw_ren,0,"R");
        doc.ImpPosX("Descripcion", 43, doc.tw_ren,0,"L");
        doc.nextRow(4);
        doc.ImpPosX("Alumno", 24, doc.tw_ren,0,"R");
        doc.ImpPosX("Nombre", 38, doc.tw_ren,0,"L");
        doc.ImpPosX("Importe", 138, doc.tw_ren,0,"R");
        doc.ImpPosX("Fecha Pago", 168, doc.tw_ren,0,"L");
        doc.nextRow(4);
        doc.printLineV();
        doc.nextRow(4);
        doc.tiene_encabezado = true;
      } else {
        doc.nextRow(6);
        doc.tiene_encabezado = true;
      }
    };
    const Cambia_Articulo = (doc, Total_Art) => {
      doc.ImpPosX("TOTAL", 108, doc.tw_ren,0,"R");
      doc.ImpPosX(Total_Art.toString(), 138, doc.tw_ren,0,"R");
      doc.nextRow(4);
    };
    Enca1(reporte);
    let articulo = producto1.numero === undefined ? "" : producto1.numero;
    let artFin = producto2.numero === undefined ? "" : producto2.numero;
    const data = await getDetallePedido(
      token,
      fecha1,
      fecha2,
      articulo,
      artFin
    );
    let alu_Ant;
    let alumno;
    for (const dato of data) {
      if (alu_Ant !== dato.alumno) {
        alumno = dato.nombre;
      }
      const importe =
        dato.cantidad * dato.precio_unitario -
        dato.cantidad * dato.precio_unitario * (dato.descuento / 100);
      const datos = {
        recibo: dato.recibo,
        fecha: dato.fecha,
        articulo: parseInt(dato.articulo),
        documento: dato.documento,
        alumno: dato.alumno,
        nombre: alumno,
        importe: importe,
      };
      const res = await insertTrabRepCobr(token, datos);
      alu_Ant = dato.alumno;
    }
    const dataTrabRepCobr = await getTrabRepCob(token, sOrdenar);
    let Art_Ant = "";
    let tot_art = 0;
    let total_general = 0;
    dataTrabRepCobr.forEach((trabRep) => {
      if (trabRep.articulo !== Art_Ant && Art_Ant !== "") {
        Cambia_Articulo(reporte, tot_art);
        tot_art = 0;
      }
      if (trabRep.articulo !== Art_Ant) {
        reporte.ImpPosX(trabRep.articulo.toString(), 24, reporte.tw_ren,0,"R");
        reporte.ImpPosX(trabRep.descripcion.toString(), 43, reporte.tw_ren,0,"L");
        Enca1(reporte);
        if (reporte.tw_ren >= reporte.tw_endRen) {
          reporte.pageBreak();
          Enca1(reporte);
        }
      }
      reporte.ImpPosX(
        trabRep.alumno.toString() +
        "-" +
        calculaDigitoBvba(trabRep.alumno.toString()),
        24,
        reporte.tw_ren,0,"R"
      );
      reporte.ImpPosX(trabRep.nombre.toString(), 38, reporte.tw_ren,0,"L");
      reporte.ImpPosX(trabRep.importe.toString(), 138, reporte.tw_ren,0,"R");
      reporte.ImpPosX(trabRep.fecha.toString(), 168, reporte.tw_ren,0,"L");
      Enca1(reporte);
      if (reporte.tw_ren >= reporte.tw_endRen) {
        reporte.pageBreak();
        Enca1(reporte);
      }
      tot_art = tot_art + trabRep.importe;
      total_general = total_general + trabRep.importe;
      Art_Ant = trabRep.articulo;
    });
    Cambia_Articulo(reporte, tot_art);
    reporte.ImpPosX("TOTAL General", 98, reporte.tw_ren,0,"L");
    reporte.ImpPosX(total_general.toString(), 138, reporte.tw_ren,0,"R");
    const pdfData = reporte.doc.output("datauristring");
    setPdfData(pdfData);
    setisLoading(false);
    setPdfPreview(true);
    showModalVista(true);
  };

  const showModalVista = (show) => {
    show
      ? document.getElementById("modalVPRepFemac12Anexo4").showModal()
      : document.getElementById("modalVPRepFemac12Anexo4").close();
  };


  return (
    <>
      <ModalVistaPreviaRepFemac12Anexo4
        pdfPreview={pdfPreview}
        pdfData={pdfData}
        PDF={ImprimePDF}
        Excel={ImprimeExcel}
      />

<div className="container h-[80vh] w-full max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y-hidden">
      <div className="flex flex-col justify-start p-3">
          <div className="flex flex-wrap md:flex-nowrap items-start md:items-center">
            <div className="order-2 md:order-1 flex justify-around w-full md:w-auto md:justify-start mb-0 md:mb-0">
              <Acciones
                home={home}
                Ver={handleVerClick}
              />
            </div>
            <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
            Reporte de Cobranza por Productos
            </h1>
          </div>
        </div>
          <div className="col-span-7">
            <div className="flex flex-col h-[calc(100%)] overflow-y-auto">
              <div className="flex flex-col md:flex-row gap-4 p-1">
                <div className='w-11/12 md:w-4/12 lg:w-3/12'>
                  <label className="input input-bordered input-md text-black dark:text-white flex items-center gap-3">
                    Fecha Inicia
                    <input
                      type="date"
                      value={fecha1}
                      onChange={(e) => setFecha1(e.target.value)}
                      className="grow dark:text-neutral-200 join-item border-b-2 border-slate-300 dark:border-slate-700 text-neutral-600 rounded-r-none"
                    />
                  </label>
                </div>
                <div className='w-11/12 md:w-4/12 lg:w-3/12'>
                  <label className="input input-bordered input-md text-black dark:text-white flex items-center gap-3">
                    Fecha Fin
                    <input
                      type="date"
                      value={fecha2}
                      onChange={(e) => setFecha2(e.target.value)}
                      className=" grow dark:text-neutral-200 join-item border-b-2 border-slate-300 dark:border-slate-700 text-neutral-600 rounded-r-none"
                    />
                  </label>
                </div>
              </div>
              <div className="p-2">
                <BuscarCat
                  table={"productos"}
                  nameInput={["producto1", "producto_desc1"]}
                  fieldsToShow={["numero", "descripcion"]}
                  titulo={"Producto: "}
                  setItem={setProducto1}
                  token={session.user.token}
                  modalId={"modal_producto1"}
                  inputWidths={{ first: "100px", second: "300px" }}
                />
              </div>
              <div className="p-2">
                <BuscarCat
                  table={"productos"}
                  nameInput={["producto2", "producto_desc2"]}
                  fieldsToShow={["numero", "descripcion"]}
                  titulo={"Producto: "}
                  setItem={setProducto2}
                  token={session.user.token}
                  modalId={"modal_producto2"}
                  inputWidths={{ first: "100px", second: "300px" }}
                />
              </div>
              <div className=" col-8 flex flex-col">
                <label
                  className={` input-md text-black dark:text-white flex items-center gap-3`}
                >
                  <span className="text-black dark:text-white">
                    Ordenar por:
                  </span>
                  <label
                    className={` input-md text-black dark:text-white flex items-center gap-3`}
                    onChange={(event) => handleCheckChange(event)}
                  >
                    <span className="text-black dark:text-white">Nombre</span>
                    <input
                      type="radio"
                      name="ordenar"
                      value="nombre"
                      className="radio"
                    />
                  </label>
                  <label
                    className={` input-md text-black dark:text-white flex items-center gap-3`}
                    onChange={(event) => handleCheckChange(event)}
                  >
                    <span className="text-black dark:text-white">Número</span>
                    <input
                      type="radio"
                      name="ordenar"
                      value="id"
                      className="radio"
                    />
                  </label>
                </label>
              </div>
            </div>
          </div>
        </div>
    </>
  );
}

export default RepFemac12Anexo;
