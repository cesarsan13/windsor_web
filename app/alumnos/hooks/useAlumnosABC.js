"use cilent";
import { useCallback, useRef, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { inactiveActiveBaja } from "@/app/utils/GlobalApis";
import { debounce, permissionsComponents } from "@/app/utils/globalfn";
import { 
    getAlumnos,
    guardarAlumnos,
    getTab,
} from "@/app/utils/api/alumnos/alumnos";
import { getFotoAlumno } from "@/app/utils/api/alumnos/alumnos";
import { getHorarios } from "@/app/utils/api/horarios/horarios";
import { showSwal, confirmSwal, showSwalConfirm } from "@/app/utils/alerts";
import { formatFecha, poneCeros, calculaDigitoBvba, format_Fecha_String } from "@/app/utils/globalfn";
import { useEscapeWarningModal, validateBeforeSave } from "@/app/utils/globalfn";

export const useAlumnosABC = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [formasAlumnos, setFormasAlumnos] = useState([]);
    const [formaAlumno, setFormaAlumno] = useState({});
    const [formaAlumnosFiltrados, setFormaAlumnosFiltrados] = useState(null);
    const [fecha_hoy, setFechaHoy] = useState("");
    const [horarios, setHorarios] = useState(null);
    const [grado, setGrado] = useState({});
    const [grado2, setGrado2] = useState({});
    const [cond1, setcond1] = useState({});
    const [cond2, setcond2] = useState({});
    const [capturedImage, setCapturedImage] = useState(null);
    const [activeTab, setActiveTab] = useState(1);
    const [condicion, setcondicion] = useState(false);
    const [inactiveActive, setInactiveActive] = useState([]);
    const [bajas, setBajas] = useState(false);
    const [openModal, setModal] = useState(false);
    const [accion, setAccion] = useState("");
    const [isLoading, setisLoading] = useState(false);
    const [isLoadingButton, setisLoadingButton] = useState(false);
    const [currentID, setCurrentId] = useState("");
    const alumnosRef = useRef(formasAlumnos);
    const [permissions, setPermissions] = useState({});
    const [titulo, setTitulo] = useState("");
    const [isDisabled, setIsDisabled] = useState(true);
    const [reload_page, setReloadPage] = useState(false);
    const [active, setActive] = useState(false);
    const [inactive, setInactive] = useState(false);
    const [busqueda, setBusqueda] = useState({
        tb_id: "",
        tb_desc: "",
        tb_grado: "",
});

const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    trigger,
} = useForm({
    defaultValues: {
    numero: formaAlumno.numero,
    nombre: formaAlumno.nombre,
    a_paterno: formaAlumno.a_paterno,
    a_materno: formaAlumno.a_materno,
    a_nombre: formaAlumno.a_nombre,
    fecha_nac: formatFecha(formaAlumno.fecha_nac),
    fecha_inscripcion: formatFecha(formaAlumno.fecha_inscripcion),
    fecha_baja: formatFecha(formaAlumno.fecha_baja),
    sexo: formaAlumno.sexo,
    telefono1: formaAlumno.telefono1,
    telefono2: formaAlumno.telefono2,
    celular: formaAlumno.celular,
    codigo_barras: formaAlumno.codigo_barras,
    direccion: formaAlumno.direccion,
    colonia: formaAlumno.colonia,
    ciudad: formaAlumno.ciudad,
    estado: formaAlumno.estado,
    cp: formaAlumno.cp,
    email: formaAlumno.email,
    imagen: formaAlumno.ruta_foto,
    dia_1: formaAlumno.dia_1,
    dia_2: formaAlumno.dia_2,
    dia_3: formaAlumno.dia_3,
    dia_4: formaAlumno.dia_4,
    hora_1: formaAlumno.hora_1,
    hora_2: formaAlumno.hora_2,
    hora_3: formaAlumno.hora_3,
    hora_4: formaAlumno.hora_4,
    cancha_1: formaAlumno.cancha_1,
    cancha_2: formaAlumno.cancha_2,
    cancha_3: formaAlumno.cancha_3,
    cancha_4: formaAlumno.cancha_4,
    horario_1: formaAlumno.horario_1,
    horario_2: formaAlumno.horario_2,
    horario_3: formaAlumno.horario_3,
    horario_4: formaAlumno.horario_4,
    horario_5: formaAlumno.horario_5,
    horario_6: formaAlumno.horario_6,
    horario_7: formaAlumno.horario_7,
    horario_8: formaAlumno.horario_8,
    horario_9: formaAlumno.horario_9,
    horario_10: formaAlumno.horario_10,
    horario_11: formaAlumno.horario_11,
    horario_12: formaAlumno.horario_12,
    horario_13: formaAlumno.horario_13,
    horario_14: formaAlumno.horario_14,
    horario_15: formaAlumno.horario_15,
    horario_16: formaAlumno.horario_16,
    horario_17: formaAlumno.horario_17,
    horario_18: formaAlumno.horario_18,
    horario_19: formaAlumno.horario_19,
    horario_20: formaAlumno.horario_20,
    cond_1: formaAlumno.cond_1,
    cond_2: formaAlumno.cond_2,
    cond_3: formaAlumno.cond_3,
    nom_pediatra: formaAlumno.nom_pediatra,
    tel_p_1: formaAlumno.tel_p_1,
    tel_p_2: formaAlumno.tel_p_2,
    cel_p_1: formaAlumno.cel_p_1,
    tipo_sangre: formaAlumno.tipo_sangre,
    alergia: formaAlumno.alergia,
    aseguradora: formaAlumno.aseguradora,
    poliza: formaAlumno.poliza,
    tel_ase_1: formaAlumno.tel_ase_1,
    tel_ase_2: formaAlumno.tel_ase_2,
    razon_social: formaAlumno.razon_social,
    raz_direccion: formaAlumno.raz_direccion,
    raz_colonia: formaAlumno.raz_colonia,
    raz_ciudad: formaAlumno.raz_ciudad,
    raz_estado: formaAlumno.raz_estado,
    raz_cp: formaAlumno.raz_cp,
    nom_padre: formaAlumno.nom_padre,
    tel_pad_1: formaAlumno.tel_pad_1,
    tel_pad_2: formaAlumno.tel_pad_2,
    cel_pad_1: formaAlumno.cel_pad,
    nom_madre: formaAlumno.nom_madre,
    tel_mad_1: formaAlumno.tel_mad_1,
    tel_mad_2: formaAlumno.tel_mad_2,
    cel_mad_1: formaAlumno.cel_mad,
    nom_avi: formaAlumno.nom_avi,
    tel_avi_1: formaAlumno.tel_avi_1,
    tel_avi_2: formaAlumno.tel_avi_2,
    cel_avi: formaAlumno.cel_avi,
    ciclo_escolar: formaAlumno.ciclo_escolar,
    descuento: formaAlumno.descuento,
    rfc_factura: formaAlumno.rfc_factura,
    estatus: formaAlumno.estatus,
    escuela: formaAlumno.escuela,
    grupo: formaAlumno.grupo,
    referencia: formaAlumno.referencia,
    horario_1_nombre: formaAlumno.horario_1_nombre,
    },
});

