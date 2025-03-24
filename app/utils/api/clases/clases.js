import { ReporteExcel } from "@/app/utils/ReportesExcel";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import { obtenerFechaYHoraActual } from "@/app/utils/globalfn";

export const getClasesBuscaCat = async (token, grupo) => {
  let url = `${process.env.DOMAIN_API}api/proceso/busca-cat`;
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      grupo: grupo
    }),
    headers: new Headers({
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
      xescuela: localStorage.getItem("xescuela"),
    }),
  });
  const resJson = await res.json();
  return resJson.data;
};

export const getClases = async (token, baja) => {
  let url = "";
  baja
    ? (url = `${process.env.DOMAIN_API}api/clase/baja`)
    : (url = `${process.env.DOMAIN_API}api/clase/`);

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

export const guardaClase = async (token, data, accion) => {
  let url_api = "";
  if (accion === "Alta") {
    url_api = `${process.env.DOMAIN_API}api/saveClase`;
    data.baja = "";
  }
  if (accion === "Eliminar" || accion === "Editar") {
    if (accion === "Eliminar") {
      data.baja = "*";
    } else {
      data.baja = "";
    }
    url_api = `${process.env.DOMAIN_API}api/updateClase`;
  }

  const res = await fetch(`${url_api}`, {
    method: "post",
    body: JSON.stringify({
      baja: data.baja,
      domingo: data.domingo,
      grupo: data.grupo,
      jueves: data.jueves,
      lunes: data.lunes,
      martes: data.martes,
      materia: data.materia,
      miercoles: data.miercoles,
      profesor: data.profesor,
      sabado: data.sabado,
      viernes: data.viernes,    
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
    doc.imprimeEncabezadoPrincipalH();
    doc.nextRow(12);
    doc.ImpPosX("Grupo", 14, doc.tw_ren, 0, "L");
    doc.ImpPosX("Asignatura", 50, doc.tw_ren, 0, "L");
    doc.ImpPosX("Profesor", 95, doc.tw_ren, 0, "L");
    doc.ImpPosX("Lunes", 180, doc.tw_ren, 0, "L");
    doc.ImpPosX("Martes", 195, doc.tw_ren, 0, "L");
    doc.ImpPosX("Miercoles", 210, doc.tw_ren, 0, "L");
    doc.ImpPosX("Jueves", 230, doc.tw_ren, 0, "L");
    doc.ImpPosX("Viernes", 245, doc.tw_ren, 0, "L");
    doc.ImpPosX("Sabado", 260, doc.tw_ren, 0, "L");
    doc.ImpPosX("Domingo", 275, doc.tw_ren, 0, "L");
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
  const orientacion = "Landscape";
  const newPDF = new ReportePDF(configuracion, orientacion);
  const { body } = configuracion;
  Enca1(newPDF);
  body.forEach((clase) => {
    newPDF.ImpPosX(clase.grupo_descripcion?.toString() ?? "", 14, newPDF.tw_ren, 12, "L");
    newPDF.ImpPosX(clase.materia_descripcion?.toString() ?? "", 50, newPDF.tw_ren, 20, "L");
    newPDF.ImpPosX(clase.profesor_nombre?.toString() ?? "", 95, newPDF.tw_ren, 35, "L");
    newPDF.ImpPosX(clase.lunes?.toString() ?? "", 180, newPDF.tw_ren, 0, "L");
    newPDF.ImpPosX(clase.martes?.toString() ?? "", 195, newPDF.tw_ren, 0, "L");
    newPDF.ImpPosX(clase.miercoles?.toString() ?? "", 210, newPDF.tw_ren, 0, "L");
    newPDF.ImpPosX(clase.jueves?.toString() ?? "", 230, newPDF.tw_ren, 0, "L");
    newPDF.ImpPosX(clase.viernes?.toString() ?? "", 245, newPDF.tw_ren, 0, "L");
    newPDF.ImpPosX(clase.sabado?.toString() ?? "", 260, newPDF.tw_ren, 0, "L");
    newPDF.ImpPosX(clase.domingo?.toString() ?? "", 275, newPDF.tw_ren, 0, "L");
    Enca1(newPDF);
    if (newPDF.tw_ren >= newPDF.tw_endRenH) {
      newPDF.pageBreakH();
      Enca1(newPDF);
    }
  });
  const { fecha, hora } = obtenerFechaYHoraActual();
  newPDF.guardaReporte(`Reporte_Clases_${fecha}${hora}`);
};

export const ImprimirExcel = (configuracion) => {
  const newExcel = new ReporteExcel(configuracion)
  const { columns } = configuracion
  const { body } = configuracion
  const { nombre } = configuracion
  newExcel.setColumnas(columns);
  newExcel.addData(body);
  newExcel.guardaReporte(nombre);
}
