import { ReporteExcel } from "@/app/utils/ReportesExcel";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import { formatDate, formatTime } from "../../globalfn";

export const getProcesoCalificaciones = async (token, data) => {
  let url = `${process.env.DOMAIN_API}api/proceso/calificaciones-get`;
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      numero: data.numero,
      nombre: data.nombre,
      grupo: data.grupo_nombre,
      materia: data.materia,
      bimestre: data.bimestre,
      cb_actividad: data.cb_actividad,
      actividad: data.actividad,
      unidad: data.evaluacion,
    }),
    headers: new Headers({
      Authorization: "Bearer " + token,
      xescuela: localStorage.getItem("xescuela"),
    }),
  });
  const resJson = await res.json();
  return resJson;
};

export const getProcesoCalificacionesAlumnos = async (token, data) => {
  let url = `${process.env.DOMAIN_API}api/proceso/calificaciones-alumnos`;
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      grupo: data.grupo,
    }),
    headers: new Headers({
      Authorization: "Bearer " + token,
      xescuela: localStorage.getItem("xescuela"),
    }),
  });
  const resJson = await res.json();
  return resJson;
};

export const guardarProcesoCalificaciones = async (token, data, data2) => {
  let url = `${process.env.DOMAIN_API}api/proceso/guardar-calificaciones`;
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      alumno: data.numero,
      calificacion: data.calificacion || "0.00",
      materia: data2.materia,
      grupo: data2.grupo,
      bimestre: data2.bimestre,
      actividad: data2.actividad,
      unidad: data2.evaluacion,
    }),
    headers: new Headers({
      Authorization: "Bearer " + token,
      xescuela: localStorage.getItem("xescuela"),
    }),
  });
  const resJson = await res.json();
  return resJson;
};

export const getCalificacionesAlumnos = async (token, grupo) => {
  let url = `${process.env.DOMAIN_API}api/calificaciones/alumnosArea1`;
  const res = await fetch(url, {
    method: "post",
    body: JSON.stringify({
      grupo: grupo.numero,
      grupo_nombre: grupo.horario,
    }),
    headers: new Headers({
      Authorization: "Bearer " + token,
      xescuela: localStorage.getItem("xescuela"),
    }),
  });
  const resJson = await res.json();
  return resJson.data;
};

export const getMateriasGrupo = async (token, grupo) => {
  let url = `${process.env.DOMAIN_API}api/calificaciones/materias`;
  const res = await fetch(url, {
    method: "post",
    body: JSON.stringify({
      grupo: grupo,
    }),
    headers: new Headers({
      Authorization: "Bearer " + token,
      xescuela: localStorage.getItem("xescuela"),
    }),
  });
  const resJson = await res.json();
  return resJson.data;
};
export const getCalificaciones = async (token, grupo) => {
  let url = `${process.env.DOMAIN_API}api/calificaciones/new`;
  const res = await fetch(url, {
    method: "post",
    body: JSON.stringify({
      grupo: grupo,
    }),
    headers: new Headers({
      Authorization: "Bearer " + token,
      xescuela: localStorage.getItem("xescuela"),
    }),
  });
  const resJson = await res.json();
  return resJson.data;
};
export const conversion = (calif, tipo) => {
  let alfesp = "";
  let alfing = "";
  if (calif === 0) return 0;
  if (calif === 10) {
    alfesp = "E";
    alfing = "E";
  } else if (calif < 10 && calif >= 9) {
    alfesp = "MB";
    alfing = "VG";
  } else if (calif < 9 && calif >= 8) {
    alfesp = "B";
    alfing = "G";
  } else if (calif < 8 && calif >= 7) {
    alfesp = "A";
    alfing = "R";
  } else if (calif < 7 && calif >= 6) {
    alfesp = "RA";
    alfing = "RS";
  } else {
    alfesp = "RA";
    alfing = "RS";
  }
  return tipo === "español" ? alfesp : alfing;
};

