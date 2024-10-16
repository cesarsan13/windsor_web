"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Acciones from "./components/Acciones";
import BuscarCat from "../components/BuscarCat";
import { useRouter } from "next/navigation";
import {
  Cobranza,
  Imprimir,
  ImprimirExcel,
} from "../utils/api/Rep_Femac_6/Rep_Femac_6";
import { formatDate, formatNumber } from "../utils/globalfn";
import { ReportePDF } from "../utils/ReportesPDF";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import ModalVistaPreviaRep6 from "./components/modalVistaPreviaRep6";
import Swal from "sweetalert2"; // Importa SweetAlert2

function Rep_Femac_6() {
  const date = new Date();
  const dateStr = formatDate(date);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [cajero, setCajero] = useState({});
  const [fechaIni, setFechaIni] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [dataCobranza, setDataCobranza] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
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
    setFechaIni(getPrimerDiaDelMes());
    setFechaFin(getUltimoDiaDelMes());
  }, []);
  useEffect(() => {
    if (status === "loading" || !session) {
      return;
    }
    const fetchData = async () => {
      setisLoading(true);
      const { token } = session.user;
      const id = cajero.numero;
      const data = await Cobranza(token, fechaIni, fechaFin, id);
      setDataCobranza(data);
      setisLoading(false);
    };
    fetchData();
  }, [session, status, cajero, fechaFin, fechaIni]);

  if (status === "loading") {
    return (
      <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  const home = () => {
    router.push("/");
  };
  const CerrarView = () => {
    setPdfPreview(false);
    setPdfData("");
  };
  const ImprimePDF = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Nombre de la Aplicación",
        Nombre_Reporte: `Reporte de Cobranza Rango de Fecha del ${fechaIni} al ${fechaFin}`,
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: dataCobranza,
    };
    Imprimir(configuracion, cajero.numero);
  };
  const ImprimeExcel = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: `Reporte de Cobranza Rango de Fecha del ${fechaIni} al ${fechaFin}`,
        Nombre_Usuario: `${session.user.name}`,
      },
      body1: dataCobranza.producto,
      body2: dataCobranza.tipo_pago,
      body3: dataCobranza.cajeros,
      columns1: [
        { header: "Producto", dataKey: "articulo" },
        { header: "Descripcion", dataKey: "descripcion" },
        { header: "Importe", dataKey: "precio_unitario" },
      ],
      columns2: [
        { header: "Tipo Cobro", dataKey: "tipo_pago" },
        { header: "Descripcion", dataKey: "descripcion" },
        { header: "Importe", dataKey: "importe" },
      ],
      columns3: [
        { header: "Cajero", dataKey: "cajero" },
        { header: "Descripcion", dataKey: "descripcion" },
        { header: "Importe", dataKey: "importe" },
      ],
      nombre: "Reporte de Cobranza",
    };
    // console.log("hohoho", configuracion);
    ImprimirExcel(configuracion, cajero.numero);
  };
  //   console.log(cajero);
  const handleVerClick = () => {
    if (cajero.numero === 0 || cajero.numero === undefined) {
      Swal.fire({
        title: "Opps",
        text: "Por favor selecciona un cajero antes de continuar.",
        icon: "error",
        confirmButtonText: "Ok",
      });
      return;
    }
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Nombre de la Aplicación",
        Nombre_Reporte: `Reporte de Cobranza Rango de Fecha del ${fechaIni} al ${fechaFin}`,
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: dataCobranza,
    };
    const reporte = new ReportePDF(configuracion);
    const Enca1 = (doc) => {
      if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalV();
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
    //Productos
    const Tw_Pago = Array.from({ length: 100 }, () => Array(2).fill(0));
    if (cajero.numero === 0 || cajero.numero === undefined) {
      if (configuracion.body.producto.length > 0) {
        reporte.ImpPosX("Producto", 14, reporte.tw_ren, 0, "L");
        reporte.ImpPosX("Descripcion", 34, reporte.tw_ren, 0, "L");
        reporte.ImpPosX("Importe", 154, reporte.tw_ren, 0, "L");
        reporte.nextRow(4);
        let atr_ant = 0;
        let tot_ant = 0;
        let atr_des_ant = "";
        let importe_cobro = 0;
        let total_productos = 0;
        configuracion.body.producto.forEach((producto) => {
          if (atr_ant !== producto.articulo && atr_ant !== 0) {
            reporte.ImpPosX(atr_ant.toString(), 27, reporte.tw_ren, 0, "R");
            reporte.ImpPosX(atr_des_ant.toString(), 34, reporte.tw_ren, 0, "L");
            reporte.ImpPosX(formatNumber(tot_ant), 166, reporte.tw_ren, 0, "R");
            total_productos = total_productos + tot_ant;
            Enca1(reporte);
            if (reporte.tw_ren >= reporte.tw_endRen) {
              reporte.pageBreak();
              Enca1(reporte);
            }
          }
          importe_cobro = roundNumber(
            producto.precio_unitario -
              producto.precio_unitario * (producto.descuento / 100),
            2
          );
          importe_cobro = importe_cobro * producto.cantidad;
          tot_ant = tot_ant + importe_cobro;
          atr_ant = producto.articulo;
          atr_des_ant = producto.descripcion;
        });
        total_productos = total_productos + tot_ant;
        reporte.ImpPosX(atr_ant.toString(), 27, reporte.tw_ren, 0, "R");
        reporte.ImpPosX(atr_des_ant.toString(), 34, reporte.tw_ren, 0, "L");
        reporte.ImpPosX(formatNumber(tot_ant), 166, reporte.tw_ren, 0, "R");
        reporte.nextRow(5);
        reporte.ImpPosX("Total Productos", 34, reporte.tw_ren, 0, "L");
        reporte.ImpPosX(
          formatNumber(total_productos),
          166,
          reporte.tw_ren,
          0,
          "R"
        );
        reporte.nextRow(15);
      } else {
        reporte.ImpPosX("Producto", 14, reporte.tw_ren, 0, "L");
        reporte.ImpPosX("Descripcion", 34, reporte.tw_ren, 0, "L");
        reporte.ImpPosX("Importe", 154, reporte.tw_ren, 0, "L");
        reporte.nextRow(5);
        let total_productos = 0;
        reporte.ImpPosX("Total Productos", 34, reporte.tw_ren, 0, "L");
        reporte.ImpPosX(
          formatNumber(total_productos),
          166,
          reporte.tw_ren,
          0,
          "R"
        );
        reporte.nextRow(15);
      }
    }
    //tipo Cobro
    for (let Tw_count = 0; Tw_count < 20; Tw_count++) {
      Tw_Pago[Tw_count][0] = 0;
      Tw_Pago[Tw_count][1] = 0;
      Tw_Pago[Tw_count][2] = "";
    }
    if (configuracion.body.tipo_pago.length > 0) {
      reporte.ImpPosX("Tipo Pago", 14, reporte.tw_ren, 0, "L");
      reporte.ImpPosX("Descripcion", 34, reporte.tw_ren, 0, "L");
      reporte.ImpPosX("Importe", 154, reporte.tw_ren, 0, "L");
      reporte.nextRow(4);
      configuracion.body.tipo_pago.forEach((tipoPago) => {
        for (let Tw_count = 0; Tw_count < 20; Tw_count++) {
          if (tipoPago.tipo_pago_1 === 0) break;
          if (Tw_Pago[Tw_count][0] === tipoPago.tipo_pago_1) {
            Tw_Pago[Tw_count][1] =
              Number(Tw_Pago[Tw_count][1]) + Number(tipoPago.importe_pago_1);
            break;
          }
          if (Tw_Pago[Tw_count][0] === 0) {
            Tw_Pago[Tw_count][0] = tipoPago.tipo_pago_1;
            Tw_Pago[Tw_count][1] = tipoPago.importe_pago_1;
            Tw_Pago[Tw_count][2] = tipoPago.descripcion1;
            break;
          }
          //   console.log("tipo_pago_1", Tw_Pago[Tw_count][0]);
          //   console.log("importe_pago_1", Tw_Pago[Tw_count][1]);
        }
        for (let Tw_count = 0; Tw_count < 20; Tw_count++) {
          if (tipoPago.tipo_pago_2 === 0) break;
          if (Tw_Pago[Tw_count][0] === tipoPago.tipo_pago_2) {
            Tw_Pago[Tw_count][1] =
              Number(Tw_Pago[Tw_count][1]) + Number(tipoPago.importe_pago_2);
            break;
          }
          if (Tw_Pago[Tw_count][0] === 0) {
            Tw_Pago[Tw_count][0] = tipoPago.tipo_pago_2;
            Tw_Pago[Tw_count][1] = tipoPago.importe_pago_2;
            Tw_Pago[Tw_count][2] = tipoPago.descripcion2;
            break;
          }
          //   console.log("tipo_pago_2", Tw_Pago[Tw_count][0]);
          //   console.log("importe_pago_2", Tw_Pago[Tw_count][1]);
        }
      });
      let total_tipo_pago = 0;
      for (let Tw_count = 0; Tw_count < 20; Tw_count++) {
        if (Tw_Pago[Tw_count][0] === 0) break;
        reporte.ImpPosX(
          Tw_Pago[Tw_count][0].toString(),
          30,
          reporte.tw_ren,
          0,
          "R"
        );
        reporte.ImpPosX(
          Tw_Pago[Tw_count][2].toString(),
          34,
          reporte.tw_ren,
          0,
          "L"
        );
        reporte.ImpPosX(
          formatNumber(Tw_Pago[Tw_count][1]),
          166,
          reporte.tw_ren,
          0,
          "R"
        );
        total_tipo_pago = total_tipo_pago + Number(Tw_Pago[Tw_count][1]);
        Enca1(reporte);
        if (reporte.tw_ren >= reporte.tw_endRen) {
          reporte.pageBreak();
          Enca1(reporte);
        }
      }
      reporte.ImpPosX("Total Tipo Pago", 34, reporte.tw_ren, 0, "L");
      reporte.ImpPosX(
        formatNumber(total_tipo_pago),
        166,
        reporte.tw_ren,
        0,
        "R"
      );
      reporte.nextRow(15);
    } else {
      reporte.ImpPosX("Tipo Pago", 14, reporte.tw_ren, 0, "L");
      reporte.ImpPosX("Descripcion", 34, reporte.tw_ren, 0, "L");
      reporte.ImpPosX("Importe", 154, reporte.tw_ren, 0, "L");
      reporte.nextRow(5);
      let total_tipo_pago = 0;
      reporte.ImpPosX("Total Tipo Pago", 34, reporte.tw_ren, 0, "L");
      reporte.ImpPosX(
        formatNumber(total_tipo_pago),
        166,
        reporte.tw_ren,
        0,
        "R"
      );
      reporte.nextRow(15);
    }
    if (configuracion.body.cajeros.length > 0) {
      reporte.ImpPosX("Cajero", 14, reporte.tw_ren, 0, "L");
      reporte.ImpPosX("Descripcion", 34, reporte.tw_ren, 0, "L");
      reporte.ImpPosX("Importe", 154, reporte.tw_ren, 0, "L");
      reporte.nextRow(4);
      let cajero_ant = 0;
      let tot_cajero = 0;
      let cajero_desc_ant = "";
      let total_cajero = 0;
      configuracion.body.cajeros.forEach((cajero) => {
        if (cajero_ant !== cajero.cajero && cajero_ant !== 0) {
          reporte.ImpPosX(cajero_ant.toString(), 24, reporte.tw_ren, 0, "R");
          reporte.ImpPosX(
            cajero_desc_ant.toString(),
            34,
            reporte.tw_ren,
            0,
            "L"
          );
          reporte.ImpPosX(
            formatNumber(tot_cajero),
            166,
            reporte.tw_ren,
            0,
            "R"
          );
          total_cajero = total_cajero + tot_cajero;
          Enca1(reporte);
          if (reporte.tw_ren >= reporte.tw_endRen) {
            reporte.pageBreak();
            Enca1(reporte);
          }
        }
        tot_cajero = Number(tot_cajero) + Number(cajero.importe_cobro);
        cajero_ant = cajero.cajero;
        cajero_desc_ant = cajero.nombre;
      });
      total_cajero = total_cajero + tot_cajero;
      reporte.ImpPosX(cajero_ant.toString(), 24, reporte.tw_ren, 0, "R");
      reporte.ImpPosX(cajero_desc_ant.toString(), 34, reporte.tw_ren, 0, "L");
      reporte.ImpPosX(formatNumber(tot_cajero), 166, reporte.tw_ren, 0, "R");
      reporte.nextRow(5);
      reporte.ImpPosX("Total Cajeros", 34, reporte.tw_ren, 0, "L");
      reporte.ImpPosX(formatNumber(total_cajero), 166, reporte.tw_ren, 0, "R");
    } else {
      reporte.ImpPosX("Cajero", 14, reporte.tw_ren, 0, "L");
      reporte.ImpPosX("Descripcion", 34, reporte.tw_ren, 0, "L");
      reporte.ImpPosX("Importe", 154, reporte.tw_ren, 0, "L");
      reporte.nextRow(4);
      let total_cajero = 0;
      reporte.ImpPosX("Total Cajeros", 34, reporte.tw_ren, 0, "L");
      reporte.ImpPosX(formatNumber(total_cajero), 166, reporte.tw_ren, 0, "R");
    }
    const pdfData = reporte.doc.output("datauristring");
    setPdfData(pdfData);
    setPdfPreview(true);
    showModalVista(true);
  };
  const showModalVista = (show) => {
    show
      ? document.getElementById("modalVRep6").showModal()
      : document.getElementById("modalVRep6").close();
  };
  function roundNumber(value, decimals) {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  }
  return (
    <>
      <ModalVistaPreviaRep6
        pdfPreview={pdfPreview}
        pdfData={pdfData}
        PDF={ImprimePDF}
        Excel={ImprimeExcel}
      />

      <div className="flex flex-col justify-start items-start bg-slate-100 shadow-xl rounded-xl dark:bg-slate-700 h-full max-[420px]:w-full w-11/12">
        <div className="w-full py-3">
          {" "}
          {/* Fila de la cabecera de la pagina */}
          <div className="flex flex-col justify-start p-3 max-[600px]:p-0">
            <div className="flex flex-wrap items-start md:items-center mx-auto">
              <div className="order-2 md:order-1 flex justify-between w-full md:w-auto mb-0">
                <Acciones home={home} Ver={handleVerClick} />
              </div>
              <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 mx-5">
                Reporte Resumen de Cobranza
              </h1>
            </div>
          </div>
        </div>
        <div className="w-full py-3 ">
          {/* Fila del formulario de la pagina */}
          {/* <div className="max-[972px]:w-full w-1/2 mx-auto bg-white"> */}
          <div className=" max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4 w-1/2 mx-auto ">{/* max-[768px]:w-full */}
            <div className="w-full grid grid-cols-1 max-[500px]:grid-cols-2 max-[766px]:grid-cols-2 md:grid-cols-2 min-[500px]:gap-4 max-[499px]:gap-y-5 px-1">
              <div className="lg:w-fit md:w-fit">
                <label className="input input-bordered input-md text-black dark:text-white flex items-center gap-3 w-auto lg:w-fit md:w-full">
                  Fecha Ini.
                  <input
                    type="date"
                    value={fechaIni}
                    onChange={(e) => setFechaIni(e.target.value)}
                    className="rounded block grow text-black max-[500px]:w-[100px] w-auto dark:text-white border-b-2 border-slate-300 dark:border-slate-700 "
                  />
                </label>
              </div>
              <div className="lg:w-fit md:w-fit">
                <label className="input input-bordered input-md text-black dark:text-white flex items-center gap-3 w-auto lg:w-fit md:w-fit">
                  Fecha Fin
                  <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="rounded block grow text-black max-[500px]:w-[100px] w-auto dark:text-white border-b-2 border-slate-300 dark:border-slate-700 "
                  />
                </label>
              </div>
              <div className="col-span-full md:col-span-full lg:col-span-full">
                <div className="w-full">
                  <BuscarCat
                    table={"cajeros"}
                    titulo={"Cajeros: "}
                    token={session.user.token}
                    fieldsToShow={["numero", "nombre"]}
                    nameInput={["numero", "nombre"]}
                    setItem={setCajero}
                    modalId={"modal_Cajeros"}
                    alignRight={true}
                    descClassName="md:mt-0 w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* <div className="w-full grid grid-cols-1 max-[500px]:grid-cols-2 max-[766px]:grid-cols-2 md:grid-cols-3 gap-4 px-1">
            <div>
              <label className="input input-bordered input-md text-black dark:text-white flex items-center gap-3 w-auto lg:w-fit md:w-fit">
                Fecha Ini.
                <input
                  type="date"
                  value={fechaIni}
                  onChange={(e) => setFechaIni(e.target.value)}
                  className="rounded block grow text-black max-[500px]:w-auto w-auto dark:text-white border-b-2 border-slate-300 dark:border-slate-700 "
                />
              </label>
            </div>
            <div>
              <label className="input input-bordered input-md text-black dark:text-white flex items-center gap-3 w-auto lg:w-fit md:w-fit">
                Fecha Fin
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="rounded block grow text-black max-[500px]:w-auto w-auto dark:text-white border-b-2 border-slate-300 dark:border-slate-700 "
                />
              </label>
            </div>
            <div className="max-[500px]:col-span-full">
              <div className="w-full">
                <BuscarCat
                  table={"cajeros"}
                  titulo={"Cajeros: "}
                  token={session.user.token}
                  fieldsToShow={["numero", "nombre"]}
                  nameInput={["numero", "nombre"]}
                  setItem={setCajero}
                  modalId={"modal_Cajeros"}
                  alignRight={true}
                />
              </div>
            </div>
          </div> */}

          {/* <div class="w-full grid grid-cols-1 max-[500px]:grid-cols-2 max-[766px]:grid-cols-2 md:grid-cols-3 gap-4 px-1">
            <div>
              <label className="input input-bordered input-md text-black dark:text-white flex items-center gap-3 w-auto">
                Fecha Ini.
                <input
                  type="date"
                  value={fechaIni}
                  onChange={(e) => setFechaIni(e.target.value)}
                  className="rounded block grow text-black max-[500px]:w-3/4 w-full dark:text-white border-b-2 border-slate-300 dark:border-slate-700 w-auto"
                />
              </label>
            </div>
            <div>
              <label className={`input input-bordered input-md text-black dark:text-white flex items-center gap-3 w-auto`}>
                Fecha Fin
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="rounded block grow text-black max-[500px]:w-3/4 w-full dark:text-white border-b-2 border-slate-300 dark:border-slate-700 w-auto"
                />
              </label>
            </div>
            <div className="max-[500px]:col-span-full">
              <div className="w-full">
                <BuscarCat
                  table={"cajeros"}
                  titulo={"Cajeros: "}
                  token={session.user.token}
                  fieldsToShow={["numero", "nombre"]}
                  nameInput={["numero", "nombre"]}
                  setItem={setCajero}
                  modalId={"modal_Cajeros"}
                  alignRight={true}
                />
              </div>
            </div>
          </div> */}
        </div>
      </div>

      {/* <div className="flex justify-center items-center h-[80vh] w-full max-[600px]:px-0 max-[600px]:mx-0">
        <div className="container h-full w-full max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y-hidden max-[600px]:px-0 max-[600px]:mx-0">
          <div className="flex flex-col justify-start p-3 max-[600px]:px-0 max-[600px]:mx-0">
            <div className="flex flex-wrap md:flex-nowrap items-start md:items-center md:mx-auto lg:mx-auto">
              <div className="order-2 md:order-1 flex justify-around w-full md:w-auto md:justify-start mb-0 md:mb-0">
                <Acciones home={home} Ver={handleVerClick} />
              </div>

              <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
                Reporte Resumen de Cobranza
              </h1>
            </div>
          </div>
          <div className="flex flex-col justify-center p-3 max-[600px]:px-0 max-[600px]:mx-0">
            <div className="flex flex-col min-[500px]:w-full max-[600px]:w-full max-[420px]:w-full max-[768px]:flex-nowrap items-center md:items-center w-4/5 md:mx-auto lg:mx-auto">
              <div className="flex flex-row w-full ">
                <div className="flex flex-wrap max-[600px]:px-0 max-[600px]:mx-0 min-[500px]:w-full max-[600px]:w-full  md:-mx-3 md:mb-6 lg:-mx-3 lg:mb-6 px-3 md:gap-x-5 lg:gap-x-5 gap-y-5 w-full">
                  <div className="flex flex-col max-[600px]:pl-0 max-[600px]:ml-0 min-[500px]:w-6/12 max-[600px]:w-6/12 max-[420px]:w-full  md:w-3/12 lg:w-3/12">
                    <div className=" w-full">
                      <label className="input input-bordered input-md text-black dark:text-white flex items-center gap-3">
                        Fecha Ini.
                        <input
                          type="date"
                          value={fechaIni}
                          onChange={(e) => setFechaIni(e.target.value)}
                          className="rounded block grow text-black dark:text-white border-b-2 border-slate-300 dark:border-slate-700"
                        />
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col max-[600px]:pl-0 max-[600px]:ml-0 min-[500px]:w-6/12 max-[600px]:w-6/12 max-[420px]:w-full md:w-3/12 lg:w-3/12 ">
                    <div className="w-full">
                      <label
                        className={`max-[600px]:pl-0 max-[600px]:ml-0 input input-bordered input-md text-black dark:text-white flex items-center gap-3`}
                      >
                        Fecha Fin
                        <input
                          type="date"
                          value={fechaFin}
                          onChange={(e) => setFechaFin(e.target.value)}
                          className="rounded block grow text-black dark:text-white border-b-2 border-slate-300 dark:border-slate-700"
                        />
                      </label>
                    </div>
                  </div>
                
                  <div className="flex flex-col sm:w-11/12 md:w-4/12 lg:w-5/12 ">
                    <div className="w-full">
                      <BuscarCat
                        table={"cajeros"}
                        titulo={"Cajeros: "}
                        token={session.user.token}
                        fieldsToShow={["numero", "nombre"]}
                        nameInput={["numero", "nombre"]}
                        setItem={setCajero}
                        modalId={"modal_Cajeros"}
                        alignRight={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}

      {/* <div className="flex flex-col md:grid md:grid-cols-8 md:grid-rows-1 h-full">
          <div className="col-span-7">
            <div className="flex flex-col h-[calc(100%)]">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-11/12 md:w-4/12 lg:w-3/12">
                  <label className="input input-bordered input-md text-black dark:text-white flex items-center gap-3">
                    Fecha Inicial
                    <input
                      type="date"
                      value={fechaIni}
                      onChange={(e) => setFechaIni(e.target.value)}
                      className="rounded block grow text-black dark:text-white border-b-2 border-slate-300 dark:border-slate-700"
                    />
                  </label>
                </div>
                <div className="w-11/12 md:w-4/12 lg:w-3/12">
                  <label
                    className={`input input-bordered input-md text-black dark:text-white flex items-center gap-3`}
                  >
                    Fecha Final
                    <input
                      type="date"
                      value={fechaFin}
                      onChange={(e) => setFechaFin(e.target.value)}
                      className="rounded block grow text-black dark:text-white border-b-2 border-slate-300 dark:border-slate-700"
                    />
                  </label>
                </div>
              </div>
              <div className="mt-4">
                <BuscarCat
                  table={"cajeros"}
                  titulo={"Cajeros: "}
                  token={session.user.token}
                  fieldsToShow={["numero", "nombre"]}
                  nameInput={["numero", "nombre"]}
                  setItem={setCajero}
                  modalId={"modal_Cajeros"}
                  alignRight={true}
                />
              </div>
            </div>
          </div>
        </div> */}
      {/* </div> */}
      {/* </div>
      </div> */}
    </>
  );
}

export default Rep_Femac_6;
