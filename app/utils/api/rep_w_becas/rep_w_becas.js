import { ReporteExcel } from "../../ReportesExcel";
import { ReportePDF } from "../../ReportesPDF";


export const getBecas = async (token, horario1, horario2, orden) => {
  horario1 = (horario1 === undefined || Object.keys(horario1).length === 0) ? '' : horario1;
  horario2 = (horario2 === undefined || Object.keys(horario2).length === 0) ? '' : horario2;
    const res = await fetch (`${process.env.DOMAIN_API}api/reportes/rep_becas`,{
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
    newPDF.guardaReporte("RepBecas")
  };

  export const ImprimirExcel = (configuracion)=>{
    const newExcel = new ReporteExcel(configuracion)
    const {columns} = configuracion
    const {body} = configuracion
    const {nombre}=configuracion
    newExcel.setColumnas(columns);
    newExcel.addData(body);
    newExcel.guardaReporte(nombre);
  }