useEffect(() => {
    const fetchData = async () => {
    setisLoading(true);
    let { token, permissions } = session.user;
    const es_admin = session.user?.es_admin || false; 
    const menuSeleccionado = Number(localStorage.getItem("puntoMenu"));
    const busqueda = limpiarBusqueda();
    const data = await getAlumnos(token, bajas);
    const res = await inactiveActiveBaja(session?.user.token, "alumnos");
    setFormasAlumnos(data);
    setFormaAlumnosFiltrados(data);
    setInactiveActive(res.data);
    const horarios = await getHorarios(token, bajas);
    setHorarios(horarios);
    let fecha_hoy = new Date();
    const fechaFormateada = fecha_hoy.toISOString().split("T")[0];
    setFechaHoy(fechaFormateada);
    const permisos = permissionsComponents(
        es_admin,
        permissions,
        session.user.id,
        menuSeleccionado
    );
    await fetchAlumnoStatus(false, res.data, busqueda);
    setPermissions(permisos);
    setisLoading(false);
    };
    if (status === "loading" || !session) {
    return;
    }
    fetchData();
}, [status, bajas, reload_page]);

useEffect(() => {
    alumnosRef.current = formasAlumnos;
}, [formasAlumnos]);

const Buscar = useCallback(async () => {
    const { tb_id, tb_desc, tb_grado } = busqueda;
    if (tb_id === "" && tb_desc === "" && tb_grado === "") {
    setFormaAlumnosFiltrados(alumnosRef.current);
    await fetchAlumnoStatus(false, inactiveActive, busqueda);
    return;
    }
    const infoFiltrada = alumnosRef.current.filter((formaAlumnos) => {
    const coincideId = tb_id
        ? formaAlumnos["numero"].toString().includes(tb_id)
        : true;
    const coincideDescripcion = tb_desc
        ? formaAlumnos["nombre"]
            .toString()
            .toLowerCase()
            .includes(tb_desc.toLowerCase())
        : true;
    const coincideGrado = tb_grado
        ? (formaAlumnos["horario_1_nombre"] || "")
            .toString()
            .toLowerCase()
            .includes(tb_grado.toLowerCase())
        : true;
    return coincideId && coincideDescripcion && coincideGrado;
    });
    setFormaAlumnosFiltrados(infoFiltrada);
    await fetchAlumnoStatus(false, inactiveActive, busqueda);
}, [busqueda]);

