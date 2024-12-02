import { ReporteExcel } from "@/app/utils/ReportesExcel";
import { ReportePDF } from "@/app/utils/ReportesPDF";

export const getCobranza = async (token, fecha, alumnoIni, alumnoFin, sinDeudores) => {
    const res = await fetch(`${process.env.DOMAIN_API}api/documentoscobranza/all`, {
        method: "POST",
        body: JSON.stringify({
            fecha_inicial: fecha,
            alumno_ini: alumnoIni,
            alumno_fin: alumnoFin,
            sin_deudores: sinDeudores,
        }),
        headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        },
    });
    const resJson = await res.json();
    return resJson.data;
}

export const Enca1 = (doc, alumno, seccion, cuenta, fecha) => {
    if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalV();
        doc.nextRow(10);
        doc.ImpPosX("COLEGIO BILINGÜE WINDSOR S.C.", 75, doc.tw_ren, 0, "L");
        doc.nextRow(5);
        doc.ImpPosX(`CUENTA DEPÓSITO ${cuenta ?? ""}`, 15, doc.tw_ren, 0, "L");
        doc.nextRow(5);
        doc.ImpPosX(`F E C H A ${fecha ?? ""}`, 150, doc.tw_ren, 0, "L");
        doc.nextRow(10);
        doc.ImpPosX(`Nombre del Alumno ${alumno ?? ""}`, 15, doc.tw_ren, 0, "L");
        doc.ImpPosX(`Sección ${seccion ?? ""}`, 130, doc.tw_ren, 0, "L");
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
    const newPDF = new ReportePDF(configuracion, "Portrait");
    const { body } = configuracion;
    Enca1(newPDF);
    body.forEach((alumnos) => {
        const id = calculaDigitoBvba((alumnos.numero || '').toString() || '');
        const nombre = `${(alumnos.a_nombre || '')} ${(alumnos.a_paterno || '')} ${(alumnos.a_materno || '')}`.substring(0, 50);
        const estatus = ((alumnos.estatus || '')).toString().substring(0, 12);
        const fecha_nac = ((alumnos.fecha_nac || '')).toString().substring(0, 15);
        const horario_1_nombre = ((alumnos.horario_1_nombre || '')).toString().substring(0, 15);
        const telefono = ((alumnos.telefono1 || '')).toString().substring(0, 15);
        newPDF.ImpPosX(`${alumnos.numero}-${id}`, 23, newPDF.tw_ren, 0, "R");
        newPDF.ImpPosX(nombre, 25, newPDF.tw_ren, 0, "L");
        newPDF.ImpPosX(estatus, 110, newPDF.tw_ren, 0, "L");
        newPDF.ImpPosX(fecha_nac, 125, newPDF.tw_ren, 0, "L");
        newPDF.ImpPosX(horario_1_nombre, 147, newPDF.tw_ren, 0, "L");
        newPDF.ImpPosX(telefono, 200, newPDF.tw_ren, 0, "R");
        if (alumnos.baja === '*') {
            newPDF.tw_ren += 5;
            const fecha_baja = ((alumnos.fecha_baja || '')).toString().substring(0, 15);
            newPDF.ImpPosX(`Fecha de Baja: ${fecha_baja}`, 25, newPDF.tw_ren);
        }
        Enca1(newPDF);
        if (newPDF.tw_ren >= newPDF.tw_endRen) {
            newPDF.pageBreak();
            Enca1(newPDF);
        }
    });
    const date = new Date();
    const todayDate = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    const dateStr = format_Fecha_String(todayDate).replace(/\//g, "");
    const timeStr = formatTime(date).replace(/:/g, "");

    newPDF.guardaReporte(`Relacion_General_Alumnos_${dateStr}${timeStr}`);
};