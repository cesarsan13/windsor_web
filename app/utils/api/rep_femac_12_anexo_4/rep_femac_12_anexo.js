import { calculaDigitoBvba } from "../../globalfn";
import { ReporteExcel } from "../../ReportesExcel";
import { ReportePDF } from "../../ReportesPDF";

export const getDetallePedido = async (
  token,
  fecha1,
  fecha2,
  articulo,
  artFin
) => {
  const res = await fetch(
    `${process.env.DOMAIN_API}api/cobranzaProducto/${fecha1}/${fecha2}/${articulo}/${artFin}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const resJson = await res.json();
  return resJson.data;
};

export const getTrabRepCob = async (token, orden) => {
  orden = orden === "nombre" ? 1 : 0;
  const res = await fetch(
    `${process.env.DOMAIN_API}api/cobranzaProductos/${orden}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const resJson = await res.json();
  return resJson.data;
};

export const insertTrabRepCobr = async (token, data) => {
  const res = await fetch(
    `${process.env.DOMAIN_API}api/cobranzaProducto/insert`,
    {
      method: "POST",
      body: JSON.stringify({
        recibo: data.recibo,
        fecha: data.fecha,
        articulo: data.articulo,
        documento: data.documento,
        alumno: data.alumno,
        nombre: data.nombre,
        importe: data.importe,
      }),
      headers: new Headers({
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      }),
    }
  );
  const resJson = await res.json();
  return resJson;
};

export const ImprimirPDF = async (
  configuracion,
  token,
  fecha1,
  fecha2,
  articulo,
  artFin,
  orden
) => {
  const newPDF = new ReportePDF(configuracion);
  Enca1(newPDF);
  articulo = articulo === undefined ? "" : articulo;
  artFin = artFin === undefined ? "" : artFin;
  const data = await getDetallePedido(token, fecha1, fecha2, articulo, artFin);
  let alu_Ant;
  let alumno;
  for (const dato of data) {
    if (alu_Ant !== dato.alumno) {
      alumno = dato.nombre;
    }
    const importe =
      dato.cantidad * dato.precio_unitario -
      dato.cantidad * dato.precio_unitario * (dato.descuento / 100);
    const datos = {
      recibo: dato.recibo,
      fecha: dato.fecha,
      articulo: Number(dato.articulo),
      documento: dato.documento,
      alumno: dato.alumno,
      nombre: alumno,
      importe: importe,
    };
    const res = await insertTrabRepCobr(token, datos);
    alu_Ant = dato.alumno;
  }
  const dataTrabRepCobr = await getTrabRepCob(token, orden);
  let Art_Ant = "";
  let tot_art = 0;
  let total_general = 0;
  dataTrabRepCobr.forEach((trabRep) => {
    if (trabRep.articulo !== Art_Ant && Art_Ant !== "") {
      Cambia_Articulo(newPDF, tot_art);
      tot_art = 0;
    }
    if (trabRep.articulo !== Art_Ant) {
      newPDF.ImpPosX(trabRep.articulo.toString(), 24, newPDF.tw_ren,0,"R");
      newPDF.ImpPosX(trabRep.descripcion.toString(), 43, newPDF.tw_ren,0,"L");
      Enca1(newPDF);
      if (newPDF.tw_ren >= newPDF.tw_endRen) {
        newPDF.pageBreak();
        Enca1(newPDF);
      }
    }
    newPDF.ImpPosX(
      trabRep.alumno.toString() +
      "-" +
      calculaDigitoBvba(trabRep.alumno.toString()),
      24,
      newPDF.tw_ren,0,"R"
    );
    newPDF.ImpPosX(trabRep.nombre.toString(), 38, newPDF.tw_ren,0,"L");
    newPDF.ImpPosX(trabRep.importe.toString(), 138, newPDF.tw_ren,0,"R");
    newPDF.ImpPosX(trabRep.fecha.toString(), 168, newPDF.tw_ren,0,"L");
    Enca1(newPDF);
    if (newPDF.tw_ren >= newPDF.tw_endRen) {
      newPDF.pageBreak();
      Enca1(newPDF);
    }
    tot_art = tot_art + trabRep.importe;
    total_general = total_general + trabRep.importe;
    Art_Ant = trabRep.articulo;
  });
  Cambia_Articulo(newPDF, tot_art);
  newPDF.ImpPosX("TOTAL General", 98, newPDF.tw_ren,0,"L");
  newPDF.ImpPosX(total_general.toString(), 138, newPDF.tw_ren,0,"R");
  newPDF.guardaReporte("Reporte Cobranza por Producto");
};
const Cambia_Articulo = (doc, Total_Art) => {
  doc.ImpPosX("TOTAL", 108, doc.tw_ren,0,"L");
  doc.ImpPosX(Total_Art.toString(), 138, doc.tw_ren,0,"R");
  doc.nextRow(4);
};
const Enca1 = (doc) => {
  if (!doc.tiene_encabezado) {
    doc.imprimeEncabezadoPrincipalV();
    doc.nextRow(12);
    doc.ImpPosX("Producto", 24, doc.tw_ren,0,"R");
    doc.ImpPosX("Descripcion", 43, doc.tw_ren,0,"L");
    doc.nextRow(4);
    doc.ImpPosX("Alumno", 24, doc.tw_ren,0,"R");
    doc.ImpPosX("Nombre", 38, doc.tw_ren,0,"L");
    doc.ImpPosX("Importe", 138, doc.tw_ren,0,"R");
    doc.ImpPosX("Fecha Pago", 168, doc.tw_ren,0,"L");
    doc.nextRow(4);
    doc.printLineV();
    doc.nextRow(4);
    doc.tiene_encabezado = true;
  } else {
    doc.nextRow(6);
    doc.tiene_encabezado = true;
  }
};

export const ImprimirExcel = async (
  configuracion,
  token,
  fecha1,
  fecha2,
  articulo,
  artFin,
  orden
) => {
  const newExcel = new ReporteExcel(configuracion);
  articulo = articulo === undefined ? "" : articulo;
  artFin = artFin === undefined ? "" : artFin;
  const data = await getDetallePedido(token, fecha1, fecha2, articulo, artFin);
  let alu_Ant;
  let alumno;
  for (const dato of data) {
    if (alu_Ant !== dato.alumno) {
      alumno = dato.nombre;
    }
    const importe =
      dato.cantidad * dato.precio_unitario -
      dato.cantidad * dato.precio_unitario * (dato.descuento / 100);
    const datos = {
      recibo: dato.recibo,
      fecha: dato.fecha,
      articulo: dato.articulo,
      documento: dato.documento,
      alumno: dato.alumno,
      nombre: alumno,
      importe: importe,
    };
    const res = await insertTrabRepCobr(token, datos);
    alu_Ant = dato.alumno;
  }
  const dataTrabRepCobr = await getTrabRepCob(token, orden);
  let Art_Ant = "";
  let tot_art = 0;
  let total_general = 0;
  const { columns } = configuracion;
  const { columns2 } = configuracion;
  const { nombre } = configuracion;
  newExcel.setColumnas(columns);
  newExcel.setColumnas(columns2);
  let data1 = [];

  dataTrabRepCobr.forEach((trabRep) => {
    if (trabRep.articulo !== Art_Ant && Art_Ant !== "") {
      Cambia_Articulo_Excel(tot_art, data1);
      // newExcel.addData(data1);
      // data1.pop()
      tot_art = 0;
    }
    if (trabRep.articulo !== Art_Ant) {
      data1.push({
        alumno: trabRep.articulo,
        nombre: trabRep.descripcion,
        importe: "",
        fecha: "",
      });
      // newExcel.addData(data1);
      // data1.pop()
    }
    data1.push({
      alumno:
        trabRep.alumno + "-" + calculaDigitoBvba(trabRep.alumno.toString()),
      nombre: trabRep.nombre,
      importe: trabRep.importe,
      fecha: trabRep.fecha,
    });
    // newExcel.addData(data1);
    // data1.pop
    tot_art = tot_art + trabRep.importe;
    total_general = total_general + trabRep.importe;
    Art_Ant = trabRep.articulo;
  });
  Cambia_Articulo_Excel(tot_art, data1);
  data1.push({
    alumno: "",
    nombre: "Total General",
    importe: total_general,
    fecha: "",
  });
  // newExcel.addData(data1);
  newExcel.addData(data1);
  newExcel.guardaReporte(nombre);
};

const Cambia_Articulo_Excel = (tot_art, data) => {
  data.push({
    alumno: "",
    nombre: "Total",
    importe: tot_art,
    fecha: "",
  });
  data.push({
    alumno: "",
    nombre: "",
    importe: "",
    fecha: "",
  });
};
