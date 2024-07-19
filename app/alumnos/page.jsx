"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { showSwal, confirmSwal } from "../utils/alerts";
import ModalAlumnos from "@/app/alumnos/components/ModalAlumnos";
import TablaAlumnos from "@/app/alumnos/components/TablaAlumnos";
import Busqueda from "@/app/alumnos/components/Busqueda";
import Acciones from "@/app/alumnos/components/Acciones";
import { useForm } from "react-hook-form";
import {
  getAlumnos,
  guardarAlumnos,
  getLastAlumnos,
  Imprimir,
  ImprimirExcel,
} from "@/app/utils/api/alumnos/alumnos";
import { getFormasPago } from "@/app/utils/api/formapago/formapago"
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
function Alumnos() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [alumnos, setAlumnos] = useState([]);
  const [alumno, setAlumno] = useState({});
  const [alumnosFiltrados, setAlumnosFiltrados] = useState([]);
  const [formaPagos, setFormaPagos] = useState([]);
  const [bajas, setBajas] = useState(false);
  const [openModal, setModal] = useState(false);
  const [accion, setAccion] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [currentID, setCurrentId] = useState("");
  const [filtro, setFiltro] = useState("");
  const [TB_Busqueda, setTB_Busqueda] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);
  const [condicion, setcondicion] = useState(false);
  const grados = [
    { id: "PREMATERNAL", grado: "1" },
    { id: "MATERNAL", grado: "2" },
    { id: "KINDER I", grado: "3" },
    { id: "KINDER II", grado: "4" },
    { id: "PREPRIMARIA", grado: "5" },
    { id: "1° PRIMARIA", grado: "6" },
    { id: "2° PRIMARIA", grado: "7" },
    { id: "3° PRIMARIA", grado: "8" },
    { id: "4° PRIMARIA", grado: "9" },
    { id: "5° PRIMARIA", grado: "10" },
    { id: "6° PRIMARIA", grado: "11" },
    { id: "1° SECUNDARIA", grado: "12" },
    { id: "2° SECUNDARIA", grado: "13" },
    { id: "3° SECUNDARIA", grado: "14" },
    { id: "DEUDOR", grado: "15" }
  ];

  const Buscar = (() => {
    if (TB_Busqueda === "" || filtro === "") {
      setAlumnosFiltrados(alumnos);
      return;
    }
    const infoFiltrada = alumnos.filter((alumno) => {
      const valorCampo = alumno[filtro];
      if (typeof valorCampo === "number") {
        return valorCampo.toString().includes(TB_Busqueda);
      }
      return valorCampo
        ?.toString()
        .toLowerCase()
        .includes(TB_Busqueda.toLowerCase());
    });
    setAlumnosFiltrados(infoFiltrada);
  });
  useEffect(() => {
    if (status === "loading" || !session) {
      return;
    }
    const fetchData = async () => {
      setisLoading(true);
      const { token } = session.user;
      const data = await getAlumnos(token, bajas);
      const dataForm = await getFormasPago(token, false);
      setFormaPagos(dataForm);
      setAlumnos(data);
      setAlumnosFiltrados(data);
      if (filtro !== "" && TB_Busqueda !== "") {
        Buscar();
      }
      setisLoading(false);
    };
    fetchData();
  }, [session, status, bajas, filtro, TB_Busqueda]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: alumno.id,
      nombre: alumno.nombre,
      a_paterno: alumno.a_paterno,
      a_materno: alumno.a_materno,
      fecha_nac: alumno.fecha_nac,
      fecha_inscripcion: alumno.fecha_inscripcion,
      fecha_baja: alumno.fecha_baja,
      sexo: alumno.sexo,
      telefono_1: alumno.telefono_1,
      telefono_2: alumno.telefono_2,
      celular: alumno.celular,
      codigo_barras: alumno.codigo_barras,
      direccion: alumno.direccion,
      colonia: alumno.colonia,
      ciudad: alumno.ciudad,
      estado: alumno.estado,
      cp: alumno.cp,
      email: alumno.email,
      imagen: alumno.imagen,
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
      cel_pad_1: alumno.cel_pad_1,
      nom_madre: alumno.nom_madre,
      tel_mad_1: alumno.tel_mad_1,
      tel_mad_2: alumno.tel_mad_2,
      cel_mad_1: alumno.cel_mad_1,
      nom_avi: alumno.nom_avi,
      tel_avi_1: alumno.tel_avi_1,
      tel_avi_2: alumno.tel_avi_2,
      cel_avi_1: alumno.cel_avi_1,
      ciclo_escolar: alumno.ciclo_escolar,
      descuento: alumno.descuento,
      rfc_factura: alumno.rfc_factura,
      estatus: alumno.estatus,
      escuela: alumno.escuela,
      referencia: alumno.referencia,
    },
  });
  useEffect(() => {
    reset({
      id: alumno.id,
      nombre: alumno.nombre,
      a_paterno: alumno.a_paterno,
      a_materno: alumno.a_materno,
      fecha_nac: alumno.fecha_nac,
      fecha_inscripcion: alumno.fecha_inscripcion,
      fecha_baja: alumno.fecha_baja,
      sexo: alumno.sexo,
      telefono_1: alumno.telefono_1,
      telefono_2: alumno.telefono_2,
      celular: alumno.celular,
      codigo_barras: alumno.codigo_barras,
      direccion: alumno.direccion,
      colonia: alumno.colonia,
      ciudad: alumno.ciudad,
      estado: alumno.estado,
      cp: alumno.cp,
      email: alumno.email,
      imagen: alumno.imagen,
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
      cel_pad_1: alumno.cel_pad_1,
      nom_madre: alumno.nom_madre,
      tel_mad_1: alumno.tel_mad_1,
      tel_mad_2: alumno.tel_mad_2,
      cel_mad_1: alumno.cel_mad_1,
      nom_avi: alumno.nom_avi,
      tel_avi_1: alumno.tel_avi_1,
      tel_avi_2: alumno.tel_avi_2,
      cel_avi_1: alumno.cel_avi_1,
      ciclo_escolar: alumno.ciclo_escolar,
      descuento: alumno.descuento,
      rfc_factura: alumno.rfc_factura,
      estatus: alumno.estatus,
      escuela: alumno.escuela,
      referencia: alumno.referencia,
    });
  }, [alumno, reset]);

  const formatNumber = (num) => {
    if (!num) return "";
    const numStr = typeof num === 'string' ? num : num.toString();
    const floatNum = parseFloat(numStr.replace(/,/g, "").replace(/[^\d.-]/g, ''));
    if (isNaN(floatNum)) return "";
    return floatNum.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const Alta = async (event) => {
    setCurrentId("");
    setCapturedImage(null);
    const { token } = session.user;
    reset({
      id: 0,
      nombre: "",
      a_paterno: "",
      a_materno: "",
      a_nombre: "",
      fecha_nac: "",
      fecha_inscripcion: "",
      fecha_baja: "",
      sexo: "",
      telefono_1: "",
      telefono_2: "",
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
      hora_1: "",
      hora_2: "",
      hora_3: "",
      hora_4: "",
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
      cond_1: 0,
      cond_2: 0,
      cond_3: 0,
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
      cel_avi_1: "",
      ciclo_escolar: "",
      descuento: 0,
      rfc_factura: "",
      estatus: "",
      escuela: "",
      referencia: 0,
      baja: "",
    });

    let siguienteId = await getLastAlumnos(token);
    siguienteId = Number(siguienteId + 1);
    setCurrentId(siguienteId);
    setAlumno({ id: siguienteId });
    setModal(!openModal);
    setAccion("Alta");
    showModal(true);

    document.getElementById("nombre").focus();
  };
  const Elimina_Comas = (data) => {
    const convertir = (alumno) => {
      const alumnoConvertido = { ...alumno };

      for (const key in alumnoConvertido) {
        if (
          typeof alumnoConvertido[key] === "string" &&
          alumnoConvertido[key].match(/^\d{1,3}(,\d{3})*(\.\d+)?$/)
        ) {
          alumnoConvertido[key] = parseFloat(
            alumnoConvertido[key].replace(/,/g, "")
          );
        }
      }
      return alumnoConvertido;
    };
    if (Array.isArray(data)) {
      return data.map(convertir);
    } else {
      return convertir(data);
    }
  };

  const onSubmitModal = handleSubmit(async (data) => {
    event.preventDefault;
    data.id = currentID;
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
        return;
      }
    }
    const gradoFiltrado = grados.find((p) => p.id === data.hora_1);
    data.horario_1 = gradoFiltrado.grado
    const formData = new FormData();
    formData.append('id', data.id || '');
    formData.append('nombre', data.nombre || '');
    formData.append('a_paterno', data.a_paterno || '');
    formData.append('a_materno', data.a_materno || '');
    formData.append('fecha_nac', data.fecha_nac || '');
    formData.append('fecha_inscripcion', data.fecha_inscripcion || '');
    formData.append('fecha_baja', data.fecha_baja || '');
    formData.append('sexo', data.sexo || '');
    formData.append('telefono_1', data.telefono_1 || '');
    formData.append('telefono_2', data.telefono_2 || '');
    formData.append('celular', data.celular || '');
    formData.append('codigo_barras', data.codigo_barras || '');
    formData.append('direccion', data.direccion || '');
    formData.append('colonia', data.colonia || '');
    formData.append('ciudad', data.ciudad || '');
    formData.append('estado', data.estado || '');
    formData.append('cp', data.cp || '');
    formData.append('email', data.email || '');
    formData.append('dia_1', data.dia_1 || '');
    formData.append('dia_2', data.dia_2 || '');
    formData.append('dia_3', data.dia_3 || '');
    formData.append('dia_4', data.dia_4 || '');
    formData.append('hora_1', data.hora_1 || '');
    formData.append('hora_2', data.hora_2 || '');
    formData.append('hora_3', data.hora_3 || '');
    formData.append('hora_4', data.hora_4 || '');
    formData.append('cancha_1', data.cancha_1 || '');
    formData.append('cancha_2', data.cancha_2 || '');
    formData.append('cancha_3', data.cancha_3 || '');
    formData.append('cancha_4', data.cancha_4 || '');
    formData.append('horario_1', data.horario_1 || '');
    formData.append('horario_2', data.horario_2 || '');
    formData.append('horario_3', data.horario_3 || '');
    formData.append('horario_4', data.horario_4 || '');
    formData.append('horario_5', data.horario_5 || '');
    formData.append('horario_6', data.horario_6 || '');
    formData.append('horario_7', data.horario_7 || '');
    formData.append('horario_8', data.horario_8 || '');
    formData.append('horario_9', data.horario_9 || '');
    formData.append('horario_10', data.horario_10 || '');
    formData.append('horario_11', data.horario_11 || '');
    formData.append('horario_12', data.horario_12 || '');
    formData.append('horario_13', data.horario_13 || '');
    formData.append('horario_14', data.horario_14 || '');
    formData.append('horario_15', data.horario_15 || '');
    formData.append('horario_16', data.horario_16 || '');
    formData.append('horario_17', data.horario_17 || '');
    formData.append('horario_18', data.horario_18 || '');
    formData.append('horario_19', data.horario_19 || '');
    formData.append('horario_20', data.horario_20 || '');
    formData.append('cond_1', data.cond_1 || '');
    formData.append('cond_2', data.cond_2 || '');
    formData.append('cond_3', data.cond_3 || '');
    formData.append('nom_pediatra', data.nom_pediatra || '');
    formData.append('tel_p_1', data.tel_p_1 || '');
    formData.append('tel_p_2', data.tel_p_2 || '');
    formData.append('cel_p_1', data.cel_p_1 || '');
    formData.append('tipo_sangre', data.tipo_sangre || '');
    formData.append('alergia', data.alergia || '');
    formData.append('aseguradora', data.aseguradora || '');
    formData.append('poliza', data.poliza || '');
    formData.append('tel_ase_1', data.tel_ase_1 || '');
    formData.append('tel_ase_2', data.tel_ase_2 || '');
    formData.append('razon_social', data.razon_social || '');
    formData.append('raz_direccion', data.raz_direccion || '');
    formData.append('raz_colonia', data.raz_colonia || '');
    formData.append('raz_ciudad', data.raz_ciudad || '');
    formData.append('raz_estado', data.raz_estado || '');
    formData.append('raz_cp', data.raz_cp || '');
    formData.append('nom_padre', data.nom_padre || '');
    formData.append('tel_pad_1', data.tel_pad_1 || '');
    formData.append('tel_pad_2', data.tel_pad_2 || '');
    formData.append('cel_pad_1', data.cel_pad_1 || '');
    formData.append('nom_madre', data.nom_madre || '');
    formData.append('tel_mad_1', data.tel_mad_1 || '');
    formData.append('tel_mad_2', data.tel_mad_2 || '');
    formData.append('cel_mad_1', data.cel_mad_1 || '');
    formData.append('nom_avi', data.nom_avi || '');
    formData.append('tel_avi_1', data.tel_avi_1 || '');
    formData.append('tel_avi_2', data.tel_avi_2 || '');
    formData.append('cel_avi_1', data.cel_avi_1 || '');
    formData.append('ciclo_escolar', data.ciclo_escolar || '');
    formData.append('descuento', data.descuento || '');
    formData.append('rfc_factura', data.rfc_factura || '');
    formData.append('estatus', data.estatus || '');
    formData.append('escuela', data.escuela || '');
    if (condicion === true) {
      const blob = dataURLtoBlob(capturedImage);
      formData.append('imagen', blob, `${data.nombre}_${data.a_paterno}_${data.a_materno}.jpg`);
    }
    res = await guardarAlumnos(session.user.token, formData, accion, data.id);
    if (res.status) {
      if (accion === "Alta") {
        const nuevosAlumnos = { currentID, ...data };
        setAlumnos([...alumnos, nuevosAlumnos]);
        if (!bajas) {
          setAlumnosFiltrados([...alumnosFiltrados, nuevosAlumnos]);
        }
      }
      if (accion === "Eliminar" || accion === "Editar") {
        const index = alumnos.findIndex((p) => p.id === data.id);
        if (index !== -1) {
          if (accion === "Eliminar") {
            const aFiltrados = alumnos.filter((p) => p.id !== data.id);
            setAlumnos(aFiltrados);
            setAlumnosFiltrados(aFiltrados);
          } else {
            if (bajas) {
              const aFiltrados = alumnos.filter((p) => p.id !== data.id);
              setAlumnos(aFiltrados);
              setAlumnosFiltrados(aFiltrados);
            } else {
              const aLactualizadas = alumnos.map((p) =>
                p.id === currentID ? { ...p, ...data } : p
              );
              setAlumnos(aLactualizadas);
              setAlumnosFiltrados(aLactualizadas);
            }
          }
        }
      }
      showSwal(res.alert_title, res.alert_text, res.alert_icon);
      showModal(false);
    }
  });
  const dataURLtoBlob = (dataURL) => {
    const parts = dataURL.split(';base64,');
    const contentType = parts[0].split(':')[1];
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
    evt.preventDefault;
    setTB_Busqueda("");
  };
  const showModal = (show) => {
    show
      ? document.getElementById("my_modal_3").showModal()
      : document.getElementById("my_modal_3").close();
  };
  const home = () => {
    router.push("/");
  };
  const handleBusquedaChange = (event) => {
    event.preventDefault;
    setTB_Busqueda(event.target.value);
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
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Datos Alumnos",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: alumnosFiltrados,
      columns: [
        { header: "Número", dataKey: "id" },
        { header: "Nombre", dataKey: "nombre" },
        { header: "Dirección", dataKey: "direccion" },
        { header: "Colonia", dataKey: "colonia" },
        { header: "Fecha Nac", dataKey: "fecha_nac" },
        { header: "Fecha Alta", dataKey: "fecha_inscripcion" },
        { header: "Telefono", dataKey: "telefono_1" },
      ],
      nombre: "Alumnos",
    };
    ImprimirExcel(configuracion);
  };

  if (status === "loading") {
    return (
      <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  return (
    <>
      <ModalAlumnos
        accion={accion}
        onSubmit={onSubmitModal}
        currentID={currentID}
        errors={errors}
        register={register}
        setAlumno={setAlumno}
        alumno={alumno}
        formatNumber={formatNumber}
        formaPagos={formaPagos}
        capturedImage={capturedImage}
        setCapturedImage={setCapturedImage}
        condicion={condicion}
        setcondicion={setcondicion}
      />
      <div className="container  w-full  max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3 ">
        <div className="flex justify-start p-3 ">
          <h1 className="text-4xl font-xthin text-black dark:text-white md:px-12">
            Alumnos.
          </h1>
        </div>
        <div className="container grid grid-cols-8 grid-rows-1 h-[calc(100%-20%)] ">
          <div className="col-span-1 flex flex-col ">
            <Acciones
              Buscar={Buscar}
              Alta={Alta}
              home={home}
              PDF={imprimePDF}
              Excel={ImprimeExcel}
            ></Acciones>
          </div>
          <div className="col-span-7  ">
            <div className="flex flex-col h-[calc(100%)]">
              <Busqueda
                setBajas={setBajas}
                setFiltro={setFiltro}
                limpiarBusqueda={limpiarBusqueda}
                Buscar={Buscar}
                handleBusquedaChange={handleBusquedaChange}
                TB_Busqueda={TB_Busqueda}
                setTB_Busqueda={setTB_Busqueda}
              />
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
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Alumnos;
