import { ReporteExcel } from "@/app/utils/ReportesExcel";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import { format_Fecha_String } from "../../globalfn";

export const getRelaciondeFacturas = async (token, tomaFecha, tomaCanceladas, fecha_cobro_ini, fecha_cobro_fin, factura_ini, factura_fin) => {
    factura_ini = (factura_ini === '' || factura_ini === undefined) ? 0 : factura_ini;
    factura_fin = (factura_fin === '' || factura_fin === undefined) ? 0 : factura_fin;

    console.log(tomaFecha, tomaCanceladas, fecha_cobro_ini, fecha_cobro_fin, factura_ini, factura_fin);
    let url = `${process.env.DOMAIN_API}api/reportes/rep_femac_9_anexo_4`
    const res = await fetch(url, {
        method: "post",
        body: JSON.stringify({
            tomaFecha: tomaFecha,
            tomaCanceladas: tomaCanceladas,
            fecha_cobro_ini: format_Fecha_String(fecha_cobro_ini),
            fecha_cobro_fin: format_Fecha_String(fecha_cobro_fin),
            factura_ini: factura_ini,
            factura_fin: factura_fin,
        }),
        headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json"
        }
    })
    const resJson = await res.json();
    return resJson.data;
}

const Enca1 = (doc,fecha_cobro_ini, fecha_cobro_fin, tomaFechas, tomaCanceladas) => {
    if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalV();
            doc.nextRow(8);
            if(tomaFechas === true)
            {
                if(fecha_cobro_fin == '')
                {
                    doc.ImpPosX(`Reporte de Factura del ${fecha_cobro_ini} `,15,doc.tw_ren),
                    doc.nextRow(5);
                }
                else{
                    doc.ImpPosX(`Reporte de Facturas del ${fecha_cobro_ini} al ${fecha_cobro_fin}`,15,doc.tw_ren),
                    doc.nextRow(5);
                }
            }
            
            if(tomaCanceladas === true){
              doc.ImpPosX("Facturas Canceladas", 15, doc.tw_ren),
              doc.nextRow(5);
            }

            doc.ImpPosX("Factura",15,doc.tw_ren),
            doc.ImpPosX("Recibo",30,doc.tw_ren),
            doc.ImpPosX("Fecha P",45,doc.tw_ren),
            doc.ImpPosX("Nombre",68,doc.tw_ren),
            doc.ImpPosX("Subtotal",145,doc.tw_ren),
            doc.ImpPosX("I.V.A",165,doc.tw_ren),
            doc.ImpPosX("Total",180,doc.tw_ren),
            doc.nextRow(4);
            doc.printLineV();
            doc.nextRow(4);
            doc.tiene_encabezado = true;
    } else {
        doc.nextRow(6);
        doc.tiene_encabezado = true;
    }
};

export const ImprimirPDF = (configuracion, fecha_cobro_ini, fecha_cobro_fin, tomaFechas, tomaCanceladas) => {
    const newPDF = new ReportePDF(configuracion, "Portrait");
    const { body } = configuracion;
    Enca1(newPDF, fecha_cobro_ini, fecha_cobro_fin, tomaFechas, tomaCanceladas);
    let total_general = 0;

    body.forEach((imp) => {
        const noFac = imp.numero_factura;
        const recibo = imp.recibo;
        const fecha = imp.fecha;
        const razon_social = imp.razon_social;
        const ivaimp = imp.iva;
        const iva = imp.iva;
        const cantidad = imp.cantidad;
        const precio_unitario = imp.precio_unitario;
        const descuento = imp.descuento;

        let total_importe = 0; 
        let sub_total = 0;
        const r_s_nombre = "FACTURA GLOBAL DEL DIA";
        let razon_social_cambio = "";

        total_importe = cantidad * precio_unitario;
        total_importe = total_importe - (total_importe *(descuento / 100));

        if (iva > 0 ){
          sub_total = total_importe * (iva / 100);
          sub_total += total_importe;

        } else if (iva < 0 || iva === 0){
          sub_total = total_importe;
        }

        if(razon_social === '' || razon_social === ' '){
          razon_social_cambio = r_s_nombre;
        } else {
          razon_social_cambio = razon_social;
       
        }
          newPDF.ImpPosX(noFac.toString(), 15, newPDF.tw_ren);
          newPDF.ImpPosX(recibo.toString(), 30, newPDF.tw_ren);
          newPDF.ImpPosX(fecha, 45, newPDF.tw_ren);
          newPDF.ImpPosX(razon_social_cambio, 68, newPDF.tw_ren);
          newPDF.ImpPosX(total_importe.toFixed(2), 145, newPDF.tw_ren);
          newPDF.ImpPosX(`${ivaimp} %`.toString(), 165, newPDF.tw_ren);
          newPDF.ImpPosX(sub_total.toFixed(2), 180, newPDF.tw_ren);
       
        Enca1(newPDF);
        if (newPDF.tw_ren >= newPDF.tw_endRen) {
          newPDF.pageBreak();
          Enca1(newPDF, fecha_cobro_ini, fecha_cobro_fin, tomaFechas, tomaCanceladas);
        }
        total_general = total_general + sub_total;

    });
    newPDF.nextRow(4);
    newPDF.ImpPosX(`TOTAL IMPORTE: ${total_general.toFixed(2)}`|| '', 149, newPDF.tw_ren);

    newPDF.guardaReporte("rep_relacion_facturas");
}

export const ImprimirExcel = (configuracion) => {
    const newExcel = new ReporteExcel(configuracion);
    const { columns, body, nombre } = configuracion;
    const newBody = [];
    
    let total_general = 0;

    body.forEach((rec) => {
        const noFac = rec.numero_factura;
        const recibo = rec.recibo;
        const fecha = rec.fecha;
        const razon_social = rec.razon_social;
        const ivaimp = rec.iva;
        const iva = rec.iva;
        const cantidad = rec.cantidad;
        const precio_unitario = rec.precio_unitario;
        const descuento = rec.descuento;

        let total_importe = 0; 
        let sub_total = 0;
        const r_s_nombre = "FACTURA GLOBAL DEL DIA";
        let razon_social_cambio = "";

        total_importe = cantidad * precio_unitario;
        total_importe = total_importe - (total_importe *(descuento / 100));

        if (iva > 0 ){
          sub_total = total_importe * (iva / 100);
          sub_total += total_importe;

        } else if (iva < 0 || iva === 0){
          sub_total = total_importe;
        }

        if(razon_social === '' || razon_social === ' '){
          razon_social_cambio = r_s_nombre;
        } else {
          razon_social_cambio = razon_social;
       
        }

        newBody.push({
            facturaI: noFac,
            reciboI: recibo,
            fechapI: fecha,
            nombreI: razon_social_cambio,
            subtotalI: total_importe.toFixed(2),
            ivaI: `${ivaimp} %`,
            totalI: sub_total.toFixed(2)
        });

        total_general = total_general + sub_total;
    });
    newBody.push({
        facturaI: '',
        reciboI: '',
        fechapI: '',
        nombreI: '',
        subtotalI: '',
        ivaI: 'TOTAL IMPORTE',
        totalI: total_general.toFixed(2)
    });
    newExcel.setColumnas(columns);
    newExcel.addData(newBody);
    newExcel.guardaReporte(nombre);
};


