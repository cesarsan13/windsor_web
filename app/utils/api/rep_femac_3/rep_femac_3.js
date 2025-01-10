import { ReportePDF } from "../../ReportesPDF";
import { ReporteExcel } from "../../ReportesExcel";
import { formatDate, formatTime, formatFecha, format_Fecha_String } from "../../globalfn";



export const getAlumnosPorMes = async (token, horario, orden) => {
  horario = (horario === undefined || Object.keys(horario).length === 0) ? '' : horario;
  const res = await fetch (`${process.env.DOMAIN_API}api/reportes/rep_femac_3`,{
    method: "post",
    body: JSON.stringify({
      horario: horario,
      orden: orden,
    }),
    headers: new Headers({
      Authorization: "Bearer " + token,
      xescuela: localStorage.getItem("xescuela"),
      "Content-Type": "application/json",
    }),
  });
  const resJson = await res.json();
  return resJson.data;
};

  const Enca1 = (doc) => {
    if (!doc.tiene_encabezado) {
      doc.imprimeEncabezadoPrincipalV();
      doc.nextRow(12);
      doc.ImpPosX("No", 15, doc.tw_ren,0,"R");
      doc.ImpPosX("No.", 25, doc.tw_ren,0,"R");
      doc.ImpPosX("Nombre", 35, doc.tw_ren,0,"L");
      doc.ImpPosX("Año", 130, doc.tw_ren,0,"R");
      doc.ImpPosX("Mes", 140, doc.tw_ren,0,"R");
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
    body.forEach((reporte) => {
      newPDF.ImpPosX(reporte.Num_Renglon.toString() !== "0" ? reporte.Num_Renglon.toString() : "", 15, newPDF.tw_ren,0,"R");
      newPDF.ImpPosX(reporte.Numero_1.toString() !== "0" ? reporte.Numero_1.toString() : "", 25, newPDF.tw_ren,0,"R");
      newPDF.ImpPosX(reporte.Nombre_1.toString() !== "0" ? reporte.Nombre_1.toString() : "", 35, newPDF.tw_ren,0,"L");
      newPDF.ImpPosX(reporte.Año_Nac_1.toString().substring(0, 4) !== "0" ? reporte.Año_Nac_1.toString().substring(0, 4) : "", 130, newPDF.tw_ren,0,"R");
      newPDF.ImpPosX(reporte.Mes_Nac_1.toString().substring(4, 2) !== "0" ? reporte.Mes_Nac_1.toString().substring(4, 2) : "", 140, newPDF.tw_ren,0,"R");

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

  newPDF.guardaReporte(`Reporte_Por_Mes_${dateStr}${timeStr}`);
  }
  
  export const ImprimirExcel = (configuracion)=>{
    const newExcel = new ReporteExcel(configuracion)
    const {columns} = configuracion
    const {body} = configuracion
    const {nombre}=configuracion
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