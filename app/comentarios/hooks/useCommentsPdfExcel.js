import React, { useState } from "react";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import { ReporteExcel } from "@/app/utils/ReportesExcel";
import {
  ImprimirPDF,
  ImprimirExcel,
  storeBatchComentarios,
} from "@/app/utils/api/comentarios/comentarios";
import { chunkArray, validateString } from "@/app/utils/globalfn";
import { truncateTable } from "@/app/utils/GlobalApis";
import { showSwal, confirmSwal } from "@/app/utils/alerts";
import * as XLSX from "xlsx";
export const useCommentsPdfExcel = (
  formaComentariosFiltrados,
  session,
  reload_page,
  inactiveActive,
  busqueda,
  fetchComentarioStatus,
  setReloadPage,
  setisLoadingButton
) => {
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const [animateLoading, setAnimateLoading] = useState(false);
  const [porcentaje, setPorcentaje] = useState(0);
  const [cerrarTO, setCerrarTO] = useState(false);
  const [dataJson, setDataJson] = useState([]);
  const [excelPreviewData, setExcelPreviewData] = useState([]);
  const MAX_LENGTHS = {
    comentario_1: 50,
    comentario_2: 50,
    comentario_3: 50,
    baja: 1,
    generales: 1,
  };

  const showModalVista = (show) => {
    show
      ? document.getElementById("modalVPComentario").showModal()
      : document.getElementById("modalVPComentario").close();
  };

  const CerrarView = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalVPComentario").close();
  };

  const handleVerClick = () => {
    setAnimateLoading(true);
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de Comentarios",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: formaComentariosFiltrados,
    };
    const orientacion = "Landscape";
    const reporte = new ReportePDF(configuracion, orientacion);
    const { body } = configuracion;
    const Enca1 = (doc) => {
      if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalH();
        doc.nextRow(12);
        doc.ImpPosX("Id", 15, doc.tw_ren);
        doc.ImpPosX("Comentario 1", 30, doc.tw_ren);
        doc.ImpPosX("Comentario 2", 110, doc.tw_ren);
        doc.ImpPosX("Comentario 3", 190, doc.tw_ren);
        doc.ImpPosX("Generales", 270, doc.tw_ren);

        doc.nextRow(4);
        doc.printLineH();
        doc.nextRow(4);
        doc.tiene_encabezado = true;
      } else {
        doc.nextRow(6);
        doc.tiene_encabezado = true;
      }
    };
    Enca1(reporte);
    const alignsIndex = [0];
    const tablaExcel = [
      ["Id", "Comentario 1", "Comentario 2", "Comentario 3", "Generales"],
    ];
    body.forEach((comentarios) => {
      reporte.ImpPosX(
        comentarios.numero.toString(),
        20,
        reporte.tw_ren,
        0,
        "R"
      );
      reporte.ImpPosX(
        comentarios.comentario_1.toString(),
        30,
        reporte.tw_ren,
        35,
        "L"
      );
      reporte.ImpPosX(
        comentarios.comentario_2.toString(),
        110,
        reporte.tw_ren,
        35,
        "L"
      );
      reporte.ImpPosX(
        comentarios.comentario_3.toString(),
        190,
        reporte.tw_ren,
        35,
        "L"
      );
      let resultado =
        comentarios.generales == 1
          ? "Si"
          : comentarios.generales == 0
          ? "No"
          : "No valido";
      reporte.ImpPosX(resultado.toString(), 270, reporte.tw_ren, 0, "L");
      tablaExcel.push([
        comentarios.numero.toString(),
        comentarios.comentario_1.toString(),
        comentarios.comentario_2.toString(),
        comentarios.comentario_3.toString(),
        resultado,
      ]);
      Enca1(reporte);
      if (reporte.tw_ren >= reporte.tw_endRenH) {
        reporte.pageBreakH();
        Enca1(reporte);
      }
    });

    setTimeout(async () => {
      const newExcel = new ReporteExcel(configuracion);
      const pdfData = reporte.doc.output("datauristring");
      const previewExcel = await newExcel.previewExcel(tablaExcel, alignsIndex);
      setPdfData(pdfData);
      setPdfPreview(true);
      setExcelPreviewData(previewExcel);
      showModalVista(true);
      setAnimateLoading(false);
    }, 500);
  };

  const ImprimePDF = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de Comentarios",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: formaComentariosFiltrados,
    };
    ImprimirPDF(configuracion);
  };

  const ImprimeExcel = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de Comentarios",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },

      body: formaComentariosFiltrados,
      columns: [
        { header: "Id", dataKey: "numero" },
        { header: "Comentario 1", dataKey: "comentario_1" },
        { header: "Comentario 2", dataKey: "comentario_2" },
        { header: "Comentario 3", dataKey: "comentario_3" },
        { header: "Generales", dataKey: "generales" },
      ],

      nombre: "Comentarios_",
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
    await truncateTable(token, "comentarios");
    const chunks = chunkArray(dataJson, 20);
    let chunksProcesados = 0;
    let numeroChunks = chunks.length;
    for (let chunk of chunks) {
      await storeBatchComentarios(token, chunk);
      chunksProcesados++;
      const progreso = (chunksProcesados / numeroChunks) * 100;
      setPorcentaje(Math.round(progreso));
    }
    setCerrarTO(true);
    setisLoadingButton(false);
    setDataJson([]);
    setPorcentaje(0);
    showSwal("Éxito", "Los datos se han subido correctamente.", "success");
    showModalProcesa(false);
    setTimeout(() => {
      setReloadPage(!reload_page);
    }, 3500);
    await fetchComentarioStatus(true, inactiveActive, busqueda);
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
        const convertedData = jsonData.map((item) => ({
          numero: item.Numero || 0,
          comentario_1: validateString(
            MAX_LENGTHS,
            "comentario_1",
            (typeof item.Comentario_1 === "string"
              ? item.Comentario_1.trim()
              : "N/A") || "N/A"
          ),
          comentario_2: validateString(
            MAX_LENGTHS,
            "comentario_2",
            (typeof item.Comentario_2 === "string"
              ? item.Comentario_2.trim()
              : "N/A") || "N/A"
          ),
          comentario_3: validateString(
            MAX_LENGTHS,
            "comentario_3",
            (typeof item.Comentario_3 === "string"
              ? item.Comentario_3.trim()
              : "N/A") || "N/A"
          ),
          baja: validateString(
            MAX_LENGTHS,
            "baja",
            (typeof item.Baja === "string" ? item.Baja.trim() : "n") || "n"
          ),
          generales: isNaN(parseInt(item.Generales))
            ? 0
            : parseInt(item.Generales),
        }));
        setDataJson(convertedData);
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  return {
    handleVerClick,
    CerrarView,
    ImprimePDF,
    ImprimeExcel,
    handleFileChange,
    buttonProcess,
    procesarDatos,
    setDataJson,
    excelPreviewData,
    pdfPreview,
    pdfData,
    animateLoading,
    porcentaje,
    cerrarTO,
    dataJson,
  };
};