export const getLugaresArea1 = (
  calificaciones,
  actividades,
  materias,
  alumnos
) => {
  for (let b = 1; b <= 5; b++) {
    alumnos.map((alumno, falum) => {
      let caliMateria = 0;
      materias.map((materia) => {
        let sumatoria = 0;
        let evaluaciones = 0;
        if (materia.actividad === "No") {
          evaluaciones = materia.evaluaciones;
          const filtroCalificaciones = calificaciones.filter(
            (calificacion) =>
              calificacion.bimestre === b &&
              calificacion.alumno === alumno.numero &&
              calificacion.actividad === 0 &&
              calificacion.materia === materia.materia &&
              calificacion.unidad <= evaluaciones
          );
          sumatoria = filtroCalificaciones.reduce(
            (acc, calificacion) => acc + calificacion.calificacion,
            0
          );
          const promedio = sumatoria / evaluaciones;
          caliMateria += parseFloat(promedio.toFixed(1));
        } else if (materia.actividad === "Si") {
          const tablas = actividades.filter(
            (actividad) => actividad.materia === materia.materia
          );
          if (tablas.length > 0) {
            for (let i = 0; i < tablas.length; i++) {
              const filtroCalificaciones = calificaciones.filter(
                (calificacion) =>
                  calificacion.alumno === alumno.numero &&
                  calificacion.materia === materia.materia &&
                  calificacion.bimestre === b &&
                  calificacion.actividad === tablas[i].secuencia &&
                  calificacion.unidad <= tablas[i]["EB" + b]
              );
              const cpa = filtroCalificaciones.reduce(
                (acc, calificacion) => acc + calificacion.calificacion,
                0
              );
              const ebValue = tablas[i]["EB" + b] || 1;
              sumatoria += cpa / ebValue;
            }
            evaluaciones = tablas.length;
            const promedio = sumatoria / evaluaciones;
            caliMateria += parseFloat(promedio.toFixed(1));
          }
        }
      });
      if (materias.length > 0) {
        alumnos[falum] = {
          ...alumnos[falum],
          [b]: parseFloat(caliMateria / materias.length).toFixed(1),
        };
      } else {
        alumnos[falum] = {
          ...alumnos[falum],
          [b]: 0,
        };
      }
    });
  }
  if (alumnos.length > 0) {
    for (let bi = 1; bi <= 5; bi++) {
      let lugar1 = 0;
      let lugar2 = 0;
      let lugar3 = 0;
      alumnos.map((alumno) => {
        let calificacion = alumno[bi];
        if (parseFloat(calificacion) > parseFloat(lugar1)) {
          if (parseFloat(calificacion) > 7) {
            lugar1 = calificacion;
          }
        }
      });
      alumnos.map((alumno) => {
        let calificacion = alumno[bi];
        if (
          parseFloat(calificacion) < parseFloat(lugar1) &&
          parseFloat(calificacion) > parseFloat(lugar2)
        ) {
          if (parseFloat(calificacion) > 7) {
            lugar2 = calificacion;
          }
        }
      });
      alumnos.map((alumno) => {
        let calificacion = alumno[bi];
        if (
          parseFloat(calificacion) < parseFloat(lugar1) &&
          parseFloat(calificacion) < parseFloat(lugar2) &&
          parseFloat(calificacion) > parseFloat(lugar3)
        ) {
          if (parseFloat(calificacion) > 7) {
            lugar3 = calificacion;
          }
        }
      });
      alumnos.map((alumno) => {
        let calificacion = alumno[bi];
        if (calificacion === lugar1 && lugar1 > 5.9) {
          alumno[bi] = "1er";
        } else if (calificacion === lugar2 && lugar2 > 5.9) {
          alumno[bi] = "2do";
        } else if (calificacion === lugar3 && lugar3 > 5.9) {
          alumno[bi] = "3er";
        } else {
          alumno[bi] = "";
        }
      });
    }
  }
  return alumnos;
};
const Enca1 = (doc, checkBoletaKinder, cicloFechas) => {
  if (!doc.tiene_encabezado) {
    doc.imprimeEncabezadoPrincipalV();
    doc.nextRow(12);
    doc.nextRow(4);
    doc.ImpPosX(
      "AV.SANTA ANA N° 368 COL. SAN FRANCISCO CULCHUACÁN C.P. 04420",
      50,
      doc.tw_ren,
      0,
      "L"
    );
    doc.nextRow(4);
    doc.ImpPosX(
      "ACUERDO N° 09980051 DEL  13 AGOSTO DE 1998",
      65,
      doc.tw_ren,
      0,
      "L"
    );
    doc.nextRow(4);
    doc.ImpPosX("CLAVE 51-2636-510-32-PX-014", 80, doc.tw_ren, 0, "L");
    doc.nextRow(4);
    doc.ImpPosX("CCT 09PPR1204U", 90, doc.tw_ren, 0, "L");
    doc.nextRow(4);
    if (checkBoletaKinder) {
      doc.ImpPosX("JARDIN DE NIÑOS", 90, doc.tw_ren, 0, "L");
      doc.nextRow(4);
    }
    doc.ImpPosX(`${cicloFechas || ""}`, 97, doc.tw_ren, 0, "L");
    doc.nextRow(4);
    doc.ImpPosX(
      "El acercamiento al colegio será una forma para asegurar el éxito del alumno",
      50,
      doc.tw_ren,
      0,
      "L"
    );
    doc.nextRow(4);
    doc.printLineV();
    doc.tiene_encabezado = true;
  } else {
    doc.nextRow(6);
    doc.tiene_encabezado = true;
  }
};
export const Imprimir = (configuracion) => {
  const newPDF = new ReportePDF(configuracion);
  const {
    body,
    header,
    header2,
    cicloFechas,
    alumno,
    grupo,
    checkBoletaK,
    selectedOption,
  } = configuracion;
  Enca1(newPDF, checkBoletaK, cicloFechas);
  newPDF.nextRow(10);
  newPDF.ImpPosX(`ALUMNO ${alumno || ""}`, 15, newPDF.tw_ren, 0, "L");
  newPDF.nextRow(4);
  newPDF.ImpPosX(`GRUPO: ${grupo || ""}`, 15, newPDF.tw_ren, 0, "L");
  if (selectedOption === "español") {
    newPDF.ImpPosX(`ESPAÑOL`, 90, newPDF.tw_ren, 0, "L");
    const data = body
      .filter((c) => c.area <= 3)
      .map((boleta) => [
        {
          content: boleta.materia.toString(),
          styles: {
            fontStyle:
              boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                ? "bold"
                : "normal",
            fontSize:
              boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                ? "12"
                : "10",
          },
        },
        {
          content: boleta.EB1?.toString() ?? "",
          styles: {
            halign: "right",
            fontStyle:
              boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                ? "bold"
                : "normal",
            fontSize:
              boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                ? "12"
                : "10",
          },
        },
        {
          content: boleta.EB2?.toString() ?? "",
          styles: {
            halign: "right",
            fontStyle:
              boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                ? "bold"
                : "normal",
            fontSize:
              boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                ? "12"
                : "10",
          },
        },
        {
          content: boleta.EB3?.toString() ?? "",
          styles: {
            halign: "right",
            fontStyle:
              boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                ? "bold"
                : "normal",
            fontSize:
              boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                ? "12"
                : "10",
          },
        },
        {
          content: boleta.EB4?.toString() ?? "",
          styles: {
            halign: "right",
            fontStyle:
              boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                ? "bold"
                : "normal",
            fontSize:
              boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                ? "12"
                : "10",
          },
        },
        {
          content: boleta.EB5?.toString() ?? "",
          styles: {
            halign: "right",
            fontStyle:
              boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                ? "bold"
                : "normal",
            fontSize:
              boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                ? "12"
                : "10",
          },
        },
        {
          content: boleta.promedio?.toString() ?? "",
          styles: {
            halign: "right",
            fontStyle:
              boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                ? "bold"
                : "normal",
            fontSize:
              boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                ? "12"
                : "10",
          },
        },
      ]);
    newPDF.generateTable(header, data);
  } else if (selectedOption === "ingles") {
    newPDF.ImpPosX(`INGLES`, 90, newPDF.tw_ren, 0, "L");
    const data = body
      .filter((c) => c.area >= 3)
      .map((boleta) => [
        {
          content: boleta.materia.toString(),
          styles: {
            fontStyle:
              boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                ? "bold"
                : "normal",
            fontSize:
              boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                ? "12"
                : "10",
          },
        },
        {
          content: boleta.EB1?.toString() ?? "",
          styles: {
            halign: "right",
            fontStyle:
              boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                ? "bold"
                : "normal",
            fontSize:
              boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                ? "12"
                : "10",
          },
        },
        {
          content: boleta.EB2?.toString() ?? "",
          styles: {
            halign: "right",
            fontStyle:
              boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                ? "bold"
                : "normal",
            fontSize:
              boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                ? "12"
                : "10",
          },
        },
        {
          content: boleta.EB3?.toString() ?? "",
          styles: {
            halign: "right",
            fontStyle:
              boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                ? "bold"
                : "normal",
            fontSize:
              boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                ? "12"
                : "10",
          },
        },
        {
          content: boleta.EB4?.toString() ?? "",
          styles: {
            halign: "right",
            fontStyle:
              boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                ? "bold"
                : "normal",
            fontSize:
              boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                ? "12"
                : "10",
          },
        },
        {
          content: boleta.EB5?.toString() ?? "",
          styles: {
            halign: "right",
            fontStyle:
              boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                ? "bold"
                : "normal",
            fontSize:
              boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                ? "12"
                : "10",
          },
        },
        {
          content: boleta.promedio?.toString() ?? "",
          styles: {
            halign: "right",
            fontStyle:
              boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                ? "bold"
                : "normal",
            fontSize:
              boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                ? "12"
                : "10",
          },
        },
      ]);
    newPDF.generateTable(header, data);
  } else {
    newPDF.ImpPosX(`ESPAÑOL`, 90, newPDF.tw_ren, 0, "L");
    const data = body
      .filter((c) => c.area <= 3)
      .map((boleta) => [
        {
          content: boleta.materia.toString(),
          styles: {
            fontStyle:
              boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                ? "bold"
                : "normal",
            fontSize:
              boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                ? "12"
                : "10",
          },
        },
        {
          content: boleta.EB1?.toString() ?? "",
          styles: {
            halign: "right",
            fontStyle:
              boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                ? "bold"
                : "normal",
            fontSize:
              boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                ? "12"
                : "10",
          },
        },
        {
          content: boleta.EB2?.toString() ?? "",
          styles: {
            halign: "right",
            fontStyle:
              boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                ? "bold"
                : "normal",
            fontSize:
              boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                ? "12"
                : "10",
          },
        },
        {
          content: boleta.EB3?.toString() ?? "",
          styles: {
            halign: "right",
            fontStyle:
              boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                ? "bold"
                : "normal",
            fontSize:
              boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                ? "12"
                : "10",
          },
        },
        {
          content: boleta.EB4?.toString() ?? "",
          styles: {
            halign: "right",
            fontStyle:
              boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                ? "bold"
                : "normal",
            fontSize:
              boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                ? "12"
                : "10",
          },
        },
        {
          content: boleta.EB5?.toString() ?? "",
          styles: {
            halign: "right",
            fontStyle:
              boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                ? "bold"
                : "normal",
            fontSize:
              boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                ? "12"
                : "10",
          },
        },
        {
          content: boleta.promedio?.toString() ?? "",
          styles: {
            halign: "right",
            fontStyle:
              boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                ? "bold"
                : "normal",
            fontSize:
              boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                ? "12"
                : "10",
          },
        },
      ]);
    newPDF.generateTable(header, data);
    newPDF.nextRow(10);
    newPDF.ImpPosX(`INGLES`, 90, newPDF.tw_ren, 0, "L");
    const data2 = body
      .filter((c) => c.area >= 3)
      .map((boleta) => [
        {
          content: boleta.materia.toString(),
          styles: {
            fontStyle:
              boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                ? "bold"
                : "normal",
            fontSize:
              boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                ? "12"
                : "10",
          },
        },
        {
          content: boleta.EB1?.toString() ?? "",
          styles: {
            halign: "right",
            fontStyle:
              boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                ? "bold"
                : "normal",
            fontSize:
              boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                ? "12"
                : "10",
          },
        },
        {
          content: boleta.EB2?.toString() ?? "",
          styles: {
            halign: "right",
            fontStyle:
              boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                ? "bold"
                : "normal",
            fontSize:
              boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                ? "12"
                : "10",
          },
        },
        {
          content: boleta.EB3?.toString() ?? "",
          styles: {
            halign: "right",
            fontStyle:
              boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                ? "bold"
                : "normal",
            fontSize:
              boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                ? "12"
                : "10",
          },
        },
        {
          content: boleta.EB4?.toString() ?? "",
          styles: {
            halign: "right",
            fontStyle:
              boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                ? "bold"
                : "normal",
            fontSize:
              boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                ? "12"
                : "10",
          },
        },
        {
          content: boleta.EB5?.toString() ?? "",
          styles: {
            halign: "right",
            fontStyle:
              boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                ? "bold"
                : "normal",
            fontSize:
              boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                ? "12"
                : "10",
          },
        },
        {
          content: boleta.promedio?.toString() ?? "",
          styles: {
            halign: "right",
            fontStyle:
              boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                ? "bold"
                : "normal",
            fontSize:
              boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                ? "12"
                : "10",
          },
        },
      ]);
    newPDF.generateTable(header2, data2);
  }
  newPDF.nextRow(50);
  newPDF.printLine(50, 160);
  newPDF.nextRow(6);
  newPDF.ImpPosX("NOMBRE Y FIRMA DEL PADRE O TUTOR", 70, newPDF.tw_ren, 0, "L");
  if (selectedOption === "español") {
    newPDF.guardaReporte(`Boleta5_Español_${alumno || ""}`);
  } else if (selectedOption === "ingles") {
    newPDF.guardaReporte(`Boleta5_Ingles_${alumno || ""}`);
  } else {
    newPDF.guardaReporte(`Boleta5_Ambos_${alumno || ""}`);
  }
};

