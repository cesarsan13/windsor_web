import { ReporteExcel } from "@/app/utils/ReportesExcel";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import { calculaDigitoBvba } from "@/app/utils/globalfn";

export const validarClaveCajero = async (token, data) => {
    let url = `${process.env.DOMAIN_API}api/pagos1/validar-clave-cajero`
    const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
            cajero: data.cajero,
            clave_cajero: data.clave_cajero,
        }),
        headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json"
        }
    })
    const resJson = await res.json();
    return resJson;
}

export const buscarArticulo = async (token, numero  ) => {
    let url = `${process.env.DOMAIN_API}api/pagos1/buscar-articulo`
    const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
            articulo: numero,
        }),
        headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json"
        }
    })
    const resJson = await res.json();
    return resJson;
}

const Enca1 = (doc) => {
    if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalH();
        doc.nextRow(12);
        doc.ImpPosX("No", 15, doc.tw_ren);
        doc.ImpPosX("Nombre", 30, doc.tw_ren);
        doc.ImpPosX("Estatus", 160, doc.tw_ren);
        doc.ImpPosX("Fecha", 180, doc.tw_ren);
        doc.ImpPosX("Horario", 210, doc.tw_ren);
        doc.ImpPosX("Teléfono", 240, doc.tw_ren);
        doc.nextRow(4);
        doc.printLineH();
        doc.nextRow(4);
        doc.tiene_encabezado = true;
    } else {
        doc.nextRow(6);
        doc.tiene_encabezado = true;
    }
};

const Enca2 = (doc) => {
    if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalV();
        doc.nextRow(12);
        doc.ImpPosX("No", 5, doc.tw_ren);
        doc.ImpPosX("Nombre", 20, doc.tw_ren);
        doc.ImpPosX("Estatus", 90, doc.tw_ren);
        doc.ImpPosX("Fecha", 110, doc.tw_ren);
        doc.ImpPosX("Horario", 135, doc.tw_ren);
        doc.ImpPosX("Teléfono", 170, doc.tw_ren);
        doc.nextRow(4);
        doc.printLineF();
        doc.nextRow(4);
        doc.tiene_encabezado = true;
    } else {
        doc.nextRow(6);
        doc.tiene_encabezado = true;
    }
};

export const verImprimir = async (configuracion) => {
    const newPDF = new ReportePDF(configuracion);
    const { body } = configuracion;
    Enca2(newPDF);

    body.forEach((alumno) => {
        const id = calculaDigitoBvba((alumno.id || '').toString() || '');
        const nombre = `${(alumno.nombre || '')} ${(alumno.a_paterno || '')} ${(alumno.a_materno || '')}`.substring(0, 20);
        const estatus = ((alumno.estatus || '')).toString().substring(0, 12);
        const fecha_nac = ((alumno.fecha_nac || '')).toString().substring(0, 15);
        const horario_1_nombre = ((alumno.horario_1_nombre || '')).toString().substring(0, 15);
        const telefono = ((alumno.telefono_1 || '')).toString().substring(0, 15);
        newPDF.ImpPosX(`${alumno.id}-${id}`, 5, newPDF.tw_ren);
        newPDF.ImpPosX(nombre, 20, newPDF.tw_ren);
        newPDF.ImpPosX(estatus, 90, newPDF.tw_ren);
        newPDF.ImpPosX(fecha_nac, 110, newPDF.tw_ren);
        newPDF.ImpPosX(horario_1_nombre, 135, newPDF.tw_ren);
        newPDF.ImpPosX(telefono, 170, newPDF.tw_ren);
        if (alumno.baja === '*') {
            newPDF.tw_ren += 5;
            const fecha_baja = ((alumno.fecha_baja || '')).toString().substring(0, 15);
            newPDF.ImpPosX(`Fecha de Baja: ${fecha_baja}`, 5, newPDF.tw_ren);
        }
        Enca2(newPDF);
        if (newPDF.tw_ren >= newPDF.tw_endRen) {
            newPDF.pageBreak();
            Enca2(newPDF);
        }
    });
    const pdfData = newPDF.doc.output("datauristring");
    return pdfData;
};


export const Imprimir = (configuracion) => {
    const orientacion = 'Landscape'
    const newPDF = new ReportePDF(configuracion, orientacion);
    const { body } = configuracion;
    Enca1(newPDF);
    body.forEach((alumnos) => {
        const id = calculaDigitoBvba((alumnos.id || '').toString() || '');
        const nombre = `${(alumnos.nombre || '')} ${(alumnos.a_paterno || '')} ${(alumnos.a_materno || '')}`.substring(0, 20);
        const estatus = ((alumnos.estatus || '')).toString().substring(0, 12);
        const fecha_nac = ((alumnos.fecha_nac || '')).toString().substring(0, 15);
        const horario_1_nombre = ((alumnos.horario_1_nombre || '')).toString().substring(0, 15);
        const telefono = ((alumnos.telefono_1 || '')).toString().substring(0, 15);
        newPDF.ImpPosX(`${alumnos.id}-${id}`, 15, newPDF.tw_ren);
        newPDF.ImpPosX(nombre, 30, newPDF.tw_ren);
        newPDF.ImpPosX(estatus, 160, newPDF.tw_ren);
        newPDF.ImpPosX(fecha_nac, 180, newPDF.tw_ren);
        newPDF.ImpPosX(horario_1_nombre, 210, newPDF.tw_ren);
        newPDF.ImpPosX(telefono, 240, newPDF.tw_ren);
        if (alumnos.baja === '*') {
            newPDF.tw_ren += 5;
            const fecha_baja = ((alumnos.fecha_baja || '')).toString().substring(0, 15);
            newPDF.ImpPosX(`Fecha de Baja: ${fecha_baja}`, 15, newPDF.tw_ren);
        }
        Enca1(newPDF);
        if (newPDF.tw_ren >= newPDF.tw_endRen) {
            newPDF.pageBreak();
            Enca1(newPDF);
        }
    });
    newPDF.guardaReporte("Relación general de alumnos")
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



