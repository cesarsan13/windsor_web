import { ReporteExcel } from "@/app/utils/ReportesExcel";
import { ReportePDF } from "@/app/utils/ReportesPDF";

export const getProcesoCalificaciones = async (token, data) => {
    let url = `${process.env.DOMAIN_API}api/proceso/calificaciones-get`
    const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            numero: data.numero,
            nombre: data.nombre,
            grupo: data.grupo_nombre,
            materia: data.materia,
            bimestre: data.bimestre,
            cb_actividad: data.cb_actividad,
            actividad: data.actividad,
            unidad: data.evaluacion,
        }),
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    const resJson = await res.json();
    return resJson;
};

export const getProcesoCalificacionesAlumnos = async (token, data) => {
    let url = `${process.env.DOMAIN_API}api/proceso/calificaciones-alumnos`
    const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            grupo: data.grupo,
        }),
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    const resJson = await res.json();
    return resJson;
};

export const guardarProcesoCalificaciones = async (token, data, data2) => {
    let url = `${process.env.DOMAIN_API}api/proceso/guardar-calificaciones`
    const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            alumno: data.numero,
            calificacion: data.calificacion || "0.00",
            materia: data2.materia,
            grupo: data2.grupo,
            bimestre: data2.bimestre,
            actividad: data2.actividad,
            unidad: data2.evaluacion,
        }),
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    const resJson = await res.json();
    return resJson;
}

const Enca1 = (doc) => {
    if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalH();
        doc.nextRow(12);
        doc.ImpPosX("Numero", 15, doc.tw_ren);
        doc.ImpPosX("Alumno", 30, doc.tw_ren);
        doc.ImpPosX("Unidad", 140, doc.tw_ren);
        doc.ImpPosX("Calificación", 170, doc.tw_ren);
        doc.nextRow(4);
        doc.printLineH();
        doc.nextRow(4);
        doc.tiene_encabezado = true;
    } else {
        doc.nextRow(6);
        doc.tiene_encabezado = true;
    }
};

export const ImprimirPDF = (configuracion) => {
    const orientacion = 'Landscape'
    const newPDF = new ReportePDF(configuracion, orientacion);
    const { body } = configuracion;
    Enca1(newPDF);
    body.forEach((calificacion) => {
        newPDF.ImpPosX(calificacion.numero.toString(), 25, newPDF.tw_ren, 0, "R");
        newPDF.ImpPosX(calificacion.nombre.toString(), 30, newPDF.tw_ren, 35, "L");
        newPDF.ImpPosX(calificacion.unidad.toString(), 150, newPDF.tw_ren, 35, "R");
        newPDF.ImpPosX(calificacion.calificacion.toString(), 183, newPDF.tw_ren, 35, "R");
        Enca1(newPDF);
        if (newPDF.tw_ren >= newPDF.tw_endRenH) {
            newPDF.pageBreakH();
            Enca1(newPDF);
        }
    });
    newPDF.guardaReporte("Calificaciones")
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
