import React, { useState } from "react";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import {
    Imprimir,
    ImprimirExcel,
    storeBatchProduct,
} from "@/app/utils/api/productos/productos";
import { chunkArray, validateString } from "@/app/utils/globalfn";
import { truncateTable } from "@/app/utils/GlobalApis";
import { showSwal, confirmSwal } from "@/app/utils/alerts";
import * as XLSX from "xlsx"
export const useProductosPdfExcel = (
    formaProductosFiltrados,
    session,
    reload_page,
    inactiveActive,
    busqueda,
    fetchProductosStatus,
    setReloadPage,
    setisLoadingButton
) => {
    const [pdfPreview, setPdfPreview] = useState(false);
    const [pdfData, setPdfData] = useState("");
    const [animateLoading, setAnimateLoading] = useState(false);
    const [porcentaje, setPorcentaje] = useState(0);
    const [cerrarTO, setCerrarTO] = useState(false);
    const [dataJson, setDataJson] = useState([]);
    
    const showModalVista = (show) => {
    show
    ? document.getElementById("modalVProducto").showModal()
    : document.getElementById("modalVProducto").close();
};

const CerrarView = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalVProducto").close();
};

const handleVerClick = () => {
    setAnimateLoading(true);
    const configuracion = {
        Encabezado: {
            Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Datos Productos",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
    },
    body: formaProductosFiltrados,
    };
    const Enca1 = (doc) => {
    if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalH();
        doc.nextRow(12);
        doc.ImpPosX("No.", 14, doc.tw_ren);
        doc.ImpPosX("Descripcion", 28, doc.tw_ren);
        doc.ImpPosX("Costo", 80, doc.tw_ren);
        doc.ImpPosX("Frecuencia", 100, doc.tw_ren);
        doc.ImpPosX("Recargo", 130, doc.tw_ren);
        doc.ImpPosX("Aplicacion", 150, doc.tw_ren);
        doc.ImpPosX("IVA", 175, doc.tw_ren);
        doc.ImpPosX("Condicion", 190, doc.tw_ren);
        doc.ImpPosX("Cambio Precio", 215, doc.tw_ren);
        doc.ImpPosX("Referencia", 250, doc.tw_ren);
        doc.nextRow(4);
        doc.printLineH();
        doc.nextRow(4);
        doc.tiene_encabezado = true;
    } else {
        doc.nextRow(6);
        doc.tiene_encabezado = true;
    }
    };
    const reporte = new ReportePDF(configuracion, "Landscape");
    Enca1(reporte);
    const {body} = configuracion;
    body.forEach((producto) => {
    reporte.ImpPosX(producto.numero.toString(), 24, reporte.tw_ren, 0, "R");
    reporte.ImpPosX(
        producto.descripcion.toString(),
        28,
        reporte.tw_ren,
        25,
        "L"
    );
    reporte.ImpPosX(producto.costo.toString(), 93, reporte.tw_ren, 0, "R");
    reporte.ImpPosX(
        producto.frecuencia.toString(),
        100,
        reporte.tw_ren,
        0,
        "L"
    );
    reporte.ImpPosX(
        producto.por_recargo.toString(),
        143,
        reporte.tw_ren,
        0,
        "R"
    );
    reporte.ImpPosX(
        producto.aplicacion.toString(),
        150,
        reporte.tw_ren,
        0,
        "L"
    );
    reporte.ImpPosX(producto.iva.toString(), 183, reporte.tw_ren, 0, "R");
    reporte.ImpPosX(producto.cond_1.toString(), 203, reporte.tw_ren, 0, "R");
    const cam_precio = producto.cam_precio ? "Si" : "No";
    reporte.ImpPosX(cam_precio.toString(), 215, reporte.tw_ren, 0, "L");
    reporte.ImpPosX(producto.ref.toString(), 250, reporte.tw_ren, 0, "L");
    Enca1(reporte);
    if (reporte.tw_ren >= reporte.tw_endRenH) {
        reporte.pageBreakH();
        Enca1(reporte);
    }
    });
    setTimeout(() => {
    const pdfData = reporte.doc.output("datauristring");
    setPdfData(pdfData);
    setPdfPreview(true);
    showModalVista(true);
    setAnimateLoading(false);
    }, 500);
};

const imprimirPDF = () => {
    const configuracion = {
        Encabezado: {
            Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Datos Productos",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
    },
    body: formaProductosFiltrados,
    };
    Imprimir(configuracion);
};

