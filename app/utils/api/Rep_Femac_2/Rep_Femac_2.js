import { ReporteExcel } from "../../ReportesExcel";
import { ReportePDF } from "../../ReportesPDF";
import { formatDate, formatTime, formatFecha, format_Fecha_String } from "../../globalfn";



export const getRepDosSel = async (token, horario1, horario2, orden) => {
  horario1 = (horario1 === undefined || Object.keys(horario1).length === 0) ? '' : horario1;
  horario2 = (horario2 === undefined || Object.keys(horario2).length === 0) ? '' : horario2;
  const res = await fetch(`${process.env.DOMAIN_API}api/reportes/rep_femac_2`, {
    method: "post",
    body: JSON.stringify({
      horario1: horario1,
      horario2: horario2,
      orden: orden,
    }),
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });

  const resJson = await res.json();
  return resJson.data;
}


//Para imprimir
const Enca1 = (doc) => {
  if (!doc.tiene_encabezado) {
    doc.imprimeEncabezadoPrincipalH();
    doc.nextRow(12);
    doc.ImpPosX("No.", 15, doc.tw_ren, 0, "L"),
      doc.ImpPosX("No. 1", 25, doc.tw_ren, 0, "L"),
      doc.ImpPosX("Nombre", 45, doc.tw_ren, 0, "L"),
      doc.ImpPosX("Año", 120, doc.tw_ren, 0, "L"),
      doc.ImpPosX("Mes", 130, doc.tw_ren, 0, "L"),
      doc.ImpPosX("Telefono", 138, doc.tw_ren, 0, "L"),
      doc.ImpPosX("No. 2", 163, doc.tw_ren, 0, "L"),
      doc.ImpPosX("Nombre", 176, doc.tw_ren, 0, "L"),
      doc.ImpPosX("Año", 250, doc.tw_ren, 0, "L"),
      doc.ImpPosX("Mes", 260, doc.tw_ren, 0, "L"),
      doc.ImpPosX("Telefono", 268, doc.tw_ren, 0, "L"),
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
  const orientacion = 'Landscape'  //Aqui se agrega la orientacion del documento PDF puede ser Landscape(Horizontal) o Portrait (Vertical)
  const newPDF = new ReportePDF(configuracion, orientacion);
  const { body } = configuracion;
  Enca1(newPDF);
  body.forEach((horarios) => {
    newPDF.ImpPosX(horarios.Num_Renglon?.toString() ?? "", 20, newPDF.tw_ren, 0, "R");
    newPDF.ImpPosX(horarios.Numero_1?.toString() ?? "", 27, newPDF.tw_ren, 0, "R");
    newPDF.ImpPosX(horarios.Nombre_1?.toString() ?? "", 45, newPDF.tw_ren, 35, "L");
    newPDF.ImpPosX(horarios.Año_Nac_1?.toString().substring(0, 4) ?? "", 128, newPDF.tw_ren, 0, "R");
    newPDF.ImpPosX(horarios.Mes_Nac_1?.toString().substring(4, 2) ?? "", 137, newPDF.tw_ren, 0, "R");
    newPDF.ImpPosX(horarios.Telefono_1?.toString() ?? "", 158, newPDF.tw_ren, 0, "R");
    newPDF.ImpPosX(horarios.Numero_2?.toString() ?? "", 173, newPDF.tw_ren, 0, "R");
    newPDF.ImpPosX(horarios.Nombre_2?.toString() ?? "", 176, newPDF.tw_ren, 35, "L");
    newPDF.ImpPosX(horarios.Año_Nac_2?.toString().substring(0, 4) ?? "", 259, newPDF.tw_ren, 0, "R");
    newPDF.ImpPosX(horarios.Mes_Nac_2?.toString().substring(4, 2) ?? "", 266, newPDF.tw_ren, 0, "R");
    newPDF.ImpPosX(horarios.Telefono_2?.toString() ?? "", 289, newPDF.tw_ren, 0, "R");
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

  newPDF.guardaReporte(`Lista_Alumnos_Por_Clase${dateStr}${timeStr}`);
};


export const ImprimirExcel = (configuracion) => {
  const newExcel = new ReporteExcel(configuracion)
  const { columns } = configuracion
  const { body } = configuracion
  const { nombre } = configuracion
  newExcel.setColumnas(columns);
  newExcel.addData(body);
  const date = new Date();
  const todayDate = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  const dateStr = format_Fecha_String(todayDate).replace(/\//g, "");
  const timeStr = formatTime(date).replace(/:/g, "");
  newExcel.guardaReporte(`${nombre}${dateStr}${timeStr}`);
}
