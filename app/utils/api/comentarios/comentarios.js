import { ReporteExcel } from "@/app/utils/ReportesExcel";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import { formatTime, format_Fecha_String } from "@/app/utils/globalfn";

export const getComentarios = async (token, baja) => {
  let url = "";
  baja
    ? (url = `${process.env.DOMAIN_API}api/comentarios/baja`)
    : (url = `${process.env.DOMAIN_API}api/comentarios`);

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      xescuela: localStorage.getItem("xescuela"),
    },
  });
  const resJson = await res.json();
  return resJson.data;
};
export const siguiente = async (token) => {
  const res = await fetch(
    `${process.env.DOMAIN_API}api/comentarios/siguiente`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        xescuela: localStorage.getItem("xescuela"),
      },
    }
  );
  const resJson = await res.json();
  return resJson.data;
};
export const guardaComentarios = async (token, data, accion) => {
  const generales = data.generales === true ? '1' : '0'
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
      generales: generales,
      baja: data.baja,
    }),
    headers: new Headers({
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
      xescuela: localStorage.getItem("xescuela"),
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
  const orientacion = "Landscape"; //Aqui se agrega la orientacion del documento PDF puede ser Landscape(Horizontal) o Portrait (Vertical)
  const newPDF = new ReportePDF(configuracion, orientacion);
  const { body } = configuracion;
  Enca1(newPDF);
  body.forEach((comentarios) => {
    newPDF.ImpPosX(comentarios.numero.toString(), 20, newPDF.tw_ren, 0, "R");
    newPDF.ImpPosX(
      comentarios.comentario_1.toString(),
      30,
      newPDF.tw_ren,
      35,
      "L"
    );
    newPDF.ImpPosX(
      comentarios.comentario_2.toString(),
      110,
      newPDF.tw_ren,
      35,
      "L"
    );
    newPDF.ImpPosX(
      comentarios.comentario_3.toString(),
      190,
      newPDF.tw_ren,
      35,
      "L"
    );
    let resultado =
      comentarios.generales == 1
        ? "Si"
        : comentarios.generales == 0
          ? "No"
          : "No valido";
    newPDF.ImpPosX(resultado.toString(), 270, newPDF.tw_ren, 0, "L");
    Enca1(newPDF);
    if (newPDF.tw_ren >= newPDF.tw_endRenH) {
      newPDF.pageBreakH();
      Enca1(newPDF);
    }
  });
  const date = new Date();
  const todayDate = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  const dateStr = format_Fecha_String(todayDate).replace(/\//g, "");
  const timeStr = formatTime(date).replace(/:/g, "");
  newPDF.guardaReporte(`Comentarios_${dateStr}${timeStr}`);
};
export const ImprimirExcel = (configuracion) => {
  const newExcel = new ReporteExcel(configuracion);
  const { columns } = configuracion;
  const { body } = configuracion;
  const { nombre } = configuracion;
  newExcel.setColumnas(columns);
  newExcel.addData(body);
  const date = new Date();
  const todayDate = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  const dateStr = format_Fecha_String(todayDate).replace(/\//g, "");
  const timeStr = formatTime(date).replace(/:/g, "");
  newExcel.guardaReporte(`${nombre}${dateStr}${timeStr}`);
};

export const storeBatchComentarios = async (token, data) => {
  let url = `${process.env.DOMAIN_API}api/comentarios/Batch`;
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
