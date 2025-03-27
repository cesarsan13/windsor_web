import { Elimina_Comas } from "@/app/utils/globalfn";
import { ReporteExcel } from "@/app/utils/ReportesExcel";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import { formatTime, format_Fecha_String } from "@/app/utils/globalfn";

export const getFormasPago = async (token, baja) => {
  let url = "";
  baja
    ? (url = `${process.env.DOMAIN_API}api/tipo_cobro/baja`)
    : (url = `${process.env.DOMAIN_API}api/tipo_cobro`);

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      xescuela: localStorage.getItem("xescuela"),
    },
  });
  const resJson = await res.json();
  return resJson.data;
};

export const storeBatchTipoCobro = async (token, data) => {
  let url = `${process.env.DOMAIN_API}api/tipo_cobro/batch`;
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: new Headers({
      Authorization: "Bearer " + token,
      xescuela: localStorage.getItem("xescuela"),
      "Content-Type": "application/json",
    }),
  });
  const resJson = await res.json();
  return resJson.data;
}

export const siguiente = async (token) => {
  const res = await fetch(`${process.env.DOMAIN_API}api/tipo_cobro/siguiente`, {
    headers: {
      Authorization: `Bearer ${token}`,
      xescuela: localStorage.getItem("xescuela"),
    },
  });
  const resJson = await res.json();
  return resJson.data;
};

export const guardaFormaPAgo = async (token, data, accion) => {
  let url_api = "";
  if (accion === "Alta") {
    url_api = `${process.env.DOMAIN_API}api/tipo_cobro`;
    data.baja = "";
  }
  if (accion === "Eliminar" || accion === "Editar") {
    if (accion === "Eliminar") {
      data.baja = "*";
    } else {
      data.baja = "";
    }
    url_api = `${process.env.DOMAIN_API}api/tipo_cobro/update`;
  }

  const res = await fetch(`${url_api}`, {
    method: "post",
    body: JSON.stringify({
      numero: data.numero,
      descripcion: data.descripcion,
      comision: Number(Elimina_Comas(data.comision)),
      aplicacion: data.aplicacion || '',
      cue_banco: data.cue_banco || '',
      baja: data.baja,
    }),
    headers: new Headers({
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
      xescuela: localStorage.getItem("xescuela"),
    }),
  });
  const resJson = await res.json();
  return resJson;
};
const Enca1 = (doc) => {
  if (!doc.tiene_encabezado) {
    doc.imprimeEncabezadoPrincipalV();
    doc.nextRow(12);
    doc.ImpPosX("No.", 14, doc.tw_ren,0,"L");
    doc.ImpPosX("Descripcion", 28, doc.tw_ren,0,"L");
    doc.ImpPosX("Comision", 122, doc.tw_ren,0,"L");
    doc.ImpPosX("Aplicacion", 152, doc.tw_ren,0,"L");
    doc.ImpPosX("Cue. Banco", 172, doc.tw_ren,0,"L");
    doc.nextRow(4);
    doc.printLineV();
    doc.nextRow(4);
    doc.tiene_encabezado = true;
  } else {
    doc.nextRow(6);
    doc.tiene_encabezado = true;
  }
};

export const ImprimirPDF = (configuracion) => {
  const orientacion = "Portrait";
  const newPDF = new ReportePDF(configuracion, orientacion);
  const { body } = configuracion;
  Enca1(newPDF);
  body.forEach((cajero) => {
    newPDF.ImpPosX(cajero.numero.toString(), 24, newPDF.tw_ren, 10,"R");
    newPDF.ImpPosX(cajero.descripcion.toString(), 28, newPDF.tw_ren, 50,"L");
    newPDF.ImpPosX(cajero.comision.toString(), 132, newPDF.tw_ren, 50,"R");
    newPDF.ImpPosX(cajero.aplicacion.toString(), 152, newPDF.tw_ren, 50,"L");
    newPDF.ImpPosX(cajero.cue_banco.toString(), 172, newPDF.tw_ren, 50,"L");
    Enca1(newPDF);
    if (newPDF.tw_ren >= newPDF.tw_endRen) {
      newPDF.pageBreak();
      Enca1(newPDF);
    }
  });
  const date = new Date();
  const todayDate = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  const dateStr = format_Fecha_String(todayDate).replace(/\//g, "");
  const timeStr = formatTime(date).replace(/:/g, "");
  newPDF.guardaReporte(`FormaPagos_${dateStr}${timeStr}`);
};

export const ImprimirExcel = (configuracion) => {
  const newExcel = new ReporteExcel(configuracion);
  const { columns } = configuracion;
  const { body } = configuracion;
  const { nombre } = configuracion;
  newExcel.setColumnas(columns);
  newExcel.addData(body);
  const date = new Date();
  const todayDate = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  const dateStr = format_Fecha_String(todayDate).replace(/\//g, "");
  const timeStr = formatTime(date).replace(/:/g, "");
  newExcel.guardaReporte(`${nombre}${dateStr}${timeStr}`);
};


