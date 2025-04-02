import { useState } from "react";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import { ReporteExcel } from "@/app/utils/ReportesExcel";
import {
  Imprimir,
  ImprimirExcel,
  storeBatchAlumnos,
} from "@/app/utils/api/alumnos/alumnos";
import { chunkArray, formatTime, validateString } from "@/app/utils/globalfn";
import { truncateTable } from "@/app/utils/GlobalApis";
import { showSwal, confirmSwal } from "@/app/utils/alerts";
import { format_Fecha_String } from "@/app/utils/globalfn";
import * as XLSX from "xlsx";

export const useAlumnosPdfExcel = (
  formaAlumnosFiltrados,
  session,
  reload_page,
  inactiveActive,
  busqueda,
  fetchAlumnoStatus,
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
    nombre: 50,
    a_paterno: 50,
    a_materno: 50,
    a_nombre: 50,
    fecha_nac: 15,
    fecha_inscripcion: 15,
    fecha_baja: 15,
    sexo: 15,
    telefono1: 15,
    telefono2: 15,
    celular: 15,
    codigo_barras: 255,
    direccion: 255,
    colonia: 100,
    ciudad: 100,
    estado: 100,
    cp: 10,
    email: 255,
    imagen: 250,
    dia_1: 20,
    dia_2: 20,
    dia_3: 20,
    dia_4: 20,
    nom_pediatra: 50,
    tel_p_1: 15,
    tel_p_2: 15,
    cel_p_1: 15,
    tipo_sangre: 20,
    alergia: 50,
    aseguradora: 100,
    poliza: 30,
    tel_ase_1: 15,
    tel_ase_2: 15,
    razon_social: 30,
    raz_direccion: 255,
    raz_cp: 10,
    raz_colonia: 100,
    raz_ciudad: 100,
    raz_estado: 100,
    nom_padre: 100,
    tel_pad_1: 15,
    tel_pad_2: 15,
    cel_pad: 15,
    nom_madre: 100,
    tel_mad_1: 15,
    tel_mad_2: 15,
    cel_mad: 15,
    nom_avi: 100,
    tel_avi_1: 15,
    tel_avi_2: 15,
    cel_avi: 15,
    ciclo_escolar: 50,
    rfc_factura: 50,
    estatus: 20,
    escuela: 50,
    grupo: 15,
    baja: 1,
  };

  const showModalVista = (show) => {
    show
      ? document.getElementById("modalVPAlumno").showModal()
      : document.getElementById("modalVPAlumno").close();
  };

  const CerrarView = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalVPAlumno").close();
  };

  const handleVerClick = () => {
    setAnimateLoading(true);
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Lista de Alumnos por clase",
        Nombre_Reporte: "Reporte de Alumnos",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: formaAlumnosFiltrados,
    };
    const Enca1 = (doc) => {
      if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalV();
        doc.nextRow(12);
        doc.ImpPosX("Numero", 10, doc.tw_ren);
        doc.ImpPosX("Nombre", 25, doc.tw_ren);
        doc.ImpPosX("Dirección", 90, doc.tw_ren);
        doc.ImpPosX("Colonia", 120, doc.tw_ren);
        doc.ImpPosX("Fecha Nac", 175, doc.tw_ren);
        doc.ImpPosX("Fecha Alta", 200, doc.tw_ren);
        doc.ImpPosX("Telefono", 230, doc.tw_ren);
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
    const alignsIndex = [0, 6];
    const tablaExcel = [
      [
        "Numero",
        "Nombre",
        "Dirección",
        "Colonia",
        "Fecha Nac",
        "Fecha Alta",
        "Telefono",
      ],
    ];
    const { body } = configuracion;
    body.forEach((alumno) => {
      reporte.ImpPosX(alumno.numero.toString(), 19, reporte.tw_ren, 0, "R");
      reporte.ImpPosX(
        alumno.nombre.toString().substring(0, 20),
        25,
        reporte.tw_ren,
        0,
        "L"
      );
      reporte.ImpPosX(
        alumno.direccion.toString().substring(0, 12),
        90,
        reporte.tw_ren,
        0,
        "L"
      );
      reporte.ImpPosX(
        alumno.colonia.toString().substring(0, 20),
        120,
        reporte.tw_ren,
        0,
        "L"
      );
      reporte.ImpPosX(
        format_Fecha_String(alumno.fecha_nac.toString().substring(0, 15)),
        175,
        reporte.tw_ren,
        0,
        "L"
      );
      reporte.ImpPosX(
        format_Fecha_String(alumno.fecha_inscripcion.toString()),
        200,
        reporte.tw_ren,
        0,
        "L"
      );
      reporte.ImpPosX(alumno.telefono1.toString(), 254, reporte.tw_ren, 0, "R");
      tablaExcel.push([
        alumno.numero,
        alumno.nombre.toString(),
        alumno.direccion.toString(),
        alumno.colonia.toString(),
        format_Fecha_String(alumno.fecha_nac.toString().substring(0, 15)),
        format_Fecha_String(alumno.fecha_inscripcion.toString()),
        alumno.telefono1.toString(),
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

  const imprimePDF = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Datos Alumnos",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: formaAlumnosFiltrados,
    };
    Imprimir(configuracion);
  };

  const ImprimeExcel = () => {
    const date = new Date();
    const todayDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    const dateStr = format_Fecha_String(todayDate).replace(/\//g, "");
    const timeStr = formatTime(date).replace(/:/g, "");
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Datos Alumnos",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: formaAlumnosFiltrados,
      columns: [
        { header: "Número", dataKey: "numero" },
        { header: "Nombre", dataKey: "nombre" },
        { header: "Dirección", dataKey: "direccion" },
        { header: "Colonia", dataKey: "colonia" },
        { header: "Fecha Nac", dataKey: "fecha_nac" },
        { header: "Fecha Alta", dataKey: "fecha_inscripcion" },
        { header: "Telefono", dataKey: "telefono1" },
      ],
      nombre: `Alumnos_${dateStr}${timeStr}`,
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
    await truncateTable(token, "alumnos");
    const chunks = chunkArray(dataJson, 20);
    let allErrors = "";
    let chunksProcesados = 0;
    let numeroChunks = chunks.length;

    for (let chunk of chunks) {
      const res = await storeBatchAlumnos(token, chunk);
      chunksProcesados++;
      const progreso = (chunksProcesados / numeroChunks) * 100;
      setPorcentaje(Math.round(progreso));
      if (!res.status) {
        allErrors += res.alert_text;
      }
    }
    setCerrarTO(true);
    setisLoadingButton(false);
    setDataJson([]);
    setPorcentaje(0);
    if (allErrors) {
      showSwalConfirm("Error", allErrors, "error", "my_modal_4");
    } else {
      showSwal(
        "Éxito",
        "Todos los alumnos se insertaron correctamente.",
        "success"
      );
      showModalProcesa(false);
    }
    setTimeout(() => {
      setReloadPage(!reload_page);
    }, 3500);
    await fetchAlumnoStatus(true, inactiveActive, busqueda);
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
          nombre: validateString(
            MAX_LENGTHS,
            "nombre",
            (typeof item.Nombre === "string" ? item.Nombre.trim() : "N/A") ||
              "N/A"
          ),
          a_paterno: validateString(
            MAX_LENGTHS,
            "a_paterno",
            (typeof item.A_Paterno === "string"
              ? item.A_Paterno.trim()
              : "N/A") || "N/A"
          ),
          a_materno: validateString(
            MAX_LENGTHS,
            "a_materno",
            (typeof item.A_Materno === "string"
              ? item.A_Materno.trim()
              : "N/A") || "N/A"
          ),
          a_nombre: validateString(
            MAX_LENGTHS,
            "a_nombre",
            (typeof item.A_Nombre === "string" ? item.A_Nombre.trim() : "") ||
              ""
          ),
          fecha_nac: validateString(
            MAX_LENGTHS,
            "fecha_nac",
            (typeof item.Fecha_Nac === "string"
              ? item.Fecha_Nac.trim()
              : "N/A") || "N/A"
          ),
          fecha_inscripcion: validateString(
            MAX_LENGTHS,
            "fecha_inscripcion",
            (typeof item.Fecha_Inscripcion === "string"
              ? item.Fecha_Inscripcion.trim()
              : "N/A") || "N/A"
          ),
          fecha_baja: validateString(
            MAX_LENGTHS,
            "fecha_baja",
            (typeof item.Fecha_Baja === "string"
              ? item.Fecha_Baja.trim()
              : "") || ""
          ),
          sexo: validateString(
            MAX_LENGTHS,
            "sexo",
            (typeof item.Sexo === "string" ? item.Sexo.trim() : "N") || "N"
          ),
          telefono1: validateString(
            MAX_LENGTHS,
            "telefono1",
            (typeof item.Telefono1 === "string"
              ? item.Telefono1.trim()
              : "N/A") || "N/A"
          ),
          telefono2: validateString(
            MAX_LENGTHS,
            "telefono2",
            (typeof item.Telefono2 === "string" ? item.Telefono2.trim() : "") ||
              ""
          ),
          celular: validateString(
            MAX_LENGTHS,
            "celular",
            (typeof item.Celular === "string" ? item.Celular.trim() : "N/A") ||
              "N/A"
          ),
          codigo_barras: validateString(
            MAX_LENGTHS,
            "codigo_barras",
            (typeof item.Codigo_Barras === "string"
              ? item.Codigo_Barras.trim()
              : "") || ""
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
          email: validateString(
            MAX_LENGTHS,
            "email",
            (typeof item.Email === "string" ? item.Email.trim() : "N/A") ||
              "N/A"
          ),
          imagen: validateString(
            MAX_LENGTHS,
            "imagen",
            (typeof item.Imagen === "string" ? item.Imagen.trim() : "") || ""
          ),
          dia_1: validateString(
            MAX_LENGTHS,
            "dia_1",
            (typeof item.Dia_1 === "string" ? item.Dia_1.trim() : "") || ""
          ),
          dia_2: validateString(
            MAX_LENGTHS,
            "dia_2",
            (typeof item.Dia_2 === "string" ? item.Dia_2.trim() : "") || ""
          ),
          dia_3: validateString(
            MAX_LENGTHS,
            "dia_3",
            (typeof item.Dia_3 === "string" ? item.Dia_3.trim() : "") || ""
          ),
          dia_4: validateString(
            MAX_LENGTHS,
            "dia_4",
            (typeof item.Dia_4 === "string" ? item.Dia_4.trim() : "") || ""
          ),
          hora_1: isNaN(parseInt(item.Hora_1)) ? 0 : parseInt(item.Hora_1),
          hora_2: isNaN(parseInt(item.Hora_2)) ? 0 : parseInt(item.Hora_2),
          hora_3: isNaN(parseInt(item.Hora_3)) ? 0 : parseInt(item.Hora_3),
          hora_4: isNaN(parseInt(item.Hora_4)) ? 0 : parseInt(item.Hora_4),
          cancha_1: isNaN(parseInt(item.Cancha_1))
            ? 0
            : parseInt(item.Cancha_1),
          cancha_2: isNaN(parseInt(item.Cancha_2))
            ? 0
            : parseInt(item.Cancha_2),
          cancha_3: isNaN(parseInt(item.Cancha_3))
            ? 0
            : parseInt(item.Cancha_3),
          cancha_4: isNaN(parseInt(item.Cancha_4))
            ? 0
            : parseInt(item.Cancha_4),
          horario_1: isNaN(parseInt(item.Horario_1))
            ? 0
            : parseInt(item.Horario_1),
          horario_2: isNaN(parseInt(item.Horario_2))
            ? 0
            : parseInt(item.Horario_2),
          horario_3: isNaN(parseInt(item.Horario_3))
            ? 0
            : parseInt(item.Horario_3),
          horario_4: isNaN(parseInt(item.Horario_4))
            ? 0
            : parseInt(item.Horario_4),
          horario_5: isNaN(parseInt(item.Horario_5))
            ? 0
            : parseInt(item.Horario_5),
          horario_6: isNaN(parseInt(item.Horario_6))
            ? 0
            : parseInt(item.Horario_6),
          horario_7: isNaN(parseInt(item.Horario_7))
            ? 0
            : parseInt(item.Horario_7),
          horario_8: isNaN(parseInt(item.Horario_8))
            ? 0
            : parseInt(item.Horario_8),
          horario_9: isNaN(parseInt(item.Horario_9))
            ? 0
            : parseInt(item.Horario_9),
          horario_10: isNaN(parseInt(item.Horario_10))
            ? 0
            : parseInt(item.Horario_10),
          horario_11: isNaN(parseInt(item.Horario_11))
            ? 0
            : parseInt(item.Horario_11),
          horario_12: isNaN(parseInt(item.Horario_12))
            ? 0
            : parseInt(item.Horario_12),
          horario_13: isNaN(parseInt(item.Horario_13))
            ? 0
            : parseInt(item.Horario_13),
          horario_14: isNaN(parseInt(item.Horario_14))
            ? 0
            : parseInt(item.Horario_14),
          horario_15: isNaN(parseInt(item.Horario_15))
            ? 0
            : parseInt(item.Horario_15),
          horario_16: isNaN(parseInt(item.Horario_16))
            ? 0
            : parseInt(item.Horario_16),
          horario_17: isNaN(parseInt(item.Horario_17))
            ? 0
            : parseInt(item.Horario_17),
          horario_18: isNaN(parseInt(item.Horario_18))
            ? 0
            : parseInt(item.Horario_18),
          horario_19: isNaN(parseInt(item.Horario_19))
            ? 0
            : parseInt(item.Horario_19),
          horario_20: isNaN(parseInt(item.Horario_20))
            ? 0
            : parseInt(item.Horario_20),
          cond_1: isNaN(parseInt(item.Cond_1)) ? 0 : parseInt(item.Cond_1),
          cond_2: isNaN(parseInt(item.Cond_2)) ? 0 : parseInt(item.Cond_2),
          cond_3: isNaN(parseInt(item.Cond_3)) ? 0 : parseInt(item.Cond_3),
          nom_pediatra: validateString(
            MAX_LENGTHS,
            "nom_pediatra",
            (typeof item.Nom_Pediatra === "string"
              ? item.Nom_Pediatra.trim()
              : "") || ""
          ),
          tel_p_1: validateString(
            MAX_LENGTHS,
            "tel_p_1",
            (typeof item.Tel_P_1 === "string" ? item.Tel_P_1.trim() : "") || ""
          ),
          tel_p_2: validateString(
            MAX_LENGTHS,
            "tel_p_2",
            (typeof item.Tel_P_2 === "string" ? item.Tel_P_2.trim() : "") || ""
          ),
          cel_p_1: validateString(
            MAX_LENGTHS,
            "cel_p_1",
            (typeof item.Cel_P_1 === "string" ? item.Cel_P_1.trim() : "") || ""
          ),
          tipo_sangre: validateString(
            MAX_LENGTHS,
            "tipo_sangre",
            (typeof item.Tipo_Sangre === "string"
              ? item.Tipo_Sangre.trim()
              : "") || ""
          ),
          alergia: validateString(
            MAX_LENGTHS,
            "alergia",
            (typeof item.Alergia === "string" ? item.Alergia.trim() : "") || ""
          ),
          aseguradora: validateString(
            MAX_LENGTHS,
            "aseguradora",
            (typeof item.Aseguradora === "string"
              ? item.Aseguradora.trim()
              : "") || ""
          ),
          poliza: validateString(
            MAX_LENGTHS,
            "poliza",
            (typeof item.Poliza === "string" ? item.Poliza.trim() : "") || ""
          ),
          tel_ase_1: validateString(
            MAX_LENGTHS,
            "tel_ase_1",
            (typeof item.Tel_Ase_1 === "string" ? item.Tel_Ase_1.trim() : "") ||
              ""
          ),
          tel_ase_2: validateString(
            MAX_LENGTHS,
            "tel_ase_2",
            (typeof item.Tel_Ase_2 === "string" ? item.Tel_Ase_2.trim() : "") ||
              ""
          ),
          razon_social: validateString(
            MAX_LENGTHS,
            "razon_social",
            (typeof item.Razon_Social === "string"
              ? item.Razon_Social.trim()
              : "") || ""
          ),
          raz_direccion: validateString(
            MAX_LENGTHS,
            "raz_direccion",
            (typeof item.Raz_Direccion === "string"
              ? item.Raz_Direccion.trim()
              : "") || ""
          ),
          raz_cp: validateString(
            MAX_LENGTHS,
            "raz_cp",
            (typeof item.Raz_CP === "string" ? item.Raz_CP.trim() : "") || ""
          ),
          raz_colonia: validateString(
            MAX_LENGTHS,
            "raz_colonia",
            (typeof item.Raz_Colonia === "string"
              ? item.Raz_Colonia.trim()
              : "") || ""
          ),
          raz_ciudad: validateString(
            MAX_LENGTHS,
            "raz_ciudad",
            (typeof item.Raz_Ciudad === "string"
              ? item.Raz_Ciudad.trim()
              : "") || ""
          ),
          raz_estado: validateString(
            MAX_LENGTHS,
            "raz_estado",
            (typeof item.Raz_Estado === "string"
              ? item.Raz_Estado.trim()
              : "") || ""
          ),
          nom_padre: validateString(
            MAX_LENGTHS,
            "nom_padre",
            (typeof item.Nom_Padre === "string" ? item.Nom_Padre.trim() : "") ||
              ""
          ),
          tel_pad_1: validateString(
            MAX_LENGTHS,
            "tel_pad_1",
            (typeof item.Tel_Pad_1 === "string" ? item.Tel_Pad_1.trim() : "") ||
              ""
          ),
          tel_pad_2: validateString(
            MAX_LENGTHS,
            "tel_pad_2",
            (typeof item.Tel_Pad_2 === "string" ? item.Tel_Pad_2.trim() : "") ||
              ""
          ),
          cel_pad: validateString(
            MAX_LENGTHS,
            "cel_pad",
            (typeof item.Cel_Pad === "string" ? item.Cel_Pad.trim() : "") || ""
          ),
          nom_madre: validateString(
            MAX_LENGTHS,
            "nom_madre",
            (typeof item.Nom_Madre === "string" ? item.Nom_Madre.trim() : "") ||
              ""
          ),
          tel_mad_1: validateString(
            MAX_LENGTHS,
            "tel_mad_1",
            (typeof item.Tel_Mad_1 === "string" ? item.Tel_Mad_1.trim() : "") ||
              ""
          ),
          tel_mad_2: validateString(
            MAX_LENGTHS,
            "tel_mad_2",
            (typeof item.Tel_Mad_2 === "string" ? item.Tel_Mad_2.trim() : "") ||
              ""
          ),
          cel_mad: validateString(
            MAX_LENGTHS,
            "cel_mad",
            (typeof item.Cel_Mad === "string" ? item.Cel_Mad.trim() : "") || ""
          ),
          nom_avi: validateString(
            MAX_LENGTHS,
            "nom_avi",
            (typeof item.Nom_Avi === "string" ? item.Nom_Avi.trim() : "") || ""
          ),
          tel_avi_1: validateString(
            MAX_LENGTHS,
            "tel_avi_1",
            (typeof item.Tel_Avi_1 === "string" ? item.Tel_Avi_1.trim() : "") ||
              ""
          ),
          tel_avi_2: validateString(
            MAX_LENGTHS,
            "tel_avi_2",
            (typeof item.Tel_Avi_2 === "string" ? item.Tel_Avi_2.trim() : "") ||
              ""
          ),
          cel_avi: validateString(
            MAX_LENGTHS,
            "cel_avi",
            (typeof item.Cel_Avi === "string" ? item.Cel_Avi.trim() : "") || ""
          ),
          ciclo_escolar: validateString(
            MAX_LENGTHS,
            "ciclo_escolar",
            (typeof item.Ciclo_Escolar === "string"
              ? item.Ciclo_Escolar.trim()
              : "") || ""
          ),
          descuento: parseFloat(item.Descuento || 0),
          rfc_factura: validateString(
            MAX_LENGTHS,
            "rfc_factura",
            (typeof item.RFC_Factura === "string"
              ? item.RFC_Factura.trim()
              : "N/A") || "N/A"
          ),
          estatus: validateString(
            MAX_LENGTHS,
            "estatus",
            (typeof item.Estatus === "string" ? item.Estatus.trim() : "N/A") ||
              "N/A"
          ),
          escuela: validateString(
            MAX_LENGTHS,
            "escuela",
            (typeof item.Escuela === "string" ? item.Escuela.trim() : "") || ""
          ),
          grupo: validateString(
            MAX_LENGTHS,
            "grupo",
            (typeof item.Grupo === "string" ? item.Grupo.trim() : "N/A") ||
              "N/A"
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
    imprimePDF,
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