const imprimirEXCEL = () => {
    const configuracion = {
    Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Datos Productos",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
    },
    body: formaProductosFiltrados,
    columns: [
        { header: "Numero", dataKey: "numero" },
        { header: "Descripcion", dataKey: "descripcion" },
        { header: "Costo", dataKey: "costo" },
        { header: "Frecuencia", dataKey: "frecuencia" },
        { header: "Recargo", dataKey: "por_recargo" },
        { header: "Aplicacion", dataKey: "aplicacion" },
        { header: "IVA", dataKey: "iva" },
        { header: "Condicion", dataKey: "cond_1" },
        { header: "Cambio Precio", dataKey: "cam_precio" },
        { header: "Referencia", dataKey: "ref" },
    ],
    nombre: "Productos",
    };
    ImprimirExcel(configuracion);
};

const procesarDatos = () => {
    showModalProcesa(true);
};

const showModalProcesa = (show) => {
    show
    ? document.getElementById("my_modal_4").showModal()
    : document.getElementById("my_modal_4").close();
};

const buttonProcess = async () => {
    document.getElementById("cargamodal").showModal();
    event.preventDefault();
    setisLoadingButton(true);
    const { token } = session.user;
    await truncateTable(token, "productos");
    const chunks = chunkArray(dataJson, 20);
    let allErrors = "";
    let chunksProcesados = 0;
    let numeroChunks = chunks.length;
    for (let chunk of chunks) {
    const res = await storeBatchProduct(token, chunk);
    chunksProcesados++;
      const progreso = (chunksProcesados / numeroChunks) * 100;
    setPorcentaje(Math.round(progreso));
    if (!res.status) {
        allErrors += res.alert_text;
    }
    }
    setCerrarTO(true);
    setisLoadingButton(false);
    setDataJson([]);
    setPorcentaje(0);
    if (allErrors) {
    showSwalConfirm("Error", allErrors, "error", "my_modal_4");
    } else {
    showSwal(
        "Éxito",
        "Todos los productos se insertaron correctamente.",
        "success"
        // "my_modal_4"
    );
    showModalProcesa(false);
    }
    await fetchProductStatus(true);
    setTimeout(() => {
    setReloadPage(!reload_page);
    }, 3500);
    await fetchProductosStatus(true, inactiveActive, busqueda)
};

const handleFileChange = async (e) => {
    const confirmed = await confirmSwal(
    "¿Desea Continuar?",
    "Por favor, verifica que las columnas del archivo de Excel coincidan exactamente con las columnas de la tabla en la base de datos y que no contengan espacios en blanco.",
    "warning",
    "Aceptar",
    "Cancelar",
    "my_modal_4"
);
    if (!confirmed) {
        return;
    }
    const selectedFile = e.target.files[0];
    if (selectedFile) {
    const reader = new FileReader();
    reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        // console.log(jsonData);
        const convertedData = jsonData.map((item) => {
        return {
            numero: String(item.Numero || 0).trim(),
            descripcion:
            item.Descripcion && String(item.Descripcion).trim() !== ""
                ? String(item.Descripcion).slice(0, 255)
                : "N/A",
            costo: parseFloat(item.Costo || 0),
            frecuencia:
            item.Frecuencia && String(item.Frecuencia).trim() !== ""
                ? String(item.Frecuencia).slice(0, 20)
                : "N/A",
            por_recargo: parseFloat(item.Por_Recargo || 0),
            aplicacion:
            item.Aplicacion && String(item.Aplicacion).trim() !== ""
                ? String(item.Aplicacion).slice(0, 25)
                : "N/A",
            iva: parseFloat(item.IVA || 0),
            cond_1: parseInt(item.Cond_1 || 0),
            cam_precio: item.Cam_Precio ? 1 : 0,
            ref:
            item.Ref && item.Ref.trim() !== ""
                ? String(item.Ref).slice(0, 20)
                : "N/A",
            baja:
            item.Baja && item.Baja.trim() !== ""
                ? String(item.Baja).slice(0, 1)
                : "n",
        };
        });
        setDataJson(convertedData);
    };
    reader.readAsArrayBuffer(selectedFile);
    }

};
    return {
        handleVerClick,
        CerrarView,
        imprimirPDF,
        imprimirEXCEL,
        handleFileChange,
        buttonProcess,
        procesarDatos,
        setDataJson,
        pdfPreview,
        pdfData,
        animateLoading,
        porcentaje,
        cerrarTO,
        dataJson,
    };
};