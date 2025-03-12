import { ReporteExcel } from "@/app/utils/ReportesExcel";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import { calculaDigitoBvba, Elimina_Comas } from "@/app/utils/globalfn";
import { obtenerFechaYHoraActual } from "@/app/utils/globalfn";

export const validarClaveCajero = async (token, data) => {
  let url = `${process.env.DOMAIN_API}api/pagos1/validar-clave-cajero`;
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      cajero: data.cajero,
      clave_cajero: data.clave_cajero,
    }),
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
      xescuela: localStorage.getItem("xescuela"),
    },
  });
  const resJson = await res.json();
  return resJson;
};

export const buscarArticulo = async (token, numero) => {
  let url = `${process.env.DOMAIN_API}api/pagos1/buscar-articulo`;
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      articulo: numero,
    }),
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
      xescuela: localStorage.getItem("xescuela"),
    },
  });
  const resJson = await res.json();
  return resJson;
};

export const buscaDocumento = async (token, data) => {
  let url = `${process.env.DOMAIN_API}api/pagos1/busca-documentos`;
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      alumno: data.alumno,
      productos: data.productos,
      numero_doc: data.numero_doc,
    }),
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
      xescuela: localStorage.getItem("xescuela"),
    },
  });
  const resJson = await res.json();
  return resJson;
};

export const buscaPropietario = async (token, numero) => {
  let url = `${process.env.DOMAIN_API}api/pagos1/busca-propietario`;
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      numero: numero,
    }),
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
      xescuela: localStorage.getItem("xescuela"),
    },
  });
  const resJson = await res.json();
  return resJson.data;
};

export const buscaDocumentosCobranza = async (token, alumno_id) => {
  let url = `${process.env.DOMAIN_API}api/pagos1/busca-doc-cobranza`;
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      alumno: alumno_id,
    }),
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
      xescuela: localStorage.getItem("xescuela"),
    },
  });
  const resJson = await res.json();
  return resJson.data;
};

function formatFecha(fecha) {
  if (!fecha) return 0;
  const [dia, mes, año] = fecha.split("-");
  return `${año}-${mes}-${dia}`;
}

export const guardarDetallePedido = async (token, data) => {
  let url = `${process.env.DOMAIN_API}api/pagos1/guardar-detalle-pedido`;
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      recibo: data.recibo,
      alumno: data.alumno,
      fecha: data.fecha,
      articulo: data.articulo,
      cantidad: data.cantidad,
      precio_unitario: data.precio_unitario,
      descuento: data.descuento,
      documento: data.documento,
      total_general: data.total_general,
    }),
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
      xescuela: localStorage.getItem("xescuela"),
    },
  });
  const resJson = await res.json();
  return resJson;
};

export const guardaEcabYCobrD = async (token, data) => {
  let url = `${process.env.DOMAIN_API}api/pagos1/guarda-EncabYCobrD`;
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      recibo: data.recibo,
      alumno: data.alumno,
      fecha: data.fecha,
      articulo: data.articulo,
      cajero: data.cajero,
      total_neto: data.total_neto,
      n_banco: data.n_banco,
      imp_pago: data.imp_pago,
      referencia_1: data.referencia_1,
      n_banco_2: data.n_banco_2,
      imp_pago_2: data.imp_pago_2,
      referencia_2: data.referencia_2,
      quien_paga: data.quien_paga,
      comenta: data.comenta,
      comentario_ad: data.comentario_ad,
    }),
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
      xescuela: localStorage.getItem("xescuela"),
    },
  });
  const resJson = await res.json();
  return resJson;
};

export const guardarDocumento = async (token, data) => {
  let url = `${process.env.DOMAIN_API}api/pagos1/guarda-documentos`;
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      alumno: data.alumno,
      producto: data.producto,
      numero_doc: data.numero_doc,
      fecha: data.fecha,
      descuento: data.descuento,
      importe: data.importe,
    }),
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
      xescuela: localStorage.getItem("xescuela"),
    },
  });
  const resJson = await res.json();
  return resJson;
};

