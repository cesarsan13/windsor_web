import { ReporteExcel } from "../../ReportesExcel";
import { ReportePDF } from "../../ReportesPDF";

export const getActividadSecuencia = async (token, materia) => {
  let url = `${process.env.DOMAIN_API}api/proceso/actividad-secuencia`
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      materia: materia
    }),
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      xescuela: localStorage.getItem("xescuela"),
      'Content-Type': 'application/json',
    }),
  });
  const resJson = await res.json();
  return resJson;
};

export const getActividades = async (token, baja) => {
  let url = "";
  baja
    ? (url = `${process.env.DOMAIN_API}api/actividades/baja`)
    : (url = `${process.env.DOMAIN_API}api/actividades/get`);
  const res = await fetch(url, {
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      xescuela: localStorage.getItem("xescuela"),
    }),
  });
  const resJson = await res.json();
  return resJson.data;
};
export const getUltimaSecuencia = async (token, materia) => {
  const res = await fetch(
    `${process.env.DOMAIN_API}api/actividades/ultimaSecuencia`,
    {
      method: "post",
      body: JSON.stringify({
        materia: materia,
      }),
      headers: new Headers({
        Authorization: "Bearer " + token,
        xescuela: localStorage.getItem("xescuela"),
        "Content-Type": "application/json",
      }),
    }
  );
  const resJson = await res.json();
  return resJson;
};
export const guardarActividad = async (token, accion, data) => {
  let url = "";
  if (accion === "Alta") {
    url = `${process.env.DOMAIN_API}api/actividades/post`;
    data.baja = "";
  }
  if (accion === "Eliminar" || accion === "Editar") {
    if (accion === "Eliminar") {
      data.baja = "*";
    } else {
      data.baja = "";
    }
    url = `${process.env.DOMAIN_API}api/actividades/update`;
  }
  const res = await fetch(`${url}`, {
    method: "post",
    body: JSON.stringify({
      materia: data.materia,
      secuencia: data.secuencia,
      descripcion: data.descripcion,
      EB1: data.EB1,
      EB2: data.EB2,
      EB3: data.EB3,
      EB4: data.EB4,
      EB5: data.EB5,
      baja: data.baja,
    }),
    headers: new Headers({
      Authorization: "Bearer " + token,
      xescuela: localStorage.getItem("xescuela"),
      "Content-Type": "application/json",
    }),
  });
  const resJson = await res.json();
  return resJson;
};

export const ImprimirPDF = (configuracion) => {
  const newPDF = new ReportePDF(configuracion);
  const { body } = configuracion;
  Enca1(newPDF);
  body.forEach((actividad) => {
    newPDF.ImpPosX(actividad.materia.toString(), 24, newPDF.tw_ren, 0, "R")
    newPDF.ImpPosX(actividad.descripcion.toString(), 38, newPDF.tw_ren, 0, "L")
    Enca1(newPDF);
    if (newPDF.tw_ren >= newPDF.tw_endRen) {
      newPDF.pageBreak();
      Enca1(newPDF);
    }
  });
  newPDF.guardaReporte("Actividades");
};

const Enca1 = (doc) => {
  if (!doc.tiene_encabezado) {
    doc.imprimeEncabezadoPrincipalV();
    doc.nextRow(12);
    doc.ImpPosX("Asignatura", 14, doc.tw_ren);
    doc.ImpPosX("Actividad", 38, doc.tw_ren);
    doc.nextRow(4);
    doc.printLineV();
    doc.nextRow(4);
    doc.tiene_encabezado = true;
  } else {
    doc.nextRow(6);
    doc.tiene_encabezado = true;
  }
};
export const ImprimirExcel = (configuracion) => {
  const newExcel = new ReporteExcel(configuracion)
  const { columns } = configuracion
  const { body } = configuracion
  const { nombre } = configuracion
  newExcel.setColumnas(columns)
  newExcel.addData(body);
  newExcel.guardaReporte(nombre)
}
export const getAsignaturas = async (token, baja) => {
  let url = "";
  baja
    ? (url = `${process.env.DOMAIN_API}api/subject/bajas`)
    : (url = `${process.env.DOMAIN_API}api/subject`);
  const res = await fetch(url, {
    headers: new Headers({
      Authorization: "Bearer " + token,
      xescuela: localStorage.getItem("xescuela"),
      "Content-Type": "application/json",
    }),
  });
  const resJson = await res.json();
  return resJson.data;
};

export const storeBatchActividad = async (token, data) => {
  let url = `${process.env.DOMAIN_API}api/actividades/batch`;
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
  return resJson;

}