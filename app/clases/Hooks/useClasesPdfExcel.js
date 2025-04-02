import React, { useState } from "react";
import { ReporteExcel } from "@/app/utils/ReportesExcel";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import { Imprimir, ImprimirExcel } from "@/app/utils/api/clases/clases";
import { obtenerFechaYHoraActual } from "@/app/utils/globalfn";

export const useClasesPdfExcel = (clasesFiltrados, session) => {
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const [animateLoading, setAnimateLoading] = useState(false);
  const [excelPreviewData, setExcelPreviewData] = useState([]);

  const showModalVista = (show) => {
    show
      ? document.getElementById("modalVPClase").showModal()
      : document.getElementById("modalVPClase").close();
  };

  const CerrarView = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalVPClase").close();
  };

  const handleVerClick = () => {
    setAnimateLoading(true);
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Datos Clase",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: clasesFiltrados,
    };
    const Enca1 = (doc) => {
      if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalH();
        doc.nextRow(12);
        doc.ImpPosX("Grupo", 14, doc.tw_ren, 0, "L");
        doc.ImpPosX("Asignatura", 50, doc.tw_ren, 0, "L");
        doc.ImpPosX("Profesor", 95, doc.tw_ren, 0, "L");
        doc.ImpPosX("Lunes", 180, doc.tw_ren, 0, "L");
        doc.ImpPosX("Martes", 195, doc.tw_ren, 0, "L");
        doc.ImpPosX("Miercoles", 210, doc.tw_ren, 0, "L");
        doc.ImpPosX("Jueves", 230, doc.tw_ren, 0, "L");
        doc.ImpPosX("Viernes", 245, doc.tw_ren, 0, "L");
        doc.ImpPosX("Sabado", 260, doc.tw_ren, 0, "L");
        doc.ImpPosX("Domingo", 275, doc.tw_ren, 0, "L");
        doc.nextRow(4);
        doc.printLineH();
        doc.nextRow(4);
        doc.tiene_encabezado = true;
      } else {
        doc.nextRow(6);
        doc.tiene_encabezado = true;
      }
    };
    const orientacion = "Landscape";
    const reporte = new ReportePDF(configuracion, orientacion);
    Enca1(reporte);
    const tablaExcel = [
      [
        "Grupo",
        "Asignatura",
        "Profesor",
        "Lunes",
        "Martes",
        "Miercoles",
        "Jueves",
        "Viernes",
        "Sabado",
        "Domingo",
      ],
    ];
    clasesFiltrados.forEach((clase) => {
      reporte.ImpPosX(
        clase.grupo_descripcion?.toString() ?? "",
        14,
        reporte.tw_ren,
        12,
        "L"
      );
      reporte.ImpPosX(
        clase.materia_descripcion?.toString() ?? "",
        50,
        reporte.tw_ren,
        20,
        "L"
      );
      reporte.ImpPosX(
        clase.profesor_nombre?.toString() ?? "",
        95,
        reporte.tw_ren,
        35,
        "L"
      );
      reporte.ImpPosX(
        clase.lunes?.toString() ?? "",
        180,
        reporte.tw_ren,
        0,
        "L"
      );
      reporte.ImpPosX(
        clase.martes?.toString() ?? "",
        195,
        reporte.tw_ren,
        0,
        "L"
      );
      reporte.ImpPosX(
        clase.miercoles?.toString() ?? "",
        210,
        reporte.tw_ren,
        0,
        "L"
      );
      reporte.ImpPosX(
        clase.jueves?.toString() ?? "",
        230,
        reporte.tw_ren,
        0,
        "L"
      );
      reporte.ImpPosX(
        clase.viernes?.toString() ?? "",
        245,
        reporte.tw_ren,
        0,
        "L"
      );
      reporte.ImpPosX(
        clase.sabado?.toString() ?? "",
        260,
        reporte.tw_ren,
        0,
        "L"
      );
      reporte.ImpPosX(
        clase.domingo?.toString() ?? "",
        275,
        reporte.tw_ren,
        0,
        "L"
      );
      tablaExcel.push([
        clase.grupo_descripcion,
        clase.materia_descripcion,
        clase.profesor_nombre,
        clase.lunes,
        clase.martes,
        clase.miercoles,
        clase.jueves,
        clase.viernes,
        clase.sabado,
        clase.domingo,
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
      const previewExcel = await newExcel.previewExcel(tablaExcel);
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
        Nombre_Reporte: "Reporte Datos Clases",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: clasesFiltrados,
    };
    Imprimir(configuracion);
  };

  const ImprimeExcel = () => {
    const { fecha, hora } = obtenerFechaYHoraActual();
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Datos Clases",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: clasesFiltrados,
      columns: [
        { header: "Grupo", dataKey: "grupo_descripcion" },
        { header: "Asignatura", dataKey: "materia_descripcion" },
        { header: "Profesor", dataKey: "profesor_nombre" },
        { header: "Lunes", dataKey: "lunes" },
        { header: "Martes", dataKey: "martes" },
        { header: "Miercoles", dataKey: "miercoles" },
        { header: "Jueves", dataKey: "jueves" },
        { header: "Viernes", dataKey: "viernes" },
        { header: "Sabado", dataKey: "sabado" },
        { header: "Domingo", dataKey: "domingo" },
      ],
      nombre: `Reporte_Clases_${fecha}${hora}`,
    };
    ImprimirExcel(configuracion);
  };

  return {
    handleVerClick,
    CerrarView,
    ImprimePDF,
    ImprimeExcel,
    excelPreviewData,
    pdfPreview,
    pdfData,
    animateLoading,
  };
};
