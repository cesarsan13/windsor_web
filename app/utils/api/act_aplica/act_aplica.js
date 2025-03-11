import { formatNumber } from "@/app/utils/globalfn";
import { ReporteExcel } from "@/app/utils/ReportesExcel";
import { ReportePDF } from "@/app/utils/ReportesPDF";

export const getAplicaciones1 = async (token) => {
  let url = `${process.env.DOMAIN_API}api/aplicacion1`;
  const res = await fetch(url, {
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      xescuela: localStorage.getItem("xescuela"),
    }),
  });
  const resJson = await res.json();
  return resJson.data;
};

export const siguiente = async (token) => {
  const res = await fetch(
    `${process.env.DOMAIN_API}api/aplicacion1/siguiente`,
    {
      headers: new Headers({
        Authorization: "Bearer " + token,
        xescuela: localStorage.getItem("xescuela"),
      }),
    }
  );
  const resJson = await res.json();
  return resJson.data;
};

export const guradaAplicacion1 = async (token, data, accion) => {
  let url = "";
  if (accion === "Alta") {
    url = `${process.env.DOMAIN_API}api/aplicacion1/post`;
  }
  if (accion === "Eliminar" || accion === "Editar") {
    if (accion === "Eliminar") {
      data.baja = "*";
    } else {
      data.baja = "";
    }
    url = `${process.env.DOMAIN_API}api/aplicacion1/update`;
  }
  const res = await fetch(`${url}`, {
    method: "post",
    body: JSON.stringify({
      numero: data.numero,
      numero_cuenta: data.numero_cuenta,
      cargo_abono: data.cargo_abono,
      importe_movimiento: data.importe_movimiento,
      referencia: data.referencia,
      fecha_referencia: data.fecha_referencia,
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
    doc.imprimeEncabezadoPrincipalV();
    doc.nextRow(12);
    doc.ImpPosX("numero", 14, doc.tw_ren, 0, "L");
    doc.ImpPosX("cuenta", 34, doc.tw_ren, 0, "L");
    doc.ImpPosX("cargo", 64, doc.tw_ren, 0, "L");
    doc.ImpPosX("abono", 94, doc.tw_ren, 0, "L");
    doc.ImpPosX("referencia", 114, doc.tw_ren, 0, "L");
    doc.ImpPosX("fecha", 164, doc.tw_ren, 0, "L");
    doc.nextRow(4);
    doc.printLineV();
    doc.nextRow(4);
    doc.tiene_encabezado = true;
  } else {
    doc.nextRow(6);
    doc.tiene_encabezado = true;
  }
};

export const Imprimir = async (configuracion) => {
  const newPDF = new ReportePDF(configuracion);
  const { body } = configuracion;
  Enca1(newPDF);
  let sumAbono = 0;
  let sumCargo = 0;
  body.forEach((aplicacion) => {
    newPDF.ImpPosX(aplicacion.numero.toString(), 24, newPDF.tw_ren, 0, "R");
    newPDF.ImpPosX(
      aplicacion.numero_cuenta.toString(),
      34,
      newPDF.tw_ren,
      0,
      "L"
    );
    const abono =
      aplicacion.cargo_abono === "A" ? Number(aplicacion.importe_movimiento) : 0;
    const cargo =
      aplicacion.cargo_abono === "C" ? Number(aplicacion.importe_movimiento) : 0;
    sumAbono += abono;
    sumCargo += cargo;
    newPDF.ImpPosX(formatNumber(cargo.toString()), 74, newPDF.tw_ren, 0, "R");
    newPDF.ImpPosX(
      formatNumber(abono.toString()),
      104,
      newPDF.tw_ren,
      0,
      "R"
    );
    newPDF.ImpPosX(aplicacion.referencia, 114, newPDF.tw_ren, 0, "L");
    newPDF.ImpPosX(aplicacion.fecha_referencia, 164, newPDF.tw_ren, 0, "L");
    Enca1(newPDF);
    if (newPDF.tw_ren >= newPDF.tw_endRen) {
      newPDF.pageBreak();
      Enca1(newPDF);
    }
  });
  newPDF.nextRow(6);
  newPDF.ImpPosX("Total", 34, newPDF.tw_ren, 0, "L");
  newPDF.ImpPosX(formatNumber(sumCargo), 74, newPDF.tw_ren, 0, "R");
  newPDF.ImpPosX(formatNumber(sumAbono), 104, newPDF.tw_ren, 0, "R");
  newPDF.guardaReporte("Act Aplica");
};

export const ImprimirExcel =(configuracion)=>{
  const newExcel = new ReporteExcel(configuracion)
  const {columns,body,nombre}=configuracion
  newExcel.setColumnas(columns)
  newExcel.addData(body);
  newExcel.guardaReporte(nombre)
}