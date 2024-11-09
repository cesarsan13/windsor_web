import { ReporteExcel } from "@/app/utils/ReportesExcel";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import { calculaDigitoBvba, formatNumber } from "@/app/utils/globalfn";
import { formatDate, formatTime, formatFecha, format_Fecha_String } from "../../globalfn";


export const getRelaciondeRecibos = async (
  token,
  tomaFecha,
  fecha_ini,
  fecha_fin,
  factura_ini,
  factura_fin,
  recibo_ini,
  recibo_fin,
  alumno_ini,
  alumno_fin
) => {
  let url = `${process.env.DOMAIN_API}api/reportes/rep_femac_8_anexo_1`;
  const res = await fetch(url, {
    method: "post",
    body: JSON.stringify({
      tomaFecha: tomaFecha,
      fecha_ini: fecha_ini,
      fecha_fin: fecha_fin,
      factura_ini: factura_ini,
      factura_fin: factura_fin,
      recibo_ini: recibo_ini,
      recibo_fin: recibo_fin,
      alumno_ini: alumno_ini,
      alumno_fin: alumno_fin,
    }),
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
  const resJson = await res.json();
  return resJson.data;
};

const Enca1 = (doc) => {
  if (!doc.tiene_encabezado) {
    doc.imprimeEncabezadoPrincipalV();
    doc.nextRow(12);
    doc.ImpPosX("Recibo", 15, doc.tw_ren, 0, "L");
    doc.ImpPosX("Factura", 30, doc.tw_ren, 0, "L");
    doc.ImpPosX("Fecha P", 45, doc.tw_ren, 0, "L");
    doc.ImpPosX("No.", 65, doc.tw_ren, 0, "L");
    doc.ImpPosX("Nombre Alumno", 75, doc.tw_ren, 0, "L");
    doc.ImpPosX("Total Rec.", 170, doc.tw_ren, 0, "L");
    doc.nextRow(4);
    doc.printLineV();
    doc.nextRow(4);
    doc.tiene_encabezado = true;
  } else {
    doc.nextRow(6);
    doc.tiene_encabezado = true;
  }
};

export const verImprimir = async (configuracion) => {
  const newPDF = new ReportePDF(configuracion, "Portrait");
  const { body } = configuracion;
  Enca1(newPDF);
  let total = 0;
  body.forEach((rec) => {
    const recibo = (rec.recibo || "").toString();
    const factura = (rec.numero_factura || "").toString();
    const fecha = (rec.fecha || "").toString();
    const idAl = (rec.alumno || "").toString();
    const nombre = `${rec.nombre_alumno || ""}`;
    let importe_total = parseFloat(rec.importe_total) || 0;
    if (importe_total !== 0) {
      total += importe_total;
    }
    newPDF.ImpPosX(recibo, 24, newPDF.tw_ren, 0, "R");
    newPDF.ImpPosX(factura, 39, newPDF.tw_ren, 0, "R");
    newPDF.ImpPosX(fecha, 43, newPDF.tw_ren, 0, "L");
    newPDF.ImpPosX(idAl, 71, newPDF.tw_ren, 0, "R");
    newPDF.ImpPosX(nombre, 75, newPDF.tw_ren, 0, "L");
    if (importe_total === 0) {
      newPDF.ImpPosX(`CANCELADO`, 170, newPDF.tw_ren, 0, "L");
    } else {
      newPDF.ImpPosX(formatNumber(importe_total), 192, newPDF.tw_ren, 0, "R");
    }
    Enca1(newPDF);
    if (newPDF.tw_ren >= newPDF.tw_endRen) {
      newPDF.pageBreak();
      Enca1(newPDF);
    }
  });

  newPDF.ImpPosX(
    `Total: ${total.toFixed(2)}` || "",
    160,
    newPDF.tw_ren,
    0,
    "L"
  );
  const pdfData = newPDF.doc.output("datauristring");
  return pdfData;
};

export const Imprimir = (configuracion) => {
  const newPDF = new ReportePDF(configuracion, "Portrait");
  const { body } = configuracion;
  Enca1(newPDF);
  let total = 0;
  body.forEach((rec) => {
    const recibo = (rec.recibo || "").toString();
    const factura = (rec.numero_factura || "").toString();
    const fecha = (rec.fecha || "").toString();
    const idAl = (rec.alumno || "").toString();
    const nombre = `${rec.nombre_alumno || ""}`;
    let importe_total = parseFloat(rec.importe_total) || 0;
    if (importe_total !== 0) {
      total += importe_total;
    }
    newPDF.ImpPosX(recibo, 24, newPDF.tw_ren, 0, "R");
    newPDF.ImpPosX(factura, 39, newPDF.tw_ren, 0, "R");
    newPDF.ImpPosX(fecha, 43, newPDF.tw_ren, 0, "L");
    newPDF.ImpPosX(idAl, 71, newPDF.tw_ren, 0, "R");
    newPDF.ImpPosX(nombre, 75, newPDF.tw_ren, 0, "L");
    if (importe_total === 0) {
      newPDF.ImpPosX(`CANCELADO`, 170, newPDF.tw_ren, 0, "L");
    } else {
      newPDF.ImpPosX(formatNumber(importe_total), 192, newPDF.tw_ren, 0, "R");
    }
    Enca1(newPDF);
    if (newPDF.tw_ren >= newPDF.tw_endRen) {
      newPDF.pageBreak();
      Enca1(newPDF);
    }
  });
  newPDF.ImpPosX(
    `Total: ${total.toFixed(2)}` || "",
    160,
    newPDF.tw_ren,
    0,
    "R"
  );
  const date = new Date();
  const todayDate = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  const dateStr = format_Fecha_String(todayDate).replace(/\//g, "");
  const timeStr = formatTime(date).replace(/:/g, "");

newPDF.guardaReporte(`Altas_Bajas_Alumnos_${dateStr}${timeStr}`);
};

export const ImprimirExcel = (configuracion) => {
  const newExcel = new ReporteExcel(configuracion);
  const { columns, body, nombre } = configuracion;
  const newBody = [];
  let total = 0;
  body.forEach((rec) => {
    let importe_total = parseFloat(rec.importe_total) || 0;
    if (importe_total !== 0) {
      total += importe_total;
    }
    if (importe_total === 0) {
      newBody.push({
        recibo: rec.recibo,
        factura: rec.numero_factura,
        fecha: rec.fecha,
        alumno: rec.alumno,
        nombre_alumno: rec.nombre_alumno,
        importe_total: "CANCELADO",
      });
    } else {
      newBody.push({
        recibo: rec.recibo,
        factura: rec.numero_factura,
        fecha: rec.fecha,
        alumno: rec.alumno,
        nombre_alumno: rec.nombre_alumno,
        importe_total: importe_total.toFixed(2),
      });
    }
  });
  newBody.push({
    recibo: "",
    factura: "",
    fecha: "",
    alumno: "",
    nombre_alumno: "Total",
    importe_total: total.toFixed(2),
  });
  newExcel.setColumnas(columns);
  newExcel.addData(newBody);
  const date = new Date();
  const todayDate = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  const dateStr = format_Fecha_String(todayDate).replace(/\//g, "");
  const timeStr = formatTime(date).replace(/:/g, "");
  newExcel.guardaReporte(`${nombre}${dateStr}${timeStr}`);
};
