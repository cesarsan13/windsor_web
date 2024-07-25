import { ReporteExcel } from "@/app/utils/ReportesExcel";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import { calculaDigitoBvba } from "@/app/utils/globalfn";

export const getRelaciondeRecibos = async (token, tomaFecha, fecha_ini, fecha_fin, factura_ini, factura_fin, recibo_ini, recibo_fin, alumno_ini, alumno_fin) => {
    let url = `${process.env.DOMAIN_API}api/reportes/rep_femac_8_anexo_1`
    const res = await fetch(url, {
        method: "post",
        body: JSON.stringify({
            tomaFecha: tomaFecha,
            fecha_ini: fecha_ini,
            fecha_fin: fecha_fin,
            factura_ini: factura_ini,
            factura_fin: factura_fin,
            recibo_ini: recibo_ini,
            recibo_fin: recibo_fin,
            alumno_ini: alumno_ini,
            alumno_fin: alumno_fin,
        }),
        headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json"
        }
    })
    const resJson = await res.json();
    return resJson.data;
}

const Enca2 = (doc) => {
    if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalV();
        doc.nextRow(12);
        doc.ImpPosX("Recibo", 5, doc.tw_ren);
        doc.ImpPosX("Factura", 20, doc.tw_ren);
        doc.ImpPosX("Fecha P", 35, doc.tw_ren);
        doc.ImpPosX("No.", 55, doc.tw_ren);
        doc.ImpPosX("Nombre Alumno", 65, doc.tw_ren);
        doc.ImpPosX("Total Rec.", 180, doc.tw_ren);
        doc.nextRow(4);
        doc.printLineF();
        doc.nextRow(4);
        doc.tiene_encabezado = true;
    } else {
        doc.nextRow(6);
        doc.tiene_encabezado = true;
    }
};

export const verImprimir = async (configuracion, impr) => {
    const newPDF = new ReportePDF(configuracion);
    const { body } = configuracion;
    Enca2(newPDF);
    let total = 0;
    body.forEach((rec) => {
        const recibo = (rec.recibo || '').toString();
        const factura = (rec.numero_factura || '').toString();
        const fecha = (rec.fecha || '').toString();
        const idAl = (rec.alumno || '').toString();
        const nombre = `${rec.nombre_alumno || ''}`;
        let importe_total = parseFloat(rec.importe_total) || 0;
        if (importe_total !== 0) {
            total += importe_total;
        }
        newPDF.ImpPosX(recibo, 6, newPDF.tw_ren);
        newPDF.ImpPosX(factura, 20, newPDF.tw_ren);
        newPDF.ImpPosX(fecha, 35, newPDF.tw_ren);
        newPDF.ImpPosX(idAl, 55, newPDF.tw_ren);
        newPDF.ImpPosX(nombre, 65, newPDF.tw_ren);
        if (importe_total === 0) {
            newPDF.ImpPosX(`CANCELADO`, 180, newPDF.tw_ren);
        } else {
            newPDF.ImpPosX(importe_total.toFixed(2), 180, newPDF.tw_ren);
        }
        Enca2(newPDF);
        if (newPDF.tw_ren >= newPDF.tw_endRen) {
            newPDF.pageBreak();
            Enca2(newPDF);
        }
    });

    newPDF.ImpPosX(`Total: ${total.toFixed(2)}` || '', 170, newPDF.tw_ren);
    const pdfData = newPDF.doc.output("datauristring");
    return pdfData;
};


const Enca1 = (doc) => {
    if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalH();
        doc.nextRow(12);
        doc.ImpPosX("Recibo", 15, doc.tw_ren);
        doc.ImpPosX("Factura", 35, doc.tw_ren);
        doc.ImpPosX("Fecha P", 55, doc.tw_ren);
        doc.ImpPosX("No.", 85, doc.tw_ren);
        doc.ImpPosX("Nombre Alumno", 100, doc.tw_ren);
        doc.ImpPosX("Total Rec.", 250, doc.tw_ren);
        doc.nextRow(4);
        doc.printLineH();
        doc.nextRow(4);
        doc.tiene_encabezado = true;
    } else {
        doc.nextRow(6);
        doc.tiene_encabezado = true;
    }
};

export const Imprimir = (configuracion, impr) => {
    const orientacion = 'Landscape'
    const newPDF = new ReportePDF(configuracion, orientacion);
    const { body } = configuracion;
    Enca1(newPDF);
    let total = 0;
    body.forEach((rec) => {
        const recibo = (rec.recibo || '').toString();
        const factura = (rec.numero_factura || '').toString();
        const fecha = (rec.fecha || '').toString();
        const idAl = (rec.alumno || '').toString();
        const nombre = `${rec.nombre_alumno || ''}`;
        let importe_total = parseFloat(rec.importe_total) || 0;
        if (importe_total !== 0) {
            total += importe_total;
        }
        newPDF.ImpPosX(recibo, 17, newPDF.tw_ren);
        newPDF.ImpPosX(factura, 35, newPDF.tw_ren);
        newPDF.ImpPosX(fecha, 55, newPDF.tw_ren);
        newPDF.ImpPosX(idAl, 85, newPDF.tw_ren);
        newPDF.ImpPosX(nombre, 100, newPDF.tw_ren);
        if (importe_total === 0) {
            newPDF.ImpPosX(`CANCELADO`, 250, newPDF.tw_ren);
        } else {
            newPDF.ImpPosX(importe_total.toFixed(2), 250, newPDF.tw_ren);
        }
        Enca1(newPDF);
        if (newPDF.tw_ren >= newPDF.tw_endRen) {
            newPDF.pageBreak();
            Enca1(newPDF);
        }
    });
    newPDF.ImpPosX(`Total: ${total.toFixed(2)}` || '', 240, newPDF.tw_ren);
    newPDF.guardaReporte("rep_relacion_recibos");
};


export const ImprimirExcel = (configuracion) => {
    const newExcel = new ReporteExcel(configuracion);
    const { columns, body, nombre } = configuracion;
    const newBody = [];
    let total = 0;
    body.forEach((rec) => {
        let importe_total = parseFloat(rec.importe_total) || 0;
        if (importe_total !== 0) {
            total += importe_total;
        }
        if (importe_total === 0) {
            newBody.push({
                recibo: rec.recibo,
                factura: rec.numero_factura,
                fecha: rec.fecha,
                alumno: rec.alumno,
                nombre_alumno: rec.nombre_alumno,
                importe_total: 'CANCELADO'
            });
        } else {
            newBody.push({
                recibo: rec.recibo,
                factura: rec.numero_factura,
                fecha: rec.fecha,
                alumno: rec.alumno,
                nombre_alumno: rec.nombre_alumno,
                importe_total: importe_total.toFixed(2)
            });
        }
    });
    newBody.push({
        recibo: '',
        factura: '',
        fecha: '',
        alumno: '',
        nombre_alumno: 'Total',
        importe_total: total.toFixed(2)
    });
    newExcel.setColumnas(columns);
    newExcel.addData(newBody);
    newExcel.guardaReporte(nombre);
};


