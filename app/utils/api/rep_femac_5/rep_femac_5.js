import { ReporteExcel } from "@/app/utils/ReportesExcel";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import { calculaDigitoBvba } from "@/app/utils/globalfn";

export const getReportAltaBajaAlumno = async (token, baja, tipoOrden, fecha_ini, fecha_fin) => {
    let url = `${process.env.DOMAIN_API}api/students/report/AltaBaja`
    const res = await fetch(url, {
        method: "post",
        body: JSON.stringify({
            baja: baja,
            tipoOrden: tipoOrden,
            fecha_ini: fecha_ini,
            fecha_fin: fecha_fin,
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
        doc.ImpPosX("Nombre", 5, doc.tw_ren);
        doc.ImpPosX("Dia", 150, doc.tw_ren);
        doc.ImpPosX("Mes", 160, doc.tw_ren);
        doc.ImpPosX("Año", 170, doc.tw_ren);
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
    body.forEach((alumno) => {
        const nombre = `${alumno.nombre || ''} ${alumno.a_paterno || ''} ${alumno.a_materno || ''}`;
        let fecha;
        fecha = new Date(alumno.fecha_nac);
        const diaFor = fecha.getDate().toString().padStart(2, '0');
        const mesFor = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const añoFor = fecha.getFullYear().toString();
        newPDF.ImpPosX(nombre, 5, newPDF.tw_ren);
        newPDF.ImpPosX(diaFor, 150, newPDF.tw_ren);
        newPDF.ImpPosX(mesFor, 160, newPDF.tw_ren);
        newPDF.ImpPosX(añoFor, 170, newPDF.tw_ren);
        Enca2(newPDF)
        if (newPDF.tw_ren >= newPDF.tw_endRen) {
            newPDF.pageBreak();
            Enca2(newPDF);
        }
    });
    const pdfData = newPDF.doc.output("datauristring");
    return pdfData;
};

const Enca1 = (doc) => {
    if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalH();
        doc.nextRow(12);
        doc.ImpPosX("Nombre", 15, doc.tw_ren);
        doc.ImpPosX("Dia", 170, doc.tw_ren);
        doc.ImpPosX("Mes", 180, doc.tw_ren);
        doc.ImpPosX("Año", 190, doc.tw_ren);
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
    body.forEach((alumno) => {
        const nombre = `${alumno.nombre || ''} ${alumno.a_paterno || ''} ${alumno.a_materno || ''}`;
        let fecha;
        fecha = new Date(alumno.fecha_nac);
        const diaFor = fecha.getDate().toString().padStart(2, '0');
        const mesFor = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const añoFor = fecha.getFullYear().toString();
        newPDF.ImpPosX(nombre, 15, newPDF.tw_ren);
        newPDF.ImpPosX(diaFor, 170, newPDF.tw_ren);
        newPDF.ImpPosX(mesFor, 180, newPDF.tw_ren);
        newPDF.ImpPosX(añoFor, 190, newPDF.tw_ren);
        newPDF.tw_ren += 1;
        Enca1(newPDF);
        console.log('ini ren', newPDF.tw_ren, 'fin ren', newPDF.tw_endRen);
        if (newPDF.tw_ren >= newPDF.tw_endRen) {
            newPDF.pageBreak();
            Enca1(newPDF);
        }
    });
    newPDF.guardaReporte("Alumnos")
};

export const ImprimirExcel = (configuracion) => {
    const newExcel = new ReporteExcel(configuracion);
    const { columns } = configuracion;
    const { body } = configuracion;
    const { nombre } = configuracion;
    const newBody = [];
    body.forEach((alumno) => {
        newBody.push({
            ...alumno,
            id: `${alumno.id}-${calculaDigitoBvba(alumno.id.toString())}`
        });
        if (alumno.baja === '*') {
            newBody.push({
                id: '',
                nombre: '',
                estatus: '',
                fecha_nac: ((`Fecha de Baja: ${alumno.fecha_baja}` || '')).toString(),
                horario_1_nombre: '',
                telefono_1: ''
            });
        }
    });
    newExcel.setColumnas(columns);
    newExcel.addData(newBody);
    newExcel.guardaReporte(nombre);
};

