import { ReporteExcel } from "@/app/utils/ReportesExcel";
import { ReportePDF } from "../../ReportesPDF";
import { formatTime, format_Fecha_String } from "../../globalfn";


export const getAsignaturas = async (token, baja) => {
  let url = "";
  baja
    ? (url = `${process.env.DOMAIN_API}api/subject/bajas`)
    : (url = `${process.env.DOMAIN_API}api/subject`);
  const res = await fetch(url, {
    headers: new Headers({
      Authorization: "Bearer " + token,
      xescuela: localStorage.getItem("xescuela"),
    }),
  });
  const resJson = await res.json();
  return resJson.data;
};

export const getAsignaturasCasoOtro = async (token, baja) => {
  let url = "";
  url = `${process.env.DOMAIN_API}api/subject/caso-otro`;
  const res = await fetch(url, {
    headers: new Headers({
      Authorization: "Bearer " + token,
      xescuela: localStorage.getItem("xescuela"),
    }),
  });
  const resJson = await res.json();
  return resJson.data;
};

export const filtroAsignaturas = async (token, tipo, valor) => {
  if (!tipo) {
    tipo = "nothing";
  }
  if (!valor) {
    valor = "nothing";
  }
  let url = `${process.env.DOMAIN_API}api/subject/filter/${tipo}/${valor}`;
  const res = await fetch(url, {
    method: "GET",
    headers: new Headers({
      Authorization: "Bearer " + token,
      xescuela: localStorage.getItem("xescuela"),
    }),
  });
  const resJson = await res.json();
  return resJson.data;
};
export const getLastSubject = async (token) => {
  let url = `${process.env.DOMAIN_API}api/subject/last`;
  const res = await fetch(url, {
    headers: new Headers({
      Authorization: "Bearer " + token,
      xescuela: localStorage.getItem("xescuela"),
    }),
  });
  const resJson = await res.json();
  return resJson.data;
};
export const guardarAsinatura = async (token, data, accion, numero) => {
  let url = "";
  let met = "";
  if (accion === "Alta") {

    url = `${process.env.DOMAIN_API}api/subject/save`;
    data.baja = "";
    met = "post";
  }
  if (accion === "Eliminar" || accion === "Editar") {
    if (accion === "Eliminar") {
      data.baja = "*";
    } else {
      data.baja = "n";
    }
    url = `${process.env.DOMAIN_API}api/subject/update/${numero}`;
    met = "put";
  }
  data.actividad = data.actividad === true ? "true" : "false";

  const res = await fetch(`${url}`, {
    method: met,
    body: JSON.stringify({
      numero: data.numero,
      descripcion: data.descripcion,
      baja: data.baja,
      evaluaciones: data.evaluaciones,
      actividad: data.actividad,
      area: data.area,
      orden: data.orden,
      lenguaje: data.lenguaje,
      caso_evaluar: data.caso_evaluar
    }),
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: "Bearer " + token,
      xescuela: localStorage.getItem("xescuela"),
    }),
  });
  const resJson = await res.json();
  return resJson;
};

const Enca1 = (doc) => {
  if (!doc.tiene_encabezado) {
    doc.imprimeEncabezadoPrincipalH();
    doc.nextRow(12);
    doc.ImpPosX("No.", 14, doc.tw_ren);
    doc.ImpPosX("Asignatura", 28, doc.tw_ren);
    doc.nextRow(4);
    doc.printLineH();
    doc.nextRow(4);
    doc.tiene_encabezado = true;
  } else {
    doc.nextRow(6);
    doc.tiene_encabezado = true;
  }
};

export const ImprimirPDF = (configuracion) => {
  const newPDF = new ReportePDF(configuracion, "Landscape");
  const { body } = configuracion;
  Enca1(newPDF);
  body.forEach((Asignatura) => {
    newPDF.ImpPosX(Asignatura.numero.toString(), 24, newPDF.tw_ren, 0, "R");
    newPDF.ImpPosX(Asignatura.descripcion.toString(), 28, newPDF.tw_ren, 25, "L");
    Enca1(newPDF);
    if (newPDF.tw_ren >= newPDF.tw_endRenH) {
      newPDF.pageBreakH();
      Enca1(newPDF);
    }
  });
  const date = new Date();
  const todayDate = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  const dateStr = format_Fecha_String(todayDate).replace(/\//g, "");
  const timeStr = formatTime(date).replace(/:/g, "");

  newPDF.guardaReporte(`Asignaturas_${dateStr}${timeStr}`);
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

export const storeBatchAsignatura = async (token, data) => {
  let url = `${process.env.DOMAIN_API}api/subject/Batch`;
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
};
