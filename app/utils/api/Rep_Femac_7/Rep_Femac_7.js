import { ReporteExcel } from "../../ReportesExcel";
import { ReportePDF } from "../../ReportesPDF";

export const Documentos = async (token, fecha, grupo) => {
  const group = grupo ? 1 : 0;
  const res = await fetch(
    `${process.env.DOMAIN_API}api/documentoscobranza/${fecha}/${group}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const resJson = await res.json();
  return resJson.data;
};
const Enca1 = (doc) => {
  if (!doc.tiene_encabezado) {
    doc.imprimeEncabezadoPrincipalH();
    doc.nextRow(12);
    doc.ImpPosX("Alumno", 14, doc.tw_ren);
    doc.ImpPosX("Nombre", 28, doc.tw_ren);
    doc.ImpPosX("Producto", 108, doc.tw_ren);
    doc.ImpPosX("Descripcion", 128, doc.tw_ren);
    doc.ImpPosX("Fecha", 208, doc.tw_ren);
    doc.ImpPosX("Saldo", 228, doc.tw_ren);
    doc.ImpPosX("Total", 248, doc.tw_ren);
    doc.ImpPosX("Telefono", 268, doc.tw_ren);
    doc.nextRow(4);
    doc.printLineH();
    doc.nextRow(4);
    doc.tiene_encabezado = true;
  } else {
    doc.nextRow(6);
    doc.tiene_encabezado = true;
  }
};
export const Imprimir = async (
  configuracion,
  grupoAlumno,
  token,
  fecha,
  sinDeudores,
  documento
) => {
  const orientacion = "landscape";
  const newPDF = new ReportePDF(configuracion, orientacion);
  Enca1(newPDF);
  if (grupoAlumno) {
    const data = await grupo_cobranza(token);
    let num_Ord = 0;
    let nom_grupo = "";
    let grupo_ant = "";
    let grupo_act = "";

    for (const dato of data) {
      if (dato.horario_1 > 0) {
        grupo_act = dato.horario_1;

        if (grupo_ant !== grupo_act) {
          num_Ord = 1;
          nom_grupo = dato.horario;
        }

        const res = await fetch(
          `${process.env.DOMAIN_API}api/documentoscobranza/grupo`,
          {
            method: "PUT",
            body: JSON.stringify({
              alumno: dato.id,
              nomGrupo: dato.horario,
              numOrd: num_Ord,
              baja: dato.baja,
            }),
            headers: new Headers({
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            }),
          }
        );
        if (res.status) break;
        grupo_ant = grupo_act;
      }
    }
  }

  let si_Imp;
  let alu_Ant = 0;
  let alu_Act = 0;
  let total_General = 0;
  let grupo_ant = "";
  let grupo_act = "";
  let nombre;
  let saldo;
  let saldoTotal = 0; // Inicializa saldoTotal a 0
  const data = await Documentos(token, fecha, grupoAlumno);
  const documentos = data.documentos;
  const indeces = data.indeces;
  const alumnos = data.alumnos;

  documentos.forEach((doc, index) => {
    grupo_act = doc.grupo;
    alu_Act = doc.alumno;
    if (grupoAlumno) {
      if (grupo_act !== grupo_ant) {
        newPDF.ImpPosX("Grupo " + grupo_act, 14, newPDF.tw_ren);
        newPDF.nextRow(4);
      }
    }
    if (alu_Ant !== doc.alumno) {
      const incide = indeces.find((ind) => ind.Alumno === alu_Act);
      si_Imp = incide && incide.Incide >= documento;

      if (sinDeudores === true) {
        const estatus = alumnos.find((alu) => alu.id === alu_Act);
        if (
          estatus.estatus.toUpperCase() === "DEUDOR" ||
          estatus.estatus.toUpperCase() === "CARTERA"
        ) {
          si_Imp = false;
        }
      }
    }
    if (si_Imp === true) {
      newPDF.ImpPosX(alu_Act.toString(), 14, newPDF.tw_ren);
      const data = alumnos.find((alu) => alu.id === alu_Act);
      nombre = data.nombre;
      newPDF.ImpPosX(nombre.toString(), 28, newPDF.tw_ren);
      newPDF.ImpPosX(doc.producto.toString(), 108, newPDF.tw_ren);
      newPDF.ImpPosX(doc.descripcion.toString(), 128, newPDF.tw_ren);
      newPDF.ImpPosX(doc.fecha.toString(), 208, newPDF.tw_ren);
      saldo = doc.importe - doc.importe * (doc.descuento / 100);
      saldoTotal += saldo;
      total_General += saldo;
      newPDF.ImpPosX(saldo.toFixed(2).toString(), 228, newPDF.tw_ren);

      const isLastRecordForAlumno =
        index === documentos.length - 1 ||
        documentos[index + 1].alumno !== alu_Act;

      if (isLastRecordForAlumno) {
        newPDF.ImpPosX(saldoTotal.toFixed(2).toString(), 248, newPDF.tw_ren);
        newPDF.ImpPosX(data.telefono_1.toString(), 268, newPDF.tw_ren);
        saldoTotal = 0;
        newPDF.nextRow(5);
      }

      Enca1(newPDF);
      if (newPDF.tw_ren >= newPDF.tw_endRen) {
        newPDF.pageBreakH();
        Enca1(newPDF);
      }
    }
    grupo_ant = grupo_act;
    alu_Ant = alu_Act;
  });
  newPDF.ImpPosX("Total General", 208, newPDF.tw_ren);
  newPDF.ImpPosX(total_General.toFixed(2).toString(), 248, newPDF.tw_ren);
  newPDF.guardaReporte("Reporte de Adeudos Pendientes");
};

export const ImprimirExcel = async (
  configuracion,
  grupoAlumno,
  token,
  fecha,
  sinDeudores,
  documento
) => {
  const newExcel = new ReporteExcel(configuracion);
  if (grupoAlumno) {
    const data = await grupo_cobranza(token);
    let num_Ord = 0;
    let nom_grupo = "";
    let grupo_ant = "";
    let grupo_act = "";
    for (const dato of data) {
      if (dato.horario_1 > 0) {
        grupo_act = dato.horario_1;

        if (grupo_ant !== grupo_act) {
          num_Ord = 1;
          nom_grupo = dato.horario;
        }

        const res = await fetch(
          `${process.env.DOMAIN_API}api/documentoscobranza/grupo`,
          {
            method: "PUT",
            body: JSON.stringify({
              alumno: dato.id,
              nomGrupo: dato.horario,
              numOrd: num_Ord,
              baja: dato.baja,
            }),
            headers: new Headers({
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            }),
          }
        );
        if (res.status) break;
        grupo_ant = grupo_act;
      }
    }
  }

  let si_Imp;
  let alu_Ant = 0;
  let alu_Act = 0;
  let total_General = 0;
  let grupo_ant = "";
  let grupo_act = "";
  let Nombre;
  let saldo;
  let saldoTotal = 0; // Inicializa saldoTotal a 0
  const data = await Documentos(token, fecha, grupoAlumno);
  const documentos = data.documentos;
  const indeces = data.indeces;
  const alumnos = data.alumnos;
  let Docs = [];
  documentos.forEach((doc, index) => {
    grupo_act = doc.grupo;
    alu_Act = doc.alumno;
    if (grupoAlumno) {
      if (grupo_act !== grupo_ant) {
        Docs.push({
          alumno: "Grupo " + grupo_act,
          nombre: "",
          producto: "",
          descripcion: "",
          fecha: "",
          saldo: "",
          total: "",
          telefono: "",
        });
      }
    }
    if (alu_Ant !== doc.alumno) {
      const incide = indeces.find((ind) => ind.Alumno === alu_Act);
      si_Imp = incide && incide.Incide >= documento;

      if (sinDeudores === true) {
        const estatus = alumnos.find((alu) => alu.id === alu_Act);
        if (
          estatus.estatus.toUpperCase() === "DEUDOR" ||
          estatus.estatus.toUpperCase() === "CARTERA"
        ) {
          si_Imp = false;
        }
      }
    }
    if (si_Imp === true) {
      const data = alumnos.find((alu) => alu.id === alu_Act);
      Nombre = data.nombre;
      saldo = doc.importe - doc.importe * (doc.descuento / 100);
      saldoTotal += saldo;
      total_General += saldo;
      Docs.push({
        alumno: alu_Act,
        nombre: Nombre,
        producto: doc.producto,
        descripcion: doc.descripcion,
        fecha: doc.fecha,
        saldo: saldo.toFixed(2),
        total: "",
        telefono: "",
      });
      const isLastRecordForAlumno =
        index === documentos.length - 1 ||
        documentos[index + 1].alumno !== alu_Act;
      if (isLastRecordForAlumno) {
        Docs.pop();
        Docs.push({
          alumno: alu_Act,
          nombre: Nombre,
          producto: doc.producto,
          descripcion: doc.descripcion,
          fecha: doc.fecha,
          saldo: saldo.toFixed(2),
          total: saldoTotal.toFixed(2),
          telefono: data.telefono_1,
        });
        saldoTotal = 0;
        Docs.push({
          alumno: "",
          nombre: "",
          producto: "",
          descripcion: "",
          fecha: "",
          saldo: "",
          total: "",
          telefono: "",
        });
      }
    }
    grupo_ant = grupo_act;
    alu_Ant = alu_Act;
  });
  Docs.push({
    alumno: "",
    nombre: "",
    producto: "",
    descripcion: "",
    fecha: "",
    saldo: "Total General",
    total: total_General.toFixed(2),
    telefono: "",
  });
  const { nombre } = configuracion;
  const { columns } = configuracion;
  newExcel.setColumnas(columns);
  newExcel.addData(Docs);
  newExcel.guardaReporte(nombre);
};

export const grupo_cobranza = async (token) => {
  // Agregado token como parámetro
  const res = await fetch(`${process.env.DOMAIN_API}api/documentoscobranza`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const resJson = await res.json();
  return resJson.data;
};
