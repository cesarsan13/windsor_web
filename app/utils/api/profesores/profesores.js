import { ReporteExcel } from "@/app/utils/ReportesExcel";
import { ReportePDF } from "@/app/utils/ReportesPDF";

export const getProfesores = async (token, baja) => {
    let url = "";
    baja
        ? (url = `${process.env.DOMAIN_API}api/profesores/index-baja`)
        : (url = `${process.env.DOMAIN_API}api/profesores/index`);
    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const resJson = await res.json();
    return resJson.data;
};

export const siguiente = async (token) => {
    const res = await fetch(`${process.env.DOMAIN_API}api/profesores/siguiente`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const resJson = await res.json();
    return resJson.data;
};

export const guardaProfesor = async (token, data, accion) => {
    let url_api = "";
    if (accion === "Alta") {
        url_api = `${process.env.DOMAIN_API}api/profesores/save`;
        data.baja = "n  ";
    }
    if (accion === "Eliminar" || accion === "Editar") {
        if (accion === "Eliminar") {
            data.baja = "*";
        } else {
            data.baja = "n";
        }
        url_api = `${process.env.DOMAIN_API}api/profesores/update`;
    }
    const res = await fetch(`${url_api}`, {
        method: "post",
        body: JSON.stringify({
            numero: data.numero || "",
            nombre: data.nombre || "",
            ap_paterno: data.ap_paterno || "",
            ap_materno: data.ap_materno || "",
            direccion: data.direccion || "",
            colonia: data.colonia || "",
            ciudad: data.ciudad || "",
            estado: data.estado || "",
            cp: data.cp || "",
            pais: data.pais || "",
            rfc: data.rfc || "",
            telefono_1: data.telefono_1 || "",
            telefono_2: data.telefono_2 || "",
            fax: data.fax || "",
            celular: data.celular || "",
            email: data.email || "",
            contraseña: data.contraseña || "",
            baja: data.baja || "",
        }),
        headers: new Headers({
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        }),
    });
    const resJson = await res.json();
    return resJson;
};

const Enca1 = (doc) => {
    if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalH();
        doc.nextRow(12);
        doc.ImpPosX("Numero", 15, doc.tw_ren);
        doc.ImpPosX("Nombre", 40, doc.tw_ren);
        doc.ImpPosX("Dirección", 110, doc.tw_ren);
        doc.ImpPosX("Colonia", 140, doc.tw_ren);
        doc.ImpPosX("Ciudad", 170, doc.tw_ren);
        doc.ImpPosX("Estado", 215, doc.tw_ren);
        doc.ImpPosX("C.P.", 240, doc.tw_ren);
        doc.nextRow(4);
        doc.ImpPosX("Email", 15, doc.tw_ren);
        doc.ImpPosX("Telefono1", 140, doc.tw_ren);
        doc.ImpPosX("Telefono2", 170, doc.tw_ren);
        doc.ImpPosX("Celular", 200, doc.tw_ren);
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
    body.forEach((profesores) => {
        newPDF.ImpPosX(profesores.numero.toString(), 20, newPDF.tw_ren, 0, "R");
        newPDF.ImpPosX(profesores.nombre_completo.toString(), 40, newPDF.tw_ren, 0, "L");
        newPDF.ImpPosX(profesores.direccion.toString(), 110, newPDF.tw_ren, 0, "L");
        newPDF.ImpPosX(profesores.colonia.toString(), 140, newPDF.tw_ren, 0, "L");
        newPDF.ImpPosX(profesores.ciudad.toString(), 170, newPDF.tw_ren, 0, "L");
        newPDF.ImpPosX(profesores.estado.toString(), 215, newPDF.tw_ren, 0, "L");
        newPDF.ImpPosX(profesores.cp.toString(), 240, newPDF.tw_ren, 0, "L");
        newPDF.nextRow(4);
        newPDF.ImpPosX(profesores.email.toString(), 15, newPDF.tw_ren, 0, "L");
        newPDF.ImpPosX(profesores.telefono_1.toString(), 140, newPDF.tw_ren, 12, "L");
        newPDF.ImpPosX(profesores.telefono_2.toString(), 170, newPDF.tw_ren, 12, "L");
        newPDF.ImpPosX(profesores.celular.toString(), 200, newPDF.tw_ren, 12, "L");
        Enca1(newPDF);
        if (newPDF.tw_ren >= newPDF.tw_endRenH) {
            newPDF.pageBreakH();
            Enca1(newPDF);
        }
    });
    newPDF.guardaReporte("Profesores")
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

export const getContraseñaProfe = async (token, grupo, materia) => {
    let url = `${process.env.DOMAIN_API}api/proceso/profesor-contraseña`
    const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            materia: materia,
            grupo: grupo
        }),
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    const resJson = await res.json();
    return resJson;
};