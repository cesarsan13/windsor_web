import { ReporteExcel } from "../../ReportesExcel";
import { ReportePDF } from "../../ReportesPDF";

export const getHorarios = async (token, baja) => {
  let url = "";
  baja
    ? (url = `${process.env.DOMAIN_API}api/horarios/baja`)
    : (url = `${process.env.DOMAIN_API}api/horarios`);
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
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
    },
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
      baja: data.baja,
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
    doc.ImpPosX("Numero", 14, doc.tw_ren,0,"L");
    doc.ImpPosX("Cancha", 28, doc.tw_ren,0,"L");
    doc.ImpPosX("Dia", 42, doc.tw_ren,0,"L");
    doc.ImpPosX("Horario", 82, doc.tw_ren,0,"L");
    doc.ImpPosX("Niños", 114, doc.tw_ren,0,"L");
    doc.ImpPosX("Sexo", 134, doc.tw_ren,0,"L");
    doc.ImpPosX("Edad Ini", 154, doc.tw_ren,0,"L");
    doc.ImpPosX("Edad Fin", 174, doc.tw_ren,0,"L");
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
    newPDF.ImpPosX(horario.numero.toString(),24,newPDF.tw_ren,0,"R")
    newPDF.ImpPosX(horario.cancha.toString(),38,newPDF.tw_ren,0,"R")
    newPDF.ImpPosX(horario.dia.toString(),42,newPDF.tw_ren)
    newPDF.ImpPosX(horario.horario.toString(),82,newPDF.tw_ren)
    newPDF.ImpPosX(horario.max_niños.toString(),124,newPDF.tw_ren,0,"R")
    newPDF.ImpPosX(horario.sexo.toString(),134,newPDF.tw_ren)
    newPDF.ImpPosX(horario.edad_ini.toString(),164,newPDF.tw_ren,0,"R")
    newPDF.ImpPosX(horario.edad_fin.toString(),184,newPDF.tw_ren,0,"R")
    Enca1(newPDF);
    if (newPDF.tw_ren >= newPDF.tw_endRen) {
      newPDF.pageBreak();
      Enca1(newPDF);
    }
  });
  newPDF.guardaReporte("Horarios")
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
