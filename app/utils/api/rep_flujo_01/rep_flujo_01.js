import { ReporteExcel } from "@/app/utils/ReportesExcel";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import { formatTime, format_Fecha_String, formatNumber} from "@/app/utils/globalfn";

export const DocumentosCobranza = async (token, fecha1, fecha2) => {
  const res = await fetch(`${process.env.DOMAIN_API}api/documentosCobranza`, {
    method: "post",
    body: JSON.stringify({
      fecha_ini: format_Fecha_String(fecha1),
      fecha_fin: format_Fecha_String(fecha2),
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

export const ImprimirPDF = (
  configuracion,
  fecha_ini,
  fecha_fin,
  selectedOption
) => {
  const newPDF = new ReportePDF(configuracion);
  const { body } = configuracion;
  const documentosCobranza = body.documentos_cobranza;
  const alumnos = body.alumnos;
  let Tw_Col = Array.from({ length: 14 }, () => Array(9).fill(0.0));
  let Tw_TGe = Array(9).fill(0.0);
  let Tw_Per = Array(14).fill("");
  let per_str;
  Enca1(newPDF);
  let Pos_Act;
  for (Pos_Act = 0; Pos_Act <= 13; Pos_Act++) {
    Tw_Per[Pos_Act] = "";
    Tw_Col[Pos_Act][1] = 0;
    Tw_Col[Pos_Act][2] = 0;
    Tw_Col[Pos_Act][3] = 0;
    Tw_Col[Pos_Act][4] = 0;
    Tw_Col[Pos_Act][5] = 0;
    Tw_Col[Pos_Act][6] = 0;
    Tw_Col[Pos_Act][7] = 0;
    Tw_Col[Pos_Act][8] = 0;
  }
  for (Pos_Act = 1; Pos_Act < 8; Pos_Act++) {
    Tw_TGe[Pos_Act] = 0;
  }
  Tw_Per[1] = (fecha_ini.slice(0, 7)).replace(/-/g, "/");
  Tw_Per[12] = (fecha_fin.slice(0, 7)).replace(/-/g, "/");
  let adiciona;

  documentosCobranza.forEach((documento) => {
    const alumno = alumnos.find((alu) => alu.numero === documento.alumno);
    if (alumno) {
      adiciona = true;
      if (selectedOption === "sin_deudor") {
        if (alumno.estatus.toUpperCase() === "Cartera") {
          adiciona = false;
        } else {
          adiciona = true;
        }
      }
      if (selectedOption === "solo_deudores") {
        if (alumno.estatus.toUpperCase() === "Cartera") {
          adiciona = true;
        } else {
          adiciona = false;
        }
      }
    } else {
      adiciona = false;
    }
    if (adiciona === true) {
      per_str = documento.fecha.toString().slice(0, 7);
      if (per_str < Tw_Per[1]) {
        Pos_Act = 0;
      } else if (per_str > Tw_Per[12]) {
        Pos_Act = 13;
      } else {
        for (Pos_Act = 1; Pos_Act <= 13; Pos_Act++) {
          if (Tw_Per[Pos_Act] === per_str) break;
          if (Tw_Per[Pos_Act] === "") {
            Tw_Per[Pos_Act] = per_str;
            break;
          }
        }
      }
      if (Pos_Act < 13) {
        if (documento.ref.toString().toUpperCase() === "COL") {
          Tw_Col[Pos_Act][1] = Number(Tw_Col[Pos_Act][1]) + documento.importe;
          Tw_Col[Pos_Act][2] = Number(Tw_Col[Pos_Act][2]) + documento.importe * (documento.descuento / 100);
        }
        if (documento.ref.toString().toUpperCase() === "INS") {
          Tw_Col[Pos_Act][3] = Number(Tw_Col[Pos_Act][3]) + documento.importe;
          Tw_Col[Pos_Act][4] = Number(Tw_Col[Pos_Act][4]) + documento.importe * (documento.descuento / 100);
        }
        if (documento.ref.toString().toUpperCase() === "REC") {
          Tw_Col[Pos_Act][4] = Number(Tw_Col[Pos_Act][4]) + documento.importe;
        }
        if (documento.ref.toString().toUpperCase() == "TAL") {
          Tw_Col[Pos_Act][5] = Number(Tw_Col[Pos_Act][5]) + documento.importe;
        }
        Tw_Col[Pos_Act][8] = Number(Tw_Col[Pos_Act][8]) + documento.importe_pago;
      }
    }
  });
  let imp_total;
  for (Pos_Act = 0; Pos_Act <= 13; Pos_Act++) {
    imp_total =
      Number(Tw_Col[Pos_Act][1]) -
      Number(Tw_Col[Pos_Act][2]) +
      Number(Tw_Col[Pos_Act][3]) +
      Number(Tw_Col[Pos_Act][4]) +
      Number(Tw_Col[Pos_Act][5]);
    Tw_TGe[1] = Number(Tw_TGe[1]) + Number(Tw_Col[Pos_Act][1]);
    Tw_TGe[2] = Number(Tw_TGe[2]) + Number(Tw_Col[Pos_Act][2]);
    Tw_TGe[3] = Number(Tw_TGe[3]) + Number(Tw_Col[Pos_Act][3]);
    Tw_TGe[4] = Number(Tw_TGe[4]) + Number(Tw_Col[Pos_Act][4]);
    Tw_TGe[5] = Number(Tw_TGe[5]) + Number(Tw_Col[Pos_Act][5]);
    Tw_TGe[6] = Number(Tw_TGe[6]) + Number(Tw_Col[Pos_Act][6]);
    Tw_TGe[7] = Number(Tw_TGe[7]) + Number(imp_total);
    Tw_TGe[8] = Number(Tw_TGe[8]) + Number(Tw_Col[Pos_Act][8]);
    newPDF.ImpPosX(Tw_Per[Pos_Act].toString(), 14, newPDF.tw_ren);
    newPDF.ImpPosX(formatNumber(Tw_Col[Pos_Act][1].toString()), 34, newPDF.tw_ren);
    newPDF.ImpPosX(formatNumber(Tw_Col[Pos_Act][2].toString()), 54, newPDF.tw_ren);
    newPDF.ImpPosX(formatNumber(Tw_Col[Pos_Act][3].toString()), 74, newPDF.tw_ren);
    newPDF.ImpPosX(formatNumber(Tw_Col[Pos_Act][4].toString()), 94, newPDF.tw_ren);
    newPDF.ImpPosX(formatNumber(Tw_Col[Pos_Act][5].toString()), 114, newPDF.tw_ren);
    newPDF.ImpPosX(formatNumber(imp_total.toString()), 134, newPDF.tw_ren);
    newPDF.ImpPosX(formatNumber(Tw_Col[Pos_Act][8].toString()), 154, newPDF.tw_ren);
    const sum = Number(imp_total) - Number(Tw_Col[Pos_Act][8].toString());
    newPDF.ImpPosX(formatNumber(sum.toString()), 174, newPDF.tw_ren);
    Enca1(newPDF);
    if (newPDF.tw_ren >= newPDF.tw_endRen) {
      newPDF.pageBreak();
      Enca1(newPDF);
    }
  }
  newPDF.ImpPosX("Total", 14, newPDF.tw_ren);
  newPDF.ImpPosX(formatNumber(Tw_TGe[1].toString()), 34, newPDF.tw_ren);
  newPDF.ImpPosX(formatNumber(Tw_TGe[2].toString()), 54, newPDF.tw_ren);
  newPDF.ImpPosX(formatNumber(Tw_TGe[3].toString()), 74, newPDF.tw_ren);
  newPDF.ImpPosX(formatNumber(Tw_TGe[4].toString()), 94, newPDF.tw_ren);
  newPDF.ImpPosX(formatNumber(Tw_TGe[5].toString()), 114, newPDF.tw_ren);
  newPDF.ImpPosX(formatNumber(Tw_TGe[7].toString()), 134, newPDF.tw_ren);
  newPDF.ImpPosX(formatNumber(Tw_TGe[8].toString()), 154, newPDF.tw_ren);
  const sum = Number(Tw_TGe[7].toString()) - Number(Tw_TGe[8].toString());
  newPDF.ImpPosX(formatNumber(sum.toString()), 174, newPDF.tw_ren);
  const date = new Date();
  const todayDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  const dateStr = format_Fecha_String(todayDate).replace(/\//g, "");
  const timeStr = formatTime(date).replace(/:/g, "");

newPDF.guardaReporte(`Reporte_Adeudos_Pendientes_${dateStr}${timeStr}`);
};

export const ImprimirExcel = (
  configuracion,
  fecha_ini,
  fecha_fin,
  selectedOption
) => {
  const newExcel = new ReporteExcel(configuracion);
  let Tw_Col = Array.from({ length: 14 }, () => Array(9).fill(0.0));
  let Tw_TGe = Array(9).fill(0.0);
  let Tw_Per = Array(14).fill("");
  let per_str;
  const { body } = configuracion;
  const documentosCobranza = body.documentos_cobranza;
  const alumnos = body.alumnos;
  let Pos_Act
  for (Pos_Act = 0; Pos_Act <= 13; Pos_Act++) {
    Tw_Per[Pos_Act] = "";
    Tw_Col[Pos_Act][1] = 0;
    Tw_Col[Pos_Act][2] = 0;
    Tw_Col[Pos_Act][3] = 0;
    Tw_Col[Pos_Act][4] = 0;
    Tw_Col[Pos_Act][5] = 0;
    Tw_Col[Pos_Act][6] = 0;
    Tw_Col[Pos_Act][7] = 0;
    Tw_Col[Pos_Act][8] = 0;
  }
  for (Pos_Act = 1; Pos_Act <= 8; Pos_Act++) {
    Tw_TGe[Pos_Act] = 0;
  }
  Tw_Per[1] = (fecha_ini.slice(0, 7)).replace(/-/g, "/");
  Tw_Per[12] = (fecha_fin.slice(0, 7)).replace(/-/g, "/");
  let adiciona;

  documentosCobranza.forEach((documento) => {
    const alumno = alumnos.find((alu) => alu.numero === documento.alumno);
    if (alumno) {
      adiciona = true;
      if (selectedOption === "sin_deudor") {
        if (alumno.estatus.toUpperCase() === "Cartera") {
          adiciona = false;
        } else {
          adiciona = true;
        }
      }
      if (selectedOption === "solo_deudores") {
        if (alumno.estatus.toUpperCase() === "Cartera") {
          adiciona = true;
        } else {
          adiciona = false;
        }
      }
    } else {
      adiciona = false;
    }
    if (adiciona === true) {
      per_str = documento.fecha.toString().slice(0, 7);
      if (per_str < Tw_Per[1]) {
        Pos_Act = 0;
      } else if (per_str > Tw_Per[12]) {
        Pos_Act = 13;
      } else {
        for (Pos_Act = 1; Pos_Act <= 13; Pos_Act++) {
          if (Tw_Per[Pos_Act] === per_str) break;
          if (Tw_Per[Pos_Act] === "") {
            Tw_Per[Pos_Act] = per_str;
            break;
          }
        }
      }
      if (Pos_Act < 13) {
        if (documento.ref.toString().toUpperCase() === "COL") {
          Tw_Col[Pos_Act][1] = Number(Tw_Col[Pos_Act][1]) + documento.importe;
          Tw_Col[Pos_Act][2] = Number(Tw_Col[Pos_Act][2]) + documento.importe * (documento.descuento / 100);
        }
        if (documento.ref.toString().toUpperCase() === "INS") {
          Tw_Col[Pos_Act][3] = Number(Tw_Col[Pos_Act][3]) + documento.importe;
          Tw_Col[Pos_Act][4] = Number(Tw_Col[Pos_Act][4]) + documento.importe * (documento.descuento / 100);
        }
        if (documento.ref.toString().toUpperCase() === "REC") {
          Tw_Col[Pos_Act][4] = Number(Tw_Col[Pos_Act][4]) + documento.importe;
        }
        if (documento.ref.toString().toUpperCase() == "TAL") {
          Tw_Col[Pos_Act][5] = Number(Tw_Col[Pos_Act][5]) + documento.importe;
        }
        Tw_Col[Pos_Act][8] = Number(Tw_Col[Pos_Act][8]) + documento.importe_pago;
      }
    }
  });
  let imp_total;
  let data = [];
  for (Pos_Act = 0; Pos_Act <= 13; Pos_Act++) {
    imp_total =
      Number(Tw_Col[Pos_Act][1]) -
      Number(Tw_Col[Pos_Act][2]) +
      Number(Tw_Col[Pos_Act][3]) +
      Number(Tw_Col[Pos_Act][4]) +
      Number(Tw_Col[Pos_Act][5]);
    Tw_TGe[1] = Number(Tw_TGe[1]) + Number(Tw_Col[Pos_Act][1]);
    Tw_TGe[2] = Number(Tw_TGe[2]) + Number(Tw_Col[Pos_Act][2]);
    Tw_TGe[3] = Number(Tw_TGe[3]) + Number(Tw_Col[Pos_Act][3]);
    Tw_TGe[4] = Number(Tw_TGe[4]) + Number(Tw_Col[Pos_Act][4]);
    Tw_TGe[5] = Number(Tw_TGe[5]) + Number(Tw_Col[Pos_Act][5]);
    Tw_TGe[6] = Number(Tw_TGe[6]) + Number(Tw_Col[Pos_Act][6]);
    Tw_TGe[7] = Number(Tw_TGe[7]) + Number(imp_total);
    Tw_TGe[8] = Number(Tw_TGe[8]) + Number(Tw_Col[Pos_Act][8]);
    const sum = Number(imp_total) - Number(Tw_Col[Pos_Act][8].toString());
    data.push({
      periodo: Tw_Per[Pos_Act].toString(),
      coleg: formatNumber(Tw_Col[Pos_Act][1].toString()),
      desc: formatNumber(Tw_Col[Pos_Act][2].toString()),
      inscrip: formatNumber(Tw_Col[Pos_Act][3].toString()),
      recargo: formatNumber(Tw_Col[Pos_Act][4].toString()),
      taller: formatNumber(Tw_Col[Pos_Act][5].toString()),
      total: formatNumber(imp_total.toString()),
      cobro: formatNumber(Tw_Col[Pos_Act][8].toString()),
      saldo: formatNumber(sum.toString()),
    });
  }
  const sum = Number(Tw_TGe[7].toString()) - Number(Tw_TGe[8].toString());
  data.push({
    periodo: "Total",
    coleg: formatNumber(Tw_TGe[1].toString()),
    desc: formatNumber(Tw_TGe[2].toString()),
    inscrip: formatNumber(Tw_TGe[3].toString()),
    recargo: formatNumber(Tw_TGe[4].toString()),
    taller: formatNumber(Tw_TGe[5].toString()),
    total: formatNumber(Tw_TGe[7].toString()),
    cobro: formatNumber(Tw_TGe[8].toString()),
    saldo: formatNumber(sum.toString()),
  });
  const { columns } = configuracion;
  const {nombre} = configuracion
  newExcel.setColumnas(columns);
  newExcel.addData(data);
  const date = new Date();
  const todayDate = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  const dateStr = format_Fecha_String(todayDate).replace(/\//g, "");
  const timeStr = formatTime(date).replace(/:/g, "");
  newExcel.guardaReporte(`${nombre}${dateStr}${timeStr}`);
};

const Enca1 = (doc) => {
  if (!doc.tiene_encabezado) {
    doc.imprimeEncabezadoPrincipalV();
    doc.nextRow(12);
    doc.ImpPosX("Periodo", 14, doc.tw_ren);
    doc.ImpPosX("Coleg.", 34, doc.tw_ren);
    doc.ImpPosX("Desc.", 54, doc.tw_ren);
    doc.ImpPosX("Inscrip.", 74, doc.tw_ren);
    doc.ImpPosX("Recargo", 94, doc.tw_ren);
    doc.ImpPosX("Taller", 114, doc.tw_ren);
    doc.ImpPosX("Total", 134, doc.tw_ren);
    doc.ImpPosX("Cobro", 154, doc.tw_ren);
    doc.ImpPosX("Saldo", 174, doc.tw_ren);
    doc.nextRow(4);
    doc.printLineV();
    doc.nextRow(4);
    doc.tiene_encabezado = true;
  } else {
    doc.nextRow(6);
    doc.tiene_encabezado = true;
  }
};
