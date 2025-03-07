import { useState } from "react";
import { ReportePDF } from '@/app/utils/ReportesPDF';
import { 
    ImprimirPDF, 
    ImprimirExcel,
    storeBatchActividad
} from '@/app/utils/api/actividades/actividades';
import { chunkArray, validateString } from "@/app/utils/globalfn";
import { truncateTable } from "@/app/utils/GlobalApis";
import { showSwal, confirmSwal } from "@/app/utils/alerts";
import * as XLSX from "xlsx";

export const useActividadesPdfExcel = (
    ActividadesFiltradas,
    session,
    reload_page,
    inactiveActive,
    busqueda,
    fetchActividadStatus,
    setReloadPage,
    setisLoadingButton
) => {
    const [pdfPreview, setPdfPreview] = useState(false);
    const [pdfData, setPdfData] = useState("");
    const [animateLoading, setAnimateLoading] = useState(false);
    const [porcentaje, setPorcentaje] = useState(0);
    const [cerrarTO, setCerrarTO] = useState(false);
    const [dataJson, setDataJson] = useState([]);
    const MAX_LENGTHS = {
        //materia: 11,
        //secuencia: 11,
        matDescripcion: 100, 
        descripcion: 30,
        evaluaciones: 11,
        //EB1: 11,
        //EB2: 11,
        //EB3: 11,
        //EB4: 11,
        //EB5: 11,
        baja: 1
    };

    const showModalVista = (show) => {
        show
            ? document.getElementById("modalVPActividades").showModal()
            : document.getElementById("modalVPActividades").close();
    }

    const CerrarView = () => {
        setPdfPreview(false);
        setPdfData("");
        document.getElementById("modalVPActividades").close();
    };

    const handleVerClick = () => {
        setAnimateLoading(true)
        const configuracion = {
            Encabezado: {
                Nombre_Aplicacion: "Sistema de Control Escolar",
                Nombre_Reporte: "Reporte Datos Horario",
                Nombre_Usuario: `Usuario: ${session.user.name}`,
            },
            body: ActividadesFiltradas,
        };
        const orientacion = "Portrait";
        const reporte = new ReportePDF(configuracion, orientacion);
        const { body } = configuracion;

        const Enca1 = (doc) => {
            if (!doc.tiene_encabezado) {
                doc.imprimeEncabezadoPrincipalV();
                doc.nextRow(12);
                doc.ImpPosX("Asignatura", 14, doc.tw_ren);
                doc.ImpPosX("Actividad", 38, doc.tw_ren);
                doc.nextRow(4);
                doc.printLineV();
                doc.nextRow(4);
                doc.tiene_encabezado = true;
            } else {
                doc.nextRow(6)
                doc.tiene_encabezado = true
            }
        }
        Enca1(reporte)
        body.forEach((actividad) => {
            reporte.ImpPosX(actividad.materia.toString(), 24, reporte.tw_ren, 0, "R")
            reporte.ImpPosX(actividad.descripcion.toString(), 38, reporte.tw_ren, 0, "L")
            Enca1(reporte);
            if (reporte.tw_ren >= reporte.tw_endRen) {
                reporte.pageBreak();
                Enca1(reporte);
            }
        })
        setTimeout(() => {
            const pdfData = reporte.doc.output("datauristring");
            setPdfData(pdfData);
            setPdfPreview(true);
            showModalVista(true)
            setAnimateLoading(false)
        }, 500)
    };

    const ImprimePDF = () => {
        const configuracion = {
            Encabezado: {
                Nombre_Aplicacion: "Sistema de Control Escolar",
                Nombre_Reporte: "Reporte Datos Actividades",
                Nombre_Usuario: `Usuario: ${session.user.name}`,
            },
            body: ActividadesFiltradas
        };
        ImprimirPDF(configuracion);
    };

    const ImprimeExcel = () => {
        const configuracion = {
            Encabezado: {
                Nombre_Aplicacion: "Sistema de Control Escolar",
                Nombre_Reporte: "Reporte Datos Actividades",
                Nombre_Usuario: `Usuario: ${session.user.name}`,
            },
            body: ActividadesFiltradas,
            columns: [
                { header: "Asignatura", dataKey: "materia" },
                { header: "Actividad", dataKey: "descripcion" }
            ],
            nombre: "Actividades"
        }
        ImprimirExcel(configuracion)
    };

    const procesarDatos = () => {
        showModalProcesa(true);
    };

    const showModalProcesa = (show) => {
        show
          ? document.getElementById("my_modal_actividades").showModal()
          : document.getElementById("my_modal_actividades").close();
    };

    const buttonProcess = async () => {
        document.getElementById("cargamodal").showModal();
        event.preventDefault();
        setisLoadingButton(true);
        const { token } = session.user;
        await truncateTable(token, "actividades");
        const chunks = chunkArray(dataJson, 20);
        let allErrors = "";
        let chunksProcesados = 0;
        let numeroChunks = chunks.length;
        for (let chunk of chunks) {
          await storeBatchActividad(token, chunk);
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
            "Todas las Actividades se insertaron correctamente.",
            "success"
        );
        showModalProcesa(false);
        setTimeout(() => {
          setReloadPage(!reload_page);
        }, 3500);
        await fetchActividadStatus(true, inactiveActive, busqueda);
    };

    const handleFileChange = async (e) => {
      const confirmed = await confirmSwal(
        "¿Desea Continuar?",
        "Por favor, verifica que las columnas del archivo de Excel coincidan exactamente con las columnas de la tabla en la base de datos y que no contengan espacios en blanco.",
        "warning",
        "Aceptar",
        "Cancelar",
        "my_modal_actividades"
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
          const convertedData = jsonData.map((item) => {
            return {
                materia: item.Materia || 0,
                secuencia: item.Secuencia || 0,
                matDescripcion: validateString(
                    MAX_LENGTHS,
                    "matDescripcion",
                    (typeof item.MatDescripcion === "string"
                        ? item.MatDescripcion.trim()
                        : "N/A") || "N/A"
                ),
                descripcion: validateString(
                    MAX_LENGTHS,
                    "descripcion",
                    ( typeof item.Descripcion === "string"
                        ? item.Descripcion.trim()
                        : "N/A") || "N/A"
                ),
                evaluaciones: isNaN(parseInt(item.Evaluaciones))
                    ? 0
                    : parseInt(item.Evaluaciones),
                EB1: isNaN(parseInt(item.EB1))
                    ? 0
                    : parseInt(item.EB1),
                EB2:isNaN(parseInt(item.EB2))
                    ? 0
                    : parseInt(item.EB2),
                EB3: isNaN(parseInt(item.EB3))
                    ? 0
                    : parseInt(item.EB3),
                EB4: isNaN(parseInt(item.EB4))
                    ? 0
                    : parseInt(item.EB4),
                EB5:isNaN(parseInt(item.EB5))
                    ? 0
                    : parseInt(item.EB5),
                baja: validateString(
                    MAX_LENGTHS,
                    "baja",
                    (typeof item.Baja === "string" ? item.Baja.trim() : "n") || "n"
                ),
            };
          });
          setDataJson(convertedData);
        };
        reader.readAsArrayBuffer(selectedFile);
      }
    };

    return{
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
        dataJson
    };
};


