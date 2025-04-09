import { format_Fecha_String, formatNumber, formatTime } from "@/app/utils/globalfn";
import { ReporteExcel } from "@/app/utils/ReportesExcel";
import { ReportePDF } from "@/app/utils/ReportesPDF";

export const ImprimirExcel = (configuracion, cajero) => {
  const newExcel = new ReporteExcel(configuracion);
  const { columns1 } = configuracion;
  const { columns2 } = configuracion;
  const { columns3 } = configuracion;
  const { body1 } = configuracion;
  const Tw_Pago = Array.from({ length: 100 }, () => Array(2).fill(0));
  if (cajero === 0 || cajero === undefined) {
    let atr_ant = 0;
    let tot_ant = 0;
    let atr_des_ant = "";
    let importe_cobro = 0;
    let total_productos = 0;
    let productos = [];

    body1.forEach((producto) => {
      if (atr_ant !== producto.articulo && atr_ant !== 0) {
        productos.push({
          articulo: atr_ant,
          descripcion: atr_des_ant,
          precio_unitario: tot_ant,
        });
        total_productos = total_productos + tot_ant;
      }
      importe_cobro = roundNumber(
        producto.precio_unitario -
          producto.precio_unitario * (producto.descuento / 100),
        2
      );
      importe_cobro = importe_cobro * producto.cantidad;
      tot_ant = tot_ant + importe_cobro;
      atr_ant = producto.articulo;
      atr_des_ant = producto.descripcion;
    });
    total_productos = total_productos + tot_ant;
    productos.push({
      articulo: atr_ant,
      descripcion: atr_des_ant,
      precio_unitario: tot_ant,
    });
    productos.push({
      articulo: "",
      descripcion: "Total Productos",
      precio_unitario: total_productos,
    });
    productos.push({
      articulo: "",
      descripcion: "",
      precio_unitario: 0.0,
    });
    newExcel.setColumnas(columns1);
    newExcel.addData(productos);
  }
  const { body2 } = configuracion;
  if (body2.length > 0) {
    let tipo_pago = [];

    for (let Tw_count = 0; Tw_count < 20; Tw_count++) {
      Tw_Pago[Tw_count][0] = 0;
      Tw_Pago[Tw_count][1] = 0;
      Tw_Pago[Tw_count][2] = "";
    }
    body2.forEach((tipoPago) => {
      for (let Tw_count = 0; Tw_count < 20; Tw_count++) {
        if (tipoPago.tipo_pago_1 === 0) break;
        if (Tw_Pago[Tw_count][0] === tipoPago.tipo_pago_1) {
          Tw_Pago[Tw_count][1] =
            Number(Tw_Pago[Tw_count][1]) + Number(tipoPago.importe_pago_1);
          break;
        }
        if (Tw_Pago[Tw_count][0] === 0) {
          Tw_Pago[Tw_count][0] = tipoPago.tipo_pago_1;
          Tw_Pago[Tw_count][1] = tipoPago.importe_pago_1;
          Tw_Pago[Tw_count][2] = tipoPago.descripcion1;
          break;
        }
      }
      for (let Tw_count = 0; Tw_count < 20; Tw_count++) {
        if (tipoPago.tipo_pago_2 === 0) break;
        if (Tw_Pago[Tw_count][0] === tipoPago.tipo_pago_2) {
          Tw_Pago[Tw_count][1] =
            Number(Tw_Pago[Tw_count][1]) + Number(tipoPago.importe_pago_2);
          break;
        }
        if (Tw_Pago[Tw_count][0] === 0) {
          Tw_Pago[Tw_count][0] = tipoPago.tipo_pago_2;
          Tw_Pago[Tw_count][1] = tipoPago.importe_pago_2;
          Tw_Pago[Tw_count][2] = tipoPago.descripcion2;
          break;
        }
      }
    });
    let total_tipo_pago = 0;
    for (let Tw_count = 0; Tw_count < 20; Tw_count++) {
      if (Tw_Pago[Tw_count][0] === 0) break;
      tipo_pago.push({
        tipo_pago: Tw_Pago[Tw_count][0],
        descripcion: Tw_Pago[Tw_count][2],
        importe: Tw_Pago[Tw_count][1],
      });
      total_tipo_pago = total_tipo_pago + Number(Tw_Pago[Tw_count][1]);
    }
    tipo_pago.push({
      tipo_pago: "",
      descripcion: "Total Tipo Pago",
      importe: total_tipo_pago,
    });
    tipo_pago.push({
      tipo_pago: "",
      descripcion: "",
      importe: "",
    });
    newExcel.setColumnas(columns2);
    newExcel.addData(tipo_pago);
  } else {
    let tipo_pago = [];
    tipo_pago.push({
      tipo_pago: "",
      descripcion: "",
      importe: "",
    });
    tipo_pago.push({
      tipo_pago: "",
      descripcion: "Total Tipo Pago",
      importe: 0.0,
    });
    tipo_pago.push({
      tipo_pago: "",
      descripcion: "",
      importe: "",
    });
    newExcel.setColumnas(columns2);
    newExcel.addData(tipo_pago);
  }
  const { body3 } = configuracion;
  if (body3.length > 0) {
    let cajero_ant = 0;
    let tot_cajero = 0;
    let cajero_desc_ant = "";
    let total_cajero = 0;
    let cajeros = [];

    body3.forEach((cajero) => {
      if (cajero_ant !== cajero.cajero && cajero_ant !== 0) {
        cajeros.push({
          cajero: cajero_ant,
          descripcion: cajero_desc_ant,
          importe: tot_cajero,
        });
      }
      tot_cajero = Number(tot_cajero) + Number(cajero.importe_cobro);
      cajero_ant = cajero.cajero;
      cajero_desc_ant = cajero.nombre;
    });
    total_cajero = total_cajero + tot_cajero;
    cajeros.push({
      cajero: cajero_ant,
      descripcion: cajero_desc_ant,
      importe: tot_cajero,
    });
    cajeros.push({
      cajero: "",
      descripcion: "Total Cajeros",
      importe: total_cajero,
    });
    newExcel.setColumnas(columns3);
    newExcel.addData(cajeros);
  } else {
    let cajeros = [];
    cajeros.push({
      cajero: "",
      descripcion: "",
      importe: 0.0,
    });
    cajeros.push({
      cajero: "",
      descripcion: "Total Cajeros",
      importe: 0,
    });
    cajeros.push({
      cajero: "",
      descripcion: "",
      importe: 0.0,
    });

    newExcel.setColumnas(columns3);
    newExcel.addData(cajeros);
  }
  const { nombre } = configuracion;
  const date = new Date();
  const todayDate = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  const dateStr = format_Fecha_String(todayDate).replace(/\//g, "");
  const timeStr = formatTime(date).replace(/:/g, "");
  newExcel.guardaReporte(`${nombre}${dateStr}${timeStr}`);
};

export const Imprimir = (configuracion, cajero) => {
  const newPDF = new ReportePDF(configuracion);
  const { body } = configuracion;
  Enca1(newPDF);
  const Tw_Pago = Array.from({ length: 100 }, () => Array(2).fill(0));
  //producto
  if (cajero === 0 || cajero === undefined) {
    if (body.producto.length > 0) {
      newPDF.ImpPosX("Producto", 14, newPDF.tw_ren, 0,"L");
      newPDF.ImpPosX("Descripcion", 34, newPDF.tw_ren, 0,"L");
      newPDF.ImpPosX("Importe", 154, newPDF.tw_ren, 0,"L");
      newPDF.nextRow(4);
      let atr_ant = 0;
      let tot_ant = 0;
      let atr_des_ant = "";
      let importe_cobro = 0;
      let total_productos = 0;
      body.producto.forEach((producto) => {
        if (atr_ant !== producto.articulo && atr_ant !== 0) {
          newPDF.ImpPosX(atr_ant.toString(), 27, newPDF.tw_ren, 0,"R");
          newPDF.ImpPosX(atr_des_ant.toString(), 34, newPDF.tw_ren, 0,"L");
          newPDF.ImpPosX(formatNumber(tot_ant), 166, newPDF.tw_ren, 0,"R");
          total_productos = total_productos + tot_ant;
          Enca1(newPDF);
          if (newPDF.tw_ren >= newPDF.tw_endRen) {
            newPDF.pageBreak();
            Enca1(newPDF);
          }
        }
        importe_cobro = roundNumber(
          producto.precio_unitario -
            producto.precio_unitario * (producto.descuento / 100),
          2
        );
        importe_cobro = importe_cobro * producto.cantidad;
        tot_ant = tot_ant + importe_cobro;
        atr_ant = producto.articulo;
        atr_des_ant = producto.descripcion;
      });
      total_productos = total_productos + tot_ant;
      newPDF.ImpPosX(atr_ant.toString(), 27, newPDF.tw_ren, 0,"R");
      newPDF.ImpPosX(atr_des_ant.toString(), 34, newPDF.tw_ren, 0,"L");
      newPDF.ImpPosX(formatNumber(tot_ant), 166, newPDF.tw_ren, 0,"R");
      newPDF.nextRow(5);
      newPDF.ImpPosX("Total Productos", 34, newPDF.tw_ren);
      newPDF.ImpPosX(formatNumber(total_productos), 166, newPDF.tw_ren, 0,"R");
      newPDF.nextRow(15);
    } else {
      newPDF.ImpPosX("Producto", 14, newPDF.tw_ren, 0,"L");
      newPDF.ImpPosX("Descripcion", 34, newPDF.tw_ren, 0,"L");
      newPDF.ImpPosX("Importe", 154, newPDF.tw_ren, 0,"L");
      newPDF.nextRow(5);
      let total_productos = 0;
      newPDF.ImpPosX("Total Productos", 34, newPDF.tw_ren, 0,"L");
      newPDF.ImpPosX(formatNumber(total_productos), 166, newPDF.tw_ren, 0,"R");
      newPDF.nextRow(15);
    }
  }
  //tipo cobro
  for (let Tw_count = 0; Tw_count < 20; Tw_count++) {
    Tw_Pago[Tw_count][0] = 0;
    Tw_Pago[Tw_count][1] = 0;
    Tw_Pago[Tw_count][2] = "";
  }
  if (body.tipo_pago.length > 0) {
    newPDF.ImpPosX("Tipo Pago", 14, newPDF.tw_ren, 0,"L");
    newPDF.ImpPosX("Descripcion", 34, newPDF.tw_ren, 0,"L");
    newPDF.ImpPosX("Importe", 154, newPDF.tw_ren, 0,"L");
    newPDF.nextRow(4);
    body.tipo_pago.forEach((tipoPago) => {
      for (let Tw_count = 0; Tw_count < 20; Tw_count++) {
        if (tipoPago.tipo_pago_1 === 0) break;
        if (Tw_Pago[Tw_count][0] === tipoPago.tipo_pago_1) {
          Tw_Pago[Tw_count][1] =
            Number(Tw_Pago[Tw_count][1]) + Number(tipoPago.importe_pago_1);
          break;
        }
        if (Tw_Pago[Tw_count][0] === 0) {
          Tw_Pago[Tw_count][0] = tipoPago.tipo_pago_1;
          Tw_Pago[Tw_count][1] = tipoPago.importe_pago_1;
          Tw_Pago[Tw_count][2] = tipoPago.descripcion1;
          break;
        }
      }
      for (let Tw_count = 0; Tw_count < 20; Tw_count++) {
        if (tipoPago.tipo_pago_2 === 0) break;
        if (Tw_Pago[Tw_count][0] === tipoPago.tipo_pago_2) {
          Tw_Pago[Tw_count][1] =
            Number(Tw_Pago[Tw_count][1]) + Number(tipoPago.importe_pago_2);
          break;
        }
        if (Tw_Pago[Tw_count][0] === 0) {
          Tw_Pago[Tw_count][0] = tipoPago.tipo_pago_2;
          Tw_Pago[Tw_count][1] = tipoPago.importe_pago_2;
          Tw_Pago[Tw_count][2] = tipoPago.descripcion2;
          break;
        }
      }
    });
    let total_tipo_pago = 0;
    for (let Tw_count = 0; Tw_count < 20; Tw_count++) {
      if (Tw_Pago[Tw_count][0] === 0) break;
      newPDF.ImpPosX(Tw_Pago[Tw_count][0].toString(), 30, newPDF.tw_ren, 0,"R");
      newPDF.ImpPosX(Tw_Pago[Tw_count][2].toString(), 34, newPDF.tw_ren, 0,"L");
      newPDF.ImpPosX(formatNumber(Tw_Pago[Tw_count][1]), 166, newPDF.tw_ren, 0,"R");
      total_tipo_pago = total_tipo_pago + Number(Tw_Pago[Tw_count][1]);
      Enca1(newPDF);
      if (newPDF.tw_ren >= newPDF.tw_endRen) {
        newPDF.pageBreak();
        Enca1(newPDF);
      }
    }
    newPDF.ImpPosX("Total Tipo Pago", 34, newPDF.tw_ren, 0,"L");
    newPDF.ImpPosX(formatNumber(total_tipo_pago), 166, newPDF.tw_ren, 0,"R");
    newPDF.nextRow(15);
  } else {
    newPDF.ImpPosX("Tipo Pago", 14, newPDF.tw_ren, 0,"L");
    newPDF.ImpPosX("Descripcion", 34, newPDF.tw_ren, 0,"L");
    newPDF.ImpPosX("Importe", 154, newPDF.tw_ren, 0,"L");
    newPDF.nextRow(5);
    let total_tipo_pago = 0;
    newPDF.ImpPosX("Total Tipo Pago", 34, newPDF.tw_ren, 0,"L");
    newPDF.ImpPosX(formatNumber(total_tipo_pago), 166, newPDF.tw_ren, 0,"R");
    newPDF.nextRow(15);
  }
  if (body.cajeros.length > 0) {
    newPDF.ImpPosX("Cajero", 14, newPDF.tw_ren, 0,"L");
    newPDF.ImpPosX("Descripcion", 34, newPDF.tw_ren, 0,"L");
    newPDF.ImpPosX("Importe", 154, newPDF.tw_ren, 0,"L");
    newPDF.nextRow(4);
    let cajero_ant = 0;
    let tot_cajero = 0;
    let cajero_desc_ant = "";
    let total_cajero = 0;
    body.cajeros.forEach((cajero) => {
      if (cajero_ant !== cajero.cajero && cajero_ant !== 0) {
        newPDF.ImpPosX(cajero_ant.toString(), 24, newPDF.tw_ren, 0,"R");
        newPDF.ImpPosX(cajero_desc_ant.toString(), 34, newPDF.tw_ren, 0,"L");
        newPDF.ImpPosX(formatNumber(tot_cajero), 166, newPDF.tw_ren, 0,"R");
        total_cajero = total_cajero + tot_cajero;
        Enca1(newPDF);
        if (newPDF.tw_ren >= newPDF.tw_endRen) {
          newPDF.pageBreak();
          Enca1(newPDF);
        }
      }
      tot_cajero = Number(tot_cajero) + Number(cajero.importe_cobro);
      cajero_ant = cajero.cajero;
      cajero_desc_ant = cajero.nombre;
    });
    total_cajero = total_cajero + tot_cajero;
    newPDF.ImpPosX(cajero_ant.toString(), 24, newPDF.tw_ren, 0,"R");
    newPDF.ImpPosX(cajero_desc_ant.toString(), 34, newPDF.tw_ren, 0,"L");
    newPDF.ImpPosX(formatNumber(tot_cajero), 166, newPDF.tw_ren, 0,"R");
    newPDF.nextRow(5);
    newPDF.ImpPosX("Total Cajeros", 34, newPDF.tw_ren, 0,"L");
    newPDF.ImpPosX(formatNumber(total_cajero), 166, newPDF.tw_ren, 0,"R");
  } else {
    newPDF.ImpPosX("Cajero", 14, newPDF.tw_ren, 0,"L");
    newPDF.ImpPosX("Descripcion", 34, newPDF.tw_ren, 0,"L");
    newPDF.ImpPosX("Importe", 154, newPDF.tw_ren, 0,"L");
    newPDF.nextRow(4);
    let total_cajero = 0;
    newPDF.ImpPosX("Total Cajeros", 34, newPDF.tw_ren, 0,"L");
    newPDF.ImpPosX(formatNumber(total_cajero), 166, newPDF.tw_ren, 0,"R");
  }
  const date = new Date();
    const todayDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    const dateStr = format_Fecha_String(todayDate).replace(/\//g, "");
    const timeStr = formatTime(date).replace(/:/g, "");

  newPDF.guardaReporte(`Reporte_Cobranza_${dateStr}${timeStr}`);
};
function roundNumber(value, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
const Enca1 = (doc) => {
  if (!doc.tiene_encabezado) {
    doc.imprimeEncabezadoPrincipalV();
    doc.nextRow(4);
    doc.printLineV();
    doc.nextRow(4);
    doc.tiene_encabezado = true;
  } else {
    doc.nextRow(6);
    doc.tiene_encabezado = true;
  }
};

export const Cobranza = async (token, fecha_inicia, fecha_final, cajero) => {
  const valorFinal = cajero === 0 || cajero === undefined ? 0 : cajero;
  const res = await fetch(
    `${process.env.DOMAIN_API}api/cobranza/`,
    {
      method:"post",
      body:JSON.stringify({
        Fecha_Inicial:format_Fecha_String(fecha_inicia),
        Fecha_Final:format_Fecha_String(fecha_final),
        cajero:valorFinal
      }),
      headers: {
       Authorization: "Bearer " + token,
            "Content-Type": "application/json",
            xescuela: localStorage.getItem("xescuela"),
            
      },
    }
  );
  const resJson = await res.json();
  return resJson.data;
};
