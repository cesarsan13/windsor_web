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
    guardaProfesorBaja
} from "@/app/utils/api/profesores/profesores";
import { showSwal, confirmSwal, showSwalConfirm } from "@/app/utils/alerts";
import { useEscapeWarningModal, validateBeforeSave } from "@/app/utils/globalfn";

export const useProfesoresABC = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [profesores, setProfesores] = useState([]);
    const [profesor, setProfesor] = useState({});
    const [profesoresFiltrados, setProfesoresFiltrados] = useState(null);
    const [inactiveActive, setInactiveActive] = useState([]);
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
        trigger,
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
      const fetchData = async () => {
        setisLoading(true);
        const { token, permissions } = session.user;
        const es_admin = session.user?.es_admin || false; // Asegúrate de que exista
        const menuSeleccionado = Number(localStorage.getItem("puntoMenu"));
        const busqueda = limpiarBusqueda();
        const data = await getProfesores(token, bajas);
        const res = await inactiveActiveBaja(session?.user.token, "profesores");
        setProfesores(data);
        setProfesoresFiltrados(data);
        setInactiveActive(res.data);
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
  }, [status, bajas, reload_page]);
    
    useEffect(() => {
        profesoresRef.current = profesores; // Actualiza el ref cuando profesores cambia
    }, [profesores]);
    
    const Buscar = useCallback( async () => {
      const { tb_numero, tb_nombre } = busqueda;
      if (tb_numero === "" && tb_nombre === "") {
        setProfesoresFiltrados(profesoresRef.current);
        await fetchProfesorStatus(false, inactiveActive, busqueda);
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
      await fetchProfesorStatus(false, inactiveActive, busqueda);
      
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [busqueda]);

    const debouncedBuscar = useMemo(() => debounce(Buscar, 500), [Buscar]);

    const fetchProfesorStatus = async (
      showMesssage, 
      inactiveActive,
      busqueda
    ) => {
      const { tb_numero, tb_nombre } = busqueda;
      let infoFiltrada = [];
      let active = 0;
      let inactive = 0;

      if(tb_numero || tb_nombre){
        infoFiltrada = inactiveActive.filter((profesor) => {
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
            ? `Reactivar Profesor: ${currentID}`
            : accion === "Reactivar"
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
      const search = { tb_numero: "", tb_nombre: "" };
        setBusqueda({ tb_numero: "", tb_nombre: "" });
      return search;
    };

    const Alta = async () => {
        setCurrentId("");
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
        setProfesor({ numero: "" });
        setModal(!openModal);
        setAccion("Alta");
        showModal(true);
        document.getElementById("nombre").focus();
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
          showSwal(res.alert_title, res.alert_text, res.alert_icon);
          showModal(false);
        } else {
          showSwal(res.alert_title, res.alert_text, res.alert_icon, "my_modal_3");
        }
        if (accion === "Alta" || accion === "Eliminar") {
          setReloadPage(!reload_page);
          await fetchProfesorStatus(false, inactiveActive, busqueda);
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

      const handleReactivar = async (evt, profesoresr) => {
        evt.preventDefault();
        const confirmed = await confirmSwal(
          "¿Desea reactivar este profesor?",
          "El profesor será reactivado y volverá a estar activo.",
          "warning",
          "Sí, reactivar",
          "Cancelar"
        );
      
        if (confirmed) {
          const res = await guardaProfesor(session.user.token, { 
            ...profesoresr, 
            contraseña: "",
            baja: ""
          }, "Editar");
      
          if (res.status) {
            const updatedProfesores = profesores.map((c) =>
              c.numero === profesores.numero ? { ...c, contraseña:"", baja: "" } : c
            );
      
            setProfesores(updatedProfesores);
            setProfesoresFiltrados(updatedProfesores);
      
            showSwal("Reactivado", "El profesor ha sido reactivado correctamente.", "success");
            setReloadPage((prev) => !prev);
          } else {
            showSwal("Error", "No se pudo reactivar el profesor.", "error");
          }
        }
      };

    const tableAction = (evt, profesor, accion) => {
        evt.preventDefault();
        setProfesor(profesor);
        setAccion(accion);
        setCurrentId(profesor.numero);
        if (accion === "Reactivar") {
          handleReactivar(evt, profesor);
          
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
        inactiveActive
    };
};