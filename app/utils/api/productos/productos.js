import { ReporteExcel } from "@/app/utils/ReportesExcel";
import { ReportePDF } from "../../ReportesPDF";
import { formatDate, formatFecha, formatTime } from "../../globalfn";

export const getProductos = async (token, baja) => {
  let url = "";
  baja
    ? (url = `${process.env.DOMAIN_API}api/product/bajas`)
    : (url = `${process.env.DOMAIN_API}api/product`);
  const res = await fetch(url, {
    headers: new Headers({
      Authorization: "Bearer " + token,
      xescuela: localStorage.getItem("xescuela"),
      "Content-Type": "application/json",
    }),
  });
  const resJson = await res.json();
  return resJson.data;
};

export const getLastProduct = async (token) => {
  let url = `${process.env.DOMAIN_API}api/product/last`;
  const res = await fetch(url, {
    headers: new Headers({
      Authorization: "Bearer " + token,
      xescuela: localStorage.getItem("xescuela"),
      "Content-Type": "application/json",
    }),
  });
  const resJson = await res.json();
  return resJson.data;
};

export const filtroProductos = async (token, tipo, valor) => {
  if (!tipo) {
    tipo = "nothing";
  }
  if (!valor) {
    valor = "nothing";
  }
  let url = `${process.env.DOMAIN_API}api/product/filter/${tipo}/${valor}`;
  const res = await fetch(url, {
    method: "GET",
    headers: new Headers({
      Authorization: "Bearer " + token,
      xescuela: localStorage.getItem("xescuela"),
      "Content-Type": "application/json",
    }),
  });
  const resJson = await res.json();
  return resJson.data;
};

export const storeBatchProduct = async (token, data) => {
  let url = `${process.env.DOMAIN_API}api/product/batch`;
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
  return resJson;
};

export const guardarProductos = async (token, data, accion) => {
  let url = "";
  let met = "";
  if (accion === "Alta") {
    url = `${process.env.DOMAIN_API}api/product/save`;
    data.baja = "n";
    met = "post";
  }
  if (accion === "Eliminar" || accion === "Editar") {
    if (accion === "Eliminar") {
      data.baja = "*";
    } else {
      data.baja = "n";
    }
    url = `${process.env.DOMAIN_API}api/product/update/${data.numero}`;
    met = "put";
  }
  const res = await fetch(`${url}`, {
    method: met,
    body: JSON.stringify({
      numero: data.numero,
      descripcion: data.descripcion,
      costo: data.costo,
      frecuencia: data.frecuencia,
      por_recargo: data.por_recargo,
      aplicacion: data.aplicacion,
      iva: data.iva,
      cond_1: data.cond_1,
      cam_precio: data.cam_precio,
      precio: data.precio,
      ref: data.ref,
      baja: data.baja,
    }),
    headers: new Headers({
      Authorization: "Bearer " + token,
      xescuela: localStorage.getItem("xescuela"),
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
    doc.ImpPosX("No.", 14, doc.tw_ren);
    doc.ImpPosX("Descripcion", 28, doc.tw_ren);
    doc.ImpPosX("Costo", 80, doc.tw_ren);
    doc.ImpPosX("Frecuencia", 100, doc.tw_ren);
    doc.ImpPosX("Recargo", 130, doc.tw_ren);
    doc.ImpPosX("Aplicacion", 150, doc.tw_ren);
    doc.ImpPosX("IVA", 175, doc.tw_ren);
    doc.ImpPosX("Condicion", 190, doc.tw_ren);
    doc.ImpPosX("Cambio Precio", 215, doc.tw_ren);
    doc.ImpPosX("Referencia", 250, doc.tw_ren);
    doc.nextRow(4);
    doc.printLineH();
    doc.nextRow(4);
    doc.tiene_encabezado = true;
  } else {
    doc.nextRow(6);
    doc.tiene_encabezado = true;
  }
};

export const Imprimir = (configuracion) => {
  const newPDF = new ReportePDF(configuracion, "Landscape");
  const { body } = configuracion;
  Enca1(newPDF);
  body.forEach((producto) => {
    newPDF.ImpPosX(producto.numero.toString(), 24, newPDF.tw_ren, 0, "R");
    newPDF.ImpPosX(producto.descripcion.toString(), 28, newPDF.tw_ren, 25, "L");
    newPDF.ImpPosX(producto.costo.toString(), 93, newPDF.tw_ren, 0, "R");
    newPDF.ImpPosX(producto.frecuencia.toString(), 100, newPDF.tw_ren, 0, "L");
    newPDF.ImpPosX(producto.por_recargo.toString(), 143, newPDF.tw_ren, 0, "R");
    newPDF.ImpPosX(producto.aplicacion.toString(), 150, newPDF.tw_ren, 0, "L");
    newPDF.ImpPosX(producto.iva.toString(), 183, newPDF.tw_ren, 0, "R");
    newPDF.ImpPosX(producto.cond_1.toString(), 203, newPDF.tw_ren, 0, "R");
    const cam_precio = producto.cam_precio ? "Si" : "No";
    newPDF.ImpPosX(cam_precio.toString(), 215, newPDF.tw_ren, 0, "L");
    newPDF.ImpPosX(producto.ref.toString(), 250, newPDF.tw_ren, 0, "L");
    Enca1(newPDF);
    if (newPDF.tw_ren >= newPDF.tw_endRenH) {
      newPDF.pageBreakH();
      Enca1(newPDF);
    }
  });
  const date = new Date();
  const dateStr = formatDate(date);
  const timeStr = formatTime(date);
  // console.log("dateStr:",dateStr," timeStr:",timeStr)
  newPDF.guardaReporte(
    `Productos_${dateStr.replaceAll("/", "")}_${timeStr.replaceAll(":", "")}`
  );
};

export const ImprimirExcel = (configuracion) => {
  const newExcel = new ReporteExcel(configuracion);
  const { columns } = configuracion;
  const { body } = configuracion;
  const { nombre } = configuracion;
  newExcel.setColumnas(columns);
  newExcel.setCondition("cam_precio", (value) => value === 1);
  newExcel.addData(body);
  const date = new Date();
  const dateStr = formatDate(date);
  const timeStr = formatTime(date);
  newExcel.guardaReporte(
    `${nombre}_${dateStr.replaceAll("/", "")}_${timeStr.replaceAll(":", "")}`
  );
};
