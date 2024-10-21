"use client";
import React from "react";
import { useState } from "react";
import {
  calculaDigitoBvba,
  formatDate,
  formatDate_NewDate,
  format_Fecha_String,
} from "../utils/globalfn";
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
  console.log(date);
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
  const [animateLoading, setAnimateLoading] = useState(false);

  const getPrimerDiaDelMes = () => {
    const fechaActual = new Date();
    return new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1)
      .toISOString()
      .split("T")[0];
  };

  const getUltimoDiaDelMes = () => {
    const fechaActual = new Date();
    return new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];
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
    setAnimateLoading(true);
    cerrarModalVista();
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
        doc.ImpPosX("Producto", 24, doc.tw_ren, 0, "R");
        doc.ImpPosX("Descripcion", 43, doc.tw_ren, 0, "L");
        doc.nextRow(4);
        doc.ImpPosX("Alumno", 24, doc.tw_ren, 0, "R");
        doc.ImpPosX("Nombre", 38, doc.tw_ren, 0, "L");
        doc.ImpPosX("Importe", 138, doc.tw_ren, 0, "R");
        doc.ImpPosX("Fecha Pago", 168, doc.tw_ren, 0, "L");
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
      doc.ImpPosX("TOTAL", 108, doc.tw_ren, 0, "R");
      doc.ImpPosX(Total_Art.toString(), 138, doc.tw_ren, 0, "R");
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
        reporte.ImpPosX(
          trabRep.articulo.toString(),
          24,
          reporte.tw_ren,
          0,
          "R"
        );
        reporte.ImpPosX(
          trabRep.descripcion.toString(),
          43,
          reporte.tw_ren,
          0,
          "L"
        );
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
        reporte.tw_ren,
        0,
        "R"
      );
      reporte.ImpPosX(trabRep.nombre.toString(), 38, reporte.tw_ren, 0, "L");
      reporte.ImpPosX(trabRep.importe.toString(), 138, reporte.tw_ren, 0, "R");
      reporte.ImpPosX(trabRep.fecha.toString(), 168, reporte.tw_ren, 0, "L");
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
    reporte.ImpPosX("TOTAL General", 98, reporte.tw_ren, 0, "L");
    reporte.ImpPosX(total_general.toString(), 138, reporte.tw_ren, 0, "R");
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
      ? document.getElementById("modalVPRepFemac12Anexo4").showModal()
      : document.getElementById("modalVPRepFemac12Anexo4").close();
  };

  const cerrarModalVista = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalVPRepFemac12Anexo4").close();
  };

  return (
    <>
      <ModalVistaPreviaRepFemac12Anexo4
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
                Reporte de Cobranza por Productos
              </h1>
            </div>
          </div>
        </div>
        <div className="w-full py-3 flex flex-col gap-y-4">
          {/* Fila del formulario de la pagina */}
          <div className=" max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4 min-[1300px]:w-1/3 min-[1920px]:w-1/4 w-1/2 mx-auto space-y-4">
            <div className="flex flex-row max-[499px]:gap-1 gap-4">
              <div className="lg:w-fit md:w-fit">
                <label className="input input-bordered input-md text-black dark:text-white flex items-center max-[430px]:gap-1 gap-3 w-auto lg:w-fit md:w-full">
                  Fecha Ini.
                  <input
                    type="date"
                    value={fecha1}
                    onChange={(e) => setFecha1(e.target.value)}
                    className="rounded block grow text-black max-[500px]:w-[100px] w-auto dark:text-white border-b-2 border-slate-300 dark:border-slate-700 "
                  />
                </label>
              </div>
              <div className="lg:w-fit md:w-fit">
                <label className="input input-bordered input-md text-black dark:text-white flex items-center max-[430px]:gap-1 gap-3 w-auto lg:w-fit md:w-fit">
                  Fecha Fin
                  <input
                    type="date"
                    value={fecha2}
                    onChange={(e) => setFecha2(e.target.value)}
                    className="rounded block grow text-black max-[500px]:w-[100px] w-auto dark:text-white border-b-2 border-slate-300 dark:border-slate-700 "
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="flex flex-row">
            <div className=" max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4 min-[1300px]:w-1/3 min-[1920px]:w-1/4 w-1/2 mx-auto ">
              <div className="col-span-full md:col-span-full lg:col-span-full">
                <div className="w-full">
                  <BuscarCat
                    table={"productos"}
                    nameInput={["producto1", "producto_desc1"]}
                    fieldsToShow={["numero", "descripcion"]}
                    titulo={"Producto: "}
                    setItem={setProducto1}
                    token={session.user.token}
                    modalId={"modal_producto1"}
                    inputWidths={{ first: "100px", second: "300px" }}
                    descClassName="md:mt-0 w-full"
                  />
                </div>
              </div>
              <div className="col-span-full md:col-span-full lg:col-span-full">
                <div className="w-full">
                  <BuscarCat
                    table={"productos"}
                    nameInput={["producto2", "producto_desc2"]}
                    fieldsToShow={["numero", "descripcion"]}
                    titulo={"Producto: "}
                    setItem={setProducto2}
                    token={session.user.token}
                    modalId={"modal_producto2"}
                    inputWidths={{ first: "100px", second: "300px" }}
                    descClassName="md:mt-0 w-full"
                  />
                </div>
              </div>
              <div className="flex flex-row max-[499px]:gap-1 gap-4">
                <div className="lg:w-fit md:w-fit">
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
        </div>
      </div>
    </>
  );
}

export default RepFemac12Anexo;