export const ImprimirPDF = (configuracion) => {
  const orientacion = "Landscape";
  const newPDF = new ReportePDF(configuracion, orientacion);
  const { body } = configuracion;
  Enca1(newPDF);
  body.forEach((calificacion) => {
    newPDF.ImpPosX(calificacion.numero.toString(), 25, newPDF.tw_ren, 0, "R");
    newPDF.ImpPosX(calificacion.nombre.toString(), 30, newPDF.tw_ren, 35, "L");
    newPDF.ImpPosX(calificacion.unidad.toString(), 150, newPDF.tw_ren, 35, "R");
    newPDF.ImpPosX(
      calificacion.calificacion.toString(),
      183,
      newPDF.tw_ren,
      35,
      "R"
    );
    Enca1(newPDF);
    if (newPDF.tw_ren >= newPDF.tw_endRenH) {
      newPDF.pageBreakH();
      Enca1(newPDF);
    }
  });
  const date = new Date()
  const dateStr = formatDate(date)
  const timeStr = formatTime(date)
  newPDF.guardaReporte(`Calificaciones_${dateStr.replaceAll("/","")}_${timeStr.replaceAll(":","")}`);
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
  newExcel.guardaReporte(`${nombre}_${dateStr.replaceAll("/","")}_${timeStr.replaceAll(":","")}`);
};
