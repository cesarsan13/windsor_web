import { ReportePDF } from "../../ReportesPDF";
import { ReporteExcel } from "../../ReportesExcel";


export const getAlumnosPorMes = async (token, horario, orden) => {
  const res = await fetch (`${process.env.DOMAIN_API}api/reportes/rep_femac_3`,{
    method: "post",
    body: JSON.stringify({
      horario: horario,
      orden: orden,
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
      doc.ImpPosX("No", 14, doc.tw_ren);
      doc.ImpPosX("No.", 28, doc.tw_ren);
      doc.ImpPosX("Nombre", 42, doc.tw_ren);
      doc.ImpPosX("Año", 92, doc.tw_ren);
      doc.ImpPosX("Mes", 122, doc.tw_ren);
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
      newPDF.ImpPosX(reporte.Num_Renglon.toString() !== "0" ? reporte.Num_Renglon.toString() : "", 14, newPDF.tw_ren);
      newPDF.ImpPosX(reporte.Numero_1.toString() !== "0" ? reporte.Numero_1.toString() : "", 28, newPDF.tw_ren);
      newPDF.ImpPosX(reporte.Nombre_1.toString() !== "0" ? reporte.Nombre_1.toString() : "", 42, newPDF.tw_ren);
      newPDF.ImpPosX(reporte.Año_Nac_1.toString().substring(0, 4) !== "0" ? reporte.Año_Nac_1.toString().substring(0, 4) : "", 92, newPDF.tw_ren);
      newPDF.ImpPosX(reporte.Mes_Nac_1.toString().substring(4, 2) !== "0" ? reporte.Mes_Nac_1.toString().substring(4, 2) : "", 122, newPDF.tw_ren);
  
      Enca1(newPDF);
      if (newPDF.tw_ren >= newPDF.tw_endRen) {
        newPDF.pageBreak();
        Enca1(newPDF);
      }
    });
  
    newPDF.guardaReporte("ReportePorMes");
  }
  
  export const ImprimirExcel = (configuracion)=>{
    const newExcel = new ReporteExcel(configuracion)
    const {columns} = configuracion
    const {body} = configuracion
    const {nombre}=configuracion
    newExcel.setColumnas(columns);
    newExcel.addData(body);
    newExcel.guardaReporte(nombre);
  }