import { useCallback, useRef, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { inactiveActiveBaja } from "@/app/utils/GlobalApis";
import { debounce, permissionsComponents } from "@/app/utils/globalfn";
import {
    getHorarios,
    guardarHorario,
} from "@/app/utils/api/horarios/horarios";
import { showSwal, confirmSwal, showSwalConfirm } from "@/app/utils/alerts";
import { useEscapeWarningModal, validateBeforeSave } from "@/app/utils/globalfn";

export const useHorariosABC = (
    dia
) => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [formasHorarios, setFormasHorarios] = useState([]);
    const [formaHorarios, setFormaHorarios] = useState({});
    const [formaHorariosFiltrados, setFormaHorariosFiltrados] = useState(null);
    const [inactiveActive, setInactiveActive] = useState([]);
    const [bajas, setBajas] = useState(false);
    const [openModal, setModal] = useState(false);
    const [accion, setAccion] = useState("");
    const [isLoading, setisLoading] = useState(false);
    const [isLoadingButton, setisLoadingButton] = useState(false);
    const [currentID, setCurrentId] = useState("");
    const horariosRef = useRef(formasHorarios);
    const [permissions, setPermissions] = useState({});
    const [titulo, setTitulo] = useState("");
    const [isDisabled, setIsDisabled] = useState(true);
    const [reload_page, setReloadPage] = useState(false);
    const [active, setActive] = useState(false);
    const [inactive, setInactive] = useState(false);
    //const [dia, setDia] = useState("");
    const [busqueda, setBusqueda] = useState({ 
        tb_id: "",
        tb_desc: "",
    });
const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
    trigger,
} = useForm({
    defaultValues: {
    numero: formaHorarios.numero,
    cancha: formaHorarios.cancha,
    dia: formaHorarios.dia,
    horario: formaHorarios.horario,
    max_niños: formaHorarios.max_niños,
    sexo: formaHorarios.sexo,
    edad_ini: formaHorarios.edad_ini,
    edad_fin: formaHorarios.edad_fin,
    salon: formaHorarios.salon,
    },
});

