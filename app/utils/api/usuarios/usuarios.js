import { ReporteExcel } from "../../ReportesExcel";
import { ReportePDF } from "../../ReportesPDF";

export const getUsuarios = async (token, baja) => {
  let url = "";
  baja
    ? (url = `${process.env.DOMAIN_API}api/usuario/baja`)
    : (url = `${process.env.DOMAIN_API}api/usuario/get`);

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      xescuela: localStorage.getItem("xescuela"),
    },
  });
  const resJson = await res.json();
  return resJson.data;
};

const Enca1 = (doc) => {
  if (!doc.tiene_encabezado) {
    doc.imprimeEncabezadoPrincipalV();
    doc.nextRow(12);
    doc.ImpPosX("Id", 15, doc.tw_ren);
    doc.ImpPosX("Usuario", 30, doc.tw_ren);
    doc.ImpPosX("Nombre", 70, doc.tw_ren);
    doc.ImpPosX("email", 150, doc.tw_ren);

    doc.nextRow(4);
    doc.printLineV();
    doc.nextRow(4);
    doc.tiene_encabezado = true;
  } else {
    doc.nextRow(6);
    doc.tiene_encabezado = true;
  }
};

export const ImprimirPDF = (configuracion) => {
  const orientacion = 'Portrait'  //Aqui se agrega la orientacion del documento PDF puede ser Landscape(Horizontal) o Portrait (Vertical)
  const newPDF = new ReportePDF(configuracion, orientacion);
  const { body } = configuracion;
  Enca1(newPDF);
  body.forEach((usuarios) => {
    newPDF.ImpPosX(usuarios.id.toString(), 20, newPDF.tw_ren, 0, "R");
    newPDF.ImpPosX(usuarios.name.toString(), 30, newPDF.tw_ren, 35, "L");
    newPDF.ImpPosX(usuarios.nombre.toString(), 70, newPDF.tw_ren, 35, "L");
    newPDF.ImpPosX(usuarios.email.toString(), 150, newPDF.tw_ren, 35, "L");
    Enca1(newPDF);
    if (newPDF.tw_ren >= newPDF.tw_endRen) {
      newPDF.pageBreak();
      Enca1(newPDF);
    }
  });
  newPDF.guardaReporte("Usuarios")
};
export const ImprimirExcel = (configuracion) => {
  const newExcel = new ReporteExcel(configuracion)
  const { columns } = configuracion
  const { body } = configuracion
  const { nombre } = configuracion
  newExcel.setColumnas(columns);
  newExcel.addData(body);
  newExcel.guardaReporte(nombre);
}

export const updateContraseña = async (data, $id) => {
  let url = `${process.env.DOMAIN_API}api/usuario/update-password/` + $id;
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      new_password: data.new_password,
      confirm_new_password: data.confirm_new_password,
      name: data.name,
      email: data.email,
      revoke_tokens: data.revoke_tokens,
    }),
    headers: {
      "Content-Type": "application/json",
      xescuela: localStorage.getItem("xescuela"),
    },
  });
  const resJson = await res.json();
  return resJson;
};

export const guardaUsuario = async (token, data, accion) => {
  let url_api = "";
  if (accion === "Alta") {
    url_api = `${process.env.DOMAIN_API}api/usuario/post`;
    data.baja = "";
  }
  if (accion === "Eliminar" || accion === "Editar") {
    if (accion === "Eliminar") {
      data.baja = "*";
      url_api = `${process.env.DOMAIN_API}api/usuario/delete`;
    } else {
      data.baja = "";
      url_api = `${process.env.DOMAIN_API}api/usuario/update`;
    }
  }
  const res = await fetch(`${url_api}`, {
    method: "POST",
    body: JSON.stringify({
      id: data.id,
      name: data.name,
      nombre: data.nombre,
      email: data.email,
      password: data.password,
      baja: data.baja,
      numero_prop: data.numero_prop
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
