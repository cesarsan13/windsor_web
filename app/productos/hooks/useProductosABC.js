import { useCallback, useRef, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { inactiveActiveBaja } from "@/app/utils/GlobalApis";
import { debounce, permissionsComponents } from "@/app/utils/globalfn";
import {
    getProductos,
    guardarProductos,
} from "@/app/utils/api/productos/productos";
import { showSwal, confirmSwal, showSwalConfirm } from "@/app/utils/alerts";
import { useEscapeWarningModal, validateBeforeSave } from "@/app/utils/globalfn";

export const useProductosABC = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [formasProductos, setFormasProductos] = useState([]);
    const [formaProductos, setFormaProductos] = useState({});
    const [formaProductosFiltrados, setFormaProductosFiltrados] = useState(null);
    const [inactiveActive, setInactiveActive] = useState([]);
    const [bajas, setBajas] = useState(false);
    const [openModal, setModal] = useState(false);
    const [accion, setAccion] = useState("");
    const [isLoading, setisLoading] = useState(false);
    const [isLoadingButton, setisLoadingButton] = useState(false);
    const [currentID, setCurrentId] = useState("");
    const productosRef = useRef(formasProductos);
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
} = useForm({
    defaultValues: {
    numero: formaProductos.numero,
    descripcion: formaProductos.descripcion,
    costo: formaProductos.costo,
    frecuencia: formaProductos.frecuencia,
    por_recargo: formaProductos.por_recargo,
    aplicacion: formaProductos.aplicacion,
    iva: formaProductos.iva,
    cond_1: formaProductos.cond_1,
    cam_precio: formaProductos.cam_precio,
    ref: formaProductos.ref,
    },
});

useEffect(() => {
    const fetchData = async () => {
    setisLoading(true);
    let { token, permissions } = session.user;
    const es_admin = session.user?.es_admin || false;
    const menuSeleccionado = Number(localStorage.getItem("puntoMenu"));
    const busqueda = limpiarBusqueda();
    const data = await getProductos(token, bajas);
    const res = await inactiveActiveBaja(session?.user.token, "productos");
    setFormasProductos(data);
    setFormaProductosFiltrados(data);
    setInactiveActive(res.data);
    const permisos = permissionsComponents(
        es_admin,
        permissions,
        session.user.id,
        menuSeleccionado
    );
    await fetchProductoStatus(false, res.data, busqueda);
    setPermissions(permisos);
    setisLoading(false);
    };
    if (status === "loading" || !session) {
    return;
    }
    fetchData();
}, [status, bajas, reload_page]);

useEffect(() => {
    productosRef.current = formasProductos;
}, [formasProductos]);

const Buscar = useCallback(async () => {
    const { tb_id, tb_desc } = busqueda;
    if (tb_id === "" && tb_desc === "") {
    setFormaProductosFiltrados(productosRef.current);
    await fetchProductoStatus(false, inactiveActive, busqueda);
    return;
    }
    const infoFiltrada = productosRef.current.filter((formaProductos) => {
    const coincideId = tb_id
        ? formaProductos["numero"].toString().includes(tb_id)
        : true;
    const coincideDescripcion = tb_desc
        ? formaProductos["descripcion"]
            .toString()
            .toLowerCase()
            .includes(tb_desc.toLowerCase())
        : true;
    return coincideId && coincideDescripcion;
    });
    setFormaProductosFiltrados(infoFiltrada);
    await fetchProductoStatus(false, inactiveActive, busqueda);
}, [busqueda]);

const debouncedBuscar = useMemo(() => debounce(Buscar, 500), [Buscar]);

