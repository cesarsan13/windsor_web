import { useCallback, useRef, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { inactiveActiveBaja } from "@/app/utils/GlobalApis";
import { debounce, permissionsComponents } from "@/app/utils/globalfn";
import { showSwal, confirmSwal, showSwalConfirm } from "@/app/utils/alerts";
import { 
    getActividades,
    guardarActividad,
    getAsignaturas,
    getUltimaSecuencia
} from '@/app/utils/api/actividades/actividades';
import { useEscapeWarningModal, validateBeforeSave } from "@/app/utils/globalfn";

export const useActividadesABC = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [actividades, setActividades] = useState([]);
    const [actividad, setActividad] = useState({})
    const [ActividadesFiltradas, setActividadesFiltradas] = useState([])
    const [inactiveActive, setInactiveActive] = useState([]);
    const [asignaturas, setAsignaturas] = useState([]);
    const [bajas, setBajas] = useState(false);
    const [openModal, setModal] = useState(false);
    const [accion, setAccion] = useState("");
    const [isLoading, setisLoading] = useState(false);
    const [isLoadingButton, setisLoadingButton] = useState(false);
    const [currentID, setCurrentId] = useState("");
    const actividadesRef = useRef(actividades);
    const [permissions, setPermissions] = useState({});
    const [titulo, setTitulo] = useState("");
    const [isDisabled, setIsDisabled] = useState(true);
    const [reload_page, setReloadPage] = useState(false);
    const [active, setActive] = useState(false);
    const [inactive, setInactive] = useState(false);
    const [busqueda, setBusqueda] = useState({
        tb_id: "",
        tb_desc: "",
    });

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
        trigger,
    } = useForm({
        defaultValues: {
            materia: actividad.materia,
            secuencia: actividad.secuencia,
            descripcion: actividad.descripcion,
            EB1: actividad.EB1,
            EB2: actividad.EB2,
            EB3: actividad.EB3,
            EB4: actividad.EB4,
            EB5: actividad.EB5,
            baja: actividad.baja,
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            setisLoading(true);
            let { token, permissions } = session.user
            const es_admin = session.user?.es_admin || false;
            const menuSeleccionado = Number(localStorage.getItem("puntoMenu"));
            const busqueda = limpiarBusqueda();
            const data = await getActividades(token, bajas)
            const asignaturas = await getAsignaturas(token, bajas)
            const res = await inactiveActiveBaja(session?.user.token, "actividades");

            setAsignaturas(asignaturas);
            setActividades(data);
            setActividadesFiltradas(data);
            setInactiveActive(res.data);
            const permisos = permissionsComponents(
                es_admin,
                permissions,
                session.user.id,
                menuSeleccionado
            );
            await fetchActividadStatus(false, res.data, busqueda);
            setPermissions(permisos);
            setisLoading(false);
        }
        if (status === "loading" || !session) {
            return;
        }
        fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, bajas, reload_page]);

    useEffect(() => {
        actividadesRef.current = actividades
    }, [actividades]);

    const Buscar = useCallback( async () => {
        const { tb_id, tb_desc } = busqueda;
        if (tb_id === "" && tb_desc === "") {
            setActividadesFiltradas(actividadesRef.current);
            await fetchActividadStatus(false, inactiveActive, busqueda);
            return;
        }
        const infoFiltrada = actividadesRef.current.filter((actividad) => {
            const coincideId = tb_id 
                ? actividad["materia"].toString().includes(tb_id) 
                : true;
            const coincideDescripcion = tb_desc 
                ? actividad["descripcion"].toString().toLowerCase().includes(tb_desc.toLowerCase()) 
                : true;
            return coincideId && coincideDescripcion;
        });
        setActividadesFiltradas(infoFiltrada);
        await fetchActividadStatus(false, inactiveActive, busqueda);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [busqueda]);

    const debouncedBuscar = useMemo(() => debounce(Buscar, 500), [Buscar]);

    const fetchActividadStatus = async (
        showMesssage,
        inactiveActive,
        busqueda
    ) => {
        const { tb_id, tb_desc } = busqueda;
        let infoFiltrada = [];
        let active = 0;
        let inactive = 0;
        if(tb_id || tb_desc){
            infoFiltrada = inactiveActive.filter((actividad) => {
                const coincideId = tb_id 
                    ? actividad["materia"].toString().includes(tb_id) 
                    : true;
                const coincideDescripcion = tb_desc 
                    ? actividad["descripcion"].toString().toLowerCase().includes(tb_desc.toLowerCase()) 
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
                "Estado de las actividades",
                `Actividades activas: ${active}\nActividades inactivas: ${inactive}`,
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
            ? `Nueva Actividad`
            : accion === "Editar"
            ? `Editar Actividad ${currentID}`
            : accion === "Eliminar"
            ? `Eliminar Actividad ${currentID}`
            : `Ver Actividad ${currentID}`
            ? `Reactivar Horario: ${currentID}`
            : accion == "Reactivar"
        );
    }, [accion, currentID]);

    useEffect(() => {
        reset({
            materia: actividad.materia,
            secuencia: actividad.secuencia,
            descripcion: actividad.descripcion,
            evaluaciones: actividad.evaluaciones,
            EB1: actividad.EB1,
            EB2: actividad.EB2,
            EB3: actividad.EB3,
            EB4: actividad.EB4,
            EB5: actividad.EB5,
            baja: actividad.baja,
        })
    }, [actividad, reset]);

    const limpiarBusqueda = () => {
        const search = { tb_id: "", tb_desc: "" }; 
        setBusqueda({ tb_id: "", tb_desc: "" });
        return search;
    };

    const Alta = async () => {
        setCurrentId("");
        reset({
            materia: "",
            secuencia: "",
            descripcion: "",
            EB1: "",
            EB2: "",
            EB3: "",
            EB4: "",
            EB5: "",
            baja: "",
        });
        setActividad({ materia: "" });
        setModal(!openModal);
        setAccion("Alta");
        showModal(true);
        document.getElementById("materia").focus();
    };

    const onSubmitModal = handleSubmit(async (data) => {
        event.preventDefault();
        setisLoadingButton(true);
        accion === "Alta" ? (data.numero = "") : (data.numero = currentID);
        let res = null
        if (accion === "Eliminar") {
            showModal(false)
            const confirmed = await confirmSwal(
                "¿Desea Continuar?",
                "se eliminara la Actividad Seleccionada",
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
        res = await guardarActividad(session.user.token, accion, data);
        if (res.status) {
            if (accion === "Alta") {
                const nuevaActividad = {currentID,...data }
                setActividades([...actividades, nuevaActividad]);
                if (!bajas) {
                    setActividadesFiltradas([...ActividadesFiltradas, nuevaActividad]);
                }
            }
            if (accion === "Eliminar" || accion === "Editar") {

                const index = actividades.findIndex((fp) => fp.materia === data.materia);
                if (index !== -1) {
                    if (accion === "Eliminar") {
                        const fpFiltrados = actividades.filter((fp) => fp.materia !== data.materia)
                        setActividades(fpFiltrados);
                        setActividadesFiltradas(fpFiltrados);
                    } else {
                        if (bajas) {
                            const fpFiltrados = actividades.filter((fp) => fp.materia !== data.materia)
                            setActividades(fpFiltrados);
                            setActividadesFiltradas(fpFiltrados);
                        } else {
                            const fpActualizadas = actividades.map((fp) =>
                                fp.materia === currentID && fp.secuencia === data.secuencia ? { ...fp, ...data } : fp
                            )
                            setActividades(fpActualizadas);
                            setActividadesFiltradas(fpActualizadas);
                        }
                    }
                }
            }
            showSwal(res.alert_title, res.alert_text, res.alert_icon);
            showModal(false);
        } else {
            showSwal(res.alert_title, res.alert_text, res.alert_icon, "my_modal_actividades");
        }
        if (accion === "Alta" || accion === "Eliminar"){
            setReloadPage(!reload_page);
            await fetchActividadStatus(false, inactiveActive, busqueda);
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

    const handleReactivar = async (evt, actividadesr) => {
        evt.preventDefault();
        const confirmed = await confirmSwal(
          "¿Desea reactivar esta actividad?",
          "La actividad será reactivada y volverá a estar activo.",
          "warning",
          "Sí, reactivar",
          "Cancelar"
        );
      
        if (confirmed) {
          const res = await guardarActividad(session.user.token, { 
            ...actividadesr, 
            baja: ""
          }, "Editar");
          console.log("a", res);
      
          if (res.status) {
            const updatedActividades = formasHorarios.map((c) =>
              c.materia === actividadesr.materia ? { ...c, baja: "" } : c
            );
      
            setActividades(updatedActividades);
            setActividadesFiltradas(updatedActividades);
      
            showSwal("Reactivado", "La Actividad ha sido reactivada correctamente.", "success");
            setReloadPage((prev) => !prev);
          } else {
            showSwal("Error", "No se pudo reactivar la Actividad.", "error");
          }
        }
    };
    

    const tableAction = (evt, actividad, accion) => {
        evt.preventDefault();
        setActividad(actividad);
        setAccion(accion);
        setCurrentId(actividad.materia);
        if (accion === "Reactivar") {
            handleReactivar(evt, actividad);
        } else {
            showModal(true);
        }  
    };

    const materia = watch("materia");
    const handleAsignaturaChange = async (event) => {
        const { token } = session.user;
        const secuencia = await getUltimaSecuencia(token, materia);
        setValue("secuencia", secuencia.data);
    };


    return{
        onSubmitModal,
        Buscar,
        Alta,
        home,
        setBajas,
        limpiarBusqueda,
        handleBusquedaChange,
        fetchActividadStatus,
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
        ActividadesFiltradas,
        titulo,
        reload_page,
        isDisabled,
        errors,
        inactiveActive,
        asignaturas,
        handleAsignaturaChange
    };
};