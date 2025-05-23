import { ReporteExcel } from "@/app/utils/ReportesExcel";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import {
  format_Fecha_String,
  formatNumber,
  formatTime,
} from "@/app/utils/globalfn";

export const getRelaciondeFacturas = async (
  token,
  tomaFecha,
  tomaCanceladas,
  fecha_cobro_ini,
  fecha_cobro_fin,
  factura_ini,
  factura_fin
) => {
  factura_ini =
    factura_ini === "" || factura_ini === undefined ? 0 : factura_ini;
  factura_fin =
    factura_fin === "" || factura_fin === undefined ? 0 : factura_fin;

  let url = `${process.env.DOMAIN_API}api/reportes/rep_femac_9_anexo_4`;
  const res = await fetch(url, {
    method: "post",
    body: JSON.stringify({
      tomaFecha: tomaFecha,
      tomaCanceladas: tomaCanceladas,
      fecha_cobro_ini: String(fecha_cobro_ini),
      fecha_cobro_fin: String(fecha_cobro_fin),
      factura_ini: Number(factura_ini),
      factura_fin: Number(factura_fin),
    }),
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
      xescuela: localStorage.getItem("xescuela"),
    },
  });
  const resJson = await res.json();
  return resJson.data;
};

const Enca1 = (
  doc,
  fecha_cobro_ini,
  fecha_cobro_fin,
  tomaFechas,
  tomaCanceladas
) => {
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

export const ImprimirPDF = (
  configuracion,
  fecha_cobro_ini,
  fecha_cobro_fin,
  tomaFechas,
  tomaCanceladas
) => {
  const newPDF = new ReportePDF(configuracion, "Portrait");
  const { body } = configuracion;
  const F_fecha_cobro_ini = format_Fecha_String(fecha_cobro_ini);
  const F_fecha_cobro_fin = format_Fecha_String(fecha_cobro_fin);
  Enca1(newPDF, fecha_cobro_ini, fecha_cobro_fin, tomaFechas, tomaCanceladas);
  let total_general = 0;

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

    total_importe = cantidad * precio_unitario;
    total_importe = total_importe - total_importe * (descuento / 100);

    if (iva > 0) {
      sub_total = total_importe * (iva / 100);
      sub_total += total_importe;
    } else if (iva < 0 || iva === 0) {
      sub_total = total_importe;
    }

    if (razon_social === "" || razon_social === " " || razon_social === null) {
      razon_social_cambio = r_s_nombre;
    } else {
      razon_social_cambio = razon_social;
    }

    if(razon_social === "null"){
      razon_social_cambio = "Cancelado";
    }

    newPDF.ImpPosX(noFac.toString(), 25, newPDF.tw_ren, 0, "R");
    newPDF.ImpPosX(recibo.toString(), 40, newPDF.tw_ren, 0, "R");
    newPDF.ImpPosX(fecha, 45, newPDF.tw_ren, 0, "L");
    newPDF.ImpPosX(razon_social_cambio, 68, newPDF.tw_ren, 0, "L");
    newPDF.ImpPosX(formatNumber(total_importe), 157, newPDF.tw_ren, 0, "R");
    newPDF.ImpPosX(`${ivaimp} %`.toString(), 175, newPDF.tw_ren, 0, "R");
    newPDF.ImpPosX(formatNumber(sub_total), 198, newPDF.tw_ren, 0, "R");

    Enca1(newPDF);
    if (newPDF.tw_ren >= newPDF.tw_endRen) {
      newPDF.pageBreak();
      Enca1(
        newPDF,
        F_fecha_cobro_ini,
        F_fecha_cobro_fin,
        tomaFechas,
        tomaCanceladas
      );
    }
    total_general = total_general + sub_total;
  });
  newPDF.nextRow(4);
  newPDF.ImpPosX(
    `TOTAL IMPORTE: ${formatNumber(total_general)}` || "",
    150,
    newPDF.tw_ren,
    0,
    "L"
  );
  const date = new Date();
  const todayDate = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  const dateStr = format_Fecha_String(todayDate).replace(/\//g, "");
  const timeStr = formatTime(date).replace(/:/g, "");

  newPDF.guardaReporte(`Rep_Relacion_Facturas_${dateStr}${timeStr}`);
};

export const ImprimirExcel = (configuracion) => {
  const newExcel = new ReporteExcel(configuracion);
  const { columns, body, nombre } = configuracion;
  const newBody = [];

  let total_general = 0;

  body.forEach((rec) => {
    let noFac = rec.numero_factura;
    const recibo = rec.recibo;
    const fecha = rec.fecha;
    const razon_social = rec.razon_social;
    const ivaimp = rec.iva;
    const iva = rec.iva;
    const cantidad = rec.cantidad;
    const precio_unitario = rec.precio_unitario;
    const descuento = rec.descuento;

    if (noFac == "" || noFac == null || noFac == " ") {
      noFac = "0";
    }
    let total_importe = 0;
    let sub_total = 0;
    const r_s_nombre = "FACTURA GLOBAL DEL DIA";
    let razon_social_cambio = "";

    total_importe = cantidad * precio_unitario;
    total_importe = total_importe - total_importe * (descuento / 100);

    if (iva > 0) {
      sub_total = total_importe * (iva / 100);
      sub_total += total_importe;
    } else if (iva < 0 || iva === 0) {
      sub_total = total_importe;
    }

    if (razon_social === "" || razon_social === " " || razon_social === null) {
      razon_social_cambio = r_s_nombre;
    } else {
      razon_social_cambio = razon_social;
    }

    if(razon_social === "null"){
      razon_social_cambio = "Cancelado";
    }

    newBody.push({
      facturaI: noFac,
      reciboI: recibo,
      fechapI: fecha,
      nombreI: razon_social_cambio,
      subtotalI: formatNumber(total_importe),
      ivaI: `${ivaimp} %`,
      totalI: formatNumber(sub_total),
    });

    total_general = total_general + sub_total;
  });
  newBody.push({
    facturaI: "",
    reciboI: "",
    fechapI: "",
    nombreI: "",
    subtotalI: "",
    ivaI: "TOTAL IMPORTE",
    totalI: formatNumber(total_general),
  });
  newExcel.setColumnas(columns);
  newExcel.addData(newBody);
  const date = new Date();
  const todayDate = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  const dateStr = format_Fecha_String(todayDate).replace(/\//g, "");
  const timeStr = formatTime(date).replace(/:/g, "");
  newExcel.guardaReporte(`${nombre}_${dateStr}${timeStr}`);
};
