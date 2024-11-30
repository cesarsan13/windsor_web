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
import { formatDate, formatNumber, permissionsComponents } from "../utils/globalfn";
import { ReportePDF } from "../utils/ReportesPDF";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import VistaPrevia from "../components/VistaPrevia";
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
  const [animateLoading, setAnimateLoading] = useState(false);
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const [permissions, setPermissions] = useState({});

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
      const { token, permissions } = session.user;
      const es_admin = session.user.es_admin;
      const id = cajero.numero;
      const data = await Cobranza(token, fechaIni, fechaFin, id);
      setDataCobranza(data);
      setisLoading(false);
      const permisos = permissionsComponents(es_admin, permissions, session.user.id, 1);
      setPermissions(permisos);
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
      nombre: "Reporte de Cobranza_",
    };
    // console.log("hohoho", configuracion);
    ImprimirExcel(configuracion, cajero.numero);
  };
  //   console.log(cajero);
  const handleVerClick = () => {
    setAnimateLoading(true);
    cerrarModalVista();
    if (cajero.numero === 0 || cajero.numero === undefined) {
      Swal.fire({
        title: "Opps",
        text: "Por favor selecciona un cajero antes de continuar.",
        icon: "error",
        confirmButtonText: "Ok",
      });
      setTimeout(() => {
        setPdfPreview(false);
        setPdfData("");
        setAnimateLoading(false);
        document.getElementById("modalVRep6").close();
      }, 500);
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
      ? document.getElementById("modalVRep6").showModal()
      : document.getElementById("modalVRep6").close();
  };
  const CerrarView = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalVRep6").close();
  };
  const cerrarModalVista = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalVRep6").close();
  };
  function roundNumber(value, decimals) {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  }
  return (
    <>
      <VistaPrevia
        id={"modalVRep6"}
        titulo={"Vista Previa de Resumen de Cobranza"}
        pdfPreview={pdfPreview}
        pdfData={pdfData}
        PDF={ImprimePDF}
        Excel={ImprimeExcel}
        CerrarView={CerrarView}
      />

      <div className="flex flex-col justify-start items-start bg-base-200 shadow-xl rounded-xl dark:bg-slate-700 h-full max-[420px]:w-full w-11/12">
        <div className="w-full py-3">
          {/* Fila de la cabecera de la pagina */}
          <div className="flex flex-col justify-start p-3 max-[600px]:p-0">
            <div className="flex flex-wrap items-start md:items-center mx-auto">
              <div className="order-2 md:order-1 flex justify-between w-full md:w-auto mb-0">
                <Acciones home={home} Ver={handleVerClick} isLoading={animateLoading} permiso_imprime={permissions.impresion}/>
              </div>
              <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 mx-5">
                Reporte Resumen de Cobranza
              </h1>
            </div>
          </div>
        </div>
        <div className="w-full py-3 flex flex-col gap-y-4">
          {/* Fila del formulario de la pagina */}
          <div className=" max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4 min-[1920px]:w-1/4 w-1/2 mx-auto ">
            <div className="flex flex-row max-[499px]:gap-1 gap-4">
              <div className="lg:w-fit md:w-fit">
                <label className="input input-bordered input-md text-black dark:text-white flex items-center max-[430px]:gap-1 gap-3 w-auto lg:w-fit md:w-full">
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
                <label className="input input-bordered input-md text-black dark:text-white flex items-center max-[430px]:gap-1 gap-3 w-auto lg:w-fit md:w-fit">
                  Fecha Fin
                  <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="rounded block grow text-black max-[500px]:w-[100px] w-auto dark:text-white border-b-2 border-slate-300 dark:border-slate-700 "
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="flex flex-row">
            <div className=" max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4 min-[1920px]:w-1/4 w-1/2 mx-auto ">
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
        </div>
      </div>
    </>
  );
}

export default Rep_Femac_6;