const debouncedBuscar = useMemo(() => debounce(Buscar, 500), [Buscar]);

const fetchAlumnoStatus = async (
    showMessage,
    inactiveActive,
    busqueda
) => {
    const { tb_id, tb_desc, tb_grado } = busqueda;
    let infoFiltrada = [];
    let active = 0;
    let inactive = 0;
    if(tb_id || tb_desc || tb_grado) {
        infoFiltrada = inactiveActive.filter((formaAlumnos) => {
            const coincideId = tb_id
        ? formaAlumnos["numero"].toString().includes(tb_id)
        : true;
    const coincideDescripcion = tb_desc
        ? formaAlumnos["nombre"]
            .toString()
            .toLowerCase()
            .includes(tb_desc.toLowerCase())
        : true;
    const coincideGrado = tb_grado
        ? (formaAlumnos["horario_1_nombre"] || "")
            .toString()
            .toLowerCase()
            .includes(tb_grado.toLowerCase())
        : true;
    return coincideId && coincideDescripcion && coincideGrado;
        });
    active = infoFiltrada.filter((c) => c.baja !== "*").length;
    inactive = infoFiltrada.filter((c) => c.baja === "*").length;
    } else {
    active = inactiveActive.filter((c) => c.baja !== "*").length;
    inactive = inactiveActive.filter((c) => c.baja === "*").length;
    }
    setActive(active);
    setInactive(inactive);
    if (showMessage) {
    showSwalConfirm(
        "Estado de los alumnos",
        `Alumnos activos: ${active}\nAlumnos inactivos: ${inactive}`,
        "info"
    );
    }
};

useEffect(() => {
    debouncedBuscar();
    return () => {
    clearTimeout(debouncedBuscar);
    };
}, [busqueda, debouncedBuscar]);

useEffect(() => {
    const debouncedBuscar = debounce(Buscar, 500);
    debouncedBuscar();
    return () => {
    clearTimeout(debouncedBuscar);
    };
}, [busqueda, Buscar]);

useEffect(() => {
    if (accion === "Eliminar" || accion === "Ver") {
    setIsDisabled(true);
    }
    if (accion === "Alta" || accion === "Editar") {
    setIsDisabled(false);
    }
    setTitulo(
    accion === "Alta"
        ? `Nuevo Alumno`
        : accion === "Editar"
        ? `Editar Alumno: ${currentID}`
        : accion === "Eliminar"
        ? `Eliminar Alumno: ${currentID}`
        : `Ver Alumno: ${currentID}`
        ? `Reactivar Alumno: ${currentID}`
        : accion == "Reactivar"
    );
}, [accion, currentID]);

