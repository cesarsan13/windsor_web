import { ReporteExcel } from "@/app/utils/ReportesExcel";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import { format_Fecha_String, formatNumber } from "@/app/utils/globalfn";

export const getConsultasInscripcion = async (token) => {
    let url = `${process.env.DOMAIN_API}api/reportes/rep_inscritos`
    const res = await fetch(url, {
        headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json"
        }
    });
    const resJson = await res.json();
    return resJson;
}

const Enca1 = (doc) => {
    if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalV();
        doc.nextRow(12);
        doc.ImpPosX("No.", 15, doc.tw_ren);
        doc.ImpPosX("Nombre", 30, doc.tw_ren);
        doc.ImpPosX("Grado", 125, doc.tw_ren);
        doc.ImpPosX("Fecha", 160, doc.tw_ren);
        doc.ImpPosX("Importe", 185, doc.tw_ren);
        doc.nextRow(4);
        doc.printLineV();
        doc.nextRow(4);
        doc.tiene_encabezado = true;
    } else {
        doc.nextRow(6);
        doc.tiene_encabezado = true;
    }
};

export const verImprimir = async (configuracion) => {
    let total_inscripcion = 0;
    let alumnos = 0;
    let si_inscrito = false;
    const newPDF = new ReportePDF(configuracion, "Portrait");
    const { bodyAlumnos } = configuracion;
    const { bodyDetalles } = configuracion;
    const { bodyProductos } = configuracion;
    const { bodyHorarios } = configuracion;
    const fecha_ini = format_Fecha_String(configuracion.fecha_ini);
    const fecha_fin = format_Fecha_String(configuracion.fecha_fin);
    Enca1(newPDF);
    bodyAlumnos.forEach((alumno) => {
        let det_inscripcion = 0;
        let si_suma = false;
        let fecha_inscripcion = "";
        const detalleEncontrado = bodyDetalles.filter(detalle =>
            detalle.alumno === alumno.numero &&
            detalle.fecha >= fecha_ini &&
            detalle.fecha <= fecha_fin
        );
        if (detalleEncontrado) {
            detalleEncontrado.forEach((detalle) => {
                const productoEncontrado = bodyProductos.filter(producto =>
                    producto.ref === 'INS' &&
                    producto.numero === detalle.articulo
                );
                if (productoEncontrado) {
                    console.log('entro');
                    si_inscrito = true;
                    si_suma = true;
                    det_inscripcion += detalle.precio_unitario * detalle.cantidad;
                    total_inscripcion += detalle.precio_unitario * detalle.cantidad;
                } else { console.log('no entro'); };
                fecha_inscripcion = detalle.fecha;
            });
            if (si_suma) {
                const nombre = `${(alumno.a_nombre || '')} ${(alumno.a_paterno || '')} ${(alumno.a_materno || '')}`.substring(0, 50);
                newPDF.ImpPosX(alumno.numero.toString() || '', 15, newPDF.tw_ren);
                newPDF.ImpPosX(nombre.toString(), 30, newPDF.tw_ren);
                const horarioEncontrado = bodyHorarios.find(
                    horario => horario.numero === alumno.horario_1
                );
                if (horarioEncontrado) {
                    newPDF.ImpPosX(horarioEncontrado.horario.toString() || '', 125, newPDF.tw_ren);
                }
                newPDF.ImpPosX(fecha_inscripcion.toString() || '', 160, newPDF.tw_ren);
                newPDF.ImpPosX(formatNumber(det_inscripcion) || '0.00', 185, newPDF.tw_ren);
                alumnos += 1;
                Enca1(newPDF);
            }
            det_inscripcion = 0;
        }
        if (newPDF.tw_ren >= newPDF.tw_endRen) {
            newPDF.pageBreak();
            Enca1(newPDF);
        }
    });
    newPDF.nextRow(4);
    newPDF.ImpPosX(`Total: ${formatNumber(total_inscripcion)}` || '0.00', 175, newPDF.tw_ren);
    newPDF.nextRow(4);
    newPDF.ImpPosX(`Total Alumnos: ${alumnos.toString() || '0'}`, 175, newPDF.tw_ren);
    const pdfData = newPDF.doc.output("datauristring");
    return pdfData;
};

