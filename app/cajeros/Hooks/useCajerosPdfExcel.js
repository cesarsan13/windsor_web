import React, { useState } from "react";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import {
  Imprimir,
  ImprimirExcel,
  storeBatchCajero,
} from "@/app/utils/api/cajeros/cajeros";
import {validateString, chunkArray } from "@/app/utils/globalfn";
import { showSwal, confirmSwal } from "@/app/utils/alerts";
import * as XLSX from "xlsx";

export const useCajerosPdfExcel = (
    cajerosFiltrados,
    session,
    reload_page,
    inactiveActive,
    busqueda,
    fetchCajerosStatus,
    setReloadPage,
    setisLoadingButton,
)=>{
    const [pdfPreview, setPdfPreview] = useState(false);
    const [animateLoading, setAnimateLoading] = useState(false);
    const [pdfData, setPdfData] = useState("");
    const [dataJson, setDataJson] = useState([]); 
    const [porcentaje, setPorcentaje] = useState(0);
    const [cerrarTO, setCerrarTO] = useState(false);
    const MAX_LENGTHS = {
        nombre: 35,
        direccion: 50,
        colonia: 30,
        estado: 30,
        telefono:  20,
        fax: 20,
        mail: 40,
        clave_cajero: 8,
        baja: 1
    };

    const showModalVista = (show) => {
      show
        ? document.getElementById("modalVPCajero").showModal()
        : document.getElementById("modalVPCajero").close();
    };

    const CerrarView = () => {
      setPdfPreview(false);
      setPdfData("");
      document.getElementById("modalVPCajero").close();
    };

    const handleVerClick = () => {
      setAnimateLoading(true);
      const configuracion = {
        Encabezado: {
          Nombre_Aplicacion: "Sistema de Control Escolar",
          Nombre_Reporte: "Reporte de Cajeros",
          Nombre_Usuario: `Usuario: ${session.user.name}`,
        },
      };
      const Enca1 = (doc) => {
        if (!doc.tiene_encabezado) {
          doc.imprimeEncabezadoPrincipalV();
          doc.nextRow(12);
          doc.ImpPosX("No.", 14, doc.tw_ren, 0, "L");
          doc.ImpPosX("Nombre", 28, doc.tw_ren, 0, "L");
          doc.ImpPosX("Clave", 97, doc.tw_ren, 0, "L");
          doc.ImpPosX("Telefono", 112, doc.tw_ren, 0, "L");
          doc.ImpPosX("Correo", 142, doc.tw_ren, 0, "L");
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
      cajerosFiltrados.forEach((cajero) => {
        reporte.ImpPosX(cajero.numero.toString(), 24, reporte.tw_ren, 0, "R");
        reporte.ImpPosX(cajero.nombre.toString(), 28, reporte.tw_ren, 0, "L");
        reporte.ImpPosX(
          cajero.clave_cajero.toString(),
          97,
          reporte.tw_ren,
          0,
          "L"
        );
        reporte.ImpPosX(cajero.telefono.toString(), 112, reporte.tw_ren, 0, "L");
        reporte.ImpPosX(cajero.mail.toString(), 142, reporte.tw_ren, 0, "L");
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
          Nombre_Reporte: "Reporte de Cajeros",
          Nombre_Usuario: `Usuario: ${session.user.name}`,
        },
        body: cajerosFiltrados,
      };
      Imprimir(configuracion);
    };
    
    const ImprimeExcel = () => {
      const configuracion = {
        Encabezado: {
          Nombre_Aplicacion: "Sistema de Control Escolar",
          Nombre_Reporte: "Reporte de Cajeros",
          Nombre_Usuario: `Usuario: ${session.user.name}`,
        },
        body: cajerosFiltrados,
        columns: [
          { header: "Numero", dataKey: "numero" },
          { header: "Nombre", dataKey: "nombre" },
          { header: "Clave Cajero", dataKey: "clave_cajero" },
          { header: "Telefono", dataKey: "telefono" },
          { header: "Correo", dataKey: "mail" },
        ],
        nombre: "Cajeros",
      };
      ImprimirExcel(configuracion);
    };

    const procesarDatos = () => {
      if (!session.user.es_admin) {
        showSwal(
          "Acción no permitida",
          "Solo los administradores pueden realizar esta acción.",
          "warning"
        );
        return;
      }
    
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
      await truncateTable(token, "cajeros");
      const chunks = chunkArray(dataJson, 20);
      let chunksProcesados = 0;
      let numeroChunks = chunks.length;
      for (let chunk of chunks) {
        await storeBatchCajero(token, chunk);
        chunksProcesados++;
        const progreso = (chunksProcesados / numeroChunks) * 100;
        setPorcentaje(Math.round(progreso));
      }
      setCerrarTO(true);
      setDataJson([]);
      showModalProcesa(false);
      showSwal("Éxito", "Los datos se han subido correctamente.", "success");
      await fetchCajerosStatus(true, inactiveActive, busqueda);
      setTimeout(() => {
        setReloadPage(!reload_page);
      }, 3500);    
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
              nombre: validateString( 
                MAX_LENGTHS,
                "nombre",
                (typeof item.Nombre === "string"
                    ? item.nombre.trim()
                    :"N/A")|| "N/A"
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
                (typeof item.Colonia === "string"
                    ? item.Colonia.trim()
                    : "N/A") || "N/A"
                ),
              estado: validateString(
                MAX_LENGTHS,
                "estado",
                (typeof item.Estado === "string"
                    ? item.Estado.trim()
                    : "N/A") || "N/A"
                ),
              telefono: validateString(
                MAX_LENGTHS,
                "telefono",
                (typeof item.Telefono === "string"
                    ? item.Telefono.trim()
                    : "N/A") || "N/A"
                ),
              fax: validateString(
                MAX_LENGTHS,
                "fax",
                (typeof item.Fax === "string"
                    ? item.Fax.trim()
                    : "N/A") || "N/A"
                ),
              mail: validateString(
                MAX_LENGTHS,
                "mail",
                (typeof item.Mail === "string"
                    ? item.Mail.trim()
                    : "N/A") || "N/A"
                ),
              clave_cajero: validateString(
                MAX_LENGTHS,
                "clave_cajero",
                (typeof item.Clave_cajero === "string"
                    ? item.Clave_cajero.trim()
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
      pdfPreview,
      pdfData,
      animateLoading,
      porcentaje,
      cerrarTO,
      dataJson,
    };
};