useEffect(() => {
    reset({
    numero: formaAlumno.numero,
    nombre: formaAlumno.nombre,
    a_paterno: formaAlumno.a_paterno,
    a_materno: formaAlumno.a_materno,
    a_nombre: formaAlumno.a_nombre,
    fecha_nac: formatFecha(formaAlumno.fecha_nac),
    fecha_inscripcion: formatFecha(formaAlumno.fecha_inscripcion),
    fecha_baja: formatFecha(formaAlumno.fecha_baja),
    sexo: formaAlumno.sexo,
    telefono1: formaAlumno.telefono1,
    telefono2: formaAlumno.telefono2,
    celular: formaAlumno.celular,
    codigo_barras: formaAlumno.codigo_barras,
    direccion: formaAlumno.direccion,
    colonia: formaAlumno.colonia,
    ciudad: formaAlumno.ciudad,
    estado: formaAlumno.estado,
    cp: formaAlumno.cp,
    email: formaAlumno.email,
    imagen: formaAlumno.ruta_foto,
    dia_1: formaAlumno.dia_1,
    dia_2: formaAlumno.dia_2,
    dia_3: formaAlumno.dia_3,
    dia_4: formaAlumno.dia_4,
    hora_1: formaAlumno.hora_1,
    hora_2: formaAlumno.hora_2,
    hora_3: formaAlumno.hora_3,
    hora_4: formaAlumno.hora_4,
    cancha_1: formaAlumno.cancha_1,
    cancha_2: formaAlumno.cancha_2,
    cancha_3: formaAlumno.cancha_3,
    cancha_4: formaAlumno.cancha_4,
    horario_1: formaAlumno.horario_1,
    horario_2: formaAlumno.horario_2,
    horario_3: formaAlumno.horario_3,
    horario_4: formaAlumno.horario_4,
    horario_5: formaAlumno.horario_5,
    horario_6: formaAlumno.horario_6,
    horario_7: formaAlumno.horario_7,
    horario_8: formaAlumno.horario_8,
    horario_9: formaAlumno.horario_9,
    horario_10: formaAlumno.horario_10,
    horario_11: formaAlumno.horario_11,
    horario_12: formaAlumno.horario_12,
    horario_13: formaAlumno.horario_13,
    horario_14: formaAlumno.horario_14,
    horario_15: formaAlumno.horario_15,
    horario_16: formaAlumno.horario_16,
    horario_17: formaAlumno.horario_17,
    horario_18: formaAlumno.horario_18,
    horario_19: formaAlumno.horario_19,
    horario_20: formaAlumno.horario_20,
    cond_1: formaAlumno.cond_1,
    cond_2: formaAlumno.cond_2,
    cond_3: formaAlumno.cond_3,
    nom_pediatra: formaAlumno.nom_pediatra,
    tel_p_1: formaAlumno.tel_p_1,
    tel_p_2: formaAlumno.tel_p_2,
    cel_p_1: formaAlumno.cel_p_1,
    tipo_sangre: formaAlumno.tipo_sangre,
    alergia: formaAlumno.alergia,
    aseguradora: formaAlumno.aseguradora,
    poliza: formaAlumno.poliza,
    tel_ase_1: formaAlumno.tel_ase_1,
    tel_ase_2: formaAlumno.tel_ase_2,
    razon_social: formaAlumno.razon_social,
    raz_direccion: formaAlumno.raz_direccion,
    raz_colonia: formaAlumno.raz_colonia,
    raz_ciudad: formaAlumno.raz_ciudad,
    raz_estado: formaAlumno.raz_estado,
    raz_cp: formaAlumno.raz_cp,
    nom_padre: formaAlumno.nom_padre,
    tel_pad_1: formaAlumno.tel_pad_1,
    tel_pad_2: formaAlumno.tel_pad_2,
    cel_pad_1: formaAlumno.cel_pad,
    nom_madre: formaAlumno.nom_madre,
    tel_mad_1: formaAlumno.tel_mad_1,
    tel_mad_2: formaAlumno.tel_mad_2,
    cel_mad_1: formaAlumno.cel_mad,
    nom_avi: formaAlumno.nom_avi,
    tel_avi_1: formaAlumno.tel_avi_1,
    tel_avi_2: formaAlumno.tel_avi_2,
    cel_avi: formaAlumno.cel_avi,
    ciclo_escolar: formaAlumno.ciclo_escolar,
    descuento: formaAlumno.descuento,
    rfc_factura: formaAlumno.rfc_factura,
    estatus: formaAlumno.estatus,
    escuela: formaAlumno.escuela,
    grupo: formaAlumno.grupo,
    referencia: formaAlumno.referencia,
    horario_1_nombre: formaAlumno.horario_1_nombre,
    });
}, [formaAlumno, reset]);

const limpiarBusqueda = () => {
    const search = {
        tb_id: "",
        tb_desc: "",
        tb_grado: "",
    };
    setBusqueda({ tb_id: "", tb_desc: "", tb_grado: "" });
    return search;
};

const Alta = async () => {
    setCurrentId("");
    setCapturedImage(null);
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
    setFormaAlumno({ numero: "", fecha_inscripcion: fecha_hoy });
    setModal(!openModal);
    setAccion("Alta");
    showModal(true);
    document.getElementById("a_paterno").focus();
};

