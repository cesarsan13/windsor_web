import { ReportePDF } from "../../ReportesPDF";
import { ReporteExcel } from "../../ReportesExcel";


export const getAlumnosPorMes = async (token, horario, orden) => {
  const horarioFinal1 = horario === "" || horario === undefined ? "" : horario;
  const res = await fetch (`${process.env.DOMAIN_API}api/reportes/rep_femac_3`,{
    method: "post",
    body: JSON.stringify({
      horario: horarioFinal1,
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
      doc.ImpPosX("No", 15, doc.tw_ren);
      doc.ImpPosX("No.", 25, doc.tw_ren);
      doc.ImpPosX("Nombre", 35, doc.tw_ren);
      doc.ImpPosX("Año", 120, doc.tw_ren);
      doc.ImpPosX("Mes", 130, doc.tw_ren);
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
    console.log(body);
    body.forEach((reporte) => {
      newPDF.ImpPosX(reporte.Num_Renglon.toString() !== "0" ? reporte.Num_Renglon.toString() : "", 15, newPDF.tw_ren);
      newPDF.ImpPosX(reporte.Numero_1.toString() !== "0" ? reporte.Numero_1.toString() : "", 25, newPDF.tw_ren);
      newPDF.ImpPosX(reporte.Nombre_1.toString() !== "0" ? reporte.Nombre_1.toString() : "", 35, newPDF.tw_ren);
      newPDF.ImpPosX(reporte.Año_Nac_1.toString().substring(0, 4) !== "0" ? reporte.Año_Nac_1.toString().substring(0, 4) : "", 120, newPDF.tw_ren);
      newPDF.ImpPosX(reporte.Mes_Nac_1.toString().substring(4, 2) !== "0" ? reporte.Mes_Nac_1.toString().substring(4, 2) : "", 130, newPDF.tw_ren);

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