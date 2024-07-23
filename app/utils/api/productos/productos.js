import { ReporteExcel } from "../../ReportesExcel";
import { ReportePDF } from "../../ReportesPDF";

export const getProductos = async (token, baja) => {
  let url = "";
  baja
    ? (url = `http://127.0.0.1:8000/api/product/bajas`)
    : (url = `http://127.0.0.1:8000/api/product`);
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const resJson = await res.json();
  return resJson.data;
};

export const getLastProduct = async (token) => {
  let url = `http://127.0.0.1:8000/api/product/last`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
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
  let url = `http://127.0.0.1:8000/api/product/filter/${tipo}/${valor}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const resJson = await res.json();
  return resJson.data;
};

export const guardarProductos = async (token, data, accion) => {
  console.log("data desde modal si no", data);
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
    url = `${process.env.DOMAIN_API}api/product/update/${data.id}`;
    met = "put";
  }
  const res = await fetch(`${url}`, {
    method: met,
    body: JSON.stringify({
      id: data.id,
      descripcion: data.descripcion,
      costo: data.costo,
      frecuencia: data.frecuencia,
      pro_recargo: data.pro_recargo,
      aplicacion: data.aplicacion,
      iva: data.iva,
      cond_1: data.cond_1,
      cam_precio: data.cam_precio,
      precio: data.precio,
      ref: data.ref,
      baja: data.baja,
    }),
    headers: new Headers({
      // Authorization: "Bearer " + token,
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
    doc.ImpPosX("Descripcion", 28, doc.tw_ren);
    doc.ImpPosX("costo", 58, doc.tw_ren);
    doc.ImpPosX("Frecuencia", 72, doc.tw_ren);
    doc.ImpPosX("Recargo", 102, doc.tw_ren);
    doc.ImpPosX("Aplicacion", 117, doc.tw_ren);
    doc.ImpPosX("IVA", 139, doc.tw_ren);
    doc.ImpPosX("Condicion", 149, doc.tw_ren);
    doc.ImpPosX("Cambio \nPrecio", 169, doc.tw_ren);
    doc.ImpPosX("Referencia", 184, doc.tw_ren);
    doc.nextRow(4);
    doc.printLine();
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
  body.forEach((producto) => {
    newPDF.ImpPosX(producto.id.toString(), 14, newPDF.tw_ren);
    newPDF.ImpPosX(producto.descripcion.toString(), 28, newPDF.tw_ren);
    newPDF.ImpPosX(producto.costo.toString(), 58, newPDF.tw_ren);
    newPDF.ImpPosX(producto.frecuencia.toString(), 72, newPDF.tw_ren);
    newPDF.ImpPosX(producto.pro_recargo.toString(), 102, newPDF.tw_ren);
    newPDF.ImpPosX(producto.aplicacion.toString(), 117, newPDF.tw_ren);
    newPDF.ImpPosX(producto.iva.toString(), 139, newPDF.tw_ren);
    newPDF.ImpPosX(producto.cond_1.toString(), 149, newPDF.tw_ren);
    const cam_precio = producto.cam_precio ? "Si" : "No";
    newPDF.ImpPosX(cam_precio.toString(), 169, newPDF.tw_ren);
    console.log(cam_precio);
    newPDF.ImpPosX(producto.ref.toString(), 184, newPDF.tw_ren);
    Enca1(newPDF);
    if (newPDF.tw_ren >= newPDF.tw_endRen) {
      newPDF.pageBreak();
      Enca1(newPDF);
    }
  });
  newPDF.guardaReporte("Productos");
  // console.log("cambios")
};

export const ImprimirExcel = (configuracion) => {
  const newExcel = new ReporteExcel(configuracion);
  const { columns } = configuracion;
  const { body } = configuracion;
  const { nombre } = configuracion;
  newExcel.setColumnas(columns);
  newExcel.setCondition("cam_precio", (value) => value === 1);
  newExcel.addData(body);
  newExcel.guardaReporte(nombre);
};
