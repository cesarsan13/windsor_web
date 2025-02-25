import { useCallback, useRef, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { inactiveActiveBaja } from "@/app/utils/GlobalApis";
import { debounce, permissionsComponents } from "@/app/utils/globalfn";
import {
    getUsuarios,
    guardaUsuario,
} from "@/app/utils/api/usuarios/usuarios";
import { showSwal, confirmSwal} from "@/app/utils/alerts";

export const useUsuariosABC = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [usuarios, setUsuarios] = useState([]);
    const [usuario, setUsuario] = useState({});
    const [usuariosFiltrados, setUsuariosFiltrados] = useState(null);
    const [inactiveActive, setInactiveActive] = useState([]);
    const [bajas, setBajas] = useState(false);
    const [openModal, setModal] = useState(false);
    const [accion, setAccion] = useState("");
    const [isLoading, setisLoading] = useState(false);
    const [isLoadingButton, setisLoadingButton] = useState(false);
    const [currentID, setCurrentId] = useState("");
    const usuariosRef = useRef(usuarios);
    const [permissions, setPermissions] = useState({});
    const [titulo, setTitulo] = useState("");
    const [isDisabled, setIsDisabled] = useState(true);
    const [reload_page, setReloadPage] = useState(false);
    const [active, setActive] = useState(false);
    const [inactive, setInactive] = useState(false);
    const [busqueda, setBusqueda] = useState({
        tb_id: "",
        tb_name: "",
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        watch,
    } = useForm({
        defaultValues: {
          id: usuario.id,
          nombre: usuario.nombre,
          name: usuario.name,
          email: usuario.email,
          password: usuario.password,
          match_password: usuario.match_password,
        },
    });

      useEffect(() => {
        const fetchData = async () => {
          setisLoading(true);
          const { token, permissions } = session.user;
          const es_admin = session.user.es_admin || false;
          const menuSeleccionado = Number(localStorage.getItem("puntoMenu"));
          const busqueda = limpiarBusqueda();
          const data = await getUsuarios(token, bajas);
          const res = await inactiveActiveBaja(session?.user.token, "users");
          setUsuarios(data);
          setUsuariosFiltrados(data);
          setInactiveActive(res.data);
          const permisos = permissionsComponents(
            es_admin,
            permissions,
            session.user.id,
            menuSeleccionado
          );
          await fetchUsuariosStatus(res.data, busqueda);
          setPermissions(permisos);
          setisLoading(false);
        };
      
        if (status === "loading" || !session) {
          return;
        }
        fetchData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ status, bajas, reload_page]);

    useEffect(() => {
        usuariosRef.current = usuarios;
    }, [usuarios]);

    const Buscar = useCallback(async () => {
        const { tb_id, tb_name } = busqueda;
    
        if (tb_id === "" && tb_name === "") {
          setUsuariosFiltrados(usuariosRef.current);
          await fetchUsuariosStatus(inactiveActive, busqueda);
          return;
        }
        const infoFiltrada = usuariosRef.current.filter((fusuarios) => {
          const coincideID = tb_id
            ? fusuarios["id"].toString().includes(tb_id)
            : true;
          const coincideusuario = tb_name
            ? fusuarios["name"]
                .toString()
                .toLowerCase()
                .includes(tb_name.toLowerCase())
            : true;
          return coincideID && coincideusuario;
        });
        setUsuariosFiltrados(infoFiltrada);
        await fetchUsuariosStatus(inactiveActive, busqueda);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [busqueda]);

    const debouncedBuscar = useMemo(() => debounce(Buscar, 500), [Buscar]);

    const fetchUsuariosStatus = async (
        inactiveActive,
        busqueda
    ) => {
        const { tb_id, tb_name } = busqueda;

        let infoFiltrada = [];
        let active = 0;
        let inactive = 0;

        if (tb_id || tb_name) {
            infoFiltrada = inactiveActive.filter((fusuarios) => {
                const coincideID = tb_id
                  ? fusuarios["id"].toString().includes(tb_id)
                  : true;
                const coincideusuario = tb_name
                  ? fusuarios["name"]
                      .toString()
                      .toLowerCase()
                      .includes(tb_name.toLowerCase())
                  : true;
                return coincideID && coincideusuario;
            });
            active = infoFiltrada.filter((c) => c.baja !== "*").length;
            inactive = infoFiltrada.filter((c) => c.baja === "*").length;
        } else {
            active = inactiveActive.filter((c) => c.baja !== "*").length;
            inactive = inactiveActive.filter((c) => c.baja === "*").length;
        }
        setActive(active);
        setInactive(inactive);
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
            ? `Nuevo Usuario`
            : accion === "Editar"
            ? `Editar Usuario: ${currentID}`
            : accion === "Eliminar"
            ? `Eliminar Usuario: ${currentID}`
            : `Ver Usuario: ${currentID}`
        );
    }, [accion, currentID]);

    useEffect(() => {
        reset({
          id: usuario.id,
          nombre: usuario.nombre,
          name: usuario.name,
          email: usuario.email,
          password: usuario.password,
          match_password: usuario.match_password,
        });
    }, [usuario, reset]);

    const limpiarBusqueda = () => {
        const search = {tb_id: "", tb_name: ""};
        setBusqueda({ tb_id: "", tb_name: "" });
        return search;
    };

    const Alta = async () => {
        setCurrentId("");
        reset({
          id: "",
          name: "",
          nombre: "",
          email: "",
          password: "",
          match_password: "",
        });
        setUsuario({ id: "" });
        setModal(!openModal);
        setAccion("Alta");
        showModal(true);
        document.getElementById("name").focus();
    };

    const validateBeforeSave = () => {
        const lastInput = document.querySelector("input[name='match_password']");
        if (lastInput && lastInput.value.trim() === "") {
        showSwal("Error", "Complete todos los campos requeridos", "error", "my_modal_3");
          return false;
        }
        return true;
    };

    const onSubmitModal = handleSubmit(async (data) => {
        event.preventDefault();
        if (!validateBeforeSave()) return;
        setisLoadingButton(true);
        accion === "Alta" ? (data.id = "") : (data.id = currentID);
        const password1 = watch("password", "");
        const password2 = watch("match_password", "");
    
        if (password1 !== password2) {
            showSwal(
                "Error de Validación",
                "Las contraseñas no coinciden",
                "error",
                "my_modal_3"
            );
            setisLoadingButton(false);
            return;
        } else {
            if (
                (accion === "Alta" || accion === "Editar") &&
                (password1 === "" || password2 === "")
            ) {
                showSwal(
                "Error de Validación",
                "Por favor capture las contraseñas",
                "error",
                "my_modal_3"
                );
                setisLoadingButton(false);
                return;
            }
    
            let res = null;
    
            if (accion === "Eliminar") {
                showModal(false);
                const confirmed = await confirmSwal(
                "¿Desea Continuar?",
                "Se eliminara al usuario seleccionado",
                "warning",
                "Aceptar",
                "Cancelar",
                );
                if (!confirmed) {
                    showModal(true);
                    setisLoadingButton(false);
                    return;
                }
            }
    
            data.numero_prop = 1;
    
            res = await guardaUsuario(session.user.token, data, accion);
            if (res.status) {
                if (accion === "Alta") {
                    data.id = res.data;
                    setCurrentId(data.id);
                    const nuevoUsuarios = { currentID, ...data };
                    setUsuarios([...usuarios, nuevoUsuarios]);
                    if (!bajas) {
                        setUsuariosFiltrados([...usuariosFiltrados, nuevoUsuarios]);
                    }
                }
                if (accion === "Eliminar" || accion === "Editar") {
                    const index = usuarios.findIndex((fp) => fp.id === data.id);
                    if (index !== -1) {
                        if (accion === "Eliminar") {
                            const fpFiltrados = usuarios.filter((fp) => fp.id !== data.id);
                            setUsuarios(fpFiltrados);
                            setUsuariosFiltrados(fpFiltrados);
                        } else {
                            if (bajas) {
                                const fpFiltrados = usuarios.filter((fp) => fp.id !== data.id);
                                setUsuarios(fpFiltrados);
                                setUsuariosFiltrados(fpFiltrados);
                            } else {
                                const fpActualizadas = usuarios.map((fp) =>
                                    fp.id === currentID ? { ...fp, ...data } : fp
                                );
                                setUsuarios(fpActualizadas);
                                setUsuariosFiltrados(fpActualizadas);
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
                await fetchUsuariosStatus(inactiveActive, busqueda);
            }
            setisLoadingButton(false);
        }
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
        event.preventDefault();
        setBusqueda((estadoPrevio) => ({
          ...estadoPrevio,
          [event.target.id]: event.target.value,
        }));
    };

    const tableAction = (evt, usuario, accion) => {
        evt.preventDefault();
        setUsuario(usuario);
        setAccion(accion);
        setCurrentId(usuario.id);
        showModal(true);
    };


    return{
        onSubmitModal,
        Buscar,
        Alta,
        home,
        setBajas,
        limpiarBusqueda,
        handleBusquedaChange,
        fetchUsuariosStatus,
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
        usuariosFiltrados,
        titulo,
        reload_page,
        isDisabled,
        errors,
        inactiveActive,
    };

};