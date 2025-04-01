import { useState } from "react";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import { ReporteExcel } from "@/app/utils/ReportesExcel";
import { chunkArray, validateString } from "@/app/utils/globalfn";
import { truncateTable } from "@/app/utils/GlobalApis";
import { showSwal, confirmSwal } from "@/app/utils/alerts";
import * as XLSX from "xlsx";
import {
  ImprimirPDF,
  ImprimirExcel,
  storeBatchAsignatura,
} from "@/app/utils/api/asignaturas/asignaturas";

export const useAsignaturasPdfExcel = (
  asignaturasFiltrados,
  session,
  reload_page,
  inactiveActive,
  busqueda,
  fetchAsignaturaStatus,
  setReloadPage,
  setisLoadingButton
) => {
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const [animateLoading, setAnimateLoading] = useState(false);
  const [porcentaje, setPorcentaje] = useState(0);
  const [cerrarTO, setCerrarTO] = useState(false);
  const [excelPreviewData, setExcelPreviewData] = useState([]);
  const [dataJson, setDataJson] = useState([]);
  const MAX_LENGTHS = {
    descripcion: 100,
    evaluaciones: 20,
    actividad: 10,
    area: 20,
    orden: 20,
    lenguaje: 15,
    caso_evaluar: 15,
    fecha_seg: 10,
    hora_seg: 10,
    cve_seg: 10,
  };

  const showModalVista = (show) => {
    show
      ? document.getElementById("modalVAsignatura").showModal()
      : document.getElementById("modalVAsignatura").closest();
  };

  const CerrarView = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalVAsignatura").close();
  };

  const handleVerClick = () => {
    setAnimateLoading(true);
    CerrarView();
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Datos Asignaturas",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
    };
    const Enca1 = (doc) => {
      if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalH();
        doc.nextRow(12);
        doc.ImpPosX("No.", 14, doc.tw_ren);
        doc.ImpPosX("Asignatura", 28, doc.tw_ren);
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
    const alignsIndex = [0];
    const tablaExcel = [["Numero", "Descripción"]];
    asignaturasFiltrados.forEach((asignatura) => {
      reporte.ImpPosX(asignatura.numero.toString(), 24, reporte.tw_ren, 0, "R");
      reporte.ImpPosX(
        asignatura.descripcion.toString(),
        28,
        reporte.tw_ren,
        25,
        "L"
      );
      tablaExcel.push([asignatura.numero, asignatura.descripcion.toString()]);
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
        Nombre_Reporte: "Reporte Datos Asignaturas",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: asignaturasFiltrados,
    };
    ImprimirPDF(configuracion);
  };

  const ImprimeExcel = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Datos Asignaturas",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: asignaturasFiltrados,
      columns: [
        { header: "Numero", dataKey: "numero" },
        { header: "Descripcion", dataKey: "descripcion" },
      ],
      nombre: "Asignaturas",
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
    await truncateTable(token, "asignaturas");
    const chunks = chunkArray(dataJson, 20);
    let chunksProcesados = 0;
    let numeroChunks = chunks.length;

    for (let chunk of chunks) {
      await storeBatchAsignatura(token, chunk);
      chunksProcesados++;
      const progreso = (chunksProcesados / numeroChunks) * 100;
      setPorcentaje(Math.round(progreso));
    }
    setCerrarTO(true);
    setisLoadingButton(false);
    setDataJson([]);
    setPorcentaje(0);
    showSwal(
      "Éxito",
      "Todos las Asignaturas se insertaron correctamente.",
      "success"
    );
    showModalProcesa(false);
    setTimeout(() => {
      setReloadPage(!reload_page);
    }, 3500);
    await fetchAsignaturaStatus(true, inactiveActive, busqueda);
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
          numero: parseInt(item.Numero || 0),
          descripcion: validateString(
            MAX_LENGTHS,
            "descripcion",
            (typeof item.Descripcion === "string"
              ? item.Descripcion.trim()
              : "N/A") || "N/A"
          ),
          fecha_seg: validateString(
            MAX_LENGTHS,
            "fecha_seg",
            (typeof item.Fecha_Seg === "string"
              ? item.Fecha_Seg.trim()
              : "N/A") || "N/A"
          ),
          hora_seg: validateString(
            MAX_LENGTHS,
            "hora_seg",
            (typeof item.Hora_Seg === "string"
              ? item.Hora_Seg.trim()
              : "N/A") || "N/A"
          ),
          cve_seg: validateString(
            MAX_LENGTHS,
            "cve_seg",
            (typeof item.Cve_Seg === "string" ? item.Cve_Seg.trim() : "N/A") ||
              "N/A"
          ),
          baja: validateString(
            MAX_LENGTHS,
            "baja",
            (typeof item.Baja === "string" ? item.Baja.trim() : "n") || "n"
          ),
          evaluaciones: validateString(
            MAX_LENGTHS,
            "evaluaciones",
            (typeof item.Evaluaciones === "string"
              ? item.Evaluaciones.trim()
              : "n") || "n"
          ),
          actividad: validateString(
            MAX_LENGTHS,
            "actividad",
            (typeof item.Actividad === "string"
              ? item.Actividad.trim()
              : "n") || "n"
          ),
          area: validateString(
            MAX_LENGTHS,
            "area",
            (typeof item.Area === "string" ? item.Area.trim() : "n") || "n"
          ),
          orden: validateString(
            MAX_LENGTHS,
            "orden",
            (typeof item.Orden === "string" ? item.Orden.trim() : "n") || "n"
          ),
          lenguaje: validateString(
            MAX_LENGTHS,
            "lenguaje",
            (typeof item.Lenguaje === "string" ? item.Lenguaje.trim() : "n") ||
              "n"
          ),
          caso_evaluar: validateString(
            MAX_LENGTHS,
            "caso_evaluar",
            (typeof item.Caso_Evaluar === "string"
              ? item.Caso_Evaluar.trim()
              : "n") || "n"
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
