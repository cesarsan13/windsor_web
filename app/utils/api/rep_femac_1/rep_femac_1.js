import { ReporteExcel } from "@/app/utils/ReportesExcel";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import { calculaDigitoBvba } from "@/app/utils/globalfn";

export const getreportAlumn = async (token, baja, tipoOrden, alumnos1, alumnos2) => {
  let url = `${process.env.DOMAIN_API}api/students/report`
  const res = await fetch(url, {
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
    doc.imprimeEncabezadoPrincipalH();
    doc.nextRow(12);
    doc.ImpPosX("No", 15, doc.tw_ren);
    doc.ImpPosX("Nombre", 30, doc.tw_ren);
    doc.ImpPosX("Estatus", 160, doc.tw_ren);
    doc.ImpPosX("Fecha", 180, doc.tw_ren);
    doc.ImpPosX("Horario", 210, doc.tw_ren);
    doc.ImpPosX("Teléfono", 240, doc.tw_ren);
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
  const orientacion = 'Landscape'
  const newPDF = new ReportePDF(configuracion, orientacion);
  const { body } = configuracion;
  Enca1(newPDF);
  body.forEach((alumnos) => {
    const id = calculaDigitoBvba(alumnos.id.toString());
    const nombre = `${alumnos.nombre.toString()} ${alumnos.a_paterno} ${alumnos.a_materno}`.substring(0, 20);
    const estatus = alumnos.estatus.toString().substring(0, 12);
    const fecha_nac = alumnos.fecha_nac.toString().substring(0, 15);
    const horario_1_nombre = alumnos.horario_1_nombre.toString().substring(0, 15);
    const telefono = alumnos.telefono_1.toString().substring(0, 15);
    newPDF.ImpPosX(`${alumnos.id}-${id}`, 15, newPDF.tw_ren);
    newPDF.ImpPosX(nombre, 30, newPDF.tw_ren);
    newPDF.ImpPosX(estatus, 160, newPDF.tw_ren);
    newPDF.ImpPosX(fecha_nac, 180, newPDF.tw_ren);
    newPDF.ImpPosX(horario_1_nombre, 210, newPDF.tw_ren);
    newPDF.ImpPosX(telefono, 240, newPDF.tw_ren);
    Enca1(newPDF);
    if (newPDF.tw_ren >= newPDF.tw_endRen) {
      newPDF.pageBreak();
      Enca1(newPDF);
    }
  });
  newPDF.guardaReporte("Alumnos")
};

export const ImprimirExcel = (configuracion) => {
  const newExcel = new ReporteExcel(configuracion)
  const { columns } = configuracion
  const { body } = configuracion
  const { nombre } = configuracion
  const newBody = body.map((alumno) => ({
    ...alumno,
    id: `${alumno.id}-${calculaDigitoBvba(alumno.id.toString())}`
  }));
  newExcel.setColumnas(columns);
  newExcel.addData(newBody);
  newExcel.guardaReporte(nombre);
}
