import { ReporteExcel } from "@/app/utils/ReportesExcel";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import { format_Fecha_String, formatNumber, obtenerFechaYHoraActual, PoneCeros } from "@/app/utils/globalfn";

export const getCobranza = async (token, fecha, alumnoIni, alumnoFin, sinDeudores, grupoAlumno) => {
    const res = await fetch(`${process.env.DOMAIN_API}api/documentoscobranza/all`, {
        method: "POST",
        body: JSON.stringify({
            fecha_inicial: fecha,
            alumno_ini: alumnoIni,
            alumno_fin: alumnoFin,
            sin_deudores: sinDeudores,
            grupo_alumno: grupoAlumno,
        }),
        headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
            xescuela: localStorage.getItem("xescuela"),
        },
    });
    const resJson = await res.json();
    return resJson.data;
}

export const Enca1 = (doc, alumno = "", seccion = "", fecha = "") => {
    if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalV();
        doc.setFontSize(14);
        doc.nextRow(10);
        doc.ImpPosX("COLEGIO BILINGÜE WINDSOR S.C.", 60, doc.tw_ren, 0, "L");
        doc.setFontSize(10);
        doc.nextRow(7);
        doc.ImpPosX("CUENTA DEPÓSITO CONVENIO  CIE  861790", 15, doc.tw_ren, 0, "L");
        doc.nextRow(7);
        doc.ImpPosX(`F E C H A ${format_Fecha_String(fecha) ?? ""}`, 150, doc.tw_ren, 0, "L");
        doc.nextRow(10);
        doc.ImpPosX(`NOMBRE DEL ALUMNO: ${alumno ?? ""}`, 15, doc.tw_ren, 50, "L");
        doc.ImpPosX(`SECCIÓN: ${seccion?.toString().toUpperCase() ?? ""}`, 130, doc.tw_ren, 0, "L");
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
    let alumnAnt = null;
    let siImp = false;
    let saldo_total = 0;
    let alumnoData = {};
    const { body, alumnos, fecha_in } = configuracion;
    body.forEach((item, index) => {
        if (alumnAnt !== item.alumno) {
            if (alumnAnt !== null) {
                const ref = "100910" + PoneCeros(parseInt(alumnAnt), 4);
                newPDF.tw_ren = 260;
                newPDF.ImpPosX(`C A N T I D A D    A    P A G A R           ${formatNumber(saldo_total)}`, 100, newPDF.tw_ren, 0, "C");
                newPDF.nextRow(5);
                newPDF.ImpPosX(`EL PAGO DEBERÁ HACERSE EN BBVA, S.A.   REFERENCIA...${ref}`, 100, newPDF.tw_ren, 0, "C");
                newPDF.nextRow(5);
                newPDF.ImpPosX("UNICAMENTE PARA TRANSFERENCIAS ELECTRONICAS CLABE 012180004505271730", 100, newPDF.tw_ren, 0, "C");
                newPDF.nextRow(5);
                newPDF.ImpPosX("PONER EN CONCEPTO NUMERO DE REFERENCIA", 100, newPDF.tw_ren, 0, "C");
                newPDF.nextRow(5);
                newPDF.ImpPosX("FAVOR DE NO HACER CORRECCIONES      REALIZAR PAGO EXACTO", 100, newPDF.tw_ren, 0, "C");
                newPDF.nextRow(5);
                saldo_total = 0
            }
            alumnoData = alumnos.find(alumno => alumno.numero === item.alumno);
            siImp = alumnoData && alumnoData.baja !== "*" && item.tw_saldo >= 0.09;
            if (siImp) {
                newPDF.tw_ren = 280;
                Enca1(newPDF, alumnoData.nombre, alumnoData.horario_1_nombre, fecha_in);
            };
        };
        Enca1(newPDF, alumnoData.nombre, alumnoData.horario_1_nombre, fecha_in);
        if (newPDF.tw_ren >= newPDF.tw_endRen - 30) {
            newPDF.pageBreak();
            Enca1(newPDF, alumnoData.nombre, alumnoData.horario_1_nombre, fecha_in);
        };
        if (siImp && item.tw_saldo >= 0.09) {
            newPDF.ImpPosX(item.producto.toString(), 25, newPDF.tw_ren, 0, "R");
            newPDF.ImpPosX(item.producto_descripcion.toString(), 40, newPDF.tw_ren, 0, "L");
            newPDF.ImpPosX(item.numero_doc.toString(), 135, newPDF.tw_ren, 0, "R");
            newPDF.ImpPosX(item.fecha.toString(), 140, newPDF.tw_ren, 0, "L");
            newPDF.ImpPosX(formatNumber(item.tw_saldo.toString()), 190, newPDF.tw_ren, 0, "R");
            saldo_total = saldo_total + item.tw_saldo;
        };
        alumnAnt = item.alumno;
        if (index === body.length - 1) {
            const ref = "100910" + PoneCeros(parseInt(alumnAnt), 4);
            newPDF.tw_ren = 260;
            newPDF.ImpPosX(`C A N T I D A D    A    P A G A R           ${formatNumber(saldo_total)}`, 100, newPDF.tw_ren, 0, "C");
            newPDF.nextRow(5);
            newPDF.ImpPosX(`EL PAGO DEBERÁ HACERSE EN BBVA, S.A.   REFERENCIA...${ref}`, 100, newPDF.tw_ren, 0, "C");
            newPDF.nextRow(5);
            newPDF.ImpPosX("UNICAMENTE PARA TRANSFERENCIAS ELECTRONICAS CLABE 012180004505271730", 100, newPDF.tw_ren, 0, "C");
            newPDF.nextRow(5);
            newPDF.ImpPosX("PONER EN CONCEPTO NUMERO DE REFERENCIA", 100, newPDF.tw_ren, 0, "C");
            newPDF.nextRow(5);
            newPDF.ImpPosX("FAVOR DE NO HACER CORRECCIONES      REALIZAR PAGO EXACTO", 100, newPDF.tw_ren, 0, "C");
            newPDF.nextRow(5);
            saldo_total = 0
        };
    });
    const { fecha, hora } = obtenerFechaYHoraActual();
    newPDF.guardaReporte(`Reporte_Recibos_Pago_${fecha}${hora}`);
};