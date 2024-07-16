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
      id: data.id,
      descripcion: data.descripcion,
      comision: data.comision,
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
    doc.imprimeEncabezadoPrincipal();
    doc.nextRow(12);
    doc.ImpPosX("Numero", 14, doc.tw_ren);
    doc.ImpPosX("Descripcion", 28, doc.tw_ren);
    doc.ImpPosX("Comision", 62, doc.tw_ren);
    doc.ImpPosX("Aplicacion", 82, doc.tw_ren);
    doc.ImpPosX("Cue. Banco", 112, doc.tw_ren);
    doc.nextRow(4);
    doc.printLine();
    doc.nextRow(4);
    doc.tiene_encabezado = true;
  } else {
    doc.nextRow(6);
    doc.tiene_encabezado = true;
  }
};
export const Imprimir = (configuracion) => {
  const newPDF = new ReportePDF(configuracion);
  const { body } = configuracion;
  Enca1(newPDF);
  body.forEach((cajero) => {
    newPDF.ImpPosX(cajero.id.toString(), 14, newPDF.tw_ren);
    newPDF.ImpPosX(cajero.descripcion.toString(), 28, newPDF.tw_ren);
    newPDF.ImpPosX(cajero.comision.toString(), 62, newPDF.tw_ren);
    newPDF.ImpPosX(cajero.aplicacion.toString(), 82, newPDF.tw_ren);
    newPDF.ImpPosX(cajero.cue_banco.toString(), 112, newPDF.tw_ren);
    Enca1(newPDF);
    if (newPDF.tw_ren >= newPDF.tw_endRen) {
      newPDF.pageBreak();
      Enca1(newPDF);
    }
  });

  newPDF.guardaReporte("PruebaEncabezado");
};

export const ImprimirExcel=(configuracion)=>{
  const newExcel=new ReporteExcel(configuracion)
  const {columns} = configuracion
  const {body} = configuracion
  const {nombre}=configuracion
  newExcel.setColumnas(columns);
  newExcel.addData(body);
  newExcel.guardaReporte(nombre);
}