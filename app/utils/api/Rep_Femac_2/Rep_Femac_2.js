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
          doc.ImpPosX("No.",15,doc.tw_ren),
          doc.ImpPosX("Nombre",30,doc.tw_ren),
          doc.ImpPosX("No. 1",80,doc.tw_ren),
          doc.ImpPosX("Año",95,doc.tw_ren),
          doc.ImpPosX("Mes",110,doc.tw_ren),
          doc.ImpPosX("Telefono",130,doc.tw_ren),
          doc.ImpPosX("Nombre",155,doc.tw_ren),
          doc.ImpPosX("No. 2",205,doc.tw_ren),
          doc.ImpPosX("Año",220,doc.tw_ren),
          doc.ImpPosX("Mes",235,doc.tw_ren),
          doc.ImpPosX("Telefono",250,doc.tw_ren),

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
        body.data1.forEach((h1) => {
          newPDF.ImpPosX(h1.nombre.toString(),30,newPDF.tw_ren, 50);
          newPDF.ImpPosX(h1.id.toString(),80,newPDF.tw_ren, 10);
          newPDF.ImpPosX(h1.año_nac.toString(),95,newPDF.tw_ren, 15);
          newPDF.ImpPosX(h1.mes_nac.toString(),110,newPDF.tw_ren, 15);
          newPDF.ImpPosX(h1.telefono_1.toString(),130,newPDF.tw_ren, 10);
          Enca1(newPDF);
          if (newPDF.tw_ren >= newPDF.tw_endRen) {
            newPDF.pageBreak();
            Enca1(newPDF);
          }
        });

        body.data2.forEach((h2) => {
          newPDF.ImpPosX(h2.nombre.toString(),155,newPDF.tw_ren, 50);
          newPDF.ImpPosX(h2.id.toString(),205,newPDF.tw_ren, 10);
          newPDF.ImpPosX(h2.año_nac.toString(),220,newPDF.tw_ren, 15);
          newPDF.ImpPosX(h2.mes_nac.toString(),235,newPDF.tw_ren, 15);
          newPDF.ImpPosX(h2.telefono_1.toString(),250,newPDF.tw_ren, 10);

          Enca1(newPDF);
          if (newPDF.tw_ren >= newPDF.tw_endRen) {
            newPDF.pageBreak();
            Enca1(newPDF);
          }
        });
        newPDF.guardaReporte("RepDosSec")
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
