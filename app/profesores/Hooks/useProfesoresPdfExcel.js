import React, { useState } from "react";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import { ReporteExcel } from "@/app/utils/ReportesExcel";
import { chunkArray, validateString } from "@/app/utils/globalfn";
import { truncateTable } from "@/app/utils/GlobalApis";
import { showSwal, confirmSwal } from "@/app/utils/alerts";
import * as XLSX from "xlsx";
import {
  ImprimirPDF,
  ImprimirExcel,
  storeBatchProfesores,
} from "@/app/utils/api/profesores/profesores";

export const useProfesoresPdfExcel = (
  profesoresFiltrados,
  session,
  reload_page,
  inactiveActive,
  busqueda,
  fetchProfesorStatus,
  setReloadPage,
  setisLoadingButton
) => {
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const [animateLoading, setAnimateLoading] = useState(false);
  const [porcentaje, setPorcentaje] = useState(0);
  const [excelPreviewData, setExcelPreviewData] = useState([]);
  const [cerrarTO, setCerrarTO] = useState(false);
  const [dataJson, setDataJson] = useState([]);
  const MAX_LENGTHS = {
    nombre: 50,
    nombre_completo: 50,
    ap_paterno: 50,
    ap_materno: 50,
    direccion: 50,
    colonia: 50,
    ciudad: 50,
    estado: 20,
    cp: 6,
    pais: 50,
    rfc: 20,
    telefono_1: 20,
    telefono_2: 20,
    fax: 20,
    celular: 20,
    email: 80,
    contraseña: 255,
    baja: 1,
  };

  const showModalVista = (show) => {
    show
      ? document.getElementById("modalVPProfesor").showModal()
      : document.getElementById("modalVPProfesor").close();
  };

  const CerrarView = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalVPProfesor").close();
  };

  const handleVerClick = () => {
    setAnimateLoading(true);
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de Profesores",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: profesoresFiltrados,
    };

    const orientacion = "Landscape";
    const reporte = new ReportePDF(configuracion, orientacion);
    const { body } = configuracion;
    const Enca1 = (doc) => {
      if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalH();
        doc.nextRow(12);
        doc.ImpPosX("Numero", 15, doc.tw_ren);
        doc.ImpPosX("Nombre", 40, doc.tw_ren);
        doc.ImpPosX("Dirección", 110, doc.tw_ren);
        doc.ImpPosX("Colonia", 155, doc.tw_ren);
        doc.ImpPosX("Ciudad", 200, doc.tw_ren);
        doc.ImpPosX("Estado", 245, doc.tw_ren);
        doc.ImpPosX("C.P.", 270, doc.tw_ren);
        doc.nextRow(4);
        doc.ImpPosX("Email", 15, doc.tw_ren);
        doc.ImpPosX("Telefono1", 155, doc.tw_ren);
        doc.ImpPosX("Telefono2", 200, doc.tw_ren);
        doc.ImpPosX("Celular", 245, doc.tw_ren);
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
      [
        "Numero",
        "Nombre",
        "Dirección",
        "Colonia",
        "Telefono1",
        "Telefono2",
        "Celular",
        "Estado",
        "Ciudad",
        "C.P.",
      ],
    ];
    body.forEach((profesores) => {
      reporte.setFontSize(8);
      reporte.ImpPosX(profesores.numero.toString(), 20, reporte.tw_ren, 0, "R");
      reporte.ImpPosX(
        profesores.nombre_completo.toString(),
        40,
        reporte.tw_ren,
        0,
        "L"
      );
      reporte.ImpPosX(
        profesores.direccion.toString(),
        110,
        reporte.tw_ren,
        0,
        "L"
      );
      reporte.ImpPosX(
        profesores.colonia.toString(),
        155,
        reporte.tw_ren,
        0,
        "L"
      );
      reporte.ImpPosX(
        profesores.ciudad.toString(),
        200,
        reporte.tw_ren,
        0,
        "L"
      );
      reporte.ImpPosX(
        profesores.estado.toString(),
        245,
        reporte.tw_ren,
        0,
        "L"
      );
      reporte.ImpPosX(profesores.cp.toString(), 270, reporte.tw_ren, 0, "L");
      reporte.nextRow(4);
      reporte.ImpPosX(profesores.email.toString(), 15, reporte.tw_ren, 0, "L");
      reporte.ImpPosX(
        profesores.telefono_1.toString(),
        155,
        reporte.tw_ren,
        12,
        "L"
      );
      reporte.ImpPosX(
        profesores.telefono_2.toString(),
        200,
        reporte.tw_ren,
        12,
        "L"
      );
      reporte.ImpPosX(
        profesores.celular.toString(),
        245,
        reporte.tw_ren,
        12,
        "L"
      );
      tablaExcel.push([
        profesores.numero.toString(),
        profesores.nombre_completo.toString(),
        profesores.direccion.toString(),
        profesores.colonia.toString(),
        profesores.telefono_1.toString(),
        profesores.telefono_2.toString(),
        profesores.celular.toString(),
        profesores.estado.toString(),
        profesores.ciudad.toString(),
        profesores.cp.toString(),
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
      setExcelPreviewData(previewExcel);
      setPdfPreview(true);
      showModalVista(true);
      setAnimateLoading(false);
    }, 500);
  };

  const ImprimePDF = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de Profesores",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: profesoresFiltrados,
    };
    ImprimirPDF(configuracion);
  };

  const ImprimeExcel = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de Profesores",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: profesoresFiltrados,
      columns: [
        { header: "Numero", dataKey: "numero" },
        { header: "Nombre", dataKey: "nombre_completo" },
        { header: "Dirección", dataKey: "direccion" },
        { header: "Colonia", dataKey: "colonia" },
        { header: "Telefono1", dataKey: "telefono_1" },
        { header: "Telefono2", dataKey: "telefono_2" },
        { header: "Ciudad", dataKey: "ciudad" },
        { header: "Estado", dataKey: "estado" },
        { header: "Celular", dataKey: "celular" },
        { header: "C.P.", dataKey: "cp" },
      ],
      nombre: "Profesores_",
    };
    ImprimirExcel(configuracion);
  };

  const procesarDatos = () => {
    showModalProcesa(true);
  };

  const showModalProcesa = (show) => {
    show
      ? document.getElementById("my_modal_profesores").showModal()
      : document.getElementById("my_modal_profesores").close();
  };

  const buttonProcess = async () => {
    document.getElementById("cargamodal").showModal();
    event.preventDefault();
    setisLoadingButton(true);
    const { token } = session.user;
    await truncateTable(token, "profesores");
    const chunks = chunkArray(dataJson, 20);
    let chunksProcesados = 0;
    let numeroChunks = chunks.length;

    for (let chunk of chunks) {
      const res = await storeBatchProfesores(token, chunk);
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
    await fetchProfesorStatus(true, inactiveActive, busqueda);
  };

  const handleFileChange = async (e) => {
    const confirmed = await confirmSwal(
      "¿Desea Continuar?",
      "Por favor, verifica que las columnas del archivo de Excel coincidan exactamente con las columnas de la tabla en la base de datos y que no contengan espacios en blanco.",
      "warning",
      "Aceptar",
      "Cancelar",
      "my_modal_profesores"
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
          numero: parseInt(item.Numero || 0),
          nombre: validateString(
            MAX_LENGTHS,
            "nombre",
            (typeof item.Nombre === "string" ? item.Nombre.trim() : "N/A") ||
              "N/A"
          ),
          ap_paterno: validateString(
            MAX_LENGTHS,
            "ap_paterno",
            (typeof item.Ap_Paterno === "string"
              ? item.Ap_Paterno.trim()
              : "N/A") || "N/A"
          ),
          ap_materno: validateString(
            MAX_LENGTHS,
            "ap_materno",
            (typeof item.Ap_Materno === "string"
              ? item.Ap_Materno.trim()
              : "N/A") || "N/A"
          ),
          direccion: validateString(
            MAX_LENGTHS,
            "direccion",
            (typeof item.Direccion === "string"
              ? item.Direccion.trim()
              : "N/A") || "N/A"
          ),
          colonia: validateString(
            MAX_LENGTHS,
            "colonia",
            (typeof item.Colonia === "string" ? item.Colonia.trim() : "N/A") ||
              "N/A"
          ),
          ciudad: validateString(
            MAX_LENGTHS,
            "ciudad",
            (typeof item.Ciudad === "string" ? item.Ciudad.trim() : "N/A") ||
              "N/A"
          ),
          estado: validateString(
            MAX_LENGTHS,
            "estado",
            (typeof item.Estado === "string" ? item.Estado.trim() : "N/A") ||
              "N/A"
          ),
          cp: validateString(
            MAX_LENGTHS,
            "cp",
            (typeof item.CP === "string" ? item.CP.trim() : "N/A") || "N/A"
          ),
          pais: validateString(
            MAX_LENGTHS,
            "pais",
            (typeof item.Pais === "string" ? item.Pais.trim() : "N/A") || "N/A"
          ),
          rfc: validateString(
            MAX_LENGTHS,
            "rfc",
            (typeof item.RFC === "string" ? item.RFC.trim() : "N/A") || "N/A"
          ),
          telefono_1: validateString(
            MAX_LENGTHS,
            "telefono_1",
            (typeof item.Telefono_1 === "string"
              ? item.Telefono_1.trim()
              : "N/A") || "N/A"
          ),
          telefono_2: validateString(
            MAX_LENGTHS,
            "telefono_2",
            (typeof item.Telefono_2 === "string"
              ? item.Telefono_2.trim()
              : "N/A") || "N/A"
          ),
          fax: validateString(
            MAX_LENGTHS,
            "fax",
            (typeof item.Fax === "string" ? item.Fax.trim() : "N/A") || "N/A"
          ),
          celular: validateString(
            MAX_LENGTHS,
            "celular",
            (typeof item.Celular === "string" ? item.Celular.trim() : "N/A") ||
              "N/A"
          ),
          email: validateString(
            MAX_LENGTHS,
            "email",
            (typeof item.Email === "string" ? item.Email.trim() : "N/A") ||
              "N/A"
          ),
          contraseña: validateString(
            MAX_LENGTHS,
            "contraseña",
            (typeof item.Contraseña === "string"
              ? item.Contraseña.trim()
              : "N/A") || "N/A"
          ),
          baja: validateString(
            MAX_LENGTHS,
            "baja",
            (typeof item.Baja === "string" ? item.Baja.trim() : "n") || "n"
          ),
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
