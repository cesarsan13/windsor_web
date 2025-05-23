"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Acciones from "@/app/Rep_Femac_9_Anexo_4/components/Acciones";
import Inputs from "@/app/Rep_Femac_9_Anexo_4/components/Inputs";
import { useForm } from "react-hook-form";
import {
  getRelaciondeFacturas,
  ImprimirPDF,
  ImprimirExcel,
} from "@/app/utils/api/rep_femac_9_anexo_4/rep_femac_9_anexo_4";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import "jspdf-autotable";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import { format_Fecha_String, formatNumber } from "@/app/utils/globalfn";
import VistaPrevia from "@/app/components/VistaPrevia";
import { permissionsComponents } from "@/app/utils/globalfn";
import ModalFechas from "@/app/components/modalFechas";
import { ReporteExcel } from "@/app/utils/ReportesExcel";

function RelaciondeFacturas() {
  const router = useRouter();
  const { data: session, status } = useSession();
  let [factura_ini, setFacturaIni] = useState("");
  let [factura_fin, setFacturaFin] = useState("");
  const [tomaFechas, setTomaFechas] = useState(true);
  const [tomaCanceladas, setTomaCanceladas] = useState(false);
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const [FormaRepRelaciondeFacturas, setFormaRelaciondeFacturas] = useState([]);
  const [animateLoading, setAnimateLoading] = useState(false);
  const [permissions, setPermissions] = useState({});
  const [excelPreviewData, setExcelPreviewData] = useState([]);
  //Modal Fechas
  let [fecha_cobro_ini, setFecha_cobro_ini] = useState("");
  let [fecha_cobro_fin, setFecha_cobro_fin] = useState("");
  const [tempFechaIni, setTempFechaIni] = useState("");
  const [tempFechaFin, setTempFechaFin] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

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
    setFecha_cobro_ini(getPrimerDiaDelMes());
    setFecha_cobro_fin(getUltimoDiaDelMes());
  }, []);

  useEffect(() => {
    if (status === "loading" || !session) {
      return;
    }
    const fetchData = async () => {
      let { permissions } = session.user;
      const menuSeleccionado = Number(localStorage.getItem("puntoMenu"));
      const es_admin = session.user.es_admin;
      const permisos = permissionsComponents(
        es_admin,
        permissions,
        session.user.id,
        menuSeleccionado
      );
      setPermissions(permisos);
    };
    fetchData();
  }, [session, status]);

  const reportData = async () => {
    const { token } = session.user;
    const data = await getRelaciondeFacturas(
      token,
      tomaFechas,
      tomaCanceladas,
      format_Fecha_String(fecha_cobro_ini),
      format_Fecha_String(fecha_cobro_fin),
      factura_ini,
      factura_fin
    );
    setFormaRelaciondeFacturas(data);
    return data;
  };

  const {
    formState: { errors },
  } = useForm({});

  const home = () => {
    router.push("/");
  };

  const handleVerClick = async () => {
    setAnimateLoading(true);
    cerrarModalVista();
    const dataFact = await reportData();
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de relación de facturas",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: dataFact,
    };

    const reporte = new ReportePDF(configuracion);
    const { body } = configuracion;
    const Enca1 = (doc) => {
      if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalV();
        doc.nextRow(8);
        if (tomaFechas === true) {
          if (fecha_cobro_fin == "") {
            doc.ImpPosX(
              `Reporte de Factura del ${fecha_cobro_ini} `,
              15,
              doc.tw_ren,
              0,
              "L"
            ),
              doc.nextRow(5);
          } else {
            doc.ImpPosX(
              `Reporte de Facturas del ${fecha_cobro_ini} al ${fecha_cobro_fin}`,
              15,
              doc.tw_ren,
              0,
              "L"
            ),
              doc.nextRow(5);
          }
        }

        if (tomaCanceladas === true) {
          doc.ImpPosX("Facturas Canceladas", 15, doc.tw_ren, 0, "L"),
            doc.nextRow(5);
        }

        doc.ImpPosX("Factura", 15, doc.tw_ren, 0, "L"),
        doc.ImpPosX("Recibo", 30, doc.tw_ren, 0, "L"),
        doc.ImpPosX("Fecha P", 45, doc.tw_ren, 0, "L"),
        doc.ImpPosX("Nombre", 68, doc.tw_ren, 0, "L"),
        doc.ImpPosX("Subtotal", 145, doc.tw_ren, 0, "L"),
        doc.ImpPosX("I.V.A", 167, doc.tw_ren, 0, "L"),
        doc.ImpPosX("Total", 180, doc.tw_ren, 0, "L"),
        doc.nextRow(4);
        doc.printLineV();
        doc.nextRow(4);
        doc.tiene_encabezado = true;
      } else {
        doc.nextRow(6);
        doc.tiene_encabezado = true;
      }
    };

    let total_general = 0;
    const alignsIndex = [0];
      const tablaExcel = [
        ["Factura", "Recibo", "Fecha P", "Nombre", "Subtotal", "I.V.A", "Total"],
        
    ];


    Enca1(reporte);
    body.forEach((imp) => {
      const noFac = imp.numero_factura;
      const recibo = imp.recibo;
      const fecha = imp.fecha;
      const razon_social = imp.razon_social;
      const ivaimp = imp.iva;
      const iva = imp.iva;
      const cantidad = imp.cantidad;
      const precio_unitario = imp.precio_unitario;
      const descuento = imp.descuento;

      let total_importe = 0;
      let sub_total = 0;
      const r_s_nombre = "FACTURA GLOBAL DEL DIA";
      let razon_social_cambio = "";

      /*Para hacer las operaciones*/
      total_importe = cantidad * precio_unitario;
      total_importe = total_importe - total_importe * (descuento / 100);

      if (iva > 0) {
        sub_total = total_importe * (iva / 100);
        sub_total += total_importe;
      } else if (iva < 0 || iva === 0) {
        sub_total = total_importe;
      }

      if (
        razon_social === "" ||
        razon_social === " " ||
        razon_social === null
      ) {
        razon_social_cambio = r_s_nombre;
      } else {
        razon_social_cambio = razon_social;
      }
      if(razon_social === "null"){
        razon_social_cambio = "Cancelado";
      }
      reporte.ImpPosX(noFac.toString(), 25, reporte.tw_ren, 0, "R");
      reporte.ImpPosX(recibo.toString(), 40, reporte.tw_ren, 0, "R");
      reporte.ImpPosX(fecha, 45, reporte.tw_ren, 0, "L");
      reporte.ImpPosX(razon_social_cambio, 68, reporte.tw_ren, 0, "L");
      reporte.ImpPosX(formatNumber(total_importe), 157, reporte.tw_ren, 0, "R");
      reporte.ImpPosX(`${ivaimp} %`.toString(), 175, reporte.tw_ren, 0, "R");
      reporte.ImpPosX(formatNumber(sub_total), 198, reporte.tw_ren, 0, "R");

      tablaExcel.push([
        noFac.toString(),
        recibo.toString(),
        fecha,
        razon_social_cambio,
        formatNumber(total_importe),
        `${ivaimp} %`.toString(),
        formatNumber(sub_total),
      ]);



      Enca1(reporte);
      if (reporte.tw_ren >= reporte.tw_endRen) {
        reporte.pageBreak();
        Enca1(reporte);
      }
      total_general = total_general + sub_total;
    });
    reporte.nextRow(4);
    reporte.ImpPosX(
      `TOTAL IMPORTE: ${formatNumber(total_general)}` || "",
      198,
      reporte.tw_ren,
      0,
      "R"
    );
    tablaExcel.push([
      "",
      "",
      "",
      "",
      "",
      "TOTAL IMPORTE:",
      formatNumber(total_general) || "",
    ]);

    setTimeout( async () => {
      const newExcel = new ReporteExcel(configuracion);
      const pdfData = reporte.doc.output("datauristring");
      const previewExcel = await newExcel.previewExcel(tablaExcel, alignsIndex);
      setPdfData(pdfData);
      setPdfPreview(true);
      setExcelPreviewData(previewExcel);
      showModalVista(true);
      setAnimateLoading(false);
    }, 500);
  };

  //hasta aqui

  const showModalVista = (show) => {
    show
      ? document.getElementById("modalVPRepFemac9Anexo4").showModal()
      : document.getElementById("modalVPRepFemac9Anexo4").close();
  };

  const cerrarModalVista = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalVPRepFemac9Anexo4").close();
  };
  const CerrarView = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalVPRepFemac9Anexo4").close();
  };
  const ImprimePDF = async () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de relación de facturas",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: FormaRepRelaciondeFacturas,
    };
    ImprimirPDF(
      configuracion,
      fecha_cobro_ini,
      fecha_cobro_fin,
      tomaFechas,
      tomaCanceladas
    );
  };

  const ImprimeExcel = async () => {
    let detallefecha = "";
    let detallecanceladas = "";
    if (tomaFechas === true) {
      if (fecha_cobro_fin == "") {
        detallefecha = `Reporte de Factura del ${fecha_cobro_ini} `;
      } else {
        detallefecha = `Reporte de Facturas del ${fecha_cobro_ini} al ${fecha_cobro_fin}`;
      }
    }

    if (tomaCanceladas === true) {
      detallecanceladas = "Facturas Canceladas";
    }

    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de relación de facturas",
        Nombre_Usuario: `${session.user.name}`,
        Clase: detallefecha,
        Profesor: detallecanceladas,
        FechaE: "",
      },
      body: FormaRepRelaciondeFacturas,
      columns: [
        { header: "Factura", dataKey: "facturaI" },
        { header: "Recibo", dataKey: "reciboI" },
        { header: "Fecha P", dataKey: "fechapI" },
        { header: "Nombre", dataKey: "nombreI" },
        { header: "Subtotal", dataKey: "subtotalI" },
        { header: "I.V.A", dataKey: "ivaI" },
        { header: "Total", dataKey: "totalI" },
      ],
      nombre: "Reporte de relación de facturas",
    };
    ImprimirExcel(configuracion);
  };

  const handleCloseModal = () => setModalOpen(false);
  const handleSelectDates = () => {
    setFecha_cobro_ini(tempFechaIni);
    setFecha_cobro_fin(tempFechaFin);
    setModalOpen(false);
  };
  const handleOpenModal = () => {
    setTempFechaIni(fecha_cobro_ini);
    setTempFechaFin(fecha_cobro_fin);
    setModalOpen(true);
  };

  if (status === "loading") {
    return (
      <div className="container skeleton w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  return (
    <>
      <VistaPrevia
        id={"modalVPRepFemac9Anexo4"}
        titulo={"Vista Previa Relacion de Facturas"}
        pdfPreview={pdfPreview}
        pdfData={pdfData}
        excelPreviewData={excelPreviewData}
        PDF={ImprimePDF}
        Excel={ImprimeExcel}
        CerrarView={CerrarView}
        seeExcel={true}
        seePDF={true}
      />

      <div className="flex flex-col justify-start items-start bg-base-200 shadow-xl rounded-xl dark:bg-slate-700 h-full max-[420px]:w-full w-11/12">
        <div className="w-full py-3">
          {/* Fila de la cabecera de la pagina */}
          <div className="flex flex-col justify-start p-3 max-[600px]:p-0">
            <div className="flex flex-wrap items-start md:items-center mx-auto">
              <div className="order-2 md:order-1 flex justify-between w-full md:w-auto mb-0">
                <Acciones
                  home={home}
                  Ver={handleVerClick}
                  isLoading={animateLoading}
                  permiso_imprime={permissions.impresion}
                />
              </div>
              <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 mx-5">
                Relación de Facturas
              </h1>
            </div>
          </div>
        </div>
        <div className="w-full py-3 flex flex-col gap-y-4">
          {/* Fila del formulario de la pagina */}
          <div className=" max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4 min-[1300px]:w-1/3 min-[1920px]:w-1/4 w-1/2 mx-auto space-y-4">
            <div className="flex flex-row gap-4">
              <div className="lg:w-fit md:w-fit">
                <input
                  type="date"
                  value={fecha_cobro_ini}
                  onChange={(e) => setFecha_cobro_ini(e.target.value)}
                  className="border p-2 rounded"
                />
              </div>
              <button
                onClick={handleOpenModal}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                📅
              </button>
              <div className="lg:w-fit md:w-fit">
                <input
                  type="date"
                  value={fecha_cobro_fin}
                  onChange={(e) => setFecha_cobro_fin(e.target.value)}
                  className="border p-2 rounded"
                />
              </div>

              {modalOpen && (
                <ModalFechas
                  tempFechaIni={tempFechaIni}
                  setTempFechaIni={setTempFechaIni}
                  tempFechaFin={tempFechaFin}
                  setTempFechaFin={setTempFechaFin}
                  handleSelectDates={handleSelectDates}
                  handleCloseModal={handleCloseModal}
                />
              )}
            </div>

            <div className="flex flex-row max-[499px]:gap-1 gap-4">
              <div className="lg:w-fit md:w-fit">
                <Inputs
                  name={"factura_ini"}
                  tamañolabel={""}
                  className={"rounded grow w-full md:w-1/2"}
                  Titulo={"Facturas: "}
                  type={"text"}
                  errors={errors}
                  maxLength={15}
                  dataType={"int"}
                  isDisabled={false}
                  setValue={setFacturaIni}
                />
              </div>
              <div className="lg:w-fit md:w-fit">
                <Inputs
                  name={"factura_fin"}
                  tamañolabel={""}
                  className={"rounded grow w-full md:w-1/2"}
                  Titulo={""}
                  type={"text"}
                  errors={errors}
                  maxLength={15}
                  dataType={"int"}
                  isDisabled={false}
                  setValue={setFacturaFin}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-row">
            <div className=" max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4 min-[1300px]:w-1/3 min-[1920px]:w-1/4 w-1/2 mx-auto ">
              <div className="flex flex-row max-[499px]:gap-1 gap-4">
                {!modalOpen && (
                  <>
                    <div className="lg:w-fit md:w-fit">
                      <div className="tooltip " data-tip="Tomar Fechas">
                        <label
                          htmlFor="ch_tomaFechas"
                          className="label cursor-pointer flex justify-start space-x-2"
                        >
                          <input
                            id="ch_tomaFechas"
                            type="checkbox"
                            className="checkbox checkbox-md"
                            defaultChecked={true}
                            onClick={(evt) => setTomaFechas(evt.target.checked)}
                          />
                          <span className="fa-regular fa-calendar block sm:hidden md:hidden lg:hidden xl:hidden  text-neutral-600 dark:text-neutral-200"></span>
                          <span className="label-text font-bold md:block hidden text-neutral-600 dark:text-neutral-200">
                            Toma Fechas
                          </span>
                        </label>
                      </div>
                    </div>
                    <div className="lg:w-fit md:w-fit">
                      <div
                        className="tooltip"
                        data-tip="Tomar Facturas Canceladas"
                      >
                        <label
                          htmlFor="ch_tomaCanceladas"
                          className="label cursor-pointer flex justify-start space-x-2"
                        >
                          <input
                            id="ch_tomaCanceladas"
                            type="checkbox"
                            className="checkbox checkbox-md"
                            defaultChecked={false}
                            onClick={(evt) =>
                              setTomaCanceladas(evt.target.checked)
                            }
                          />
                          <span className="fa-regular fa-file-lines block sm:hidden md:hidden lg:hidden xl:hidden text-neutral-600 dark:text-neutral-200"></span>
                          <span className="label-text font-bold hidden sm:block text-neutral-600 dark:text-neutral-200">
                            Toma Facturas Canceladas
                          </span>
                        </label>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RelaciondeFacturas;
