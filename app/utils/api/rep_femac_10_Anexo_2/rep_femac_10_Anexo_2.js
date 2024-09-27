import { ReporteExcel } from "../../ReportesExcel";
import { ReportePDF } from "../../ReportesPDF";
import { calculaDigitoBvba, format_Fecha_String, formatNumber } from "../../globalfn";

export const getReporteEstadodeCuenta = async (token, fecha_ini, fecha_fin, alumno_ini,
    alumno_fin, tomaFechas) => {
        const res = await fetch (`${process.env.DOMAIN_API}api/reportes/rep_femac_10_anexo_2`,{
            method: "post",
            body: JSON.stringify({
                tomafecha: tomaFechas,
                fecha_cobro_ini: format_Fecha_String(fecha_ini),
                fecha_cobro_fin: format_Fecha_String(fecha_fin),
                alumno_ini: alumno_ini,
                alumno_fin: alumno_fin
            }),
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          });
          const resJson = await res.json();
          return resJson.data;
    }

//Impresion de encabezado
const Enca1 = (doc, fecha_ini, fecha_fin, tomaFechas) => {
  if (!doc.tiene_encabezado) {
    doc.imprimeEncabezadoPrincipalV();
    doc.nextRow(8);
    if(tomaFechas === true)
    {
      if(fecha_fin == '')
      {
          doc.ImpPosX(`Reporte de cobranza del ${fecha_ini} `, 15, doc.tw_ren, 0, "L"),
          doc.nextRow(5);
      }
      else{
          doc.ImpPosX(`Reporte de cobranza del ${fecha_ini} al ${fecha_fin}`, 15, doc.tw_ren, 0, "L"),
          doc.nextRow(5);
      }
    }

    doc.nextRow(5);
    doc.ImpPosX("No.", 15, doc.tw_ren, 0, "L"),
    doc.ImpPosX("Nombre", 30, doc.tw_ren, 0, "L"),
    doc.ImpPosX("Cursa", 100, doc.tw_ren, 0, "L"),
    doc.ImpPosX("Fecha Nac", 135, doc.tw_ren, 0, "L"),
    doc.ImpPosX("Fecha Insc", 155, doc.tw_ren, 0, "L"),
    doc.nextRow(5);
    doc.ImpPosX("Documento", 15, doc.tw_ren, 0, "L"),
    doc.ImpPosX("producto", 35, doc.tw_ren, 0, "L"),
    doc.ImpPosX("Descripcion", 53, doc.tw_ren, 0, "L"),
    doc.ImpPosX("Fecha P", 130, doc.tw_ren, 0, "L"),
    doc.ImpPosX("Importe", 165, doc.tw_ren, 0, "L"),
    doc.ImpPosX("Recibo", 185, doc.tw_ren, 0, "L"),
    doc.nextRow(4);
    doc.printLineV();
    doc.nextRow(4);
    doc.tiene_encabezado = true;
  } else {
    doc.nextRow(6);
    doc.tiene_encabezado = true;
  }
};


