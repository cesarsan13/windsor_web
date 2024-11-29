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
} from "../utils/globalfn";
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
  }, [session, status, bajas]);

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
    const nombreCompleto = `${data.a_paterno || ""} ${data.a_materno || ""} ${
      data.a_nombre || ""
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

  if (status === "loading") {
    return (
      <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
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
