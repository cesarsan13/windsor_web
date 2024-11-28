import { ReporteExcel } from "@/app/utils/ReportesExcel";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import { calculaDigitoBvba } from "@/app/utils/globalfn";
import { formatDate, formatTime, formatFecha, format_Fecha_String } from "../../globalfn";

export const getCredencialFormato = async (token, id) => {
    let url = "";
    url = `${process.env.DOMAIN_API}api/facturasformato/${id}`;
  
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const resJson = await res.json();
    return resJson.data;
  };
  export const getCredencialAlumno = async (token,formData) => {
    let url = "";
    url = `${process.env.DOMAIN_API}api/reportes/rep_femac_4`;
  
    const res = await fetch(url, {
      method: "POST",
      body: formData,
      headers: new Headers({
        Authorization: "Bearer " + token,
      }),
    });
    const resJson = await res.json();
    return resJson.data;
  };


  const Enca1 = (doc) => {
    if (!doc.tiene_encabezado) {
      doc.imprimeEncabezadoPrincipalV();
      doc.nextRow(12);
      doc.ImpPosX("No", 15, doc.tw_ren);
      doc.ImpPosX("Nombre", 35, doc.tw_ren);
      doc.ImpPosX("Dia", 170, doc.tw_ren);
      doc.ImpPosX("Mes", 180, doc.tw_ren);
      doc.ImpPosX("Año", 190, doc.tw_ren);
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
    const reporte = new ReportePDF(configuracion,"landscape");
    const { body,formato } = configuracion;
    const conX = 0.4;
    const conY = 0.4;
    formato.forEach((formato) => {
        switch (formato.descripcion_campo) {
            case "No. Alumno":
                reporte.ImpPosX(body.alumno.numero.toString(), (formato.columna_impresion*conX),(formato.renglon_impresion*conY), 0, "R");
                break;
            case "Ciclo escolar":
                reporte.ImpPosX(body.alumno.ciclo_escolar.toString(), (formato.columna_impresion*conX),(formato.renglon_impresion*conY), 0, "L");
                break;
            case "Fecha nacimiento":
                reporte.ImpPosX(body.alumno.fecha_nac.toString(), (formato.columna_impresion*conX),(formato.renglon_impresion*conY), 0, "L");
                break;
            case "Nombre":
                reporte.ImpPosX(body.alumno.nombre.toString(), (formato.columna_impresion*conX),(formato.renglon_impresion*conY), 0, "L");
                break;
            case "Dirección":
                reporte.ImpPosX(body.alumno.direccion.toString(), (formato.columna_impresion*conX),(formato.renglon_impresion*conY), 0, "L");
                break;
            case "Colonia":
                reporte.ImpPosX(body.alumno.colonia.toString(), (formato.columna_impresion*conX),(formato.renglon_impresion*conY), 0, "L");
                break;
          }
      });
    const date = new Date();
      const todayDate = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
      const dateStr = format_Fecha_String(todayDate).replace(/\//g, "");
      const timeStr = formatTime(date).replace(/:/g, "");
  
    reporte.guardaReporte(`Credencial_Alumno_${dateStr}${timeStr}`);
  };