const Enca2 = (doc) => {
  if (!doc.tiene_encabezado) {
    doc.imprimeEncabezadoPrincipalV();
    doc.nextRow(12);
    doc.ImpPosX("No", 5, doc.tw_ren);
    doc.ImpPosX("Nombre", 20, doc.tw_ren);
    doc.ImpPosX("Estatus", 90, doc.tw_ren);
    doc.ImpPosX("Fecha", 110, doc.tw_ren);
    doc.ImpPosX("Horario", 135, doc.tw_ren);
    doc.ImpPosX("Teléfono", 170, doc.tw_ren);
    doc.nextRow(4);
    doc.printLineF();
    doc.nextRow(4);
    doc.tiene_encabezado = true;
  } else {
    doc.nextRow(6);
    doc.tiene_encabezado = true;
  }
};

export const verImprimir = async (configuracion) => {
  const newPDF = new ReportePDF(configuracion);
  const { body } = configuracion;
  Enca2(newPDF);

  body.forEach((alumno) => {
    const id = calculaDigitoBvba((alumno.id || "").toString() || "");
    const nombre = `${alumno.nombre || ""} ${alumno.a_paterno || ""} ${alumno.a_materno || ""
      }`.substring(0, 20);
    const estatus = (alumno.estatus || "").toString().substring(0, 12);
    const fecha_nac = (alumno.fecha_nac || "").toString().substring(0, 15);
    const horario_1_nombre = (alumno.horario_1_nombre || "")
      .toString()
      .substring(0, 15);
    const telefono = (alumno.telefono_1 || "").toString().substring(0, 15);
    newPDF.ImpPosX(`${alumno.id}-${id}`, 5, newPDF.tw_ren);
    newPDF.ImpPosX(nombre, 20, newPDF.tw_ren);
    newPDF.ImpPosX(estatus, 90, newPDF.tw_ren);
    newPDF.ImpPosX(fecha_nac, 110, newPDF.tw_ren);
    newPDF.ImpPosX(horario_1_nombre, 135, newPDF.tw_ren);
    newPDF.ImpPosX(telefono, 170, newPDF.tw_ren);
    if (alumno.baja === "*") {
      newPDF.tw_ren += 5;
      const fecha_baja = (alumno.fecha_baja || "").toString().substring(0, 15);
      newPDF.ImpPosX(`Fecha de Baja: ${fecha_baja}`, 5, newPDF.tw_ren);
    }
    Enca2(newPDF);
    if (newPDF.tw_ren >= newPDF.tw_endRen) {
      newPDF.pageBreak();
      Enca2(newPDF);
    }
  });
  const pdfData = newPDF.doc.output("datauristring");
  return pdfData;
};

const Enca1 = (doc, body) => {
  if (!doc.tiene_encabezado) {
    doc.imprimeEncabezadoPrincipalP(body, body.fecha);
    doc.nextRow(12);
    doc.ImpPosX("Mat", 15, doc.tw_ren);
    doc.ImpPosX("Alumno", 30, doc.tw_ren);
    doc.ImpPosX("Descripcion", 140, doc.tw_ren);
    doc.ImpPosX("Nom Doctor", 195, doc.tw_ren);
    doc.ImpPosX("Precio", 250, doc.tw_ren);
    doc.ImpPosX("Importe", 270, doc.tw_ren);
    doc.nextRow(4);
    doc.printLineH();
    doc.nextRow(4);
    doc.tiene_encabezado = true;
  } else {
    doc.nextRow(6);
    doc.tiene_encabezado = true;
  }
};

function numeroALetras(num) {
  const unidades = [
    "", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez",
    "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve"
  ];
  const decenas = [
    "", "", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"
  ];
  const centenas = [
    "", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"
  ];
  const miles = [
    "", "mil"
  ];
  if (num === 0) return "cero";
  let letras = "";
  let decimales = 0;
  if (num >= 1000) {
    const mil = Math.floor(num / 1000);
    letras += mil === 1 ? "mil " : `${numeroALetras(mil)} mil `;
    num %= 1000;
  }
  if (num >= 100) {
    const centena = Math.floor(num / 100);
    letras += centenas[centena] + " ";
    num %= 100;
  }
  if (num >= 20) {
    const decena = Math.floor(num / 10);
    letras += decenas[decena] + " ";
    num %= 10;
  }
  if (num > 0) {
    letras += unidades[num];
  }
  if (num % 1 !== 0) {
    decimales = (num % 1).toFixed(2).split('.')[1];

    if (decimales) {
      letras += " con " + decimales + " centavos";
    }
  }
  return letras.trim();
}

