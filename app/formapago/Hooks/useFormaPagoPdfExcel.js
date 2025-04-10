import { useState } from "react";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import { ReporteExcel } from "@/app/utils/ReportesExcel";
import {
  ImprimirExcel,
  storeBatchTipoCobro,
} from "@/app/utils/api/formapago/formapago";
import { chunkArray, validateString } from "@/app/utils/globalfn";
import { truncateTable } from "@/app/utils/GlobalApis";
import { showSwal, confirmSwal } from "@/app/utils/alerts";
import * as XLSX from "xlsx";

export const useFormaPagoPdfExcel = (
  formaPagosFiltrados,
  session,
  reload_page,
  inactiveActive,
  busqueda,
  fetchFormaPagoStatus,
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
    descripcion: 50,
    aplicacion: 30,
    cue_banco: 34,
    baja: 1,
  };

  const showModalVista = (show) => {
    show
      ? document.getElementById("modalVFormaPago").showModal()
      : document.getElementById("modalVFormaPago").close();
  };

  const CerrarView = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalVFormaPago").close();
  };

  const handleVerClick = () => {
    setAnimateLoading(true);
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Datos Productos",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: formaPagosFiltrados,
    };

    const orientacion = "Portrait";
    const reporte = new ReportePDF(configuracion, orientacion);
    const { body } = configuracion;
    const Enca1 = (doc) => {
      if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalV();
        doc.nextRow(12);
        doc.ImpPosX("No.", 14, doc.tw_ren, 0, "L");
        doc.ImpPosX("Descripcion", 28, doc.tw_ren, 0, "L");
        doc.ImpPosX("Comision", 128, doc.tw_ren, 0, "L");
        doc.ImpPosX("Aplicacion", 152, doc.tw_ren, 0, "L");
        doc.ImpPosX("C. Banco", 182, doc.tw_ren, 0, "L");
        doc.nextRow(4);
        doc.printLineV();
        doc.nextRow(4);
        doc.tiene_encabezado = true;
      } else {
        doc.nextRow(6);
        doc.tiene_encabezado = true;
      }
    };
    const alignsIndex = [0];
    const tablaExcel = [
      ["Numero", "Descripcion", "Comision", "Aplicacion", "Cue. Banco"],
    ];
    Enca1(reporte);
    body.forEach((producto) => {
      reporte.ImpPosX(producto.numero.toString(), 24, reporte.tw_ren, 0, "R");
      reporte.ImpPosX(
        producto.descripcion.toString(),
        28,
        reporte.tw_ren,
        0,
        "L"
      );
      reporte.ImpPosX(
        producto.comision.toString(),
        138,
        reporte.tw_ren,
        0,
        "R"
      );
      reporte.ImpPosX(
        producto.aplicacion.toString(),
        152,
        reporte.tw_ren,
        0,
        "L"
      );
      reporte.ImpPosX(
        producto.cue_banco.toString(),
        182,
        reporte.tw_ren,
        0,
        "L"
      );
      tablaExcel.push([
        producto.numero,
        producto.descripcion.toString(),
        producto.comision.toString(),
        producto.aplicacion.toString(),
        producto.cue_banco.toString(),
      ]);
      Enca1(reporte);
      if (reporte.tw_ren >= reporte.tw_endRen) {
        reporte.pageBreak();
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
        Nombre_Reporte: "Reporte Datos Cajero",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: formaPagosFiltrados,
    };
    Imprimir(configuracion);
  };

  const ImprimeExcel = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Datos Forma Pagos",
        Nombre_Usuario: ` ${session.user.name}`,
      },
      body: formaPagosFiltrados,
      columns: [
        { header: "Numero", dataKey: "numero" },
        { header: "Descripcion", dataKey: "descripcion" },
        { header: "Comision", dataKey: "comision" },
        { header: "Aplicacion", dataKey: "aplicacion" },
        { header: "Cue. Banco", dataKey: "cue_banco" },
      ],
      nombre: "FormaPagos_",
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
    await truncateTable(token, "tipo_cobro");
    const chunks = chunkArray(dataJson, 20);
    let chunksProcesados = 0;
    let numeroChunks = chunks.length;
    for (let chunk of chunks) {
      await storeBatchTipoCobro(token, chunk);
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
    await fetchFormaPagoStatus(true, inactiveActive, busqueda);
  };

  const handleFileChange = async (e) => {
    const confirmed = await confirmSwal(
      "¿Desea Continuar?",
      "Asegúrate de que las columnas del archivo de excel coincidan exactamente con las columnas de la tabla en la base de datos.",
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
          descripcion: validateString(
            MAX_LENGTHS,
            "descripcion",
            (typeof item.Descripcion === "string"
              ? item.Descripcion.trim()
              : "N/A") || "N/A"
          ),
          comision: parseFloat(item.Comision || 0),
          aplicacion: validateString(
            MAX_LENGTHS,
            "aplicacion",
            (typeof item.Aplicacion === "string"
              ? item.Aplicacion.trim()
              : "N/A") || "N/A"
          ),
          baja: validateString(
            MAX_LENGTHS,
            "baja",
            (typeof item.Baja === "string" ? item.Baja.trim() : "n") || "n"
          ),
          cue_banco: validateString(
            MAX_LENGTHS,
            "cue_banco",
            (typeof item.Cue_banco === "string"
              ? item.Cue_banco.trim()
              : "N/A") || "N/A"
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
