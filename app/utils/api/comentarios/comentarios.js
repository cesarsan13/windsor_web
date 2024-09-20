import { ReporteExcel } from "../../ReportesExcel";
import { ReportePDF } from "../../ReportesPDF";

export const getComentarios = async (token, baja) => {
  let url = "";
  baja
    ? (url = `${process.env.DOMAIN_API}api/comentarios/baja`)
    : (url = `${process.env.DOMAIN_API}api/comentarios`);

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const resJson = await res.json();
  return resJson.data;
};
export const siguiente = async (token) => {
  const res = await fetch(`${process.env.DOMAIN_API}api/comentarios/siguiente`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const resJson = await res.json();
  return resJson.data;
};
export const guardaComentarios = async (token, data, accion) => {
    let url_api = "";
    if (accion === "Alta") {
      url_api = `${process.env.DOMAIN_API}api/comentarios`;
      data.baja = "";
    }
    if (accion === "Eliminar" || accion === "Editar") {
      if (accion === "Eliminar") {
        data.baja = "*";
      } else {
        data.baja = "";
      }
      url_api = `${process.env.DOMAIN_API}api/comentarios/update`;
    }
  
    const res = await fetch(`${url_api}`, {
      method: "post",
      body: JSON.stringify({
        numero: data.numero,
        comentario_1: data.comentario_1,
        comentario_2: data.comentario_2,
        comentario_3: data.comentario_3,
        generales: data.generales,
        baja: data.baja,
      }),
      headers: new Headers({
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      }),
    });
    const resJson = await res.json();
    return resJson;
  };


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
      newPDF.ImpPosX(comentarios.numero.toString(),15,newPDF.tw_ren, 10);
      newPDF.ImpPosX(comentarios.comentario_1.toString(),30,newPDF.tw_ren, 40);
      newPDF.ImpPosX(comentarios.comentario_2.toString(),110,newPDF.tw_ren, 40);
      newPDF.ImpPosX(comentarios.comentario_3.toString(),190,newPDF.tw_ren, 40);
      let resultado = (comentarios.generales == 1) ? "Si" : (comentarios.generales == 0) ? "No": "No valido";
      newPDF.ImpPosX(resultado.toString(),270,newPDF.tw_ren, 5);
      Enca1(newPDF);
      if (newPDF.tw_ren >= newPDF.tw_endRenH) {
        newPDF.pageBreakH();
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