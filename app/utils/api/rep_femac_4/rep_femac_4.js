import { ReportePDF } from "@/app/utils/ReportesPDF";
import { formatTime, format_Fecha_String } from "@/app/utils/globalfn";

export const getFotoAlumno = async (token, imagen) => {
  let url = `${process.env.DOMAIN_API}api/students/imagen/${imagen}`;
  const res = await fetch(url, {
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
      xescuela: localStorage.getItem("xescuela"),
    },
  });
  const blob = await res.blob();
  return blob;
};

export const getCredencialFormato = async (token, id) => {
  let url = "";
  url = `${process.env.DOMAIN_API}api/facturasformato/${id}`;

  const res = await fetch(url, {
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': "application/json",
      xescuela: localStorage.getItem("xescuela"),
    },
  });
  const resJson = await res.json();
  return resJson.data;
};

export const getCredencialAlumno = async (token, formData) => {
  let url = "";
  url = `${process.env.DOMAIN_API}api/reportes/rep_femac_4`;

  const res = await fetch(url, {
    method: "POST",
    body: formData,
    headers: new Headers({
      Authorization: "Bearer " + token,
      xescuela: localStorage.getItem("xescuela"),
    }),
  });
  const resJson = await res.json();
  return resJson.data;
};

export const Imprimir = (configuracion) => {
  const reporte = new ReportePDF(configuracion, "landscape");
  let doc = reporte.getDoc();
  const { body, formato, imagen } = configuracion;
  const match = imagen.match(/^data:image\/([a-zA-Z0-9]+);base64,/);
  const valorMatch = match ? match[1] : null;
  if (
    imagen &&
    typeof imagen === "string" &&
    imagen.startsWith(`data:image/${valorMatch};base64,`)
  ) {
    doc.addImage(imagen, valorMatch, 10, 10, 80, 80);
  }
  const conX = 0.4;
  const conY = 0.4;
  formato.forEach((formato) => {
    
    switch (formato.descripcion_campo) {
      case "No. Alumno":
        reporte.ImpPosX(
          body.alumno.numero.toString(),
          formato.columna_impresion * conX,
          formato.renglon_impresion * conY,
          0,
          "R"
        );
        break;
      case "Ciclo escolar":
        reporte.ImpPosX(
          body.alumno.ciclo_escolar.toString(),
          formato.columna_impresion * conX,
          formato.renglon_impresion * conY,
          0,
          "L"
        );
        break;
      case "Fecha nacimiento":
        reporte.ImpPosX(
          body.alumno.fecha_nac.toString(),
          formato.columna_impresion * conX,
          formato.renglon_impresion * conY,
          0,
          "L"
        );
        break;
      case "Nombre":
        reporte.ImpPosX(
          body.alumno.nombre.toString(),
          formato.columna_impresion * conX,
          formato.renglon_impresion * conY,
          0,
          "L"
        );
        break;
      case "Dirección":
        reporte.ImpPosX(
          body.alumno.direccion.toString(),
          formato.columna_impresion * conX,
          formato.renglon_impresion * conY,
          0,
          "L"
        );
        break;
      case "Colonia":
        reporte.ImpPosX(
          body.alumno.colonia.toString(),
          formato.columna_impresion * conX,
          formato.renglon_impresion * conY,
          0,
          "L"
        );
        break;
    }
  });
  const date = new Date();
  const todayDate = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  const dateStr = format_Fecha_String(todayDate).replace(/\//g, "");
  const timeStr = formatTime(date).replace(/:/g, "");
  reporte.guardaReporte(`Credencial_Alumno_${body.alumno.nombre}_${dateStr}${timeStr}`);
};
