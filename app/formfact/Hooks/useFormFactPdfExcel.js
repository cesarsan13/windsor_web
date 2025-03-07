import React, { useState } from "react";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import {
    storeBatchFormFact,
} from "@/app/utils/api/formfact/formfact";

export const useFormFactPdfExcel = (
    session,
    reload_page,
    inactiveActive,
    busqueda,
    fetchFormFactStatus,
    setReloadPage,
    setisLoadingButton
) => {
    const [porcentaje, setPorcentaje] = useState(0);
    const [cerrarTO, setCerrarTO] = useState(false);
    const [dataJson, setDataJson] = useState([]);
    const MAX_LENGTHS = {
        nombre_forma: 50,
        baja: 1,
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
        await truncateTable(token, "facturas_formas");
        const chunks = chunkArray(dataJson, 20);
        let chunksProcesados = 0;
        let numeroChunks = chunks.length;
        for (let chunk of chunks) {
          await storeBatchFormFact(token, chunk);
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
            "Todos los factura formas se insertaron correctamente.",
            "success"
        );
        showModalProcesa(false);
        setTimeout(() => {
          setReloadPage(!reload_page);
        }, 3500);
        await fetchFormFactStatus(true, inactiveActive, busqueda);
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
              numero_forma: item.Numero_Forma || 0,
              nombre_forma: validateString(
                MAX_LENGTHS,
                "nombre_forma",
                item.Nombre_Forma || ""
              ),
              longitud: parseFloat(item.Longitud || 0),
              baja: validateString(MAX_LENGTHS, "baja", item.Baja || "n"),
            }));
            setDataJson(convertedData);
          };
          reader.readAsArrayBuffer(selectedFile);
        }
    };

    return{
        handleFileChange,
        buttonProcess,
        procesarDatos,
        setDataJson,
        porcentaje,
        cerrarTO,
        dataJson
    };
};
