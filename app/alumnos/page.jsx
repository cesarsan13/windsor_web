"use client";
import React, { useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { showSwal, confirmSwal } from "../utils/alerts";
import ModalAlumnos from "@/app/alumnos/components/modalAlumnos";
const TablaAlumnos = React.lazy(() =>
  import("@/app/alumnos/components/tablaAlumnos")
);
import Busqueda from "@/app/alumnos/components/Busqueda";
import Acciones from "@/app/alumnos/components/Acciones";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import { useForm } from "react-hook-form";
import VistaPrevia from "@/app/components/VistaPrevia";
import {
  getAlumnos,
  guardarAlumnos,
  getLastAlumnos,
  Imprimir,
  ImprimirExcel,
  getTab,
  storeBatchAlumnos,
} from "@/app/utils/api/alumnos/alumnos";
import { getHorarios } from "@/app/utils/api/horarios/horarios";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import "@react-pdf-viewer/core/lib/styles/index.css";
import {
  formatFecha,
  format_Fecha_String,
  debounce,
  formatTime,
  permissionsComponents,
  chunkArray,
  validateString,
} from "@/app/utils/globalfn";
import ModalProcesarDatos from "../components/modalProcesarDatos";
function Alumnos() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [alumnos, setAlumnos] = useState([]);
  const [alumno, setAlumno] = useState({});
  const [alumnosFiltrados, setAlumnosFiltrados] = useState(null);
  const [horarios, setHorarios] = useState(null);
  const [bajas, setBajas] = useState(false);
  const [openModal, setModal] = useState(false);
  const [accion, setAccion] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [isLoadingButton, setisLoadingButton] = useState(false);
  const [currentID, setCurrentId] = useState("");
  const [filtro, setFiltro] = useState("");
  const [TB_Busqueda, setTB_Busqueda] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);
  const [condicion, setcondicion] = useState(false);
  const [grado, setGrado] = useState({});
  const [grado2, setGrado2] = useState({});
  const [cond1, setcond1] = useState({});
  const [cond2, setcond2] = useState({});
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const [fecha_hoy, setFechaHoy] = useState("");
  const [animateLoading, setAnimateLoading] = useState(false);
  const [files, setFile] = useState(null);
  const [activeTab, setActiveTab] = useState(1);
  const [permissions, setPermissions] = useState({});
  const [dataJson, setDataJson] = useState([]);
  const [reload_page, setReloadPage] = useState(false);
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

  const alumnosRef = useRef(alumnos);
  const [busqueda, setBusqueda] = useState({
    tb_id: "",
    tb_desc: "",
    tb_grado: "",
  });
  useEffect(() => {
    alumnosRef.current = alumnos; // Actualiza el ref cuando alumnos cambia
  }, [alumnos]);
  //  Memorizar la funcion
  const Buscar = useCallback(() => {
    const { tb_id, tb_desc, tb_grado } = busqueda;
    if (tb_id === "" && tb_desc === "" && tb_grado === "") {
      setAlumnosFiltrados(alumnosRef.current);
      return;
    }
    const infoFiltrada = alumnosRef.current.filter((alumno) => {
      const coincideId = tb_id
        ? alumno["numero"].toString().includes(tb_id)
        : true;
      const coincideDescripcion = tb_desc
        ? alumno["nombre"]
          .toString()
          .toLowerCase()
          .includes(tb_desc.toLowerCase())
        : true;
      const coincideGrado = tb_grado
        ? (alumno["horario_1_nombre"] || "")
          .toString()
          .toLowerCase()
          .includes(tb_grado.toLowerCase())
        : true;
      return coincideId && coincideDescripcion && coincideGrado;
    });
    setAlumnosFiltrados(infoFiltrada);
  }, [busqueda]);

  const debouncedBuscar = useMemo(() => debounce(Buscar, 500), [Buscar]);

  useEffect(() => {
    debouncedBuscar();
    return () => {
      clearTimeout(debouncedBuscar);
    };
  }, [busqueda, debouncedBuscar]);

  useEffect(() => {
    const fetchData = async () => {
      setisLoading(true);
      let { token, permissions } = session.user;
      const es_admin = session.user.es_admin;
      const menuSeleccionado = Number(localStorage.getItem("puntoMenu"));

      const data = await getAlumnos(token, bajas);
      const horarios = await getHorarios(token, bajas);
      setHorarios(horarios);
      setAlumnos(data);
      setAlumnosFiltrados(data);
      setisLoading(false);
      let fecha_hoy = new Date();
      const fechaFormateada = fecha_hoy.toISOString().split("T")[0];
      setFechaHoy(fechaFormateada);
      const permisos = permissionsComponents(
        es_admin,
        permissions,
        session.user.id,
        menuSeleccionado
      );
      setPermissions(permisos);
    };
    if (status === "loading" || !session) {
      return;
    }
    fetchData();
  }, [session, status, bajas, reload_page]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      numero: alumno.numero,
      nombre: alumno.nombre,
      a_paterno: alumno.a_paterno,
      a_materno: alumno.a_materno,
      a_nombre: alumno.a_nombre,
      fecha_nac: formatFecha(alumno.fecha_nac),
      fecha_inscripcion: formatFecha(alumno.fecha_inscripcion),
      fecha_baja: formatFecha(alumno.fecha_baja),
      sexo: alumno.sexo,
      telefono1: alumno.telefono1,
      telefono2: alumno.telefono2,
      celular: alumno.celular,
      codigo_barras: alumno.codigo_barras,
      direccion: alumno.direccion,
      colonia: alumno.colonia,
      ciudad: alumno.ciudad,
      estado: alumno.estado,
      cp: alumno.cp,
      email: alumno.email,
      imagen: alumno.ruta_foto,
      dia_1: alumno.dia_1,
      dia_2: alumno.dia_2,
      dia_3: alumno.dia_3,
      dia_4: alumno.dia_4,
      hora_1: alumno.hora_1,
      hora_2: alumno.hora_2,
      hora_3: alumno.hora_3,
      hora_4: alumno.hora_4,
      cancha_1: alumno.cancha_1,
      cancha_2: alumno.cancha_2,
      cancha_3: alumno.cancha_3,
      cancha_4: alumno.cancha_4,
      horario_1: alumno.horario_1,
      horario_2: alumno.horario_2,
      horario_3: alumno.horario_3,
      horario_4: alumno.horario_4,
      horario_5: alumno.horario_5,
      horario_6: alumno.horario_6,
      horario_7: alumno.horario_7,
      horario_8: alumno.horario_8,
      horario_9: alumno.horario_9,
      horario_10: alumno.horario_10,
      horario_11: alumno.horario_11,
      horario_12: alumno.horario_12,
      horario_13: alumno.horario_13,
      horario_14: alumno.horario_14,
      horario_15: alumno.horario_15,
      horario_16: alumno.horario_16,
      horario_17: alumno.horario_17,
      horario_18: alumno.horario_18,
      horario_19: alumno.horario_19,
      horario_20: alumno.horario_20,
      cond_1: alumno.cond_1,
      cond_2: alumno.cond_2,
      cond_3: alumno.cond_3,
      nom_pediatra: alumno.nom_pediatra,
      tel_p_1: alumno.tel_p_1,
      tel_p_2: alumno.tel_p_2,
      cel_p_1: alumno.cel_p_1,
      tipo_sangre: alumno.tipo_sangre,
      alergia: alumno.alergia,
      aseguradora: alumno.aseguradora,
      poliza: alumno.poliza,
      tel_ase_1: alumno.tel_ase_1,
      tel_ase_2: alumno.tel_ase_2,
      razon_social: alumno.razon_social,
      raz_direccion: alumno.raz_direccion,
      raz_colonia: alumno.raz_colonia,
      raz_ciudad: alumno.raz_ciudad,
      raz_estado: alumno.raz_estado,
      raz_cp: alumno.raz_cp,
      nom_padre: alumno.nom_padre,
      tel_pad_1: alumno.tel_pad_1,
      tel_pad_2: alumno.tel_pad_2,
      cel_pad_1: alumno.cel_pad,
      nom_madre: alumno.nom_madre,
      tel_mad_1: alumno.tel_mad_1,
      tel_mad_2: alumno.tel_mad_2,
      cel_mad_1: alumno.cel_mad,
      nom_avi: alumno.nom_avi,
      tel_avi_1: alumno.tel_avi_1,
      tel_avi_2: alumno.tel_avi_2,
      cel_avi: alumno.cel_avi,
      ciclo_escolar: alumno.ciclo_escolar,
      descuento: alumno.descuento,
      rfc_factura: alumno.rfc_factura,
      estatus: alumno.estatus,
      escuela: alumno.escuela,
      grupo: alumno.grupo,
      referencia: alumno.referencia,
      horario_1_nombre: alumno.horario_1_nombre,
    },
  });
  useEffect(() => {
    reset({
      numero: alumno.numero,
      nombre: alumno.nombre,
      a_paterno: alumno.a_paterno,
      a_materno: alumno.a_materno,
      a_nombre: alumno.a_nombre,
      fecha_nac: formatFecha(alumno.fecha_nac),
      fecha_inscripcion: formatFecha(alumno.fecha_inscripcion),
      fecha_baja: formatFecha(alumno.fecha_baja),
      sexo: alumno.sexo,
      telefono1: alumno.telefono1,
      telefono2: alumno.telefono2,
      celular: alumno.celular,
      codigo_barras: alumno.codigo_barras,
      direccion: alumno.direccion,
      colonia: alumno.colonia,
      ciudad: alumno.ciudad,
      estado: alumno.estado,
      cp: alumno.cp,
      email: alumno.email,
      imagen: alumno.ruta_foto,
      dia_1: alumno.dia_1,
      dia_2: alumno.dia_2,
      dia_3: alumno.dia_3,
      dia_4: alumno.dia_4,
      hora_1: alumno.hora_1,
      hora_2: alumno.hora_2,
      hora_3: alumno.hora_3,
      hora_4: alumno.hora_4,
      cancha_1: alumno.cancha_1,
      cancha_2: alumno.cancha_2,
      cancha_3: alumno.cancha_3,
      cancha_4: alumno.cancha_4,
      horario_1: alumno.horario_1,
      horario_2: alumno.horario_2,
      horario_3: alumno.horario_3,
      horario_4: alumno.horario_4,
      horario_5: alumno.horario_5,
      horario_6: alumno.horario_6,
      horario_7: alumno.horario_7,
      horario_8: alumno.horario_8,
      horario_9: alumno.horario_9,
      horario_10: alumno.horario_10,
      horario_11: alumno.horario_11,
      horario_12: alumno.horario_12,
      horario_13: alumno.horario_13,
      horario_14: alumno.horario_14,
      horario_15: alumno.horario_15,
      horario_16: alumno.horario_16,
      horario_17: alumno.horario_17,
      horario_18: alumno.horario_18,
      horario_19: alumno.horario_19,
      horario_20: alumno.horario_20,
      cond_1: alumno.cond_1,
      cond_2: alumno.cond_2,
      cond_3: alumno.cond_3,
      nom_pediatra: alumno.nom_pediatra,
      tel_p_1: alumno.tel_p_1,
      tel_p_2: alumno.tel_p_2,
      cel_p_1: alumno.cel_p_1,
      tipo_sangre: alumno.tipo_sangre,
      alergia: alumno.alergia,
      aseguradora: alumno.aseguradora,
      poliza: alumno.poliza,
      tel_ase_1: alumno.tel_ase_1,
      tel_ase_2: alumno.tel_ase_2,
      razon_social: alumno.razon_social,
      raz_direccion: alumno.raz_direccion,
      raz_colonia: alumno.raz_colonia,
      raz_ciudad: alumno.raz_ciudad,
      raz_estado: alumno.raz_estado,
      raz_cp: alumno.raz_cp,
      nom_padre: alumno.nom_padre,
      tel_pad_1: alumno.tel_pad_1,
      tel_pad_2: alumno.tel_pad_2,
      cel_pad_1: alumno.cel_pad,
      nom_madre: alumno.nom_madre,
      tel_mad_1: alumno.tel_mad_1,
      tel_mad_2: alumno.tel_mad_2,
      cel_mad_1: alumno.cel_mad,
      nom_avi: alumno.nom_avi,
      tel_avi_1: alumno.tel_avi_1,
      tel_avi_2: alumno.tel_avi_2,
      cel_avi: alumno.cel_avi,
      ciclo_escolar: alumno.ciclo_escolar,
      descuento: alumno.descuento,
      rfc_factura: alumno.rfc_factura,
      estatus: alumno.estatus,
      escuela: alumno.escuela,
      grupo: alumno.grupo,
      referencia: alumno.referencia,
      horario_1_nombre: alumno.horario_1_nombre,
    });
  }, [alumno, reset]);

  const formatNumber = (num) => {
    if (!num) return "";
    const numStr = typeof num === "string" ? num : num.toString();
    const floatNum = parseFloat(
      numStr.replace(/,/g, "").replace(/[^\d.-]/g, "")
    );
    if (isNaN(floatNum)) return "";
    return floatNum.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const Alta = async (event) => {
    setCurrentId("");
    setCapturedImage(null);
    const { token } = session.user;
    reset({
      numero: "",
      nombre: "",
      a_paterno: "",
      a_materno: "",
      a_nombre: "",
      fecha_nac: "",
      fecha_inscripcion: formatFecha(fecha_hoy),
      fecha_baja: "",
      sexo: "",
      telefono1: "",
      telefono2: "",
      celular: "",
      codigo_barras: "",
      direccion: "",
      colonia: "",
      ciudad: "",
      estado: "",
      cp: "",
      email: "",
      imagen: "",
      dia_1: "",
      dia_2: "",
      dia_3: "",
      dia_4: "",
      hora_1: 0,
      hora_2: 0,
      hora_3: 0,
      hora_4: 0,
      cancha_1: 0,
      cancha_2: 0,
      cancha_3: 0,
      cancha_4: 0,
      horario_1: 0,
      horario_2: 0,
      horario_3: 0,
      horario_4: 0,
      horario_5: 0,
      horario_6: 0,
      horario_7: 0,
      horario_8: 0,
      horario_9: 0,
      horario_10: 0,
      horario_11: 0,
      horario_12: 0,
      horario_13: 0,
      horario_14: 0,
      horario_15: 0,
      horario_16: 0,
      horario_17: 0,
      horario_18: 0,
      horario_19: 0,
      horario_20: 0,
      cond_1: "0",
      cond_2: "0",
      cond_3: "0",
      nom_pediatra: "",
      tel_p_1: "",
      tel_p_2: "",
      cel_p_1: "",
      tipo_sangre: "",
      alergia: "",
      aseguradora: "",
      poliza: "",
      tel_ase_1: "",
      tel_ase_2: "",
      razon_social: "",
      raz_direccion: "",
      raz_colonia: "",
      raz_ciudad: "",
      raz_estado: "",
      raz_cp: "",
      nom_padre: "",
      tel_pad_1: "",
      tel_pad_2: "",
      cel_pad_1: "",
      nom_madre: "",
      tel_mad_1: "",
      tel_mad_2: "",
      cel_mad_1: "",
      nom_avi: "",
      tel_avi_1: "",
      tel_avi_2: "",
      cel_avi: "",
      ciclo_escolar: "",
      descuento: 0,
      rfc_factura: "",
      estatus: "",
      escuela: "",
      grupo: "",
      referencia: 0,
      horario_1_nombre: "",
      baja: "",
    });
    setcond1({});
    setcond2({});
    setGrado({});
    // // let siguienteId = await getLastAlumnos(token);
    // // siguienteId = Number(siguienteId + 1);
    // // setCurrentId(siguienteId);
    setAlumno({ numero: "", fecha_inscripcion: fecha_hoy });
    setModal(!openModal);
    setAccion("Alta");
    showModal(true);

    document.getElementById("a_paterno").focus();
  };
  const onSubmitModal = handleSubmit(async (data) => {
    event.preventDefault();
    setisLoadingButton(true);
    accion === "Alta" ? (data.numero = "") : (data.numero = currentID);
    let res = null;
    if (accion === "Eliminar") {
      showModal(false);
      const confirmed = await confirmSwal(
        "¿Desea Continuar?",
        "Se eliminara el alumno seleccionado",
        "warning",
        "Aceptar",
        "Cancelar"
      );
      if (!confirmed) {
        showModal(true);
        setisLoadingButton(false);
        return;
      }
    }
    const nombreCompleto = `${data.a_paterno || ""} ${data.a_materno || ""} ${data.a_nombre || ""
      }`.trim();
    data.nombre = nombreCompleto;
    const formData = new FormData();
    formData.append("numero", data.numero || "");
    formData.append("nombre", data.nombre || "");
    formData.append("a_paterno", data.a_paterno || "");
    formData.append("a_materno", data.a_materno || "");
    formData.append("a_nombre", data.a_nombre || "");
    formData.append("fecha_nac", format_Fecha_String(data.fecha_nac) || "");
    formData.append(
      "fecha_inscripcion",
      format_Fecha_String(data.fecha_inscripcion) || ""
    );
    formData.append("fecha_baja", format_Fecha_String(data.fecha_baja) || "");
    formData.append("sexo", data.sexo || "");
    formData.append("telefono1", data.telefono1 || "");
    formData.append("telefono2", data.telefono2 || "");
    formData.append("celular", data.celular || "");
    formData.append("codigo_barras", data.codigo_barras || "");
    formData.append("direccion", data.direccion || "");
    formData.append("colonia", data.colonia || "");
    formData.append("ciudad", data.ciudad || "");
    formData.append("estado", data.estado || "");
    formData.append("cp", data.cp || "");
    formData.append("email", data.email || "");
    formData.append("dia_1", data.dia_1 || "");
    formData.append("dia_2", data.dia_2 || "");
    formData.append("dia_3", data.dia_3 || "");
    formData.append("dia_4", data.dia_4 || "");
    formData.append("hora_1", data.hora_1 || 0);
    formData.append("hora_2", data.hora_2 || 0);
    formData.append("hora_3", data.hora_3 || 0);
    formData.append("hora_4", data.hora_4 || 0);
    formData.append("cancha_1", data.cancha_1 || "");
    formData.append("cancha_2", data.cancha_2 || "");
    formData.append("cancha_3", data.cancha_3 || "");
    formData.append("cancha_4", data.cancha_4 || "");
    if (grado.numuero !== null && grado.numero !== undefined) {
      formData.append("horario_1", grado.numero || "");
    } else {
      formData.append("horario_1", alumno.grupo || "");
    }
    // formData.append("horario_1", grado.numero || alumno.grupo || "" );
    formData.append("horario_2", grado2.numero || "");
    formData.append("horario_3", data.horario_3 || "");
    formData.append("horario_4", data.horario_4 || "");
    formData.append("horario_5", data.horario_5 || "");
    formData.append("horario_6", data.horario_6 || "");
    formData.append("horario_7", data.horario_7 || "");
    formData.append("horario_8", data.horario_8 || "");
    formData.append("horario_9", data.horario_9 || "");
    formData.append("horario_10", data.horario_10 || "");
    formData.append("horario_11", data.horario_11 || "");
    formData.append("horario_12", data.horario_12 || "");
    formData.append("horario_13", data.horario_13 || "");
    formData.append("horario_14", data.horario_14 || "");
    formData.append("horario_15", data.horario_15 || "");
    formData.append("horario_16", data.horario_16 || "");
    formData.append("horario_17", data.horario_17 || "");
    formData.append("horario_18", data.horario_18 || "");
    formData.append("horario_19", data.horario_19 || "");
    formData.append("horario_20", data.horario_20 || "");
    formData.append("cond_1", cond1.id || "");
    formData.append("cond_2", cond2.id || "");
    formData.append("cond_3", data.cond_3 || "");
    formData.append("nom_pediatra", data.nom_pediatra || "");
    formData.append("tel_p_1", data.tel_p_1 || "");
    formData.append("tel_p_2", data.tel_p_2 || "");
    formData.append("cel_p_1", data.cel_p_1 || "");
    formData.append("tipo_sangre", data.tipo_sangre || "");
    formData.append("alergia", data.alergia || "");
    formData.append("aseguradora", data.aseguradora || "");
    formData.append("poliza", data.poliza || "");
    formData.append("tel_ase_1", data.tel_ase_1 || "");
    formData.append("tel_ase_2", data.tel_ase_2 || "");
    formData.append("razon_social", data.razon_social || "");
    formData.append("raz_direccion", data.raz_direccion || "");
    formData.append("raz_colonia", data.raz_colonia || "");
    formData.append("raz_ciudad", data.raz_ciudad || "");
    formData.append("raz_estado", data.raz_estado || "");
    formData.append("raz_cp", data.raz_cp || 0);
    formData.append("nom_padre", data.nom_padre || "");
    formData.append("tel_pad_1", data.tel_pad_1 || "");
    formData.append("tel_pad_2", data.tel_pad_2 || "");
    formData.append("cel_pad", data.cel_pad_1 || "");
    formData.append("nom_madre", data.nom_madre || "");
    formData.append("tel_mad_1", data.tel_mad_1 || "");
    formData.append("tel_mad_2", data.tel_mad_2 || "");
    formData.append("cel_mad", data.cel_mad_1 || "");
    formData.append("nom_avi", data.nom_avi || "");
    formData.append("tel_avi_1", data.tel_avi_1 || "");
    formData.append("tel_avi_2", data.tel_avi_2 || "");
    formData.append("cel_avi", data.cel_avi || "");
    formData.append("ciclo_escolar", data.ciclo_escolar || "");
    formData.append("descuento", data.descuento || "");
    formData.append("rfc_factura", data.rfc_factura || "");
    formData.append("estatus", data.estatus || "");
    formData.append("escuela", data.escuela || "");
    if (grado.numuero !== null && grado.numero !== undefined) {
      formData.append("grupo", grado.numero || "");
    } else {
      formData.append("grupo", alumno.grupo || "");
    }

    // formData.append("grupo", grado.numero || alumno.grupo || "");
    if (condicion === true) {
      const blob = dataURLtoBlob(capturedImage);
      formData.append(
        "ruta_foto",
        blob,
        `${data.nombre}_${data.a_paterno}_${data.a_materno}.jpg`
      );
    }
    let horario_1_nombre = horarios.find((item) => {
      if (grado.numuero !== null && grado.numero !== undefined) {
        return item.numero === grado.numero;
      } else {
        return item.numero === alumno.grupo;
      }
    });
    if (typeof horario_1_nombre === "undefined") {
      horario_1_nombre = {
        numero: 0,
        horario: "",
      };
    }
    data.horario_1_nombre = grado.horario || horario_1_nombre.horario;
    res = await guardarAlumnos(
      session.user.token,
      formData,
      accion,
      data.numero
    );
    if (res.status) {
      if (accion === "Alta") {
        data.numero = res.data;
        const nuevosAlumnos = { ...data };
        setAlumnos([...alumnos, nuevosAlumnos]);
        if (!bajas) {
          setAlumnosFiltrados([...alumnosFiltrados, nuevosAlumnos]);
        }
      }
      if (accion === "Eliminar" || accion === "Editar") {
        const index = alumnos.findIndex((p) => p.numero === data.numero);
        if (index !== -1) {
          if (accion === "Eliminar") {
            const aFiltrados = alumnos.filter((p) => p.numero !== data.numero);
            setAlumnos(aFiltrados);
            setAlumnosFiltrados(aFiltrados);
          } else {
            if (bajas) {
              const aFiltrados = alumnos.filter(
                (p) => p.numero !== data.numero
              );
              setAlumnos(aFiltrados);
              setAlumnosFiltrados(aFiltrados);
            } else {
              const aLactualizadas = alumnos.map((p) =>
                p.numero === currentID ? { ...p, ...res.data } : p
              );
              aLactualizadas.find((item) => {
                if (item.numero === res.data.numero) {
                  item.horario_1_nombre = data.horario_1_nombre;
                }
              });
              setAlumnos(aLactualizadas);
              setAlumnosFiltrados(aLactualizadas);
            }
          }
        }
      }
      showSwal(res.alert_title, res.alert_text, res.alert_icon);

      showModal(false);
      setActiveTab(1);
      setGrado({});
      setcond1({});
      setcond2({});

      // Buscar();
    } else {
      // console.log(res);
      if (Object.keys(res.errors).length > 0) {
        const primerError = Object.keys(res.errors)[0];
        document.getElementById(primerError).focus();
        setActiveTab(getTab(primerError));
      }
      showSwal("Error", res.alert_text, "error", "my_modal_alumnos");
    }
    setisLoadingButton(false);
  });
  const dataURLtoBlob = (dataURL) => {
    const parts = dataURL.split(";base64,");
    const contentType = parts[0].split(":")[1];
    const b64Data = parts[1];
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  };
  const limpiarBusqueda = (evt) => {
    evt.preventDefault();
    setBusqueda({ tb_id: "", tb_desc: "", tb_grado: "" });
  };
  const showModal = (show) => {
    show
      ? document.getElementById("my_modal_alumnos").showModal()
      : document.getElementById("my_modal_alumnos").close();
  };
  const showModalVista = (show) => {
    show
      ? document.getElementById("modalVPAlumno").showModal()
      : document.getElementById("modalVPAlumno").close();
  };
  const home = () => {
    router.push("/");
  };
  const handleBusquedaChange = (event) => {
    setBusqueda((estadoPrevio) => ({
      ...estadoPrevio,
      [event.target.id]: event.target.value,
    }));
  };

  const imprimePDF = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Datos Alumnos",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: alumnosFiltrados,
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
      body: alumnosFiltrados,
      columns: [
        { header: "Número", dataKey: "numero" },
        { header: "Nombre", dataKey: "nombre" },
        { header: "Dirección", dataKey: "direccion" },
        { header: "Colonia", dataKey: "colonia" },
        { header: "Fecha Nac", dataKey: "fecha_nac" },
        { header: "Fecha Alta", dataKey: "fecha_inscripcion" },
        { header: "Telefono", dataKey: "telefono_1" },
      ],
      nombre: `Alumnos_${dateStr}${timeStr}`,
    };
    ImprimirExcel(configuracion);
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
    alumnosFiltrados.forEach((alumno) => {
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
      Enca1(reporte);
      if (reporte.tw_ren >= reporte.tw_endRenH) {
        reporte.pageBreakH();
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

  const procesarDatos = () => {
    showModalProcesa(true);
  };

  const showModalProcesa = (show) => {
    show
      ? document.getElementById("my_modal_4").showModal()
      : document.getElementById("my_modal_4").close();
  };

  const buttonProcess = async () => {
    event.preventDefault();
    setisLoadingButton(true);
    const { token } = session.user;
    const chunks = chunkArray(dataJson, 20);
    for (let chunk of chunks) {
      await storeBatchAlumnos(token, chunk)
    }
    setDataJson([]);
    showModalProcesa(false);
    showSwal("Éxito", "Los datos se han subido correctamente.", "success");
    setReloadPage(!reload_page);
    setisLoadingButton(false);
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
        const convertedData = jsonData.map(item => ({
          numero: parseInt(item.Numero || 0),
          nombre: validateString(MAX_LENGTHS, "nombre", item.Nombre || "N/A"),
          a_paterno: validateString(MAX_LENGTHS, "a_paterno", item.A_Paterno || "N/A"),
          a_materno: validateString(MAX_LENGTHS, "a_materno", item.A_Materno || "N/A"),
          a_nombre: validateString(MAX_LENGTHS, "a_nombre", item.A_Nombre || ""),
          fecha_nac: validateString(MAX_LENGTHS, "fecha_nac", item.Fecha_Nac || "N/A"),
          fecha_inscripcion: validateString(MAX_LENGTHS, "fecha_inscripcion", item.Fecha_Inscripcion || "N/A"),
          fecha_baja: validateString(MAX_LENGTHS, "fecha_baja", item.Fecha_Baja || ""),
          sexo: validateString(MAX_LENGTHS, "sexo", item.Sexo || "N/A"),
          telefono1: validateString(MAX_LENGTHS, "telefono1", item.Telefono1 || "N/A"),
          telefono2: validateString(MAX_LENGTHS, "telefono2", item.Telefono2 || ""),
          celular: validateString(MAX_LENGTHS, "celular", item.Celular || "N/A"),
          codigo_barras: validateString(MAX_LENGTHS, "codigo_barras", item.Codigo_Barras || ""),
          direccion: validateString(MAX_LENGTHS, "direccion", item.Direccion || "N/A"),
          colonia: validateString(MAX_LENGTHS, "colonia", item.Colonia || "N/A"),
          ciudad: validateString(MAX_LENGTHS, "ciudad", item.Ciudad || "N/A"),
          estado: validateString(MAX_LENGTHS, "estado", item.Estado || "N/A"),
          cp: validateString(MAX_LENGTHS, "cp", item.CP || "N/A"),
          email: validateString(MAX_LENGTHS, "email", item.Email || "N/A"),
          imagen: validateString(MAX_LENGTHS, "imagen", item.Imagen || ""),
          dia_1: validateString(MAX_LENGTHS, "dia_1", item.Dia_1 || ""),
          dia_2: validateString(MAX_LENGTHS, "dia_2", item.Dia_2 || ""),
          dia_3: validateString(MAX_LENGTHS, "dia_3", item.Dia_3 || ""),
          dia_4: validateString(MAX_LENGTHS, "dia_4", item.Dia_4 || ""),
          hora_1: parseInt(item.Hora_1 || 0),
          hora_2: parseInt(item.Hora_2 || 0),
          hora_3: parseInt(item.Hora_3 || 0),
          hora_4: parseInt(item.Hora_4 || 0),
          cancha_1: parseInt(item.Cancha_1 || 0),
          cancha_2: parseInt(item.Cancha_2 || 0),
          cancha_3: parseInt(item.Cancha_3 || 0),
          cancha_4: parseInt(item.Cancha_4 || 0),
          horario_1: parseInt(item.Horario_1 || 0),
          horario_2: parseInt(item.Horario_2 || 0),
          horario_3: parseInt(item.Horario_3 || 0),
          horario_4: parseInt(item.Horario_4 || 0),
          horario_5: parseInt(item.Horario_5 || 0),
          horario_6: parseInt(item.Horario_6 || 0),
          horario_7: parseInt(item.Horario_7 || 0),
          horario_8: parseInt(item.Horario_8 || 0),
          horario_9: parseInt(item.Horario_9 || 0),
          horario_10: parseInt(item.Horario_10 || 0),
          horario_11: parseInt(item.Horario_11 || 0),
          horario_12: parseInt(item.Horario_12 || 0),
          horario_13: parseInt(item.Horario_13 || 0),
          horario_14: parseInt(item.Horario_14 || 0),
          horario_15: parseInt(item.Horario_15 || 0),
          horario_16: parseInt(item.Horario_16 || 0),
          horario_17: parseInt(item.Horario_17 || 0),
          horario_18: parseInt(item.Horario_18 || 0),
          horario_19: parseInt(item.Horario_19 || 0),
          horario_20: parseInt(item.Horario_20 || 0),
          cond_1: parseInt(item.Cond_1 || 0),
          cond_2: parseInt(item.Cond_2 || 0),
          cond_3: parseInt(item.Cond_3 || 0),
          nom_pediatra: validateString(MAX_LENGTHS, "nom_pediatra", item.Nom_Pediatra || ""),
          tel_p_1: validateString(MAX_LENGTHS, "tel_p_1", item.Tel_P_1 || ""),
          tel_p_2: validateString(MAX_LENGTHS, "tel_p_2", item.Tel_P_2 || ""),
          cel_p_1: validateString(MAX_LENGTHS, "cel_p_1", item.Cel_P_1 || ""),
          tipo_sangre: validateString(MAX_LENGTHS, "tipo_sangre", item.Tipo_Sangre || ""),
          alergia: validateString(MAX_LENGTHS, "alergia", item.Alergia || ""),
          aseguradora: validateString(MAX_LENGTHS, "aseguradora", item.Aseguradora || ""),
          poliza: validateString(MAX_LENGTHS, "poliza", item.Poliza || ""),
          tel_ase_1: validateString(MAX_LENGTHS, "tel_ase_1", item.Tel_Ase_1 || ""),
          tel_ase_2: validateString(MAX_LENGTHS, "tel_ase_2", item.Tel_Ase_2 || ""),
          razon_social: validateString(MAX_LENGTHS, "razon_social", item.Razon_Social || ""),
          raz_direccion: validateString(MAX_LENGTHS, "raz_direccion", item.Raz_Direccion || ""),
          raz_cp: validateString(MAX_LENGTHS, "raz_cp", item.Raz_CP || ""),
          raz_colonia: validateString(MAX_LENGTHS, "raz_colonia", item.Raz_Colonia || ""),
          raz_ciudad: validateString(MAX_LENGTHS, "raz_ciudad", item.Raz_Ciudad || ""),
          raz_estado: validateString(MAX_LENGTHS, "raz_estado", item.Raz_Estado || ""),
          nom_padre: validateString(MAX_LENGTHS, "nom_padre", item.Nom_Padre || ""),
          tel_pad_1: validateString(MAX_LENGTHS, "tel_pad_1", item.Tel_Pad_1 || ""),
          tel_pad_2: validateString(MAX_LENGTHS, "tel_pad_2", item.Tel_Pad_2 || ""),
          cel_pad: validateString(MAX_LENGTHS, "cel_pad", item.Cel_Pad || ""),
          nom_madre: validateString(MAX_LENGTHS, "nom_madre", item.Nom_Madre || ""),
          tel_mad_1: validateString(MAX_LENGTHS, "tel_mad_1", item.Tel_Mad_1 || ""),
          tel_mad_2: validateString(MAX_LENGTHS, "tel_mad_2", item.Tel_Mad_2 || ""),
          cel_mad: validateString(MAX_LENGTHS, "cel_mad", item.Cel_Mad || ""),
          nom_avi: validateString(MAX_LENGTHS, "nom_avi", item.Nom_Avi || ""),
          tel_avi_1: validateString(MAX_LENGTHS, "tel_avi_1", item.Tel_Avi_1 || ""),
          tel_avi_2: validateString(MAX_LENGTHS, "tel_avi_2", item.Tel_Avi_2 || ""),
          cel_avi: validateString(MAX_LENGTHS, "cel_avi", item.Cel_Avi || ""),
          ciclo_escolar: validateString(MAX_LENGTHS, "ciclo_escolar", item.Ciclo_Escolar || ""),
          descuento: parseFloat(item.Descuento || 0),
          rfc_factura: validateString(MAX_LENGTHS, "rfc_factura", item.RFC_Factura || ""),
          estatus: validateString(MAX_LENGTHS, "estatus", item.Estatus || "N/A"),
          escuela: validateString(MAX_LENGTHS, "escuela", item.Escuela || ""),
          grupo: validateString(MAX_LENGTHS, "grupo", item.Grupo || ""),
          baja: validateString(MAX_LENGTHS, "baja", item.Baja || "n"),
        }));
        setDataJson(convertedData);
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const itemHeaderTable = () => {
    return (
      <>
        <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</td>
        <td className="w-[20%]">Nombre</td>
        <td className="w-[20%]">A. Paterno</td>
        <td className="w-[20%]">A. Materno</td>
        <td className="w-[20%]">A. Nombre</td>
        <td className="w-[10%]">Fecha Nac.</td>
        <td className="w-[10%]">Fecha Inscripción</td>
        <td className="w-[10%]">Fecha Baja</td>
        <td className="w-[5%]">Sexo</td>
        <td className="w-[10%]">Teléfono 1</td>
        <td className="w-[10%]">Teléfono 2</td>
        <td className="w-[10%]">Celular</td>
        <td className="w-[10%]">Código Barras</td>
        <td className="w-[20%]">Dirección</td>
        <td className="w-[15%]">Colonia</td>
        <td className="w-[15%]">Ciudad</td>
        <td className="w-[10%]">Estado</td>
        <td className="w-[5%]">CP</td>
        <td className="w-[20%]">Email</td>
        <td className="w-[20%]">Ruta Foto</td>
        <td className="w-[5%]">Día 1</td>
        <td className="w-[5%]">Día 2</td>
        <td className="w-[5%]">Día 3</td>
        <td className="w-[5%]">Día 4</td>
        <td className="w-[5%]">Hora 1</td>
        <td className="w-[5%]">Hora 2</td>
        <td className="w-[5%]">Hora 3</td>
        <td className="w-[5%]">Hora 4</td>
        <td className="w-[5%]">Cancha 1</td>
        <td className="w-[5%]">Cancha 2</td>
        <td className="w-[5%]">Cancha 3</td>
        <td className="w-[5%]">Cancha 4</td>
        <td className="w-[10%]">Horario 1</td>
        <td className="w-[10%]">Horario 2</td>
        <td className="w-[10%]">Horario 3</td>
        <td className="w-[10%]">Horario 4</td>
        <td className="w-[10%]">Horario 5</td>
        <td className="w-[10%]">Horario 6</td>
        <td className="w-[10%]">Horario 7</td>
        <td className="w-[10%]">Horario 8</td>
        <td className="w-[10%]">Horario 9</td>
        <td className="w-[10%]">Horario 10</td>
        <td className="w-[10%]">Horario 11</td>
        <td className="w-[10%]">Horario 12</td>
        <td className="w-[10%]">Horario 13</td>
        <td className="w-[10%]">Horario 14</td>
        <td className="w-[10%]">Horario 15</td>
        <td className="w-[10%]">Horario 16</td>
        <td className="w-[10%]">Horario 17</td>
        <td className="w-[10%]">Horario 18</td>
        <td className="w-[10%]">Horario 19</td>
        <td className="w-[10%]">Horario 20</td>
        <td className="w-[15%]">Condición 1</td>
        <td className="w-[15%]">Condición 2</td>
        <td className="w-[15%]">Condición 3</td>
        <td className="w-[20%]">Nom. Pediatra</td>
        <td className="w-[10%]">Tel. P 1</td>
        <td className="w-[10%]">Tel. P 2</td>
        <td className="w-[10%]">Cel. P 1</td>
        <td className="w-[10%]">Tipo Sangre</td>
        <td className="w-[20%]">Alergia</td>
        <td className="w-[20%]">Aseguradora</td>
        <td className="w-[10%]">Póliza</td>
        <td className="w-[10%]">Tel. Aseg. 1</td>
        <td className="w-[10%]">Tel. Aseg. 2</td>
        <td className="w-[20%]">Razón Social</td>
        <td className="w-[20%]">Raz. Dirección</td>
        <td className="w-[10%]">Raz. CP</td>
        <td className="w-[15%]">Raz. Colonia</td>
        <td className="w-[15%]">Raz. Ciudad</td>
        <td className="w-[10%]">Raz. Estado</td>
        <td className="w-[20%]">Nombre Padre</td>
        <td className="w-[10%]">Tel. Padre 1</td>
        <td className="w-[10%]">Tel. Padre 2</td>
        <td className="w-[10%]">Cel. Padre</td>
        <td className="w-[20%]">Nombre Madre</td>
        <td className="w-[10%]">Tel. Madre 1</td>
        <td className="w-[10%]">Tel. Madre 2</td>
        <td className="w-[10%]">Cel. Madre</td>
        <td className="w-[20%]">Nombre Avi</td>
        <td className="w-[10%]">Tel. Avi 1</td>
        <td className="w-[10%]">Tel. Avi 2</td>
        <td className="w-[10%]">Cel. Avi 1</td>
        <td className="w-[10%]">Ciclo Escolar</td>
        <td className="w-[5%]">Descuento</td>
        <td className="w-[10%]">RFC Factura</td>
        <td className="w-[5%]">Estatus</td>
        <td className="w-[15%]">Escuela</td>
        <td className="w-[15%]">Grupo</td>
        <td className="w-[5%]">Baja</td>
      </>
    );
  };

  const itemDataTable = (item) => {
    return (
      <>
        <tr key={item.numero} className="hover:cursor-pointer">
          <th className="text-left">{item.numero}</th>
          <td>{item.nombre}</td>
          <td>{item.a_paterno}</td>
          <td>{item.a_materno}</td>
          <td>{item.a_nombre}</td>
          <td>{item.fecha_nac}</td>
          <td>{item.fecha_inscripcion}</td>
          <td>{item.fecha_baja}</td>
          <td>{item.sexo}</td>
          <td>{item.telefono1}</td>
          <td>{item.telefono2}</td>
          <td>{item.celular}</td>
          <td>{item.codigo_barras}</td>
          <td>{item.direccion}</td>
          <td>{item.colonia}</td>
          <td>{item.ciudad}</td>
          <td>{item.estado}</td>
          <td>{item.cp}</td>
          <td>{item.email}</td>
          <td>{item.imagen}</td>
          <td>{item.dia_1}</td>
          <td>{item.dia_2}</td>
          <td>{item.dia_3}</td>
          <td>{item.dia_4}</td>
          <td>{item.hora_1}</td>
          <td>{item.hora_2}</td>
          <td>{item.hora_3}</td>
          <td>{item.hora_4}</td>
          <td>{item.cancha_1}</td>
          <td>{item.cancha_2}</td>
          <td>{item.cancha_3}</td>
          <td>{item.cancha_4}</td>
          <td>{item.horario_1}</td>
          <td>{item.horario_2}</td>
          <td>{item.horario_3}</td>
          <td>{item.horario_4}</td>
          <td>{item.horario_5}</td>
          <td>{item.horario_6}</td>
          <td>{item.horario_7}</td>
          <td>{item.horario_8}</td>
          <td>{item.horario_9}</td>
          <td>{item.horario_10}</td>
          <td>{item.horario_11}</td>
          <td>{item.horario_12}</td>
          <td>{item.horario_13}</td>
          <td>{item.horario_14}</td>
          <td>{item.horario_15}</td>
          <td>{item.horario_16}</td>
          <td>{item.horario_17}</td>
          <td>{item.horario_18}</td>
          <td>{item.horario_19}</td>
          <td>{item.horario_20}</td>
          <td>{item.cond_1}</td>
          <td>{item.cond_2}</td>
          <td>{item.cond_3}</td>
          <td>{item.nom_pediatra}</td>
          <td>{item.tel_p_1}</td>
          <td>{item.tel_p_2}</td>
          <td>{item.cel_p_1}</td>
          <td>{item.tipo_sangre}</td>
          <td>{item.alergia}</td>
          <td>{item.aseguradora}</td>
          <td>{item.poliza}</td>
          <td>{item.tel_ase_1}</td>
          <td>{item.tel_ase_2}</td>
          <td>{item.razon_social}</td>
          <td>{item.raz_direccion}</td>
          <td>{item.raz_cp}</td>
          <td>{item.raz_colonia}</td>
          <td>{item.raz_ciudad}</td>
          <td>{item.raz_estado}</td>
          <td>{item.nom_padre}</td>
          <td>{item.tel_pad_1}</td>
          <td>{item.tel_pad_2}</td>
          <td>{item.cel_pad}</td>
          <td>{item.nom_madre}</td>
          <td>{item.tel_mad_1}</td>
          <td>{item.tel_mad_2}</td>
          <td>{item.cel_mad}</td>
          <td>{item.nom_avi}</td>
          <td>{item.tel_avi_1}</td>
          <td>{item.tel_avi_2}</td>
          <td>{item.cel_avi}</td>
          <td>{item.ciclo_escolar}</td>
          <td>{item.descuento}</td>
          <td>{item.rfc_factura}</td>
          <td>{item.estatus}</td>
          <td>{item.escuela}</td>
          <td>{item.grupo}</td>
          <td>{item.baja}</td>
        </tr>
      </>
    );
  };


  if (status === "loading") {
    return (
      <div className="container skeleton w-full max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  return (
    <>
      <ModalAlumnos
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        session={session}
        accion={accion}
        handleSubmit={handleSubmit}
        onSubmit={onSubmitModal}
        currentID={currentID}
        errors={errors}
        register={register}
        setAlumno={setAlumno}
        alumno={alumno}
        formatNumber={formatNumber}
        capturedImage={capturedImage}
        setCapturedImage={setCapturedImage}
        condicion={condicion}
        setcondicion={setcondicion}
        setGrado={setGrado}
        setGrado2={setGrado2}
        setcond1={setcond1}
        setcond2={setcond2}
        setFile={setFile}
        files={files}
        isLoadingButton={isLoadingButton}
      />
      <ModalProcesarDatos
        id_modal={"my_modal_4"}
        session={session}
        buttonProcess={buttonProcess}
        isLoadingButton={isLoadingButton}
        isLoading={isLoading}
        title={"Procesar Datos desde Excel."}
        setDataJson={setDataJson}
        dataJson={dataJson}
        handleFileChange={handleFileChange}
        itemHeaderTable={itemHeaderTable}
        itemDataTable={itemDataTable}
        //clase para mover al tamaño del modal a preferencia (max-w-4xl)
        classModal={"modal-box w-full max-w-5xl h-full bg-base-200"}
      />
      <VistaPrevia
        id="modalVPAlumno"
        titulo="Vista Previa de Alumnos"
        pdfPreview={pdfPreview}
        pdfData={pdfData}
        PDF={imprimePDF}
        Excel={ImprimeExcel}
        CerrarView={CerrarView}
      />
      <div className="container h-[80vh] w-full max-w-screen-xl bg-base-200 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y-hidden">
        <div className="flex flex-col justify-start p-3">
          <div className="flex flex-wrap md:flex-nowrap items-start md:items-center">
            <div className="order-2 md:order-1 flex justify-around w-full md:w-auto md:justify-start mb-0 md:mb-0">
              <Acciones
                // Buscar={Buscar}
                Alta={Alta}
                home={home}
                PDF={imprimePDF}
                Excel={ImprimeExcel}
                Ver={handleVerClick}
                procesarDatos={procesarDatos}
                animateLoading={animateLoading}
                permiso_alta={permissions.altas}
                permiso_imprime={permissions.impresion}
              />
            </div>
            <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
              Alumnos
            </h1>
          </div>
        </div>
        <div className="flex flex-col items-center h-full">
          <div className="w-full max-w-4xl">
            <Busqueda
              setBajas={setBajas}
              limpiarBusqueda={limpiarBusqueda}
              // Buscar={Buscar}
              handleBusquedaChange={handleBusquedaChange}
              busqueda={busqueda}
            />
            {status === "loading" ||
              (!session ? (
                <></>
              ) : (
                <TablaAlumnos
                  session={session}
                  isLoading={isLoading}
                  alumnosFiltrados={alumnosFiltrados}
                  showModal={showModal}
                  setAlumno={setAlumno}
                  setAccion={setAccion}
                  setCurrentId={setCurrentId}
                  formatNumber={formatNumber}
                  setCapturedImage={setCapturedImage}
                  setcondicion={setcondicion}
                  permiso_cambio={permissions.cambios}
                  permiso_baja={permissions.bajas}
                />
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Alumnos;
