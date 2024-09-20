import { ReporteExcel } from "@/app/utils/ReportesExcel";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import { calculaDigitoBvba } from "@/app/utils/globalfn";

export const getreportAlumn = async (token, baja, tipoOrden, alumnos1, alumnos2) => {
  const res = await fetch(`${process.env.DOMAIN_API}api/students/report`, {
    method: "post",
    body: JSON.stringify({
      baja: baja,
      tipoOrden: tipoOrden,
      alumnos1: alumnos1,
      alumnos2: alumnos2,
    }),
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json"
    } 
  })
  const resJson = await res.json();
  return resJson.data;
}


const Enca1 = (doc) => {
  if (!doc.tiene_encabezado) {
    doc.imprimeEncabezadoPrincipalV();
    doc.nextRow(12);
    doc.ImpPosX("No", 15, doc.tw_ren);
    doc.ImpPosX("Nombre", 25, doc.tw_ren);
    doc.ImpPosX("Estatus", 105, doc.tw_ren);
    doc.ImpPosX("Fecha", 125, doc.tw_ren);
    doc.ImpPosX("Horario", 150, doc.tw_ren);
    doc.ImpPosX("Teléfono", 175, doc.tw_ren);
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
    newPDF.ImpPosX(`${alumnos.numero}-${id}`, 15, newPDF.tw_ren);
    newPDF.ImpPosX(nombre, 25, newPDF.tw_ren);
    newPDF.ImpPosX(estatus, 105, newPDF.tw_ren);
    newPDF.ImpPosX(fecha_nac, 125, newPDF.tw_ren);
    newPDF.ImpPosX(horario_1_nombre, 150, newPDF.tw_ren);
    newPDF.ImpPosX(telefono, 175, newPDF.tw_ren);
    if (alumnos.baja === '*') {
      newPDF.tw_ren += 5;
      const fecha_baja = ((alumnos.fecha_baja || '')).toString().substring(0, 15);
      newPDF.ImpPosX(`Fecha de Baja: ${fecha_baja}`, 15, newPDF.tw_ren);
    }
    Enca1(newPDF);
    if (newPDF.tw_ren >= newPDF.tw_endRen) {
      newPDF.pageBreak();
      Enca1(newPDF);
    }
  });
  newPDF.guardaReporte("Relación general de alumnos")
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
  newExcel.guardaReporte(nombre);
};

