import { ReporteExcel } from "@/app/utils/ReportesExcel";
import { ReportePDF } from "@/app/utils/ReportesPDF";
export const getAlumnos = async (token, baja) => {
  let url = "";
  baja
    ? (url = `${process.env.DOMAIN_API}api/students/bajas`)
    : (url = `${process.env.DOMAIN_API}api/students`);
  const res = await fetch(url, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
  const resJson = await res.json();
  return resJson.data;
};

export const getFotoAlumno = async (token, imagen) => {
  let url = `${process.env.DOMAIN_API}api/students/imagen/${imagen}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const blob = await res.blob();
  return URL.createObjectURL(blob);
};

export const getLastAlumnos = async (token) => {
  let url = `${process.env.DOMAIN_API}api/students/last`;
  const res = await fetch(url, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
  const resJson = await res.json();
  return resJson.data;
};

export const guardarAlumnos = async (token, formData, accion, id) => {
  let url = "";
  if (accion === "Alta") {
    url = `${process.env.DOMAIN_API}api/students/save`;
    formData.append("baja", "n");
  }
  if (accion === "Eliminar" || accion === "Editar") {
    if (accion === "Eliminar") {
      formData.append("baja", "*");
    } else {
      formData.append("baja", "n");
    }
    url = `${process.env.DOMAIN_API}api/students/update/${id}`;
  }
  const res = await fetch(`${url}`, {
    method: "POST",
    body: formData,
    headers: new Headers({
      Authorization: "Bearer " + token,
    }),
  });
  const resJson = await res.json();
  return resJson;
};

const Enca1 = (doc) => {
  if (!doc.tiene_encabezado) {
    doc.imprimeEncabezadoPrincipalV();
    doc.nextRow(12);
    doc.ImpPosX("Numero", 10, doc.tw_ren);
    doc.ImpPosX("Nombre", 25, doc.tw_ren);
    doc.ImpPosX("Dirección", 70, doc.tw_ren);
    doc.ImpPosX("Colonia", 100, doc.tw_ren);
    doc.ImpPosX("Fecha Nac", 130, doc.tw_ren);
    doc.ImpPosX("Fecha Alta", 155, doc.tw_ren);
    doc.ImpPosX("Telefono", 180, doc.tw_ren);
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
  console.log("body", body);
  Enca1(newPDF);
  body.forEach((alumnos) => {
    const id = alumnos.id.toString().substring(0, 25);
    const nombre = `${alumnos.nombre.toString()} ${alumnos.a_paterno} ${
      alumnos.a_materno
    }`.substring(0, 20);
    const direccion = alumnos.direccion.toString().substring(0, 12);
    const colonia = alumnos.colonia.toString().substring(0, 20);
    const fecha_nac = alumnos.fecha_nac.toString().substring(0, 15);
    const fecha_inscripcion = alumnos.fecha_inscripcion
      .toString()
      .substring(0, 15);
    const telefono = alumnos.telefono_1.toString().substring(0, 15);
    newPDF.ImpPosX(id, 10, newPDF.tw_ren);
    newPDF.ImpPosX(nombre, 25, newPDF.tw_ren);
    newPDF.ImpPosX(direccion, 70, newPDF.tw_ren);
    newPDF.ImpPosX(colonia, 100, newPDF.tw_ren);
    newPDF.ImpPosX(fecha_nac, 130, newPDF.tw_ren);
    newPDF.ImpPosX(fecha_inscripcion, 155, newPDF.tw_ren);
    newPDF.ImpPosX(telefono, 180, newPDF.tw_ren);
    Enca1(newPDF);
    if (newPDF.tw_ren >= newPDF.tw_endRen) {
      newPDF.pageBreak();
      Enca1(newPDF);
    }
  });
  newPDF.guardaReporte("Horarios");
};

export const ImprimirExcel = (configuracion) => {
  const newExcel = new ReporteExcel(configuracion);
  const { columns } = configuracion;
  const { body } = configuracion;
  const { nombre } = configuracion;
  newExcel.setColumnas(columns);
  newExcel.addData(body);
  newExcel.guardaReporte(nombre);
};
