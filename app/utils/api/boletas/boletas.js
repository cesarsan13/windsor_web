import { ReportePDF } from "@/app/utils/ReportesPDF";

export const getBoletas3 = async (token, grupo) => {
    let url = `${process.env.DOMAIN_API}api/proceso/boleta-get`;
    const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
            grupo: grupo
        }),
        headers: new Headers({
            Authorization: "Bearer " + token,
            xescuela: localStorage.getItem("xescuela"),
            "Content-Type": "application/json",
          }),
    });
    const resJson = await res.json();
    return resJson.data;
};

export const getActividadMateria = async (token, numero) => {
    let url = `${process.env.DOMAIN_API}api/proceso/materia-actividad`;
    const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
            numero: numero
        }),
        headers: new Headers({
            Authorization: "Bearer " + token,
            xescuela: localStorage.getItem("xescuela"),
            "Content-Type": "application/json",
          }),
    });
    const resJson = await res.json();
    return resJson.data;
};

export const getEvaluacionMateria = async (token, data, materia, grupo_nombre) => {
    let url = `${process.env.DOMAIN_API}api/proceso/boleta-evaluacion`;
    const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
            grupo: grupo_nombre,
            bimestre: data.bimestre,
            alumno: data.alumno,
            materia: materia,
        }),
        headers: new Headers({
            Authorization: "Bearer " + token,
            xescuela: localStorage.getItem("xescuela"),
            "Content-Type": "application/json",
          }),
    });
    const resJson = await res.json();
    return resJson.data;
};

export const getAreas = async (token, data, materia) => {
    let url = `${process.env.DOMAIN_API}api/proceso/boleta-areas`;
    const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
            materia: materia,
            grupo: data.grupo_nombre,
            bimestre: data.bimestre,
            alumno: data.alumno,
        }),
        headers: new Headers({
            Authorization: "Bearer " + token,
            xescuela: localStorage.getItem("xescuela"),
            "Content-Type": "application/json",
          }),
    });
    const resJson = await res.json();
    return resJson.data;
};

export const getAreasOtros = async (token, data, materia) => {
    let url = `${process.env.DOMAIN_API}api/proceso/bleta-areas-otroso`;
    const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
            materia: materia,
            grupo: data.grupo_nombre,
            bimestre: data.bimestre,
            alumno: data.alumno,
        }),
        headers: new Headers({
            Authorization: "Bearer " + token,
            xescuela: localStorage.getItem("xescuela"),
            "Content-Type": "application/json",
          }),
    });
    const resJson = await res.json();
    return resJson.data;
};

export const getDatosPorGrupo = async (token, grupo, grupo_nombre, ordenAlfabetico) => {
    let url = `${process.env.DOMAIN_API}api/proceso/datos-por-grupo`;
    const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
            grupo: grupo,
            grupo_nombre: grupo_nombre,
            orden_alfabetico: ordenAlfabetico
        }),
        headers: new Headers({
            Authorization: "Bearer " + token,
            xescuela: localStorage.getItem("xescuela"),
            "Content-Type": "application/json",
          }),
    });
    const resJson = await res.json();
    return resJson.data;
};

const Enca1 = (doc, ciclo_fechas, boleta_kinder) => {
    if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalV();
        doc.nextRow(12);
        doc.nextRow(4);
        doc.ImpPosX("AV.SANTA ANA N° 368 COL. SAN FRANCISCO CULCHUACÁN C.P. 04420", 100, doc.tw_ren, 0, "L");
        doc.nextRow(4);
        doc.ImpPosX("ACUERDO N° 09980051 DEL  13 AGOSTO DE 1998", 115, doc.tw_ren, 0, "L");
        doc.nextRow(4);
        doc.ImpPosX("CLAVE 51-2636-510-32-PX-014", 130, doc.tw_ren, 0, "L");
        doc.nextRow(4);
        doc.ImpPosX("CCT 09PPR1204U", 140, doc.tw_ren, 0, "L");
        doc.nextRow(4);
        if (boleta_kinder) {
            doc.ImpPosX("JARDIN DE NIÑOS", 140, doc.tw_ren, 0, "L");
            doc.nextRow(4);
        }
        doc.ImpPosX(`${ciclo_fechas || ""}`, 147, doc.tw_ren, 0, "L");
        doc.nextRow(4);
        doc.ImpPosX("El acercamiento al colegio será una forma para asegurar el éxito del alumno", 100, doc.tw_ren, 0, "L");
        doc.nextRow(4);
        doc.printLineH();
        doc.tiene_encabezado = true;
    } else {
        doc.nextRow(6);
        doc.tiene_encabezado = true;
    }
};

export const ImprimirPDF = (configuracion) => {
    const newPDF = new ReportePDF(configuracion, "Landscape");
    const {
        body,
        alumno,
        grupo,
        asignacion,
        header,
        ciclo_fechas,
        boleta_kinder,
    } = configuracion;
    Enca1(newPDF, ciclo_fechas, boleta_kinder);

    newPDF.nextRow(10);
    newPDF.ImpPosX(`ALUMNO: ${alumno || ""}`, 15, newPDF.tw_ren, 0, "L");
    newPDF.nextRow(4);
    newPDF.ImpPosX(`GRUPO: ${grupo || ""}`, 15, newPDF.tw_ren, 0, "L");
    newPDF.nextRow(4);
    if (asignacion === 'asig_español') {
        newPDF.ImpPosX(`ESPAÑOL`, 150, newPDF.tw_ren, 0, "L");
    } else { newPDF.ImpPosX(`INGLES`, 150, newPDF.tw_ren, 0, "L"); }
    newPDF.nextRow(4);
    const data = body.map((boleta) => [
        boleta.descripcion.toString(),
        { content: boleta.bimestre1.toString(), styles: { halign: 'right' } },
        { content: boleta.bimestre2?.toString() ?? "", styles: { halign: 'right' } },
        { content: boleta.bimestre3?.toString() ?? "", styles: { halign: 'right' } },
        { content: boleta.promedio?.toString() ?? "", styles: { halign: 'right' } },
    ]);
    newPDF.generateTable(header, data);
    newPDF.nextRow(50);
    newPDF.printLineZ()
    newPDF.nextRow(6);
    newPDF.ImpPosX("NOMBRE Y FIRMA DEL PADRE O TUTOR", 200, newPDF.tw_ren, 0, "L");
    if (asignacion === 'asig_español') {
        newPDF.guardaReporte(`Boleta3_Español_${alumno || ""}`)
    } else {
        newPDF.guardaReporte(`Boleta3_Ingles_${alumno || ""}`)
    }
};

