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
  siguiente
} from "@/app/utils/api/cajeros/cajeros";
import { showSwal, confirmSwal, showSwalConfirm } from "@/app/utils/alerts";
export const useCajerosABC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [cajeros, setCajeros] = useState([]);
  const [cajero, setCajero] = useState({});
  const [cajerosFiltrados, setCajerosFiltrados] = useState(null);
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
    cajerosRef.current = cajeros;
  }, [cajeros]);
    
  const Buscar = useCallback(() => {
    const { tb_id, tb_desc, tb_correo, tb_tel } = busqueda;
    if (tb_id === "" && tb_desc === "" && tb_correo === "" && tb_tel === "") {
      setCajerosFiltrados(cajerosRef.current);
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
  }, [busqueda]);

  const debouncedBuscar = useMemo(() => debounce(Buscar, 500), [Buscar]);

  const fetchCajerosStatus = async (showMesssage) => {
    const res = await inactiveActiveBaja(session.user.token, "cajeros");
    if (res.status) {
      const { inactive, active } = res.data;
      setActive(active);
      setInactive(inactive);
      showMesssage === true
        ? showSwalConfirm(
            "Estado de los cajeros",
            `Cajeros activos: ${active}\nCajeros inactivos: ${inactive}`,
            "info"
          )
        : "";
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
    const fetchData = async () => {
      setisLoading(true);
      let { token, permissions } = session.user;
      const es_admin = session.user?.es_admin || false; // Asegúrate de que exista
      const menuSeleccionado = Number(localStorage.getItem("puntoMenu"));
      limpiarBusqueda();
      const data = await getCajeros(token, bajas);
      await fetchCajerosStatus(false);
      setCajeros(data);
      setCajerosFiltrados(data);
      setisLoading(false);
      const permisos = permissionsComponents(
        es_admin,
        permissions,
        session.user.id,
        menuSeleccionado
      );
      console.log("a", permisos);
      setPermissions(permisos);
    };
    if (status === "loading" || !session) {
      return;
    }
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, bajas, reload_page]);

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
  }, [accion]);

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

  const limpiarBusqueda = (evt) => {
    setBusqueda({ tb_id: "", tb_desc: "", tb_correo: "", tb_tel: "" });
  };

  const Alta = async (event) => {
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
    let siguienteId = await siguiente(token);
    siguienteId = Number(siguienteId) + 1;
    setCurrentId(siguienteId);
    setCajero({ numero: siguienteId });
    setModal(!openModal);
    setAccion("Alta");
    showModal(true);

    document.getElementById("nombre").focus();
  };

  const onSubmitModal = handleSubmit(async (data) => {
    event.preventDefault;
    setisLoadingButton(true);;
    data.id = currentID;
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
      await fetchCajerosStatus(false);
    }
    setisLoadingButton(false);
  });

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
  };
        
};