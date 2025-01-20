import { formatDate, formatTime } from "../../globalfn";
import { ReporteExcel } from "../../ReportesExcel";
import { ReportePDF } from "../../ReportesPDF";

export const getAlumnoXHorario = async (token) => {
  let url = "";
  url = `${process.env.DOMAIN_API}api/horarios/alumnosxhorario`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      xescuela: localStorage.getItem("xescuela"),
    },
  });
  const resJson = await res.json();
  return resJson.data;
};
export const getHorarios = async (token, baja) => {
  let url = "";
  baja
    ? (url = `${process.env.DOMAIN_API}api/horarios/baja`)
    : (url = `${process.env.DOMAIN_API}api/horarios`);
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      xescuela: localStorage.getItem("xescuela"),
    },
  });
  const resJson = await res.json();
  return resJson.data;
};
export const getUltimoHorario = async (token) => {
  let url = `${process.env.DOMAIN_API}api/horarios/ultimo`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      xescuela: localStorage.getItem("xescuela"),
    },
  });
  const resJson = await res.json();
  return resJson.data;
};

export const storeBatchHorario = async (token, data) => {
  let url = `${process.env.DOMAIN_API}api/horarios/batch`;
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

export const guardarHorario = async (token, data, accion) => {
  let url = "";
  let met = "";
  if (accion === "Alta") {
    url = `${process.env.DOMAIN_API}api/horarios/post`;
    data.baja = "";
    met = "post";
  }
  if (accion === "Eliminar" || accion == "Editar") {
    if (accion === "Eliminar") {
      data.baja = "*";
    } else {
      data.baja = "";
    }
    url = `${process.env.DOMAIN_API}api/horarios/update`;
  }
  const res = await fetch(`${url}`, {
    method: "post",
    body: JSON.stringify({
      numero: data.numero,
      cancha: data.cancha,
      dia: data.dia,
      horario: data.horario,
      max_niños: data.max_niños,
      sexo: data.sexo,
      edad_ini: data.edad_ini,
      edad_fin: data.edad_fin,
      salon: data.salon,
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
    doc.imprimeEncabezadoPrincipalV();
    doc.nextRow(12);
    doc.ImpPosX("Numero", 14, doc.tw_ren, 0, "L");
    doc.ImpPosX("Horario", 28, doc.tw_ren, 0, "L");
    doc.ImpPosX("Salón", 62, doc.tw_ren, 0, "L");
    doc.ImpPosX("Dia", 90, doc.tw_ren, 0, "L");
    doc.ImpPosX("Cancha", 117, doc.tw_ren, 0, "L");
    doc.ImpPosX("Niños", 134, doc.tw_ren, 0, "L");
    doc.ImpPosX("Sexo", 149, doc.tw_ren, 0, "L");
    doc.ImpPosX("Edad Ini", 164, doc.tw_ren, 0, "L");
    doc.ImpPosX("Edad Fin", 184, doc.tw_ren, 0, "L");
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
  body.forEach((horario) => {
    newPDF.ImpPosX(horario.numero.toString(), 24, newPDF.tw_ren, 0, "R");
    newPDF.ImpPosX(horario.horario.toString(), 28, newPDF.tw_ren);
    newPDF.ImpPosX(horario.salon.toString(), 62, newPDF.tw_ren);
    newPDF.ImpPosX(horario.dia.toString(), 90, newPDF.tw_ren);
    newPDF.ImpPosX(horario.cancha.toString(), 127, newPDF.tw_ren, 0, "R");
    newPDF.ImpPosX(horario.max_niños.toString(), 144, newPDF.tw_ren, 0, "R");
    newPDF.ImpPosX(horario.sexo.toString(), 149, newPDF.tw_ren);
    newPDF.ImpPosX(horario.edad_ini.toString(), 174, newPDF.tw_ren, 0, "R");
    newPDF.ImpPosX(horario.edad_fin.toString(), 194, newPDF.tw_ren, 0, "R");
    Enca1(newPDF);
    if (newPDF.tw_ren >= newPDF.tw_endRen) {
      newPDF.pageBreak();
      Enca1(newPDF);
    }
  });
  const date = new Date()
  const dateStr = formatDate(date)
  const timeStr = formatTime(date)
  newPDF.guardaReporte(`Horarios_${dateStr.replaceAll("/", "")}_${timeStr.replaceAll(":", "")}`);
};
export const ImprimirExcel = (configuracion) => {
  const newExcel = new ReporteExcel(configuracion);
  const { columns } = configuracion;
  const { body } = configuracion;
  const { nombre } = configuracion;
  newExcel.setColumnas(columns);
  newExcel.addData(body);
  const date = new Date()
  const dateStr = formatDate(date)
  const timeStr = formatTime(date)
  newExcel.guardaReporte(`${nombre}_${dateStr.replaceAll("/", "")}_${timeStr.replaceAll(":", "")}`);
};

export const getHorariosXAlumno = async (token, horario) => {
  const res = await fetch(`${process.env.DOMAIN_API}api/AlumnosPC/Lista`, {
    method: "post",
    body: JSON.stringify({
      horario: horario,
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