export const Imprimir = (configuracion) => {
  const orientacion = "Landscape";
  const newPDF = new ReportePDF(configuracion, orientacion);
  const { body } = configuracion;
  const { encaBody } = configuracion;
  Enca1(newPDF, encaBody);
  body.forEach((pagos) => {
    const alumno = (pagos.alumno_id || "").toString();
    const alumno_nombre = `${pagos.alumno_nombre_completo || ""}`.toString();
    const articulo_id = (pagos.articulo_id || "").toString();
    const articulo_des = (pagos.articulo_nombre || "").toString();
    const nom_doc = (pagos.nom_doc || "").toString().substring(0, 10);
    const cantidad = (pagos.cantidad || "").toString();
    const precio = (pagos.precio || "").toString();
    const importe = (pagos.importe || "").toString();

    newPDF.ImpPosX(`${alumno}`, 23, newPDF.tw_ren, 40, "R");
    newPDF.ImpPosX(alumno_nombre, 30, newPDF.tw_ren, 0, "L");
    newPDF.ImpPosX(articulo_id, 150, newPDF.tw_ren, 0, "R");
    newPDF.ImpPosX(articulo_des, 140, newPDF.tw_ren, 30, "L");
    newPDF.ImpPosX(nom_doc, 215, newPDF.tw_ren, 0, "R");
    newPDF.ImpPosX(cantidad, 240, newPDF.tw_ren, 0, "R");
    newPDF.ImpPosX(precio, 265, newPDF.tw_ren, 0, "R");
    newPDF.ImpPosX(importe, 285, newPDF.tw_ren, 0, "R");
    Enca1(newPDF, encaBody);
    if (newPDF.tw_ren >= newPDF.tw_endRen) {
      newPDF.pageBreak();
      Enca1(newPDF, encaBody);
    }
  });
  newPDF.nextRow(4);
  const num = Elimina_Comas(encaBody.tota_general);
  const totalConLetras = numeroALetras(parseFloat(num));
  newPDF.ImpPosX(`Importe con Letras: ${totalConLetras.toString().toUpperCase()} PESOS`, 15, newPDF.tw_ren);
  newPDF.ImpPosX(`Total: ${encaBody.tota_general}`, 240, newPDF.tw_ren);
  newPDF.nextRow(4);
  newPDF.ImpPosX(
    `Nombre Cajero: ${encaBody.cajero_descripcion}`,
    240,
    newPDF.tw_ren
  );
  const { fecha, hora } = obtenerFechaYHoraActual();
  newPDF.guardaReporte(`Pagos_${fecha}${hora}`);
};

export const ImprimirExcel = (configuracion) => {
  const newExcel = new ReporteExcel(configuracion);
  const { columns } = configuracion;
  const { body } = configuracion;
  const { nombre } = configuracion;
  const newBody = [];
  body.forEach((alumno) => {
    newBody.push({
      ...alumno,
      id: `${alumno.id}-${calculaDigitoBvba(alumno.id.toString())}`,
    });
    if (alumno.baja === "*") {
      newBody.push({
        id: "",
        nombre: "",
        estatus: "",
        fecha_nac: (`Fecha de Baja: ${alumno.fecha_baja}` || "").toString(),
        horario_1_nombre: "",
        telefono_1: "",
      });
    }
  });
  newExcel.setColumnas(columns);
  newExcel.addData(newBody);
  newExcel.guardaReporte(nombre);
};

export const storeBatchDetallePedido = async (token, data) => {

  let url = `${process.env.DOMAIN_API}api/pagos1/guardar-detalle-pedido`;
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
};