import { ReporteExcel } from "@/app/utils/ReportesExcel";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import { formatTime, format_Fecha_String } from "@/app/utils/globalfn";


export const getBecas = async (token, alumno1, alumno2, orden) => {
  alumno1 = (alumno1 === undefined || Object.keys(alumno1).length === 0) ? '' : alumno1;
  alumno2 = (alumno2 === undefined || Object.keys(alumno2).length === 0) ? '' : alumno2;
    const res = await fetch (`${process.env.DOMAIN_API}api/reportes/rep_becas`,{
      method: "post",
      body: JSON.stringify({
        alumno1: alumno1.numero,
        alumno2: alumno2.numero,
        orden: orden,
      }),
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        xescuela: localStorage.getItem("xescuela"),
      },
    });
    
    const resJson = await res.json();
    return resJson;
}

   //Para imprimir
   const Enca1 = (doc) => {
    if (!doc.tiene_encabezado) {
      doc.imprimeEncabezadoPrincipalH();
      doc.nextRow(12);
      doc.ImpPosX("No.",15,doc.tw_ren),
      doc.ImpPosX("Nombre",25,doc.tw_ren),
      doc.ImpPosX("Grado",115,doc.tw_ren),
      doc.ImpPosX("Colegiatura",160,doc.tw_ren),
      doc.ImpPosX("Descuento",190,doc.tw_ren),
      doc.ImpPosX("Saldo",210,doc.tw_ren),
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

      newPDF.ImpPosX(horarios.numero.toString(),15, newPDF.tw_ren);
      newPDF.ImpPosX(horarios.alumno.toString(),25, newPDF.tw_ren);
      newPDF.ImpPosX(horarios.grado.toString(),115, newPDF.tw_ren);
      newPDF.ImpPosX(horarios.colegiatura.toString().substring(0,4),160, newPDF.tw_ren);
      newPDF.ImpPosX(horarios.descuento.toString().substring(4,2),190, newPDF.tw_ren);
      newPDF.ImpPosX(horarios.costo_final.toString(),210, newPDF.tw_ren);

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

  newPDF.guardaReporte(`Rep_Becas_${dateStr}${timeStr}`);
  };

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
