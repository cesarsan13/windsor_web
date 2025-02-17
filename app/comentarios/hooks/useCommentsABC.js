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
export const useCommentsABC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formasComentarios, setFormasComentarios] = useState([]);
  const [formaComentarios, setFormaComentarios] = useState({});
  const [formaComentariosFiltrados, setFormaComentariosFiltrados] =
    useState(null);
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
    comentariosRef.current = formasComentarios;
  }, [formasComentarios]);

  const Buscar = useCallback(() => {
    const { tb_numero, tb_comentario1 } = busqueda;
    if (tb_numero === "" && tb_comentario1 === "") {
      setFormaComentariosFiltrados(comentariosRef.current);
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
  }, [busqueda]);

  const debouncedBuscar = useMemo(() => debounce(Buscar, 500), [Buscar]);

  const fetchComentarioStatus = async (showMesssage) => {
    const res = await inactiveActiveBaja(session.user.token, "comentarios");
    if (res.status) {
      const { inactive, active } = res.data;
      setActive(active);
      setInactive(inactive);
      showMesssage === true
        ? showSwalConfirm(
            "Estado de los comentarios",
            `Comentarios activos: ${active}\nComentarios inactivos: ${inactive}`,
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
      const es_admin = session.user?.es_admin || false;
      const menuSeleccionado = Number(localStorage.getItem("puntoMenu"));
      limpiarBusqueda();
      const data = await getComentarios(token, bajas);
      await fetchComentarioStatus(false);
      setFormasComentarios(data);
      setFormaComentariosFiltrados(data);
      const permisos = permissionsComponents(
        es_admin,
        permissions,
        session.user.id,
        menuSeleccionado
      );
      setPermissions(permisos);
      setisLoading(false);
    };
    if (status === "loading" || !session) {
      return;
    }
    fetchData();
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
    setBusqueda({ tb_numero: "", tb_comentario1: "" });
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
      await fetchComentarioStatus(false);
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
  };
};
