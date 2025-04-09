import React, { useState } from "react";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import { ReporteExcel } from "@/app/utils/ReportesExcel";
import {
  Imprimir,
  ImprimirExcel,
  storeBatchHorario,
} from "@/app/utils/api/horarios/horarios";
import { chunkArray, validateString } from "@/app/utils/globalfn";
import { truncateTable } from "@/app/utils/GlobalApis";
import { showSwal, confirmSwal } from "@/app/utils/alerts";
import * as XLSX from "xlsx";

export const useHorariosPdfExcel = (
  formaHorariosFiltrados,
  session,
  reload_page,
  inactiveActive,
  busqueda,
  fetchHorariosStatus,
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
    salon: 50,
  };

  const showModalVista = (show) => {
    show
      ? document.getElementById("modalVPHorarios").showModal()
      : document.getElementById("modalVPHorarios").close();
  };

  const CerrarView = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalVPHorarios").close();
  };

  const handleVerClick = () => {
    setAnimateLoading(true);
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Datos Horario",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: formaHorariosFiltrados,
    };
    const Enca1 = (doc) => {
      if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalV();
        doc.nextRow(12);
        doc.nextRow(12);
        doc.ImpPosX("Numero", 14, doc.tw_ren);
        doc.ImpPosX("Horario", 28, doc.tw_ren);
        doc.ImpPosX("Salón", 62, doc.tw_ren);
        doc.ImpPosX("Dia", 90, doc.tw_ren);
        doc.ImpPosX("Cancha", 117, doc.tw_ren);
        doc.ImpPosX("Niños", 134, doc.tw_ren);
        doc.ImpPosX("Sexo", 149, doc.tw_ren);
        doc.ImpPosX("Edad Ini", 164, doc.tw_ren);
        doc.ImpPosX("Edad Fin", 184, doc.tw_ren);
        doc.nextRow(4);
        doc.printLineV();
        doc.nextRow(4);
        doc.tiene_encabezado = true;
      } else {
        doc.nextRow(6);
        doc.tiene_encabezado = true;
      }
    };
    const reporte = new ReportePDF(configuracion);
    Enca1(reporte);
    const alignsIndex = [0, 4, 5, 7, 8];
    const tablaExcel = [
      [
        "Numero",
        "Horario",
        "Salón",
        "Dia",
        "Cancha",
        "Niños",
        "Sexo",
        "Edad Ini",
        "Edad Fin",
      ],
    ];
    const { body } = configuracion;
    body.forEach((horario) => {
      reporte.ImpPosX(horario.numero.toString(), 24, reporte.tw_ren, 0, "R");
      reporte.ImpPosX(horario.horario.toString(), 28, reporte.tw_ren);
      reporte.ImpPosX(horario.salon.toString(), 62, reporte.tw_ren);
      reporte.ImpPosX(horario.dia.toString(), 90, reporte.tw_ren);
      reporte.ImpPosX(horario.cancha.toString(), 127, reporte.tw_ren, 0, "R");
      reporte.ImpPosX(
        horario.max_niños.toString(),
        144,
        reporte.tw_ren,
        0,
        "R"
      );
      reporte.ImpPosX(horario.sexo.toString(), 149, reporte.tw_ren);
      reporte.ImpPosX(horario.edad_ini.toString(), 174, reporte.tw_ren, 0, "R");
      reporte.ImpPosX(horario.edad_fin.toString(), 194, reporte.tw_ren, 0, "R");
      tablaExcel.push([
        horario.numero,
        horario.horario.toString(),
        horario.salon.toString(),
        horario.dia.toString(),
        horario.cancha,
        horario.max_niños,
        horario.sexo.toString(),
        horario.edad_ini,
        horario.edad_fin,
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
        Nombre_Reporte: "Reporte Datos Horario",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: formaHorariosFiltrados,
    };
    Imprimir(configuracion);
  };

  const ImprimeExcel = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Datos Horario",
        Nombre_Usuario: `${session.user.name}`,
      },
      body: formaHorariosFiltrados,
      columns: [
        { header: "Numero", dataKey: "numero" },
        { header: "Horario", dataKey: "horario" },
        { header: "Salón", dataKey: "salon" },
        { header: "Dia", dataKey: "dia" },
        { header: "Cancha", dataKey: "cancha" },
        { header: "Niños", dataKey: "max_niños" },
        { header: "Sexo", dataKey: "sexo" },
        { header: "Edad Ini", dataKey: "edad_ini" },
        { header: "Edad Fin", dataKey: "edad_fin" },
      ],
      nombre: "Horarios",
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
    await truncateTable(token, "horarios");
    const chunks = chunkArray(dataJson, 20);
    let chunksProcesados = 0;
    let numeroChunks = chunks.length;
    for (let chunk of chunks) {
      await storeBatchHorario(token, chunk);
      chunksProcesados++;
      const progreso = (chunksProcesados / numeroChunks) * 100;
      setPorcentaje(Math.round(progreso));
    }
    setCerrarTO(true);
    setDataJson([]);
    showModalProcesa(false);
    showSwal("Éxito", "Los datos se han subido correctamente.", "success");
    await fetchHorariosStatus(true);
    setTimeout(() => {
      setReloadPage(!reload_page);
    }, 3500);
    await fetchHorariosStatus(true, inactiveActive, busqueda);
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
          horario:
            item.Horario && String(item.Horario).trim() !== ""
              ? String(item.Horario).slice(0, 20)
              : "N/A",
          salon: validateString(
            MAX_LENGTHS,
            "salon",
            (typeof item.Salon === "string" ? item.Salon.trim() : "N/A") ||
              "N/A"
          ),
          dia:
            item.Dia && String(item.Dia).trim() !== ""
              ? String(item.Dia).slice(0, 15)
              : "N/A",
          cancha: parseInt(item.Cancha || 0),
          max_niños: parseInt(item.Max_niños || 0),
          sexo:
            item.Sexo && String(item.Sexo).trim() !== ""
              ? String(item.Sexo).slice(0, 8)
              : "N/A",
          edad_ini: parseInt(item.Edad_ini || 0),
          edad_fin: parseInt(item.Edad_fin || 0),
          baja:
            item.Baja && item.Baja.trim() !== ""
              ? String(item.Baja).slice(0, 1)
              : "n",
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
