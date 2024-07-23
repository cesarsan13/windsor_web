import { ReportePDF } from "../../ReportesPDF";

export const siguiente = async (token) => {
    const res = await fetch(`${process.env.DOMAIN_API}api/RepDosSel/siguiente`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const resJson = await res.json();
    return resJson.data;
  };
  export const guardaRep = async (token, data, accion) => {
    if (accion === "Eliminar" || accion === "Editar") {
      if (accion === "Eliminar") {
        data.baja = "*";
      } else {
        data.baja = "";
      }
      url_api = `${process.env.DOMAIN_API}api/RepDosSel/UpdateRepDosSel/`;
    }
  
    const res = await fetch(`${url_api}`, {
      method: "post",
      body: JSON.stringify({
        numero: data.numero,
        numero_1: data.numero_1,
        nombre_1: data.nombre_1,
        año_nac_1: data.año_nac_1,
        mes_nac_1: data.mes_nac_1,
        telefono_1: data.telefono_1,
        numero_2: data.numero_2,
        nombre_2: data.nombre_2,
        año_nac_2: data.año_nac_2,
        mes_nac_2: data.mes_nac_2,
        telefono_2: data.telefono_2,
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
      doc.imprimeEncabezadoPrincipal();
      doc.nextRow(12);
      doc.ImpPosX("Numero", 14, doc.tw_ren);
      doc.ImpPosX("Nombre", 28, doc.tw_ren);
      doc.ImpPosX("Clave", 62, doc.tw_ren);
      doc.ImpPosX("Telefono", 82, doc.tw_ren);
      doc.ImpPosX("Correo", 112, doc.tw_ren);
      doc.nextRow(4);
      doc.printLine();
      doc.nextRow(4);
      doc.tiene_encabezado = true;
    } else {
      doc.nextRow(6);
      doc.tiene_encabezado = true;
    }
  };
  export const Imprimir = (configuracion) =>{
    const newPDF = new ReportePDF(configuracion);
    const { body } = configuracion;
    Enca1(newPDF);
    body.forEach((reporte) => {
      newPDF.ImpPosX(reporte.numero.toString(), 14, newPDF.tw_ren);
      newPDF.ImpPosX(reporte.numero_1.toString(), 28, newPDF.tw_ren);
      newPDF.ImpPosX(reporte.nombre_1.toString(), 62, newPDF.tw_ren);
      newPDF.ImpPosX(reporte.numero_2.toString(), 82, newPDF.tw_ren);
      newPDF.ImpPosX(reporte.nombre_2.toString(), 112, newPDF.tw_ren);
      Enca1(newPDF);
      if (newPDF.tw_ren >= newPDF.tw_endRen) {
        newPDF.pageBreak();
        Enca1(newPDF);
      }
    });
  
    newPDF.guardaReporte("Reporte");
  }