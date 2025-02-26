import { useCallback, useRef, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { inactiveActiveBaja } from "@/app/utils/GlobalApis";
import { debounce, permissionsComponents } from "@/app/utils/globalfn";
import {
  getCajeros,
  guardaCajero,
} from "@/app/utils/api/cajeros/cajeros";
import { showSwal, confirmSwal, showSwalConfirm } from "@/app/utils/alerts";
import { useEscapeWarningModal, validateBeforeSave } from "@/app/utils/globalfn";

export const useCajerosABC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [cajeros, setCajeros] = useState([]);
  const [cajero, setCajero] = useState({});
  const [cajerosFiltrados, setCajerosFiltrados] = useState(null);
  const [inactiveActive, setInactiveActive] = useState([]);
  const [bajas, setBajas] = useState(false);
  const [openModal, setModal] = useState(false);
  const [accion, setAccion] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [isLoadingButton, setisLoadingButton] = useState(false);
  const [currentID, setCurrentId] = useState("");
  const cajerosRef = useRef(cajeros);
  const [permissions, setPermissions] = useState({});
  const [titulo, setTitulo] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [reload_page, setReloadPage] = useState(false);
  const [active, setActive] = useState(false);
  const [inactive, setInactive] = useState(false);
  const [busqueda, setBusqueda] = useState({
    tb_id: "",
    tb_desc: "",
    tb_correo: "",
    tb_tel: "",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      numero: cajero.numero,
      nombre: cajero.nombre,
      direccion: cajero.direccion,
      colonia: cajero.colonia,
      telefono: cajero.telefono,
      estado: cajero.estado,
      fax: cajero.fax,
      mail: cajero.mail,
      clave_cajero: cajero.clave_cajero,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setisLoading(true);
      let { token, permissions } = session.user;
      const es_admin = session.user?.es_admin || false; // Asegúrate de que exista
      const menuSeleccionado = Number(localStorage.getItem("puntoMenu"));
      const busqueda = limpiarBusqueda();
      const data = await getCajeros(token, bajas);
      const res = await inactiveActiveBaja(session?.user.token, "cajeros");
      setCajeros(data);
      setCajerosFiltrados(data);
      setInactiveActive(res.data);
      const permisos = permissionsComponents(
        es_admin,
        permissions,
        session.user.id,
        menuSeleccionado
      );
      await fetchCajerosStatus(false, res.data, busqueda);
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
    cajerosRef.current = cajeros;
  }, [cajeros]);
    
  const Buscar = useCallback(async () => {
    const { tb_id, tb_desc, tb_correo, tb_tel } = busqueda;
    if (tb_id === "" && tb_desc === "" && tb_correo === "" && tb_tel === "") {
      setCajerosFiltrados(cajerosRef.current);
      await fetchCajerosStatus(false, inactiveActive, busqueda);
      return;
    }
    const infoFiltrada = cajerosRef.current.filter((cajero) => {
      const coincideNumero = tb_id
        ? cajero["numero"].toString().includes(tb_id)
        : true;
      const coincideNombre = tb_desc
        ? cajero["nombre"]
            .toString()
            .toLowerCase()
            .includes(tb_desc.toLowerCase())
        : true;
      const coincideCorreo = tb_correo
        ? cajero["mail"]
            .toString()
            .toLowerCase()
            .includes(tb_correo.toLowerCase())
        : true;
      const coincideTelefono = tb_tel
        ? cajero["telefono"].toString().includes(tb_tel)
        : true;
      return (
        coincideNumero && coincideNombre && coincideCorreo && coincideTelefono
      );
    });
    setCajerosFiltrados(infoFiltrada);
    await fetchCajerosStatus(false, inactiveActive, busqueda);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busqueda]);

  const debouncedBuscar = useMemo(() => debounce(Buscar, 500), [Buscar]);

  const fetchCajerosStatus = async (
    showMesssage, 
    inactiveActive,
    busqueda
  ) => {
    const { tb_id, tb_desc, tb_correo, tb_tel } = busqueda;
    let infoFiltrada = [];
    let active = 0;
    let inactive = 0;

    if(tb_id || tb_desc || tb_correo || tb_tel){
      infoFiltrada = inactiveActive.filter((cajero) => {
        const coincideNumero = tb_id
          ? cajero["numero"].toString().includes(tb_id)
          : true;
        const coincideNombre = tb_desc
          ? cajero["nombre"]
              .toString()
              .toLowerCase()
              .includes(tb_desc.toLowerCase())
          : true;
        const coincideCorreo = tb_correo
          ? cajero["mail"]
              .toString()
              .toLowerCase()
              .includes(tb_correo.toLowerCase())
          : true;
        const coincideTelefono = tb_tel
          ? cajero["telefono"].toString().includes(tb_tel)
          : true;
        return coincideNumero && coincideNombre && coincideCorreo && coincideTelefono;
      });
      active = infoFiltrada.filter((c) => c.baja !== "*").length;
      inactive = infoFiltrada.filter((c) => c.baja === "*").length;
    } else {
      active = inactiveActive.filter((c) => c.baja !== "*").length;
      inactive = inactiveActive.filter((c) => c.baja === "*").length;
    }
    setActive(active);
    setInactive(inactive);
    if(showMesssage){
      showSwalConfirm(
        "Estado de los cajeros",
        `Cajeros activos: ${active}\nCajeros inactivos: ${inactive}`,
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
        ? `Nuevo Cajero: ${currentID}`
        : accion === "Editar"
        ? `Editar Cajero: ${currentID}`
        : accion === "Eliminar"
        ? `Eliminar Cajero: ${currentID}`
        : `Ver Cajero: ${currentID}`
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accion, currentID]);

  useEffect(() => {
    reset({
      numero: cajero.numero,
      nombre: cajero.nombre,
      direccion: cajero.direccion,
      colonia: cajero.colonia,
      telefono: cajero.telefono,
      estado: cajero.estado,
      fax: cajero.fax,
      mail: cajero.mail,
      clave_cajero: cajero.clave_cajero,
    });
  }, [cajero, reset]);

  const limpiarBusqueda = () => {
    const search = { tb_id: "", tb_desc: "", tb_correo: "", tb_tel: "" };
    setBusqueda({ tb_id: "", tb_desc: "", tb_correo: "", tb_tel: "" });
    return search;
  };

  const Alta = async () => {
    setCurrentId("");
    const { token } = session.user;
    reset({
      numero: "",
      nombre: "",
      direccion: "",
      colonia: "",
      estado: "",
      telefono: "",
      fax: "",
      mail: "",
      clave_cajero: "",
    });

    setCajero({ numero: "" });
    setModal(!openModal);
    setAccion("Alta");
    showModal(true);

    document.getElementById("nombre").focus();
  };

  const onSubmitModal = handleSubmit(async (data) => {
    event.preventDefault;
    if (!validateBeforeSave("clave_cajero", "my_modal_3")) {
      return;
  }
    setisLoadingButton(true);
    accion === "Alta" ? (data.numero = "") : (data.numero = currentID);
    let res = null;
    
    if (accion === "Eliminar") {
      showModal(false);
      const confirmed = await confirmSwal(
        "¿Desea Continuar?",
        "Se eliminara el cajero seleccionado",
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

    res = await guardaCajero(session.user.token, data, accion);
    if (res.status) {
      if (accion === "Alta") {
        data.numero = res.data;
        setCurrentId(data.numero);
        const nuevaCajero = { currentID, ...data };
        setCajeros([...cajeros, nuevaCajero]);
        if (!bajas) {
          setCajerosFiltrados([...cajerosFiltrados, nuevaCajero]);
        }
      }
      if (accion === "Eliminar" || accion === "Editar") {
        const index = cajeros.findIndex((c) => c.numero === data.numero);
        if (index !== -1) {
          if (accion === "Eliminar") {
            const cFiltrados = cajeros.filter((c) => c.numero !== data.numero);
            setCajeros(cFiltrados);
            setCajerosFiltrados(cFiltrados);
          } else {
            if (bajas) {
              const cFiltrados = cajeros.filter(
                (c) => c.numero !== data.numero
              );
              setCajeros(cFiltrados);
              setCajerosFiltrados(cFiltrados);
            } else {
              const cActualizadas = cajeros.map((c) =>
                c.numero === currentID ? { ...c, ...data } : c
              );
              setCajeros(cActualizadas);
              setCajerosFiltrados(cActualizadas);
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
      await fetchCajerosStatus(false, inactiveActive, busqueda);
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

  const tableAction = (evt, cajero, accion) => {
    evt.preventDefault();
    setCajero(cajero);
    setAccion(accion);
    setCurrentId(cajero.numero);
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
    fetchCajerosStatus,
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
    cajerosFiltrados,
    titulo,
    reload_page,
    isDisabled,
    errors,
    inactiveActive
  };
        
};