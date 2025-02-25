import { useCallback, useRef, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { inactiveActiveBaja } from "@/app/utils/GlobalApis";
import { debounce, permissionsComponents } from "@/app/utils/globalfn";
import {
  getComentarios,
  guardaComentarios,
} from "@/app/utils/api/comentarios/comentarios";
import { showSwal, confirmSwal, showSwalConfirm } from "@/app/utils/alerts";
import { useEscapeWarningModal, validateBeforeSave } from "@/app/utils/globalfn";

export const useCommentsABC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formasComentarios, setFormasComentarios] = useState([]);
  const [formaComentarios, setFormaComentarios] = useState({});
  const [formaComentariosFiltrados, setFormaComentariosFiltrados] =
    useState(null);
  const [inactiveActive, setInactiveActive] = useState([]);
  const [bajas, setBajas] = useState(false);
  const [openModal, setModal] = useState(false);
  const [accion, setAccion] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [isLoadingButton, setisLoadingButton] = useState(false);
  const [currentID, setCurrentId] = useState("");
  const comentariosRef = useRef(formasComentarios);
  const [permissions, setPermissions] = useState({});
  const [titulo, setTitulo] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [reload_page, setReloadPage] = useState(false);
  const [active, setActive] = useState(false);
  const [inactive, setInactive] = useState(false);
  const [busqueda, setBusqueda] = useState({
    tb_numero: "",
    tb_comentario1: "",
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      numero: formaComentarios.numero,
      comentario_1: formaComentarios.comentario_1,
      comentario_2: formaComentarios.comentario_2,
      comentario_3: formaComentarios.comentario_3,
      generales: formaComentarios.generales,
    },
  });
 
  useEffect(() => {
    const fetchData = async () => {
      setisLoading(true);
      let { token, permissions } = session.user;
      const es_admin = session.user?.es_admin || false;
      const menuSeleccionado = Number(localStorage.getItem("puntoMenu"));
      const busqueda = limpiarBusqueda();
      const data = await getComentarios(token, bajas);
      const res = await inactiveActiveBaja(session?.user.token, "comentarios");
      setFormasComentarios(data);
      setFormaComentariosFiltrados(data);
      setInactiveActive(res.data);
      const permisos = permissionsComponents(
        es_admin,
        permissions,
        session.user.id,
        menuSeleccionado
      );
      await fetchComentarioStatus(false, res.data, busqueda);
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
    comentariosRef.current = formasComentarios;
  }, [formasComentarios]);

  const Buscar = useCallback(async () => {
    const { tb_numero, tb_comentario1 } = busqueda;
    if (tb_numero === "" && tb_comentario1 === "") {
      setFormaComentariosFiltrados(comentariosRef.current);
      await fetchComentarioStatus(false, inactiveActive, busqueda);
      return;
    }
    const infoFiltrada = comentariosRef.current.filter((formaComentarios) => {
      const coincideID = tb_numero
        ? formaComentarios["numero"].toString().includes(tb_numero)
        : true;
      const coincideComentario1 = tb_comentario1
        ? formaComentarios["comentario_1"]
            .toString()
            .toLowerCase()
            .includes(tb_comentario1.toLowerCase())
        : true;
      return coincideID && coincideComentario1;
    });
    setFormaComentariosFiltrados(infoFiltrada);
    await fetchComentarioStatus(false, inactiveActive, busqueda);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busqueda]);

  const debouncedBuscar = useMemo(() => debounce(Buscar, 500), [Buscar]);

  const fetchComentarioStatus = async (
    showMesssage,
    inactiveActive,
    busqueda
  ) => {
    const { tb_numero, tb_comentario1 } = busqueda;
    let infoFiltrada = [];
    let active = 0;
    let inactive = 0;
    if (tb_numero || tb_comentario1) {
      infoFiltrada = inactiveActive.filter((formaComentarios) => {
        const coincideID = tb_numero
          ? formaComentarios["numero"].toString().includes(tb_numero)
          : true;
        const coincideComentario1 = tb_comentario1
          ? formaComentarios["comentario_1"]
              .toString()
              .toLowerCase()
              .includes(tb_comentario1.toLowerCase())
          : true;
        return coincideID && coincideComentario1;
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
        "Estado de los comentarios",
        `Comentarios activos: ${active}\nComentarios inactivos: ${inactive}`,
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
        ? `Nuevo Comentario`
        : accion === "Editar"
        ? `Editar Comentario: ${currentID}`
        : accion === "Eliminar"
        ? `Eliminar Comentario: ${currentID}`
        : `Ver Comentario: ${currentID}`
    );
  }, [accion, currentID]);

  useEffect(() => {
    reset({
      numero: formaComentarios.numero,
      comentario_1: formaComentarios.comentario_1,
      comentario_2: formaComentarios.comentario_2,
      comentario_3: formaComentarios.comentario_3,
      generales: formaComentarios.generales,
    });
  }, [formaComentarios, reset]);

  const limpiarBusqueda = () => {
    const search = {
      tb_numero: "",
      tb_comentario1: "",
    };
    setBusqueda({ tb_numero: "", tb_comentario1: "" });
    return search;
  };

  const Alta = async () => {
    setCurrentId("");
    reset({
      numero: "",
      comentario_1: "",
      comentario_2: "",
      comentario_3: "",
      generales: "",
    });
    setFormaComentarios({ numero: "" });
    setModal(!openModal);
    setAccion("Alta");
    showModal(true);
    document.getElementById("comentario_1").focus();
  };

  const onSubmitModal = handleSubmit(async (data) => {
    event.preventDefault();
    if (!validateBeforeSave("comentario_3", "my_modal_3")) {
      return;
  }
    setisLoadingButton(true);
    accion === "Alta" ? (data.numero = "") : (data.numero = currentID);
    let res = null;
    if (accion === "Eliminar") {
      showModal(false);
      const confirmed = await confirmSwal(
        "¿Desea Continuar?",
        "Se eliminara el comentario seleccionado",
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
    res = await guardaComentarios(session.user.token, data, accion);
    if (res.status) {
      if (accion === "Alta") {
        data.numero = res.data;
        setCurrentId(data.numero);
        const nuevaFormaComentarios = { currentID, ...data };
        setFormasComentarios([...formasComentarios, nuevaFormaComentarios]);
        if (!bajas) {
          setFormaComentariosFiltrados([
            ...formaComentariosFiltrados,
            nuevaFormaComentarios,
          ]);
        }
      }
      if (accion === "Eliminar" || accion === "Editar") {
        const index = formasComentarios.findIndex(
          (fp) => fp.numero === data.numero
        );
        if (index !== -1) {
          if (accion === "Eliminar") {
            const fpFiltrados = formasComentarios.filter(
              (fp) => fp.numero !== data.numero
            );
            setFormasComentarios(fpFiltrados);
            setFormaComentariosFiltrados(fpFiltrados);
          } else {
            if (bajas) {
              const fpFiltrados = formasComentarios.filter(
                (fp) => fp.numero !== data.numero
              );
              setFormasComentarios(fpFiltrados);
              setFormaComentariosFiltrados(fpFiltrados);
            } else {
              const fpActualizadas = formasComentarios.map((fp) =>
                fp.numero === currentID ? { ...fp, ...data } : fp
              );
              setFormasComentarios(fpActualizadas);
              setFormaComentariosFiltrados(fpActualizadas);
            }
          }
        }
      }
      showSwal(res.alert_title, res.alert_text, res.alert_icon);
      showModal(false);
    } else {
      showSwal(res.alert_title, res.alert_text, res.alert_icon, "my_modal_3");
    }
    if (accion === "Alta" || accion === "Eliminar") {
      setReloadPage(!reload_page);
      await fetchComentarioStatus(false, inactiveActive, busqueda);
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

  const handleBusquedaChange = async (event) => {
    event.preventDefault();
    setBusqueda((estadoPrevio) => ({
      ...estadoPrevio,
      [event.target.id]: event.target.value,
    }));
  };

  const tableAction = (evt, formaComentarios, accion) => {
    evt.preventDefault();
    setFormaComentarios(formaComentarios);
    setAccion(accion);
    setCurrentId(formaComentarios.numero);
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
    fetchComentarioStatus,
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
    formaComentariosFiltrados,
    titulo,
    reload_page,
    isDisabled,
    errors,
    inactiveActive,
  };
};