export const ImprimirPDF = (configuracion, fecha_ini, fecha_fin, tomaFechas) =>{
  const orientacion = 'Portrait'
  const newPDF = new ReportePDF(configuracion, orientacion);
  const { body } = configuracion;

  let alumno_Ant = "";
  let total_importe = 0;
  let total_general = 0;

  const Cambia_Alumno = (doc, total_importe) => {
      doc.ImpPosX(`TOTAL: ${formatNumber(total_importe)}` || "", 157, doc.tw_ren, 0, "R");
      doc.nextRow(8);
  }

  Enca1(newPDF,fecha_ini, fecha_fin, tomaFechas);
      body.forEach((reporte2) => {
          let tipoPago2 = " ";
          
      if(reporte2.desc_Tipo_Pago_2 === null)
      {
          tipoPago2 = " ";
      }
      else{
          tipoPago2 = reporte2.desc_Tipo_Pago_2;
      }

      if(reporte2.id_al !== alumno_Ant && alumno_Ant !== ""){
          Cambia_Alumno(newPDF, total_importe);
          total_importe = 0;
      }

      if(reporte2.id_al !== alumno_Ant){
          newPDF.ImpPosX(reporte2.id_al +"-"+ calculaDigitoBvba(reporte2.id_al.toString()), 15, newPDF.tw_ren, 0, "L");
          newPDF.ImpPosX(reporte2.nom_al.toString(), 30, newPDF.tw_ren, 0, "L");
          newPDF.ImpPosX(reporte2.horario_nom.toString(), 100, newPDF.tw_ren, 0, "L");
          newPDF.ImpPosX(reporte2.fecha_nac_al.toString(), 135, newPDF.tw_ren, 0, "L");
          newPDF.ImpPosX(reporte2.fecha_ins_al.toString(), 155, newPDF.tw_ren, 0, "L");
          Enca1(newPDF);
          if (newPDF.tw_ren >= newPDF.tw_endRen) {
            newPDF.pageBreak();
              Enca1(newPDF);
          }
      }
      newPDF.ImpPosX(reporte2.numero_doc.toString(), 33, newPDF.tw_ren, 0, "R");
      newPDF.ImpPosX(reporte2.articulo.toString(), 49, newPDF.tw_ren, 0, "R");
      newPDF.ImpPosX(reporte2.descripcion.toString(), 53, newPDF.tw_ren, 0, "L");
      
      newPDF.ImpPosX(reporte2.fecha.toString(), 130, newPDF.tw_ren, 0, "L");
      newPDF.ImpPosX(formatNumber(reporte2.importe), 176, newPDF.tw_ren, 0, "R");
      newPDF.ImpPosX(reporte2.recibo.toString(), 195, newPDF.tw_ren, 0, "R");

      Enca1(newPDF,fecha_ini, fecha_fin, tomaFechas);
    if (newPDF.tw_ren >= newPDF.tw_endRen) {
      newPDF.pageBreak();
      Enca1(newPDF,fecha_ini, fecha_fin, tomaFechas);
    }
      total_importe = total_importe + reporte2.importe;
      total_general = total_general + reporte2.importe;
      alumno_Ant = reporte2.id_al;
  });
  Cambia_Alumno(newPDF, total_importe);
  
  newPDF.ImpPosX(`TOTAL IMPORTE: ${formatNumber(total_general)}` || "",
      157, newPDF.tw_ren, 0, "R"
    );
  newPDF.guardaReporte(`Reporte Estado de Cuenta del dia ${fecha_ini} al ${fecha_fin}`)
};

export const ImprimirExcel = (configuracion) =>{
  const newExcel = new ReporteExcel(configuracion);
  let alumno_Ant = "";
  let total_importe = 0;
  let total_general = 0;

  const { body } = configuracion;
  const { columns } = configuracion;
  const { columns2 } = configuracion;
  const { nombre } = configuracion;
  newExcel.setColumnas(columns);
  newExcel.setColumnas(columns2);
  let data1 = [];

  body.forEach((imp) => {
    if(imp.id_al !== alumno_Ant && alumno_Ant !== ""){
      Cambia_Alumno_Excel(total_importe, data1);
      total_importe = 0;
    }

    let tipoPago2 = " ";
    if(imp.desc_Tipo_Pago_2 === null)
    {
        tipoPago2 = " ";
    }
    else{
        tipoPago2 = imp.desc_Tipo_Pago_2;
    }

    if(imp.id_al !== alumno_Ant){
      data1.push({
        numero_doc: imp.id_al+"-"+ calculaDigitoBvba(imp.id_al.toString()),
        articulo: imp.nom_al,
        descripcion: imp.horario_nom,
        fecha: imp.fecha_nac_al,
        importe: imp.fecha_ins_al,
        recibo: "",
        
      })
    }

    data1.push({
      numero_doc: imp.numero_doc,
      articulo: imp.articulo,
      descripcion: imp.descripcion,
      fecha: imp.fecha,
      importe: imp.importe,
      recibo: imp.recibo,

    });

    total_importe = total_importe + imp.importe;
    total_general = total_general + imp.importe;
    alumno_Ant = imp.id_al;

  });

  Cambia_Alumno_Excel(total_importe, data1);
  data1.push({
    articulo: "",
    descripcion: "",
    numero_doc: "",
    fecha: "TOTAL GENERAL",
    importe: total_general,
    recibo: "",
  });
  newExcel.addData(data1);
  newExcel.guardaReporte(nombre);
};

const Cambia_Alumno_Excel = (total_importe, data) => {
  data.push({
    articulo: "",
    descripcion: "",
    numero_doc: "",
    fecha: "TOTAL",
    importe: total_importe,
    recibo: "",

  });
  data.push({
    articulo: "",
    descripcion: "",
    numero_doc: "",
    fecha: "",
    importe: "",
    recibo: "",

  });
};