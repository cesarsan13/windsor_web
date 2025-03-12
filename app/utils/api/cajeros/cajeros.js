import { ReportePDF } from "@/app/utils/ReportesPDF";
import { ReporteExcel } from "@/app/utils/ReportesExcel";
import { formatTime, format_Fecha_String } from "@/app/utils/globalfn";

export const getCajeros = async (token, baja) => {
  let url = "";
  baja
    ? (url = `${process.env.DOMAIN_API}api/Cajero/baja`)
    : (url = `${process.env.DOMAIN_API}api/Cajero/`);

  const res = await fetch(url, {
    headers: new Headers({
      Authorization: "Bearer " + token,
      xescuela: localStorage.getItem("xescuela"),
    }),
  });
  const resJson = await res.json();
  return resJson.data;
};
export const siguiente = async (token) => {
  const res = await fetch(`${process.env.DOMAIN_API}api/Cajero/siguiente`, {
    headers: new Headers({
      Authorization: "Bearer " + token,
      xescuela: localStorage.getItem("xescuela"),
    }),
  });
  const resJson = await res.json();
  return resJson.data;
};

export const guardaCajero = async (token, data, accion) => {
    let url_api = "";
    if (accion === "Alta") {
      url_api = `${process.env.DOMAIN_API}api/Cajero/store`;
      data.baja = "";
    }
    if (accion === "Eliminar" || accion === "Editar") {
      if (accion === "Eliminar") {
        data.baja = "*";
      } else {
        data.baja = "";
      }
      url_api = `${process.env.DOMAIN_API}api/Cajero/UpdateCajeros`;
    }
   let data_env = JSON.stringify({
    numero: data.numero,
    nombre: data.nombre,
    direccion: data.direccion,
    colonia: data.colonia,
    estado: data.estado,
    telefono: data.telefono,
    fax: data.fax,
    mail: data.mail,
    baja: data.baja,
    clave_cajero: data.clave_cajero
  });
    const res = await fetch(`${url_api}`, {
      method: "post",
      body:data_env,
      headers: new Headers({
        Authorization: "Bearer " + token,
        xescuela: localStorage.getItem("xescuela"),
        "Content-Type": "application/json",
      }),
    });
    const resJson = await res.json();
    return resJson;
  };

  export const storeBatchCajero = async (token, data) => {
    let url = `${process.env.DOMAIN_API}api/Cajero/batch`;
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: new Headers({
        Authorization: "Bearer " + token,
        xescuela: localStorage.getItem("xescuela"),
        "Content-Type": "application/json",
      }),
    });
    const resJson = await res.json();
    return resJson.data;
  }

  const Enca1 = (doc) => {
    if (!doc.tiene_encabezado) {
      doc.imprimeEncabezadoPrincipalV();
      doc.nextRow(12);
      doc.ImpPosX("No.", 14, doc.tw_ren,0,"L");
      doc.ImpPosX("Nombre", 28, doc.tw_ren,0,"L");
      doc.ImpPosX("Clave", 97, doc.tw_ren,0,"L");
      doc.ImpPosX("Telefono", 112, doc.tw_ren,0,"L");
      doc.ImpPosX("Correo", 142, doc.tw_ren,0,"L");
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
      newPDF.ImpPosX(cajero.numero.toString(), 24, newPDF.tw_ren,0,"R");
      newPDF.ImpPosX(cajero.nombre.toString(), 28, newPDF.tw_ren,0,"L");
      newPDF.ImpPosX(cajero.clave_cajero.toString(), 97, newPDF.tw_ren,0,"L");
      newPDF.ImpPosX(cajero.telefono.toString(), 112, newPDF.tw_ren,0,"L");
      newPDF.ImpPosX(cajero.mail.toString(), 142, newPDF.tw_ren,0,"L");
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

  newPDF.guardaReporte(`Cajeros_${dateStr}${timeStr}`);
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
  