const onSubmitModal = handleSubmit(async (data) => {
    event.preventDefault();
    if (!validateBeforeSave("horario_1_nombre", "my_modal_3")) {
        return;
    }
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
    formData.append("horario_1", formaAlumno.grupo || "");
    }
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
    formData.append("grupo", formaAlumno.grupo || "");
    }

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
        return item.numero === formaAlumno.grupo;
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
        setCurrentId(data.numero);
        const nuevaFormaAlumnos = { ...data };
        setFormasAlumnos([...formasAlumnos, nuevaFormaAlumnos]);
        if (!bajas) {
        setFormaAlumnosFiltrados([...formaAlumnosFiltrados, nuevaFormaAlumnos]);
        }
    }
    if (accion === "Eliminar" || accion === "Editar") {
        const index = formasAlumnos.findIndex((fp) => fp.numero === data.numero);
        if (index !== -1) {
        if (accion === "Eliminar") {
            const faFiltrados = formasAlumnos.filter((fp) => fp.numero !== data.numero);
            setFormasAlumnos(faFiltrados);
            setFormaAlumnosFiltrados(faFiltrados);
        } else {
            if (bajas) {
            const faFiltrados = formaAlumno.filter(
                (fp) => fp.numero !== data.numero
            );
            setFormaAlumno(faFiltrados);
            setFormaAlumnosFiltrados(faFiltrados);
            } else {
            const faLactualizadas = formasAlumnos.map((fp) =>
                fp.numero === currentID ? { ...fp, ...res.data } : fp
            );
            faLactualizadas.find((item) => {
                if (item.numero === res.data.numero) {
                item.horario_1_nombre = data.horario_1_nombre;
                }
            });
            setFormasAlumnos(faLactualizadas);
            setFormaAlumnosFiltrados(faLactualizadas);
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
    } else {
    if (Object.keys(res.errors).length > 0) {
        const primerError = Object.keys(res.errors)[0];
        document.getElementById(primerError).focus();
        setActiveTab(getTab(primerError));
    }
    showSwal(res.alert_title, res.alert_text, res.alert_icon, "my_modal_3");
}
    if (accion === "Alta" || accion === "Eliminar") {
        setReloadPage(!reload_page);
    await fetchAlumnoStatus(false, inactiveActive, busqueda);;
    }
    setisLoadingButton(false);
},
async (errors) => {
    await trigger();
    if (Object.keys(errors).length > 0) {
      showSwal("Error", "Complete todos los campos requeridos", "error", "my_modal_3");
    }
  }
);

const showModal = (show) => {
    show
    ? document.getElementById("my_modal_3").showModal()
    : document.getElementById("my_modal_3").close();
};

//Para el Esc
useEscapeWarningModal(openModal, showModal);

const home = () => {
    router.push("/");
};

const handleBusquedaChange = (event) => {
    event.preventDefault();
    setBusqueda((estadoPrevio) => ({
    ...estadoPrevio,
    [event.target.id]: event.target.value,
    }));
};

const handleReactivar = async (evt, formaAlumnos) => {
    evt.preventDefault();
    const confirmed = await confirmSwal(
    "¿Desea reactivar este alumno?",
    "El alumno será reactivado y volverá a estar activo.",
    "warning",
    "Sí, reactivar",
    "Cancelar"
    );
    const formData = new FormData();
    Object.keys(formaAlumnos).forEach((key) => {
        formData.append(key, formaAlumnos[key] ?? "");
        });
    formData.append("baja", "");
    formData.append("estatus", "Activo");
    if (confirmed) {
    const res = await guardarAlumnos(session.user.token, formData, "Editar", formaAlumnos.numero);


    if (res.status) {
        const updatedAlumnos = formasAlumnos.map((c) =>
        c.numero === formaAlumnos.numero ? { ...c, baja: "" } : c
        );

        setFormasAlumnos(updatedAlumnos);
        setFormaAlumnosFiltrados(updatedAlumnos);

        showSwal("Reactivado", "El alumno ha sido reactivado correctamente.", "success");
        setReloadPage((prev) => !prev);
    } else {
        showSwal("Error", "No se pudo reactivar el alumno.", "error");
    }
    }
};

const tableAction = async (evt, formaAlumnos, accion) => {
    evt.preventDefault();
    const imagenUrl = await getFotoAlumno(session.user.token, formaAlumnos.ruta_foto);
    if (imagenUrl) {
    setCapturedImage(imagenUrl);
    }
    let ref = "100910" + poneCeros(formaAlumnos.numero, 4);
    let digitoBvba = calculaDigitoBvba(ref);
    let resultado = `${ref}${digitoBvba}`;
    formaAlumnos.referencia = resultado;
    setFormaAlumno(formaAlumnos);
    setAccion(accion);
    setCurrentId(formaAlumnos.numero);
    if (accion === "Reactivar") {
        handleReactivar(evt, formaAlumnos);
    } else {
        showModal(true);
    }      
    setcondicion(false);
};

return {
    onSubmitModal,
    Buscar,
    Alta,
    home,
    setBajas,
    limpiarBusqueda,
    handleBusquedaChange,
    fetchAlumnoStatus,
    setReloadPage,
    setisLoadingButton,
    tableAction,
    register,
    status,
    session,
    isLoadingButton,
    isLoading,
    accion,
    permissions,
    active,
    inactive,
    busqueda,
    formaAlumnosFiltrados,
    titulo,
    reload_page,
    isDisabled,
    errors,
    inactiveActive,
};
};