export const Imprimir = (configuracion) => {
    let total_inscripcion = 0;
    let alumnos = 0;
    let si_inscrito = false;
    const newPDF = new ReportePDF(configuracion, "Portrait");
    const { bodyAlumnos } = configuracion;
    const { bodyDetalles } = configuracion;
    const { bodyProductos } = configuracion;
    const { bodyHorarios } = configuracion;
    const { fecha_ini } = configuracion;
    const { fecha_fin } = configuracion;
    Enca1(newPDF);
    bodyAlumnos.forEach((alumno) => {
        let det_inscripcion = 0;
        let si_suma = false;
        let fecha_inscripcion = "";
        const detalleEncontrado = bodyDetalles.filter(detalle =>
            detalle.alumno === alumno.numero &&
            detalle.fecha >= fecha_ini &&
            detalle.fecha <= fecha_fin
        );
        if (detalleEncontrado) {
            detalleEncontrado.forEach((detalle) => {
                const productoEncontrado = bodyProductos.filter(producto =>
                    producto.ref === 'INS' &&
                    producto.numero === detalle.articulo
                );
                if (productoEncontrado) {
                    console.log('no entro');
                    si_inscrito = true;
                    si_suma = true;
                    det_inscripcion += detalle.precio_unitario * detalle.cantidad;
                    total_inscripcion += detalle.precio_unitario * detalle.cantidad;
                } else { console.log('no entro'); };
                fecha_inscripcion = detalle.fecha;
            });
            if (si_suma) {
                const nombre = `${(alumno.a_nombre || '')} ${(alumno.a_paterno || '')} ${(alumno.a_materno || '')}`.substring(0, 50);
                newPDF.ImpPosX(alumno.numero.toString() || '', 15, newPDF.tw_ren);
                newPDF.ImpPosX(nombre.toString(), 30, newPDF.tw_ren);
                const horarioEncontrado = bodyHorarios.find(
                    horario => horario.numero === alumno.horario_1
                );
                if (horarioEncontrado) {
                    newPDF.ImpPosX(horarioEncontrado.horario.toString() || '', 125, newPDF.tw_ren);
                }
                newPDF.ImpPosX(fecha_inscripcion.toString() || '', 160, newPDF.tw_ren);
                newPDF.ImpPosX(formatNumber(det_inscripcion) || '0.00', 185, newPDF.tw_ren);
                alumnos += 1;
                Enca1(newPDF);
            }
            det_inscripcion = 0;
        }
        if (newPDF.tw_ren >= newPDF.tw_endRen) {
            newPDF.pageBreak();
            Enca1(newPDF);
        }
    });
    newPDF.nextRow(4);
    newPDF.ImpPosX(`Total: ${formatNumber(total_inscripcion)}` || '0.00', 175, newPDF.tw_ren);
    newPDF.nextRow(4);
    newPDF.ImpPosX(`Total Alumnos: ${alumnos.toString() || '0'}`, 175, newPDF.tw_ren);
    newPDF.guardaReporte("Reporte Alumnos Inscritos");
};

export const ImprimirExcel = (configuracion) => {
    const newExcel = new ReporteExcel(configuracion);
    const { bodyAlumnos, bodyDetalles, bodyProductos, bodyHorarios, fecha_ini, fecha_fin, columns, nombre } = configuracion;
    const newBody = [];
    let total_inscripcion = 0;
    let alumnos = 0;
    bodyAlumnos.forEach((alumno) => {
        let det_inscripcion = 0;
        let si_suma = false;
        let fecha_inscripcion = "";
        const detalleEncontrado = bodyDetalles.filter(detalle =>
            detalle.alumno === alumno.numero &&
            detalle.fecha >= fecha_ini &&
            detalle.fecha <= fecha_fin
        );
        if (detalleEncontrado) {
            detalleEncontrado.forEach((detalle) => {
                const productoEncontrado = bodyProductos.filter(producto =>
                    producto.ref === 'INS' &&
                    producto.numero === detalle.articulo
                );

                if (productoEncontrado) {
                    si_suma = true;
                    det_inscripcion += detalle.precio_unitario * detalle.cantidad;
                    total_inscripcion += detalle.precio_unitario * detalle.cantidad;
                    fecha_inscripcion = detalle.fecha;
                }
            });
            if (si_suma) {
                const nombreCompleto = `${(alumno.a_nombre || '')} ${(alumno.a_paterno || '')} ${(alumno.a_materno || '')}`.substring(0, 50);
                newBody.push({
                    numero: alumno.numero,
                    nombre: nombreCompleto,
                    horario: bodyHorarios.find(horario => horario.numero === alumno.horario_1)?.horario || '',
                    fecha_inscripcion: fecha_inscripcion,
                    det_inscripcion: formatNumber(det_inscripcion) || '0.00'
                });
                alumnos += 1;
            }
        }
    });
    newBody.push({
        numero: '',
        nombre: '',
        horario: '',
        fecha_inscripcion: `Total: ${formatNumber(total_inscripcion) || '0.00'}`,
        det_inscripcion: `Total: ${alumnos || '0'}`,
    });
    newExcel.setColumnas(columns);
    newExcel.addData(newBody);
    newExcel.guardaReporte(nombre);
};



