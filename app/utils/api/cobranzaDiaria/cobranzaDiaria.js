import { formatNumber } from "../../globalfn";
import { ReporteExcel } from "../../ReportesExcel";
import { ReportePDF } from "../../ReportesPDF";

export const getCobranzaDiaria = async (
  token,
  fecha,
  cheque,
  recibo,
  alumno
) => {
  let url = `${process.env.DOMAIN_API}api/cobranzaDiaria`;
  const res = await fetch(url, {
    method: "post",
    body: JSON.stringify({
      fecha: fecha,
      cheque: cheque,
      recibo: recibo,
      alumno: alumno,
    }),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const resJson = await res.json();
  return resJson.data;
};
export const guardarCobranzaDiaria = async (token, data) => {
  let url = `${process.env.DOMAIN_API}api/cobranzaDiaria/update`;
  const res = await fetch(url, {
    method: "post",
    body: JSON.stringify({
      recibo: data.recibo,
      referencia: data.referencia,
      importe: data.importe,
      cue_banco: data.cue_banco,
    }),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const resJson = await res.json();
  return resJson;
};

const Enca1 = (doc) => {
  if (!doc.tiene_encabezado) {
    doc.imprimeEncabezadoPrincipalH();
    doc.nextRow(12);
    doc.ImpPosX("Recibo.", 14, doc.tw_ren, 0, "L");
    doc.ImpPosX("TP", 28, doc.tw_ren, 0, "L");
    doc.ImpPosX("Importe", 40, doc.tw_ren, 0, "L");
    doc.ImpPosX("Referencia", 58, doc.tw_ren, 0, "L");
    doc.ImpPosX("TP", 108, doc.tw_ren, 0, "L");
    doc.ImpPosX("Importe", 118, doc.tw_ren, 0, "L");
    doc.ImpPosX("Referencia", 138, doc.tw_ren, 0, "L");
    doc.ImpPosX("TP", 208, doc.tw_ren, 0, "L");
    doc.ImpPosX("Importe", 218, doc.tw_ren, 0, "L");
    doc.ImpPosX("Referencia", 238, doc.tw_ren, 0, "L");
    doc.nextRow(4);
    doc.printLineH();
    doc.nextRow(4);
    doc.tiene_encabezado = true;
  } else {
    doc.nextRow(6);
    doc.tiene_encabezado = true;
  }
};

export const Imprimir = (configuracion) => {
  const newPDF = new ReportePDF(configuracion, "Landscape");
  const { body, tipoPago } = configuracion;
  Enca1(newPDF);
  let sumaTp1 = 0;
  let sumaTp2 = 0;
  let sumaTp3 = 0;
  body.forEach((cobranza) => {
    newPDF.ImpPosX(cobranza.recibo.toString(), 24, newPDF.tw_ren, 0, "R");
    newPDF.ImpPosX(cobranza.tipo_pago_1.toString(), 33, newPDF.tw_ren, 0, "R");
    newPDF.ImpPosX(
      formatNumber(cobranza.importe_pago_1.toString(), 2),
      55,
      newPDF.tw_ren,
      0,
      "R"
    );
    newPDF.ImpPosX(cobranza.referencia_1.toString(), 58, newPDF.tw_ren, 0, "L");
    newPDF.ImpPosX(cobranza.tipo_pago_2.toString(), 113, newPDF.tw_ren, 0, "R");
    newPDF.ImpPosX(
      formatNumber(cobranza.importe_pago_2.toString(), 2),
      128,
      newPDF.tw_ren,
      0,
      "R"
    );
    newPDF.ImpPosX(
      cobranza.referencia_2.toString(),
      138,
      newPDF.tw_ren,
      0,
      "L"
    );
    newPDF.ImpPosX(
      cobranza?.cue_banco ? cobranza.cue_banco.toString() : "",
      213,
      newPDF.tw_ren,
      0,
      "R"
    );
    newPDF.ImpPosX(
      formatNumber(cobranza.importe.toString(), 2),
      228,
      newPDF.tw_ren,
      0,
      "R"
    );
    newPDF.ImpPosX(
      cobranza?.referencia ? cobranza.referencia.toString() : "",
      238,
      newPDF.tw_ren,
      0,
      "L"
    );
    sumaTp1 += cobranza.importe_pago_1;
    sumaTp2 += cobranza.importe_pago_2;
    sumaTp3 += cobranza.importe;
    Enca1(newPDF);
    if (newPDF.tw_ren >= newPDF.tw_endRenH) {
      newPDF.pageBreakH();
      Enca1(newPDF);
    }
  });
  newPDF.nextRow(5);
  newPDF.ImpPosX("Total", 14, newPDF.tw_ren, 0, "L");
  newPDF.ImpPosX(
    formatNumber(sumaTp1.toString(), 2),
    55,
    newPDF.tw_ren,
    0,
    "R"
  );
  newPDF.ImpPosX(
    formatNumber(sumaTp2.toString(), 2),
    128,
    newPDF.tw_ren,
    0,
    "R"
  );
  newPDF.ImpPosX(
    formatNumber(sumaTp3.toString(), 2),
    228,
    newPDF.tw_ren,
    0,
    "R"
  );
  newPDF.nextRow(10);
  newPDF.ImpPosX("Detalle de cobros", 14, newPDF.tw_ren, 0, "L");
  newPDF.nextRow(6);
  tipoPago.forEach((tp) => {
    const cobranza = body.filter(
      (cobranza) =>
        cobranza.tipo_pago_1 === tp.numero || cobranza.tipo_pago_2 === tp.numero
    );
    const totalTipoPago = cobranza.reduce((acc, cobranza) => {
      let importe = 0;
      if (cobranza.tipo_pago_1 === tp.numero) {
        importe += cobranza.importe_pago_1;
      }
      if (cobranza.tipo_pago_2 === tp.numero) {
        importe += cobranza.importe_pago_2;
      }
      return acc + importe;
    }, 0);
    if (cobranza.length > 0) {
      newPDF.ImpPosX(tp.numero.toString(), 29, newPDF.tw_ren, 0, "R");
      newPDF.ImpPosX(tp.descripcion.toString(), 39, newPDF.tw_ren, 0, "L");
      newPDF.ImpPosX(
        formatNumber(totalTipoPago.toString(), 2),
        99,
        newPDF.tw_ren,
        0,
        "R"
      );
      Enca1(newPDF);
    }
  });
  newPDF.guardaReporte(`Cobranza Diaria`);
};

export const ImprimirExcel =(configuracion)=>{
  const newExcel = new ReporteExcel(configuracion)
  const {columns,body,nombre}=configuracion
  newExcel.setColumnas(columns)
  newExcel.addData(body);
  newExcel.guardaReporte(nombre)
}