const fetchProductoStatus = async (
    showMessage,
    inactiveActive,
    busqueda
) => {
    const { tb_id, tb_desc } = busqueda;
    let infoFiltrada = [];
    let active = 0;
    let inactive = 0;
    if(tb_id || tb_desc) {
        infoFiltrada = inactiveActive.filter((formaProductos) => {
            const coincideId = tb_id
            ? formaProductos["numero"].toString().includes(tb_id)
            : true;
        const coincideDescripcion = tb_desc
            ? formaProductos["descripcion"]
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
    if (showMessage) {
        showSwalConfirm(
            "Estado de los productos",
            `Productos activos: ${active}\nProductos inactivos: ${inactive}`,
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
        ? `Nuevo Producto: ${currentID}`
        : accion === "Editar"
        ? `Editar Producto: ${currentID}`
        : accion === "Eliminar"
        ? `Eliminar Producto: ${currentID}`
        : `Ver Producto: ${currentID}`
    );
}, [accion, currentID]);

useEffect(() => {
    reset({
    numero: formaProductos.numero,
    descripcion: formaProductos.descripcion,
    costo: formaProductos.costo,
    frecuencia: formaProductos.frecuencia,
    por_recargo: formaProductos.por_recargo,
    aplicacion: formaProductos.aplicacion,
    iva: formaProductos.iva,
    cond_1: formaProductos.cond_1,
    cam_precio: formaProductos.cam_precio,
    ref: formaProductos.ref,
    });
}, [formaProductos, reset]);

const limpiarBusqueda = (evt) => {
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
    descripcion: "",
    costo: 0,
    frecuencia: "",
    por_recargo: 0,
    aplicacion: "",
    iva: 0,
    cond_1: 0,
    cam_precio: false,
    ref: "",
    });
    setFormaProductos({numero: ""});
    setModal(!openModal);
    setAccion("Alta");
    showModal(true);
    document.getElementById("descripcion").focus();
};

const validateBeforeSave = () => {
    const lastInput = document.querySelector("input[name='cam_precio']");
    if (lastInput && lastInput.value.trim() === "") {
    showSwal("Error", "Complete todos los campos requeridos", "error", "my_modal_3");
      return false;
    }
    return true;
};

const onSubmitModal = handleSubmit(async (data) => {
    event.preventDefault;
    if (!validateBeforeSave("cam_precio", "my_modal_3")) {
        return;
    }
    setisLoadingButton(true);
    accion == "Alta" ? (data.numero = "") : (data.numero = currentID);
    let res = null;
    if (accion === "Eliminar") {
    showModal(false);
    const confirmed = await confirmSwal(
        "¿Desea Continuar?",
        "Se eliminara el producto seleccionado",
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
    //data.numero = num || currentID;
    //data = await Elimina_Comas(data);
    res = await guardarProductos(session.user.token, data, accion);
    if (res.status) {
    if (accion === "Alta") {
        data.numero = res.data;
        setCurrentId(data.numero);
        const nuevaFormaProductos = { currentID, ...data };
        setFormasProductos([...formasProductos, nuevaFormaProductos]);
        if (!bajas) {
        setFormaProductosFiltrados([...formaProductosFiltrados, nuevaFormaProductos]);
        }
    }
    if (accion === "Eliminar" || accion === "Editar") {
        const index = formasProductos.findIndex((fp) => fp.numero === data.numero);
        if (index !== -1) {
        if (accion === "Eliminar") {
            const fpFiltrados = formasProductos.filter(
            (fp) => fp.numero !== data.numero
            );
            setFormasProductos(fpFiltrados);
            setFormaProductosFiltrados(fpFiltrados);
        } else {
            if (bajas) {
            const fpFiltrados = formasProductos.filter(
                (fp) => fp.numero !== data.numero
            );
            setFormasProductos(fpFiltrados);
            setFormaProductosFiltrados(fpFiltrados);
            } else {
            const fpActualizadas = formasProductos.map((fp) =>
                fp.numero === currentID ? { ...fp, ...data } : fp
            );
            setFormasProductos(fpActualizadas);
            setFormaProductosFiltrados(fpActualizadas);
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
    await fetchProductoStatus(false, inactiveActive, busqueda);
    }
    setisLoadingButton(false);
});

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
    event.preventDefault;
    setBusqueda((estadoPrevio) => ({
    ...estadoPrevio,
    [event.target.id]: event.target.value,
    }));
};

const tableAction = (evt, formaProductos, accion) => {
    evt.preventDefault();
    setFormaProductos(formaProductos);
    setAccion(accion);
    setCurrentId(formaProductos.numero);
    showModal(true);
};

return {
    onSubmitModal,
    Buscar,
    Alta,
    home,
    setBajas,
    limpiarBusqueda,
    handleBusquedaChange,
    fetchProductoStatus,
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
    formaProductosFiltrados,
    titulo,
    reload_page,
    isDisabled,
    errors,
    inactiveActive,
};
};