useEffect(() => {
    const fetchData = async () => {
    setisLoading(true);
    let { token, permissions } = session.user;
    const es_admin = session.user?.es_admin || false;
    const menuSeleccionado = Number(localStorage.getItem("puntoMenu"));
    const busqueda = limpiarBusqueda();
    const data = await getHorarios(token, bajas);
    const res = await inactiveActiveBaja(session?.user.token, "horarios");
    setFormasHorarios(data);
    setFormaHorariosFiltrados(data);
    setInactiveActive(res.data);
    const permisos = permissionsComponents(
        es_admin, 
        permissions, 
        session.user.id,
        menuSeleccionado
    );
    await fetchHorariosStatus(false, res.data, busqueda);
    setPermissions(permisos);
    setisLoading(false);
    };
    if (status === "loading" || !session) {
    return;
    }
    fetchData();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [status, bajas, reload_page]);

useEffect(() => {
    horariosRef.current = formasHorarios
}, [formasHorarios]);

const Buscar = useCallback(async () => {
    const { tb_id, tb_desc } = busqueda;
    if (tb_id === "" && tb_desc === "") {
    setFormaHorariosFiltrados(horariosRef.current);
    await fetchHorariosStatus(false, inactiveActive, busqueda);
    return;
    }
    const infoFiltrada = horariosRef.current.filter((formaHorarios) => {
    const coincideId = tb_id
        ? formaHorarios["numero"].toString().includes(tb_id)
        : true;
    const coincideDescripcion = tb_desc
        ? formaHorarios["horario"]
        .toString()
        .toLowerCase()
        .includes(tb_desc.toLowerCase())
        : true;
    return coincideId && coincideDescripcion;
    });
    setFormaHorariosFiltrados(infoFiltrada);
    await fetchHorariosStatus(false, inactiveActive, busqueda);
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [busqueda]);

const debouncedBuscar = useMemo(() => debounce(Buscar, 500), [Buscar])

const fetchHorariosStatus = async (
    showMesssage,
    inactiveActive,
    busqueda
) => {
    const { tb_id, tb_desc } = busqueda;
    let infoFiltrada = [];
    let active = 0;
    let inactive = 0;
    if(tb_id || tb_desc) {
        infoFiltrada = inactiveActive.filter((formaHorarios) => {
            const coincideId = tb_id
        ? formaHorarios["numero"].toString().includes(tb_id)
        : true;
    const coincideDescripcion = tb_desc
        ? formaHorarios["horario"]
        .toString()
        .toLowerCase()
        .includes(tb_desc.toLowerCase())
        : true;
    return coincideId && coincideDescripcion;
        });
        active = infoFiltrada.filter((c) => c.baja !== "*").length;
        inactive = infoFiltrada.filter((c) => c.baja === "*").length;
    } else {
        active = inactiveActive.filter((c) => c.baja !== "*").length;
        inactive = inactiveActive.filter((c) => c.baja === "*").length;
    }
    setActive(active);
    setInactive(inactive);
    if (showMesssage) {
    showSwalConfirm(
        "Estado de los horarios",
        `Horarios activos: ${active}\nHorarios inactivos: ${inactive}`,
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
        ? `Nuevo Horario: ${currentID}`
        : accion === "Editar"
        ? `Editar Horario: ${currentID}`
        : accion === "Eliminar"
        ? `Eliminar Horario: ${currentID}`
        : `Ver Horario: ${currentID}`
    );
}, [accion, currentID]);

useEffect(() => {
    reset({
    numero: formaHorarios.numero,
    cancha: formaHorarios.cancha,
    dia: formaHorarios.dia,
    horario: formaHorarios.horario,
    max_niños: formaHorarios.max_niños,
    sexo: formaHorarios.sexo,
    edad_ini: formaHorarios.edad_ini,
    edad_fin: formaHorarios.edad_fin,
    salon: formaHorarios.salon,
    });
}, [formaHorarios, reset]);

const limpiarBusqueda = () => {
    const search = {
        tb_id: "",
        tb_desc: "",
    };
    setBusqueda({ tb_id: "", tb_desc: "" });
    return search;
};

const Alta = async () => {
    setCurrentId("");
    reset({
    numero: "",
    cancha: "",
    dia: "",
    horario: "",
    max_niños: "",
    sexo: "",
    edad_ini: "",
    edad_fin: "",
    salon: "",
    });
    setFormaHorarios({ numero: "" });
    setModal(!openModal);
    setAccion("Alta");
    showModal(true);
    document.getElementById("cancha").focus();
};

const onSubmitModal = handleSubmit(async (data) => {
    event.preventDefault;
    setisLoadingButton(true);
    accion === "Alta" ? (data.numero = "") : (data.numero = currentID);
    let res = null;
    if (accion === "Eliminar") {
    showModal(false);
    const confirmed = await confirmSwal(
        "¿Desea Continuar?",
        "Se eliminara el horario seleccionado",
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
    if (Array.isArray(dia)) {
    data.dia = dia.join("/");
    } else {
    data.dia = dia;
    }
    res = await guardarHorario(session.user.token, data, accion);
    if (res.status) {
        if (accion === "Alta") {
            data.numero = res.data;
            setCurrentId(data.numero);
            const nuevaFormaHorario = { currentID, ...data };
            setFormasHorarios([...formasHorarios, nuevaFormaHorario]);
            if (!bajas) {
            setFormaHorariosFiltrados([...formaHorariosFiltrados, nuevaFormaHorario]);
            }
        }
        if (accion === "Eliminar" || accion === "Editar") {
            const index = formasHorarios.findIndex((fp) => fp.numero === data.numero);
            if (index !== -1) {
                if (accion === "Eliminar") {
                    const fpFiltrados = formasHorarios.filter(
                    (fp) => fp.numero !== data.numero
                    );
                    setFormasHorarios(fpFiltrados);
                    setFormaHorariosFiltrados(fpFiltrados);
                } else {
                    if (bajas) {
                    const fpFiltrados = formasHorarios.filter(
                        (fp) => fp.numero !== data.numero
                    );
                    setFormasHorarios(fpFiltrados);
                    setFormaHorariosFiltrados(fpFiltrados);
                    } else {
                    const fpActualizadas = formasHorarios.map((fp) =>
                        fp.numero === currentID ? { ...fp, ...data } : fp
                    );
                    setFormasHorarios(fpActualizadas);
                    setFormaHorariosFiltrados(fpActualizadas);
                    }
                }
            }
        }
        showSwal(res.alert_title, res.alert_text, res.alert_icon);
        showModal(false);
    } else {
        showSwal(res.alert_title, res.alert_text, "error", "my_modal_3");
    }
    if (accion === "Alta" || accion === "Eliminar") {
        setReloadPage(!reload_page);
        await fetchHorariosStatus(false, inactiveActive, busqueda);
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

const handleBusquedaChange = async (event) => {
    event.preventDefault();
    setBusqueda((estadoPrevio) => ({
    ...estadoPrevio,
    [event.target.id]: event.target.value,
    }));
};

const handleReactivar = async (evt, horariosr) => {
    evt.preventDefault();
    const confirmed = await confirmSwal(
      "¿Desea reactivar este horario?",
      "El horario será reactivado y volverá a estar activo.",
      "warning",
      "Sí, reactivar",
      "Cancelar"
    );
  
    if (confirmed) {
      const res = await guardarHorario(session.user.token, { 
        ...horariosr, 
        baja: ""
      }, "Editar");
  
      if (res.status) {
        const updatedHorarios = formasHorarios.map((c) =>
          c.numero === horariosr.numero ? { ...c, baja: "" } : c
        );
  
        setFormasHorarios(updatedHorarios);
        setFormaHorariosFiltrados(updatedHorarios);
  
        showSwal("Reactivado", "El horario ha sido reactivado correctamente.", "success");
        setReloadPage((prev) => !prev);
      } else {
        showSwal("Error", "No se pudo reactivar el horario.", "error");
      }
    }
};

const tableAction = (evt, formaHorarios, accion) => {
    evt.preventDefault();
    setFormaHorarios(formaHorarios);
    setAccion(accion);
    setCurrentId(formaHorarios.numero);
    if (accion === "Reactivar") {
        handleReactivar(evt, formaHorarios);
    } else {
        showModal(true);
    }  
};

return {
    onSubmitModal,
    Buscar,
    Alta,
    home,
    setBajas,
    limpiarBusqueda,
    handleBusquedaChange,
    fetchHorariosStatus,
    setReloadPage,
    setisLoadingButton,
    tableAction,
    register,
    control,
    status,
    session,
    isLoadingButton,
    isLoading,
    accion,
    permissions,
    active,
    inactive,
    busqueda,
    formaHorariosFiltrados,
    titulo,
    reload_page,
    isDisabled,
    errors,
    inactiveActive,
    formaHorarios,
};
};