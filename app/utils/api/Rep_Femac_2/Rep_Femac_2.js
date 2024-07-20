import { ReporteExcel } from "../../ReportesExcel";
import { ReportePDF } from "../../ReportesPDF";

export const getHorariosAPC = async (token) => {
    const res = await fetch(`${process.env.DOMAIN_API}api/AlumnosPC/HorariosAPC`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const resJson = await res.json();
    return resJson.data;
};
export const getRepDosSel = async (token, horario1, horario2, orden) => {
    const res = await fetch (`${process.env.DOMAIN_API}api/AlumnosPC/Lista/${horario1}/${horario2}/${orden}`,{
      headers: {
        Authorization: `Bearer ${token}`,
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
          doc.ImpPosX("id", 15, doc.tw_ren);
          doc.ImpPosX("Comentario 1", 30, doc.tw_ren);
          doc.ImpPosX("Comentario 2", 110, doc.tw_ren);
          doc.ImpPosX("Comentario 3", 190, doc.tw_ren);
          doc.ImpPosX("Generales", 270, doc.tw_ren);
    
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
        body.forEach((comentarios) => {
         // newPDF.ImpPosX(comentarios.id.toString(),15,newPDF.tw_ren, 10)

          Enca1(newPDF);
          if (newPDF.tw_ren >= newPDF.tw_endRen) {
            newPDF.pageBreak();
            Enca1(newPDF);
          }
        });
        newPDF.guardaReporte("Comentarios")
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
