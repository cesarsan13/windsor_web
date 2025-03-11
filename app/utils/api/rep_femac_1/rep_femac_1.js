import { ReporteExcel } from "@/app/utils/ReportesExcel";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import { calculaDigitoBvba } from "@/app/utils/globalfn";
import { formatTime, format_Fecha_String } from "@/app/utils/globalfn";

export const getreportAlumn = async (token, baja, tipoOrden, alumnos1, alumnos2) => {
  const res = await fetch(`${process.env.DOMAIN_API}api/students/report`, {
    method: "post",
    body: JSON.stringify({
      baja: baja,
      tipoOrden: tipoOrden,
      alumnos1: alumnos1,
      alumnos2: alumnos2,
    }),
    headers: new Headers({
      Authorization: "Bearer " + token,
      xescuela: localStorage.getItem("xescuela"),
      "Content-Type": "application/json"
    } )
  })

  const resJson = await res.json();
  return resJson.data;
}

const Enca1 = (doc) => {
  if (!doc.tiene_encabezado) {
    doc.imprimeEncabezadoPrincipalV();
    doc.nextRow(12);
    doc.ImpPosX("No", 15, doc.tw_ren, 0, "L");
    doc.ImpPosX("Nombre", 25, doc.tw_ren, 0, "L");
    doc.ImpPosX("Estatus", 110, doc.tw_ren, 0, "L");
    doc.ImpPosX("Fecha", 125, doc.tw_ren, 0, "L");
    doc.ImpPosX("Horario", 147, doc.tw_ren, 0, "L");
    doc.ImpPosX("Teléfono", 178, doc.tw_ren, 0, "L");
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
  const newPDF = new ReportePDF(configuracion, "Portrait");
  const { body } = configuracion;
  Enca1(newPDF);
  body.forEach((alumnos) => {
    const id = calculaDigitoBvba((alumnos.numero || '').toString() || '');
    const nombre = `${(alumnos.a_nombre || '')} ${(alumnos.a_paterno || '')} ${(alumnos.a_materno || '')}`.substring(0, 50);
    const estatus = ((alumnos.estatus || '')).toString().substring(0, 12);
    const fecha_nac = ((alumnos.fecha_nac || '')).toString().substring(0, 15);
    const horario_1_nombre = ((alumnos.horario_1_nombre || '')).toString().substring(0, 15);
    const telefono = ((alumnos.telefono1 || '')).toString().substring(0, 15);
    newPDF.ImpPosX(`${alumnos.numero}-${id}`, 23, newPDF.tw_ren, 0, "R");
    newPDF.ImpPosX(nombre, 25, newPDF.tw_ren, 0, "L");
    newPDF.ImpPosX(estatus, 110, newPDF.tw_ren, 0, "L");
    newPDF.ImpPosX(fecha_nac, 125, newPDF.tw_ren, 0, "L");
    newPDF.ImpPosX(horario_1_nombre, 147, newPDF.tw_ren, 0, "L");
    newPDF.ImpPosX(telefono, 200, newPDF.tw_ren, 0, "R");
    if (alumnos.baja === '*') {
      newPDF.tw_ren += 5;
      const fecha_baja = ((alumnos.fecha_baja || '')).toString().substring(0, 15);
      newPDF.ImpPosX(`Fecha de Baja: ${fecha_baja}`, 25, newPDF.tw_ren);
    }
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

newPDF.guardaReporte(`Relacion_General_Alumnos_${dateStr}${timeStr}`);
};

export const ImprimirExcel = (configuracion) => {
  const newExcel = new ReporteExcel(configuracion);
  const { columns } = configuracion;
  const { body } = configuracion;
  const { nombre } = configuracion;
  const newBody = [];
  body.forEach((alumno) => {
    newBody.push({
      ...alumno,
      id: `${alumno.numero}-${calculaDigitoBvba(alumno.numero.toString())}`
    });
    if (alumno.baja === '*') {
      newBody.push({
        numero: '',
        nombre: '',
        estatus: '',
        fecha_nac: ((`Fecha de Baja: ${alumno.fecha_baja}` || '')).toString(),
        horario_1_nombre: '',
        telefono_1: ''
      });
    }
  });
  newExcel.setColumnas(columns);
  newExcel.addData(newBody);
  const date = new Date();
  const todayDate = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  const dateStr = format_Fecha_String(todayDate).replace(/\//g, "");
  const timeStr = formatTime(date).replace(/:/g, "");
  newExcel.guardaReporte(`${nombre}${dateStr}${timeStr}`);};

