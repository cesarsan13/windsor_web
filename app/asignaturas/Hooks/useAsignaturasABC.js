import { useCallback, useRef, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { inactiveActiveBaja } from "@/app/utils/GlobalApis";
import { debounce, permissionsComponents, snToBool } from "@/app/utils/globalfn";
import {
    getAsignaturas,
    guardarAsinatura,
} from "@/app/utils/api/asignaturas/asignaturas";
import { showSwal, confirmSwal, showSwalConfirm } from "@/app/utils/alerts";
import { useEscapeWarningModal, validateBeforeSave } from "@/app/utils/globalfn";

export const useAsignaturasABC = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [asignaturas, setAsignaturas] = useState([]);
    const [asignatura, setAsignatura] = useState({});
    const [asignaturasFiltrados, setAsignaturasFiltrados] = useState(null);
    const [inactiveActive, setInactiveActive] = useState([]);
    const [bajas, setBajas] = useState(false);
    const [openModal, setModal] = useState(false);
    const [accion, setAccion] = useState("");
    const [isLoading, setisLoading] = useState(false);
    const [isLoadingButton, setisLoadingButton] = useState(false);
    const [currentID, setCurrentId] = useState("");
    const asignaturasRef = useRef(asignaturas);
    const [permissions, setPermissions] = useState({});
    const [titulo, setTitulo] = useState("");
    const [isDisabled, setIsDisabled] = useState(true);
    const [reload_page, setReloadPage] = useState(false)
    const [active, setActive] = useState(false);
    const [inactive, setInactive] = useState(false);
    const [busqueda, setBusqueda] = useState({ 
        tb_id: "", tb_desc: "" 
    });

    const {
        register,
        handleSubmit,
        reset,
        //watch,
        //setValue,
        //getValues,
        formState: { errors },
        trigger,
      } = useForm({
        defaultValues: {
          numero: asignatura.numero,
          descripcion: asignatura.descripcion,
          evaluaciones: asignatura.evaluaciones,
          actividad: asignatura.actividad,
          area: asignatura.area,
          orden: asignatura.orden,
          lenguaje: asignatura.lenguaje,
          caso_evaluar: asignatura.caso_evaluar,
        },
    });

    useEffect(() => {
        const fetchData = async () => {
          setisLoading(true);
          const { token, permissions } = session.user;
          const es_admin = session.user?.es_admin || false; // Asegúrate de que exista
          const menuSeleccionado = Number(localStorage.getItem("puntoMenu"));
          const busqueda = limpiarBusqueda();
          const data = await getAsignaturas(token, bajas);
          const res = await inactiveActiveBaja(session?.user.token, "asignaturas");
          setAsignaturas(data);
          setAsignaturasFiltrados(data);
          setInactiveActive(res.data);
          const permisos = permissionsComponents(
            es_admin, 
            permissions, 
            session.user.id, 
            menuSeleccionado
          );
          await fetchAsignaturaStatus(false, res.data, busqueda);
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
        asignaturasRef.current = asignaturas;
    }, [asignaturas]);

    const Buscar = useCallback(async () => {
        const { tb_id, tb_desc } = busqueda;
        if (tb_id === "" && tb_desc === "") {
          setAsignaturasFiltrados(asignaturasRef.current);
          await fetchAsignaturaStatus(false, inactiveActive, busqueda);
          return;
        }
        const infoFiltrada = asignaturasRef.current.filter((asignatura) => {
          const coincideId = tb_id
            ? asignatura["numero"].toString().includes(tb_id)
            : true;
          const coincideDescripcion = tb_desc
            ? asignatura["descripcion"]
              .toString()
              .toLowerCase()
              .includes(tb_desc.toLowerCase())
            : true;
          return coincideId && coincideDescripcion;
        });
        setAsignaturasFiltrados(infoFiltrada);
        await fetchAsignaturaStatus(false, inactiveActive, busqueda);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [busqueda]);
    
    const debouncedBuscar = useMemo(() => debounce(Buscar, 500), [Buscar]);
    
    const fetchAsignaturaStatus = async (
        showMesssage,
        inactiveActive,
        busqueda
    ) => {
        const { tb_id, tb_desc } = busqueda;
        let infoFiltrada = [];
        let active = 0;
        let inactive = 0;
        if (tb_id === "" || tb_desc === "") {
            infoFiltrada = inactiveActive.filter((asignatura) => {
                const coincideId = tb_id
                  ? asignatura["numero"].toString().includes(tb_id)
                  : true;
                const coincideDescripcion = tb_desc
                  ? asignatura["descripcion"]
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
                "Estado de las asignaturas",
                `Asignaturas activas: ${active}\nAsignaturas inactivas: ${inactive}`,
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
            ? `Nueva Asignatura`
            : accion === "Editar"
            ? `Editar Asignatura: ${currentID}`
            : accion === "Eliminar"
            ? `Eliminar Asignatura: ${currentID}`
            : `Ver Asignatura: ${currentID}`
        );
      }, [accion, currentID]);

    useEffect(() => {
          reset({
            numero: asignatura.numero,
            descripcion: asignatura.descripcion,
            evaluaciones: asignatura.evaluaciones,
            actividad: asignatura.actividad,
            area: asignatura.area,
            orden: asignatura.orden,
            lenguaje: asignatura.lenguaje,
            caso_evaluar: asignatura.caso_evaluar,
          });
    }, [asignatura, reset]);

    const limpiarBusqueda = () => {
        const search = { tb_id: "", tb_desc: "" };
        setBusqueda({ tb_id: "", tb_desc: "" });
        return search;
    };

    const Alta = async () => {
        setCurrentId("");
        reset({
          numero: 0,
          descripcion: "",
          evaluaciones: 0,
          actividad: snToBool(""),
          area: 0,
          orden: 0,
          lenguaje: "",
          caso_evaluar: "",
        });
        setAsignatura({ numero: "" });
        setModal(!openModal);
        setAccion("Alta");
        showModal(true);
        document.getElementById("descripcion").focus();
    };

     const Elimina_Comas = (data) => {
    const convertir = (asignatura) => {
      const asignaturaConvertido = { ...asignatura };

      for (const key in asignaturaConvertido) {
        if (
          typeof asignaturaConvertido[key] === "string" &&
          asignaturaConvertido[key].match(/^\d{1,3}(,\d{3})*(\.\d+)?$/)
        ) {
          asignaturaConvertido[key] = parseFloat(
            asignaturaConvertido[key].replace(/,/g, "")
          );
        }
      }

      return asignaturaConvertido;
    };

    if (Array.isArray(data)) {
      return data.map(convertir);
    } else {
      return convertir(data);
    }
  };

    const onSubmitModal = handleSubmit(async (data) => {
        event.preventDefault;
        if (!validateBeforeSave("caso_evaluar", "my_modal_3")) {
          return;
      }
        setisLoadingButton(true);
        accion === "Alta" ? (data.numero = "") : (data.numero = currentID);
        let res = null;
        if (accion === "Eliminar") {
          showModal(false);
          const confirmed = await confirmSwal(
            "¿Desea Continuar?",
            "Se eliminara la asignatura seleccionada",
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
        data = await Elimina_Comas(data);
        res = await guardarAsinatura(session.user.token, data, accion, data.numero);
    
        if (res.status) {
          if (accion === "Alta") {
            data.numero = res.data;
            const nuevasAsignaturas = { currentID, ...data };
            setAsignaturas([...asignaturas, nuevasAsignaturas]);
            if (!bajas) {
              setAsignaturasFiltrados([...asignaturasFiltrados, nuevasAsignaturas]);
            }
          }
          if (accion === "Eliminar" || accion === "Editar") {
            const index = asignaturas.findIndex((p) => p.numero === data.numero);
            if (index !== -1) {
              if (accion === "Eliminar") {
                const aFiltrados = asignaturas.filter(
                  (p) => p.numero !== data.numero
                );
                setAsignaturas(aFiltrados);
                setAsignaturasFiltrados(aFiltrados);
              } else {
                if (bajas) {
                  const aFiltrados = asignaturas.filter(
                    (p) => p.numero !== data.numero
                  );
                  setAsignaturas(aFiltrados);
                  setAsignaturasFiltrados(aFiltrados);
                } else {
                  const aActualizadas = asignaturas.map((p) =>
                    p.numero === currentID ? { ...p, ...data } : p
                  );
                  setAsignaturas(aActualizadas);
                  setAsignaturasFiltrados(aActualizadas);
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
            setReloadPage(!setReloadPage);
          await fetchAsignaturaStatus(false, inactiveActive, busqueda);
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

    const handleBusquedaChange = (event) => {
        event.preventDefault();
        setBusqueda((estadoPrevio) => ({
          ...estadoPrevio,
          [event.target.id]: event.target.value,
        }));
    };

    const tableAction = (evt, asignatura, accion) => {
        evt.preventDefault();
        asignatura.actividad = snToBool(asignatura.actividad);
        setAsignatura(asignatura);
        setAccion(accion);
        setCurrentId(asignatura.numero);
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
        fetchAsignaturaStatus,
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
        asignaturasFiltrados,
        titulo,
        reload_page,
        isDisabled,
        errors,
        inactiveActive
    };


};