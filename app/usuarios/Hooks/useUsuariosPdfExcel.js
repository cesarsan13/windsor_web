import React, { useState } from "react";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import {
    ImprimirPDF,
    ImprimirExcel,
} from "@/app/utils/api/usuarios/usuarios";

export const useUsuariosPdfExcel = (
    usuariosFiltrados,
    session,
) => {
    const [pdfPreview, setPdfPreview] = useState(false);
    const [pdfData, setPdfData] = useState("");
    const [animateLoading, setAnimateLoading] = useState(false);

    const showModalVista = (show) => {
        show
          ? document.getElementById("modalVPUsuario").showModal()
          : document.getElementById("modalVPUsuario").close();
    };

    const CerrarView = () => {
        setPdfPreview(false);
        setPdfData("");
        document.getElementById("modalVPUsuario").close();
    };

    const handleVerClick = () => {
        setAnimateLoading(true);
        const configuracion = {
          Encabezado: {
            Nombre_Aplicacion: "Sistema de Control Escolar",
            Nombre_Reporte: "Reporte de Usuarios",
            Nombre_Usuario: `Usuario: ${session.user.name}`,
          },
          body: usuariosFiltrados,
        };
    
        const orientacion = "Portrait";
        const reporte = new ReportePDF(configuracion, orientacion);
        const { body } = configuracion;
        const Enca1 = (doc) => {
          if (!doc.tiene_encabezado) {
            doc.imprimeEncabezadoPrincipalV();
            doc.nextRow(12);
            doc.ImpPosX("Id", 15, doc.tw_ren);
            doc.ImpPosX("Usuario", 30, doc.tw_ren);
            doc.ImpPosX("Nombre", 70, doc.tw_ren);
            doc.ImpPosX("Email", 150, doc.tw_ren);
    
            doc.nextRow(4);
            doc.printLineV();
            doc.nextRow(4);
            doc.tiene_encabezado = true;
          } else {
            doc.nextRow(6);
            doc.tiene_encabezado = true;
          }
        };
    
        Enca1(reporte);
        body.forEach((usuarios) => {
          reporte.ImpPosX(usuarios.id.toString(), 20, reporte.tw_ren, 0, "R");
          reporte.ImpPosX(usuarios.name.toString(), 30, reporte.tw_ren, 35, "L");
          reporte.ImpPosX(usuarios.nombre.toString(), 70, reporte.tw_ren, 35, "L");
          reporte.ImpPosX(usuarios.email.toString(), 150, reporte.tw_ren, 35, "L");
          Enca1(reporte);
          if (reporte.tw_ren >= reporte.tw_endRen) {
            reporte.pageBreak();
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

    const ImprimePDF = () => {
        const configuracion = {
          Encabezado: {
            Nombre_Aplicacion: "Sistema de Control Escolar",
            Nombre_Reporte: "Reporte de Usuarios",
            Nombre_Usuario: `Usuario: ${session.user.name}`,
          },
          body: usuariosFiltrados,
        };
        ImprimirPDF(configuracion);
    };
    
    const ImprimeExcel = () => {
        const configuracion = {
          Encabezado: {
            Nombre_Aplicacion: "Sistema de Control Escolar",
            Nombre_Reporte: "Reporte de Usuarios",
            Nombre_Usuario: `Usuario: ${session.user.name}`,
          },
    
          body: usuariosFiltrados,
          columns: [
            { header: "Id", dataKey: "id" },
            { header: "Usuario", dataKey: "name" },
            { header: "Nombre", dataKey: "nombre" },
            { header: "Email", dataKey: "email" },
          ],
          nombre: "Usuarios",
        };
        ImprimirExcel(configuracion);
    };

    return {
      handleVerClick,
      CerrarView,
      ImprimePDF,
      ImprimeExcel,
      pdfPreview,
      pdfData,
      animateLoading,
    };
};