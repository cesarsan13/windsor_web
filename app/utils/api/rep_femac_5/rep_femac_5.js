import { ReporteExcel } from "@/app/utils/ReportesExcel";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import { calculaDigitoBvba } from "@/app/utils/globalfn";

export const getReportAltaBajaAlumno = async (
  token,
  baja,
  tipoOrden,
  fecha_ini,
  fecha_fin
) => {
  let url = `${process.env.DOMAIN_API}api/students/report/AltaBaja`;
  const res = await fetch(url, {
    method: "post",
    body: JSON.stringify({
      baja: baja,
      tipoOrden: tipoOrden,
      fecha_ini: fecha_ini,
      fecha_fin: fecha_fin,
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
    doc.ImpPosX("No", 15, doc.tw_ren);
    doc.ImpPosX("Nombre", 35, doc.tw_ren);
    doc.ImpPosX("Dia", 170, doc.tw_ren);
    doc.ImpPosX("Mes", 180, doc.tw_ren);
    doc.ImpPosX("Año", 190, doc.tw_ren);
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
  const newPDF = new ReportePDF(configuracion);
  const { body } = configuracion;
  Enca1(newPDF);
  body.forEach((alumno) => {
    const nombre = `${alumno.a_nombre || ""} ${alumno.a_paterno || ""} ${
      alumno.a_materno || ""
    }`;
    const id = calculaDigitoBvba((alumno.numero || '').toString() || '');
    let fecha;
    fecha = new Date(alumno.fecha_nac);
    const diaFor = fecha.getDate().toString().padStart(2, "0");
    const mesFor = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const añoFor = fecha.getFullYear().toString();
    newPDF.ImpPosX(`${alumno.numero}-${id}`, 15, newPDF.tw_ren);
    newPDF.ImpPosX(nombre, 35, newPDF.tw_ren);
    newPDF.ImpPosX(diaFor, 170, newPDF.tw_ren);
    newPDF.ImpPosX(mesFor, 180, newPDF.tw_ren);
    newPDF.ImpPosX(añoFor, 190, newPDF.tw_ren);
    newPDF.tw_ren += 1;
    Enca1(newPDF);
    if (newPDF.tw_ren >= newPDF.tw_endRen) {
      newPDF.pageBreak();
      Enca1(newPDF);
    }
  });
  newPDF.guardaReporte("Reporte Altas Bajas Alumnos por Periodo");
};

export const ImprimirExcel = (configuracion) => {
  const newExcel = new ReporteExcel(configuracion);
  const { columns, body, nombre } = configuracion;
  const newBody = [];
  body.forEach((alumno) => {
    let fecha = new Date(alumno.fecha_nac);
    const diaFor = fecha.getDate().toString().padStart(2, "0");
    const mesFor = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const añoFor = fecha.getFullYear().toString();
    newBody.push({
      ...alumno,
      dia: diaFor,
      mes: mesFor,
      año: añoFor,
    });
  });
  newExcel.setColumnas(columns);
  newExcel.addData(newBody);
  newExcel.guardaReporte(nombre);
};
