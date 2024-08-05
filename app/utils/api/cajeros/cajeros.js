import { useSession } from "next-auth/react";
import { ReportePDF } from "../../ReportesPDF";
import { ReporteExcel } from "../../ReportesExcel";

export const getCajeros = async (token, baja) => {
  let url = "";
  baja
    ? (url = `${process.env.DOMAIN_API}api/Cajero/baja`)
    : (url = `${process.env.DOMAIN_API}api/Cajero/`);

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const resJson = await res.json();
  return resJson.data;
};
export const siguiente = async (token) => {
  const res = await fetch(`${process.env.DOMAIN_API}api/Cajero/siguiente`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const resJson = await res.json();
  return resJson.data;
};
export const guardaCajero = async (token, data, accion) => {
    let url_api = "";
    if (accion === "Alta") {
      url_api = `${process.env.DOMAIN_API}api/Cajero/`;
      data.baja = "";
    }
    if (accion === "Eliminar" || accion === "Editar") {
      if (accion === "Eliminar") {
        data.baja = "*";
      } else {
        data.baja = "";
      }
      url_api = `${process.env.DOMAIN_API}api/Cajero/UpdateCajeros/`;
    }
  
    const res = await fetch(`${url_api}`, {
      method: "post",
      body: JSON.stringify({
        numero: data.numero,
        nombre: data.nombre,
        direccion: data.direccion,
        colonia: data.colonia,
        estado: data.estado,
        telefono: data.telefono,
        fax: data.fax,
        mail: data.mail,
        baja: data.baja,
        fec_cambio: data.fec_cambio,
        clave_cajero: data.clave_cajero,
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
      doc.imprimeEncabezadoPrincipalV();
      doc.nextRow(12);
      doc.ImpPosX("No.", 14, doc.tw_ren);
      doc.ImpPosX("Nombre", 28, doc.tw_ren);
      doc.ImpPosX("Clave", 97, doc.tw_ren);
      doc.ImpPosX("Telefono", 112, doc.tw_ren);
      doc.ImpPosX("Correo", 142, doc.tw_ren);
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
    body.forEach((cajero) => {
      newPDF.ImpPosX(cajero.numero.toString(), 14, newPDF.tw_ren);
      newPDF.ImpPosX(cajero.nombre.toString(), 28, newPDF.tw_ren);
      newPDF.ImpPosX(cajero.clave_cajero.toString(), 97, newPDF.tw_ren);
      newPDF.ImpPosX(cajero.telefono.toString(), 112, newPDF.tw_ren);
      newPDF.ImpPosX(cajero.mail.toString(), 142, newPDF.tw_ren);
      Enca1(newPDF);
      if (newPDF.tw_ren >= newPDF.tw_endRen) {
        newPDF.pageBreak();
        Enca1(newPDF);
      }
    });
  
    newPDF.guardaReporte("Reporte_Cajeros");
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
  