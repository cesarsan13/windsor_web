import { ReporteExcel } from "../../ReportesExcel";
import { ReportePDF } from "../../ReportesPDF";
import { calculaDigitoBvba, format_Fecha_String } from "../../globalfn";

export const getReporteCobranzaporAlumno = async (token, fecha_ini, fecha_fin, alumno_ini,
    alumno_fin, cajero_ini, cajero_fin, tomaFechas) => {
        const res = await fetch (`${process.env.DOMAIN_API}api/reportes/rep_femac_11_anexo_3`,{
            method: "post",
            body: JSON.stringify({
                tomafecha: tomaFechas,
                fecha_cobro_ini: format_Fecha_String(fecha_ini),
                fecha_cobro_fin: format_Fecha_String(fecha_fin),
                alumno_ini: alumno_ini,
                alumno_fin: alumno_fin,
                cajero_ini: cajero_ini,
                cajero_fin: cajero_fin
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
const Enca1 = (doc, fecha_ini, fecha_fin, cajero_ini, cajero_fin, tomaFechas) => {
  if (!doc.tiene_encabezado) {
    doc.imprimeEncabezadoPrincipalV();
    doc.nextRow(8);
    if(tomaFechas === true)
    {
      if(fecha_fin == '')
      {
          doc.ImpPosX(`Reporte de cobranza del ${fecha_ini} `,15,doc.tw_ren),
          doc.nextRow(5);
      }
      else{
          doc.ImpPosX(`Reporte de cobranza del ${fecha_ini} al ${fecha_fin}`,15,doc.tw_ren),
          doc.nextRow(5);
      }
    }
    if(cajero_ini === undefined || cajero_ini == ""){
      cajero_ini = {
        numero:undefined
      };
    }
    if(cajero_fin === undefined || cajero_fin == ""){
      cajero_fin = {
        numero:undefined
      };
    }
    if(cajero_fin.numero  === undefined)
    {
      if(cajero_ini.numero !== undefined){
        doc.ImpPosX(`Cajero seleccionado: ${cajero_ini.numero} `,15,doc.tw_ren),
        doc.nextRow(10);
      }
      
    }
    else{
      doc.ImpPosX(`Cajeros seleccionado de ${cajero_ini.numero} al ${cajero_fin.numero}`,15,doc.tw_ren),
      doc.nextRow(10);
    }
    
    doc.ImpPosX("No.",15,doc.tw_ren),
    doc.ImpPosX("Nombre",50,doc.tw_ren),
    doc.nextRow(5);
    doc.ImpPosX("Producto",15,doc.tw_ren),
    doc.ImpPosX("Descripcion",30,doc.tw_ren),
    doc.ImpPosX("Documento",70,doc.tw_ren),
    doc.ImpPosX("Fecha P",90,doc.tw_ren),
    doc.ImpPosX("Importe",110,doc.tw_ren),
    doc.ImpPosX("Recibo",130,doc.tw_ren),
    doc.ImpPosX("Pago 1",143,doc.tw_ren),
    doc.ImpPosX("Pago 2",163,doc.tw_ren),
    doc.ImpPosX("Cajero",183,doc.tw_ren),
    doc.nextRow(4);
    doc.printLineV();
    doc.nextRow(4);
    doc.tiene_encabezado = true;
  } else {
    doc.nextRow(6);
    doc.tiene_encabezado = true;
  }
};


export const ImprimirPDF = (configuracion, fecha_ini, fecha_fin, cajero_ini, cajero_fin, tomaFechas) =>{
  const orientacion = 'Portrait'
  const newPDF = new ReportePDF(configuracion, orientacion);
  const { body } = configuracion;
  const F_fecha_ini = format_Fecha_String(fecha_ini)
  const F_fecha_fin = format_Fecha_String(fecha_fin)
  console.log("Body => ",body)
    let alumno_Ant = "";
    let total_importe = 0;
    let total_general = 0;
  
    const Cambia_Alumno = (doc, total_importe) => {
        doc.ImpPosX(`TOTAL: ${total_importe.toString()}` || '', 97, doc.tw_ren);
        doc.nextRow(8);
    }
  
    Enca1(newPDF,F_fecha_ini, F_fecha_fin, cajero_ini, cajero_fin, tomaFechas);
    body.forEach((reporte2) => {
        let tipoPago2 = " ";
        let nombre = " ";
  
        if(reporte2.nombre === null){
          nombre = " ";
        }else{
          nombre = reporte2.nombre;
        }
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
  
        if(reporte2.id_al !== alumno_Ant && reporte2.id_al != null){
          newPDF.ImpPosX(reporte2.id_al +"-"+ calculaDigitoBvba(reporte2.id_al.toString()),15, newPDF.tw_ren, 0, "R");
            newPDF.ImpPosX(reporte2.nom_al,50, newPDF.tw_ren, 0 , "L");
            Enca1(newPDF);
            if (newPDF.tw_ren >= newPDF.tw_endRen) {
              newPDF.pageBreak();
                Enca1(newPDF);
            }
        }
        newPDF.setFontSize(8)
        newPDF.ImpPosX(reporte2.articulo.toString(),15, newPDF.tw_ren, 0 , "L");
        newPDF.ImpPosX(reporte2.descripcion.toString(),30, newPDF.tw_ren, 0 , "L");
        // newPDF.ImpPosX(reporte2.numero_doc.toString(),70, newPDF.tw_ren, 0 , "R");
        newPDF.ImpPosX(reporte2.numero_doc.toString(),87, newPDF.tw_ren, 0 , "R");
        newPDF.ImpPosX(reporte2.fecha.toString(),90, newPDF.tw_ren, 0 , "L");
        newPDF.ImpPosX(reporte2.importe.toString(),122, newPDF.tw_ren, 0 , "R");
        newPDF.ImpPosX(reporte2.recibo.toString(),140, newPDF.tw_ren, 0 , "R");
        newPDF.ImpPosX(reporte2.desc_Tipo_Pago_1.toString(),143, newPDF.tw_ren, 0 , "L");
        newPDF.ImpPosX(tipoPago2.toString(),163, newPDF.tw_ren, 0 , "L");
        newPDF.ImpPosX(nombre.toString(),183, newPDF.tw_ren, 0 , "L");
  
        Enca1(newPDF,F_fecha_ini, F_fecha_fin, cajero_ini, cajero_fin, tomaFechas);
      if (newPDF.tw_ren >= newPDF.tw_endRen) {
        newPDF.pageBreak();
        Enca1(newPDF,F_fecha_ini, F_fecha_fin, cajero_ini, cajero_fin, tomaFechas);
      }
        total_importe = total_importe + reporte2.importe;
        total_general = total_general + reporte2.importe;
        alumno_Ant = reporte2.id_al;
    });
    Cambia_Alumno(newPDF, total_importe);
    
    newPDF.ImpPosX(`TOTAL IMPORTE: ${total_general}` || '', 80, newPDF.tw_ren, 0 , "R");
    newPDF.guardaReporte("Reporte Cobranza por Alumno(s)")
  
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
    let nombre = " ";

    if(imp.nombre === null){
      nombre = " ";
    }else{
      nombre = imp.nombre;
    }
    if(imp.desc_Tipo_Pago_2 === null)
    {
        tipoPago2 = " ";
    }
    else{
        tipoPago2 = imp.desc_Tipo_Pago_2;
    }

    if(imp.id_al !== alumno_Ant && imp.id_al != null){
      data1.push({
        articulo: imp.id_al+"-"+ calculaDigitoBvba(imp.id_al.toString()),
        descripcion: imp.nom_al,
        numero_doc: "",
        fecha: "",
        importe: "",
        recibo: "",
        desc_Tipo_Pago_1: "",
        desc_Tipo_Pago_2: "",
        nombre: "",
      })
    }

    data1.push({
      articulo: imp.articulo,
      descripcion: imp.descripcion,
      numero_doc: imp.numero_doc,
      fecha: imp.fecha,
      importe: imp.importe,
      recibo: imp.recibo,
      desc_Tipo_Pago_1: imp.desc_Tipo_Pago_1,
      desc_Tipo_Pago_2: tipoPago2,
      nombre: imp.nombre,
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
    desc_Tipo_Pago_1: "",
    desc_Tipo_Pago_2: "",
    nombre: "",
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
    desc_Tipo_Pago_1: "",
    desc_Tipo_Pago_2: "",
    nombre: "",
  });
  data.push({
    articulo: "",
    descripcion: "",
    numero_doc: "",
    fecha: "",
    importe: "",
    recibo: "",
    desc_Tipo_Pago_1: "",
    desc_Tipo_Pago_2: "",
    nombre: "",
  });
};