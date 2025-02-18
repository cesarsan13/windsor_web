import React, { useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { inactiveActiveBaja } from "@/app/utils/GlobalApis";
import { debounce, permissionsComponents } from "@/app/utils/globalfn";
import {
    getProfesores,
    guardaProfesor,
    siguiente
} from "@/app/utils/api/profesores/profesores";
import { showSwal, confirmSwal, showSwalAndWait, showSwalConfirm } from "@/app/utils/alerts";

export const useProfesoresABC = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [profesores, setProfesores] = useState([]);
    const [profesor, setProfesor] = useState({});
    const [profesoresFiltrados, setProfesoresFiltrados] = useState(null);
    const [bajas, setBajas] = useState(false);
    const [openModal, setModal] = useState(false);
    const [accion, setAccion] = useState("");
    const [isLoading, setisLoading] = useState(false);
    const [isLoadingButton, setisLoadingButton] = useState(false);
    const [currentID, setCurrentId] = useState("");
    const profesoresRef = useRef(profesores);
    const [permissions, setPermissions] = useState({});
    const [titulo, setTitulo] = useState("");
    const [isDisabled, setIsDisabled] = useState(true);
    const [reload_page, setReloadPage] = useState(false);
    const [active, setActive] = useState(false);
    const [inactive, setInactive] = useState(false);
    const [busqueda, setBusqueda] = useState({
        tb_numero: "",
        tb_nombre: "",
    });

     const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
      } = useForm({
        defaultValues: {
          numero: profesor.numero,
          nombre: profesor.nombre,
          nombre_completo: profesor.nombre_completo,
          ap_paterno: profesor.ap_paterno,
          ap_materno: profesor.ap_materno,
          direccion: profesor.direccion,
          colonia: profesor.colonia,
          ciudad: profesor.ciudad,
          estado: profesor.estado,
          cp: profesor.cp,
          pais: profesor.pais,
          rfc: profesor.rfc,
          telefono_1: profesor.telefono_1,
          telefono_2: profesor.telefono_2,
          fax: profesor.fax,
          celular: profesor.celular,
          email: profesor.email,
          contraseña: "",
        },
    });
    
    useEffect(() => {
        profesoresRef.current = profesores; // Actualiza el ref cuando profesores cambia
    }, [profesores]);
    
    const Buscar = useCallback(() => {
      const { tb_numero, tb_nombre } = busqueda;
      if (tb_numero === "" && tb_nombre === "") {
        setProfesoresFiltrados(profesoresRef.current);
        fetchProfesorStatus(false, profesoresRef.current);
        return;
      }
      const infoFiltrada = profesoresRef.current.filter((profesor) => {
        const coincideID = tb_numero
          ? profesor["numero"].toString().includes(tb_numero)
          : true;
        const coincideNombre = tb_nombre
          ? profesor["nombre"]
            .toString()
            .toLowerCase()
            .includes(tb_nombre.toLowerCase())
          : true;
        return coincideID && coincideNombre;
      });
      setProfesoresFiltrados(infoFiltrada);
      fetchProfesorStatus(false, infoFiltrada);
    }, [busqueda]);

    const debouncedBuscar = useMemo(() => debounce(Buscar, 500), [Buscar]);

    const fetchProfesorStatus = async (showMesssage, profesoresFiltrados) => {
      const active = profesoresFiltrados?.filter((c) => c.baja !== "*").length;
      const inactive = profesoresFiltrados?.filter((c) => c.baja === "*").length;
        setActive(active);
        setInactive(inactive);
        if(showMesssage){
          showSwalConfirm(
            "Estado de los profesores",
            `Profesores activos: ${active}\nProfesores inactivos: ${inactive}`,
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
        const fetchData = async () => {
          setisLoading(true);
          const { token, permissions } = session.user;
          const es_admin = session.user?.es_admin || false; // Asegúrate de que exista
          const menuSeleccionado = Number(localStorage.getItem("puntoMenu"));
          const busqueda = limpiarBusqueda();
          const data = await getProfesores(token, bajas);
          const res = await inactiveActiveBaja(session?.user.token, "profesores")
          setProfesores(data);
          setProfesoresFiltrados(data);
          const permisos = permissionsComponents(
            es_admin,
            permissions,
            session.user.id,
            menuSeleccionado
          );
          await fetchProfesorStatus(false, res.data, busqueda);
          setPermissions(permisos);
          setisLoading(false);
        };
        if (status === "loading" || !session) {
          return;
        }
        fetchData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session, status, bajas, reload_page]);

    useEffect(() => {
        if (accion === "Eliminar" || accion === "Ver") {
          setIsDisabled(true);
        }
        if (accion === "Alta" || accion === "Editar") {
          setIsDisabled(false);
        }
        setTitulo(
          accion === "Alta"
            ? `Nuevo Profesor`
            : accion === "Editar"
            ? `Editar Profesor: ${currentID}`
            : accion === "Eliminar"
            ? `Eliminar Profesor: ${currentID}`
            : `Ver Profesor: ${currentID}`
        );
    }, [accion, currentID]);

    useEffect(() => {
        reset({
          numero: profesor.numero,
          nombre: profesor.nombre,
          nombre_completo: profesor.nombre_completo,
          ap_paterno: profesor.ap_paterno,
          ap_materno: profesor.ap_materno,
          direccion: profesor.direccion,
          colonia: profesor.colonia,
          ciudad: profesor.ciudad,
          estado: profesor.estado,
          cp: profesor.cp,
          pais: profesor.pais,
          rfc: profesor.rfc,
          telefono_1: profesor.telefono_1,
          telefono_2: profesor.telefono_2,
          fax: profesor.fax,
          celular: profesor.celular,
          email: profesor.email,
          contraseña: "",
        });
    }, [profesor, reset]);

    const limpiarBusqueda = () => {
        setBusqueda({ tb_numero: "", tb_nombre: "" });
    };

    const Alta = async (event) => {
        setCurrentId("");
        const { token } = session.user;
        reset({
          numero: "",
          nombre: "",
          nombre_completo: "",
          ap_paterno: "",
          ap_materno: "",
          direccion: "",
          colonia: "",
          ciudad: "",
          estado: "",
          cp: "",
          pais: "",
          rfc: "",
          telefono_1: "",
          telefono_2: "",
          fax: "",
          celular: "",
          email: "",
          contraseña: "",
        });
        let siguienteId = await siguiente(token);
        siguienteId = Number(siguienteId) + 1;
        setCurrentId(siguienteId);
        setProfesor({ numero: siguienteId });
        setModal(!openModal);
        setAccion("Alta");
        showModal(true);
    
        document.getElementById("nombre").focus();
    };

    const onSubmitModal = handleSubmit(async (data) => {
        event.preventDefault();
        setisLoadingButton(true);
        data.numero = currentID;
        let res = null;
        if (accion === "Eliminar") {
          showModal(false);
          const confirmed = await confirmSwal(
            "¿Desea Continuar?",
            "Se eliminara el profesor seleccionado",
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
        data.nombre_completo = `${data.nombre} ${data.ap_paterno} ${data.ap_materno}`
        res = await guardaProfesor(session.user.token, data, accion);
        if (res.status) {
          if (accion === "Alta") {
            const nuevaProfesor = { currentID, ...data };
            setProfesores([...profesores, nuevaProfesor]);
            if (!bajas) {
              setProfesoresFiltrados([...profesoresFiltrados, nuevaProfesor]);
            }
          }
          if (accion === "Eliminar" || accion === "Editar") {
            const index = profesores.findIndex((fp) => fp.numero === data.numero);
            if (index !== -1) {
              if (accion === "Eliminar") {
                const fpFiltrados = profesores.filter(
                  (fp) => fp.numero !== data.numero
                );
                setProfesores(fpFiltrados);
                setProfesoresFiltrados(fpFiltrados);
              } else {
                if (bajas) {
                  const fpFiltrados = profesores.filter(
                    (fp) => fp.numero !== data.numero
                  );
                  setProfesores(fpFiltrados);
                  setProfesoresFiltrados(fpFiltrados);
                } else {
                  const fpActualizadas = profesores.map((fp) =>
                    fp.numero === currentID ? { ...fp, ...data } : fp
                  );
                  setProfesores(fpActualizadas);
                  setProfesoresFiltrados(fpActualizadas);
                }
              }
            }
          }
          showModal(false);
          showSwal(res.alert_title, res.alert_text, res.alert_icon);
        } else {
          showModal(false);
          await showSwalAndWait(res.alert_title, res.alert_text, res.alert_icon);
          showModal(true);
        }
        if (accion === "Alta" || accion === "Eliminar") {
          await fetchProfesorStatus(false);
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
      setBusqueda((estadoPrevio) => ({
        ...estadoPrevio,
        [event.target.id]: event.target.value,
      }));
    };

    const tableAction = (evt, profesores, accion) => {
        evt.preventDefault();
        setProfesores(profesores);
        setAccion(accion);
        setCurrentId(profesores.numero);
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
        fetchProfesorStatus,
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
        profesoresFiltrados,
        titulo,
        reload_page,
        isDisabled,
        errors,
    };
};