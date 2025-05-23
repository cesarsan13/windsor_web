import { ReporteExcel } from "@/app/utils/ReportesExcel";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import { format_Fecha_String, formatTime } from "@/app/utils/globalfn";

export const getDataSex = async (token) => {
  let url = "";
  url = `${process.env.DOMAIN_API}api/students/datasex`;
  const res = await fetch(url, {
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      xescuela: localStorage.getItem("xescuela"),
    }),
  });
  const resJson = await res.json();
  return resJson.data;
};

export const getAlumnos = async (token, baja) => {
  let url = "";
  baja
    ? (url = `${process.env.DOMAIN_API}api/students/bajas`)
    : (url = `${process.env.DOMAIN_API}api/students/`);
  const res = await fetch(url, {
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      xescuela: localStorage.getItem("xescuela"),
    }),
  });
  const resJson = await res.json();
  return resJson.data;
};

export const getFotoAlumno = async (token, imagen) => {
  let url = `${process.env.DOMAIN_API}api/students/imagen/${imagen}`;
  const res = await fetch(url, {
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      xescuela: localStorage.getItem("xescuela"),
    }),
  });
  const blob = await res.blob();
  return URL.createObjectURL(blob);
};

export const getLastAlumnos = async (token) => {
  let url = `${process.env.DOMAIN_API}api/students/last`;
  const res = await fetch(url, {
    headers: new Headers({
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
      xescuela: localStorage.getItem("xescuela"),
    }),
  });
  const resJson = await res.json();
  return resJson.data;
};

export const guardarAlumnos = async (token, formData, accion, numero) => {
  let url = "";
  if (accion === "Alta") {
    url = `${process.env.DOMAIN_API}api/students/save`;
    formData.append("baja", "n");
  }
  if (accion === "Eliminar" || accion === "Editar") {
    if (accion === "Eliminar") {
      let fecha_hoy = new Date();
      formData.append("baja", "*");
      formData.append("fecha_baja", format_Fecha_String(fecha_hoy.toISOString().split("T")[0]));
    } else {
      formData.append("baja", "n");
      formData.append("fecha_baja", " ");
    }
    url = `${process.env.DOMAIN_API}api/students/update/${numero}`;
  }
  const res = await fetch(`${url}`, {
    method: "POST",
    body: formData,
    headers: new Headers({
      Authorization: "Bearer " + token,
      xescuela: localStorage.getItem("xescuela"),
    }),
  });
  const resJson = await res.json();
  return resJson;
};

export const storeBatchAlumnos = async (token, data) => {
  let url = `${process.env.DOMAIN_API}api/students/batch`;
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
};

const Enca1 = (doc) => {
  if (!doc.tiene_encabezado) {
    doc.imprimeEncabezadoPrincipalH();
    doc.nextRow(12);
    doc.ImpPosX("Numero", 10, doc.tw_ren);
    doc.ImpPosX("Nombre", 25, doc.tw_ren);
    doc.ImpPosX("Dirección", 90, doc.tw_ren);
    doc.ImpPosX("Colonia", 120, doc.tw_ren);
    doc.ImpPosX("Fecha Nac", 175, doc.tw_ren);
    doc.ImpPosX("Fecha Alta", 200, doc.tw_ren);
    doc.ImpPosX("Telefono", 230, doc.tw_ren);
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
  const newPDF = new ReportePDF(configuracion, "landscape");
  const { body } = configuracion;
  Enca1(newPDF);
  body.forEach((alumnos) => {
    newPDF.ImpPosX(alumnos.numero.toString(), 19, newPDF.tw_ren, 0, "R");
    newPDF.ImpPosX(
      alumnos.nombre.toString().substring(0, 20),
      25,
      newPDF.tw_ren,
      0,
      "L"
    );
    newPDF.ImpPosX(
      alumnos.direccion.toString().substring(0, 12),
      90,
      newPDF.tw_ren,
      0,
      "L"
    );
    newPDF.ImpPosX(
      alumnos.colonia.toString().substring(0, 20),
      120,
      newPDF.tw_ren,
      0,
      "L"
    );
    newPDF.ImpPosX(
      format_Fecha_String(alumnos.fecha_nac.toString().substring(0, 15)),
      175,
      newPDF.tw_ren,
      0,
      "L"
    );
    newPDF.ImpPosX(
      format_Fecha_String(alumnos.fecha_inscripcion.toString()),
      200,
      newPDF.tw_ren,
      0,
      "L"
    );
    newPDF.ImpPosX(alumnos.telefono1.toString(), 254, newPDF.tw_ren, 0, "R");
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
  newPDF.guardaReporte(`Alumnos_${dateStr}${timeStr}`);
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

export const getTab = (nombre_campo) => {
  switch (nombre_campo) {
    case "a_materno": // campo en el tab 'Alumno'
    case "a_paterno":
    case "a_nombre":
    case "estatus":
    case "fecha_nac":
    case "sexo":
    case "escuela":
    case "telefono1":
    case "celular":
      return 1;
      break;
    case "direccion": // campo en el tab 'Generales'
    case "colonia":
    case "ciudad":
    case "estado":
    case "cp":
    case "email":
      return 2;
      break;
    case "rfc_factura":
      return 7;
    default:
      break;
  }
};
