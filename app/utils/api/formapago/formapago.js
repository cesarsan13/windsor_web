import { Elimina_Comas } from "../../globalfn";
import { ReporteExcel } from "../../ReportesExcel";
import { ReportePDF } from "../../ReportesPDF";
export const getFormasPago = async (token, baja) => {
  let url = "";
  baja
    ? (url = `${process.env.DOMAIN_API}api/tipo_cobro/baja`)
    : (url = `${process.env.DOMAIN_API}api/tipo_cobro/`);

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const resJson = await res.json();
  return resJson.data;
};

export const siguiente = async (token) => {
  const res = await fetch(`${process.env.DOMAIN_API}api/tipo_cobro/siguiente`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const resJson = await res.json();
  return resJson.data;
};

export const guardaFormaPAgo = async (token, data, accion) => {
  let url_api = "";
  if (accion === "Alta") {
    url_api = `${process.env.DOMAIN_API}api/tipo_cobro/`;
    data.baja = "";
  }
  if (accion === "Eliminar" || accion === "Editar") {
    if (accion === "Eliminar") {
      data.baja = "*";
    } else {
      data.baja = "";
    }
    url_api = `${process.env.DOMAIN_API}api/tipo_cobro/update/`;
  }

  const res = await fetch(`${url_api}`, {
    method: "post",
    body: JSON.stringify({
      numero: data.numero,
      descripcion: data.descripcion,
      comision: Number(Elimina_Comas(data.comision)),
      aplicacion: data.aplicacion,
      cue_banco: data.cue_banco,
      baja: data.baja,
    }),
    headers: new Headers({
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    }),
  });
  const resJson = await res.json();
  return resJson;
};
const Enca1 = (doc) => {
  if (!doc.tiene_encabezado) {
    doc.imprimeEncabezadoPrincipalV();
    doc.nextRow(12);
    doc.ImpPosX("No.", 14, doc.tw_ren);
    doc.ImpPosX("Descripcion", 28, doc.tw_ren);
    doc.ImpPosX("Comision", 132, doc.tw_ren);
    doc.ImpPosX("Aplicacion", 152, doc.tw_ren);
    doc.ImpPosX("Cue. Banco", 172, doc.tw_ren);
    doc.nextRow(4);
    doc.printLineV();
    doc.nextRow(4);
    doc.tiene_encabezado = true;
  } else {
    doc.nextRow(6);
    doc.tiene_encabezado = true;
  }
};
export const Imprimir = (configuracion) => {
  const orientacion = "Portrait";
  const newPDF = new ReportePDF(configuracion, orientacion);
  const { body } = configuracion;
  Enca1(newPDF);
  body.forEach((cajero) => {
    newPDF.ImpPosX(cajero.id.toString(), 14, newPDF.tw_ren, 10);
    newPDF.ImpPosX(cajero.descripcion.toString(), 28, newPDF.tw_ren, 50);
    newPDF.ImpPosX(cajero.comision.toString(), 132, newPDF.tw_ren, 50);
    newPDF.ImpPosX(cajero.aplicacion.toString(), 152, newPDF.tw_ren, 50);
    newPDF.ImpPosX(cajero.cue_banco.toString(), 172, newPDF.tw_ren, 50);
    Enca1(newPDF);
    if (newPDF.tw_ren >= newPDF.tw_endRen) {
      newPDF.pageBreak();
      Enca1(newPDF);
    }
  });

  newPDF.guardaReporte("FormaPago");
};

export const ImprimirExcel = (configuracion) => {
  const newExcel = new ReporteExcel(configuracion);
  const { columns } = configuracion;
  const { body } = configuracion;
  const { nombre } = configuracion;
  newExcel.setColumnas(columns);
  newExcel.addData(body);
  newExcel.guardaReporte(nombre);
};
