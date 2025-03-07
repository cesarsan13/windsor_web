import { useCallback, useRef, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { inactiveActiveBaja } from "@/app/utils/GlobalApis";
import { debounce, permissionsComponents } from "@/app/utils/globalfn";
import {
    getClases,
    guardaClase
} from "@/app/utils/api/clases/clases";
import { showSwal, confirmSwal, showSwalConfirm } from "@/app/utils/alerts";
import { useEscapeWarningModal, validateBeforeSave } from "@/app/utils/globalfn";


export const useClasesABC = (

) => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [clases, setClases] = useState([]);
    const [clase, setClase] = useState({});
    const [clasesFiltrados, setClasesFiltrados] = useState(null);
    const [bajas, setBajas] = useState(false);
    const [openModal, setModal] = useState(false);
    const [accion, setAccion] = useState("");
    const [grado, setGrado] = useState({});
    const [materia, setMateria] = useState({});
    const [profesor, setProfesor] = useState({});
    const [vGrado, setVGrado] = useState(null);
    const [vMateria, setVMateria] = useState(null);
    const [vProfesor, setVProfesor] = useState(null);
    const [isLoadingButton, setisLoadingButton] = useState(false);
    const [isLoading, setisLoading] = useState(false);
    const clasesRef = useRef(clases);
    const [currentID, setCurrentId] = useState("");
    const [contador, setContador] = useState(0);
    const [permissions, setPermissions] = useState({});
    const [busqueda, setBusqueda] = useState({
        tb_grupo: "",
        tb_materia: "",
        tb_profesor: "",
    });
    const [active, setActive] = useState(false);
    const [inactive, setInactive] = useState(false);
    const [inactiveActive, setInactiveActive] = useState([]);
    const [reload_page, setReloadPage] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);
    const [isDisabledBusca, setIsDisabledBusca] = useState(true);
    const [titulo, setTitulo] = useState("");
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
      } = useForm({
        defaultValues: {
          grupo: clase.grupo,
          materia: clase.materia,
          profesor: clase.profesor,
          lunes: clase.lunes,
          martes: clase.martes,
          miercoles: clase.miercoles,
          jueves: clase.jueves,
          viernes: clase.viernes,
          sabado: clase.sabado,
          domingo: clase.domingo,
        },
    });

    useEffect(() => {
        const fetchData = async () => {
          setisLoading(true);
          let { token, permissions } = session.user;
          const es_admin = session.user.es_admin;
          const menuSeleccionado = Number(localStorage.getItem("puntoMenu"));
          const busqueda = limpiarBusqueda();
          const data = await getClases(token, bajas);
          const res = await inactiveActiveBaja(session?.user.token, "clases");
          setClases(data);
          setClasesFiltrados(data);
          setInactiveActive(res.data);
          const permisos = permissionsComponents(
            es_admin,
            permissions,
            session.user.id,
            menuSeleccionado
          );
          await fetchClasesStatus(res.data, busqueda);
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
        clasesRef.current = clases;
    }, [clases]);
    
    useEffect(() => {
    }, [vGrado, vMateria, vProfesor]);

    const Buscar = useCallback(async () => {
        const { tb_grupo, tb_materia, tb_profesor } = busqueda;
        if (tb_grupo === "" && tb_materia === "" && tb_profesor === "") {
          setClasesFiltrados(clasesRef.current);
          await fetchClasesStatus(inactiveActive, busqueda);
          return;
        }
        const infoFiltrada = clasesRef.current.filter((clase) => {
          const coincideGrupo = tb_grupo
            ? clase["grupo_descripcion"]
                ?.toString()
                .toLowerCase()
                .includes(tb_grupo.toLowerCase())
            : true;
          const coincideMateria = tb_materia
            ? clase["materia_descripcion"]
                ?.toString()
                .toLowerCase()
                .includes(tb_materia.toLowerCase())
            : true;
          const coincideProfesor = tb_profesor
            ? clase["profesor_nombre"]
                ?.toString()
                .toLowerCase()
                .includes(tb_profesor.toLowerCase())
            : true;
          return coincideGrupo && coincideMateria && coincideProfesor;
        });
        setClasesFiltrados(infoFiltrada);
        await fetchClasesStatus(inactiveActive, busqueda);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [busqueda]);

    const debouncedBuscar = useMemo(() => debounce(Buscar, 500), [Buscar])

    const fetchClasesStatus = async (
        inactiveActive,
        busqueda
    ) => {
        const { tb_grupo, tb_materia, tb_profesor } = busqueda;
        let infoFiltrada = [];
        let active = 0;
        let inactive = 0;

        if (tb_grupo || tb_materia || tb_profesor) {
            infoFiltrada = inactiveActive.filter((clase) => {
                const coincideGrupo = tb_grupo
                  ? clase["grupo_descripcion"]
                      ?.toString()
                      .toLowerCase()
                      .includes(tb_grupo.toLowerCase())
                  : true;
                const coincideMateria = tb_materia
                  ? clase["materia_descripcion"]
                      ?.toString()
                      .toLowerCase()
                      .includes(tb_materia.toLowerCase())
                  : true;
                const coincideProfesor = tb_profesor
                  ? clase["profesor_nombre"]
                      ?.toString()
                      .toLowerCase()
                      .includes(tb_profesor.toLowerCase())
                  : true;
                return coincideGrupo && coincideMateria && coincideProfesor;
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
        if (accion === "Alta") {
          setIsDisabledBusca(false);
        } else if (accion === "Editar" || accion === "Ver" || accion === "Editar") {
          setIsDisabledBusca(true);
        }
        setTitulo(
          accion === "Alta"
            ? `Nueva Clase ${currentID}`
            : accion === "Editar"
              ? `Editar Clase: ${currentID}`
              : accion === "Eliminar"
                ? `Eliminar Clase: ${currentID}`
                : `Ver Clase: ${currentID}`
        );
    }, [accion, currentID]);

    useEffect(() => {
        reset({
          grupo: clase.grupo,
          materia: clase.materia,
          profesor: clase.profesor,
          lunes: clase.lunes,
          martes: clase.martes,
          miercoles: clase.miercoles,
          jueves: clase.jueves,
          viernes: clase.viernes,
          sabado: clase.sabado,
          domingo: clase.domingo,
        });
    }, [clase, reset]);

    const limpiarBusqueda = () => {
        const search = { tb_grupo: "", tb_materia: "", tb_profesor: "" };
        setBusqueda({ tb_grupo: "", tb_materia: "", tb_profesor: "" });
        return search;
    };

    const Alta = async (event) => {
        setCurrentId("");
        setContador((prevCount) => prevCount + 1); // Cambia la clave para re-renderizar los buscat
        reset({
          grupo: "",
          materia: "",
          profesor: "",
          lunes: "",
          martes: "",
          miercoles: "",
          jueves: "",
          viernes: "",
          sabado: "",
          domingo: "",
        });
        setModal(!openModal);
        setAccion("Alta");
        showModal(true);
        setMateria({});
        setProfesor({});
        setGrado({});
        document.getElementById("lunes").focus();
    };

    const onSubmitModal = handleSubmit(async (data) => {
        event.preventDefault();        
        const isProfesorValid = profesor && Object.keys(profesor).length === 0;
        const isMateriaValid = materia && Object.keys(materia).length === 0;
        const isGradoValid = grado && Object.keys(grado).length === 0;
        if(!isProfesorValid && !isMateriaValid && !isGradoValid){
            if (!currentID) {
              const claseExistente = clases.find(
                (clase) =>
                  clase.grupo === data.grupo &&
                  clase.materia === data.materia &&
                  clase.profesor === data.profesor &&
                  clase.id !== currentID
              );
              if (claseExistente) {
                showSwal(
                  "Error",
                  "Esta combinación de grupo, materia y profesor ya está registrada.",
                  "error",
                  "my_modal_3"
                );
                return;
              }
            }
            setisLoadingButton(true);
            let res = null;
            if (accion === "Eliminar") {
              showModal(false);
              const confirmed = await confirmSwal(
                "¿Desea Continuar?",
                "Se eliminara la clase seleccionada",
                "warning",
                "Aceptar",
                "Cancelar"
              );
              if (!confirmed) {
                showModal(true);
                return;
              }
            }

            data.grupo = grado.numero ?? clase.grupo;
            data.grupo_descripcion = grado.horario ?? clase.grupo_descripcion;
            data.materia = materia.numero ?? clase.materia;
            data.materia_descripcion = materia.descripcion ?? clase.materia_descripcion;
            data.profesor = profesor.numero ?? clase.profesor;
            data.profesor_nombre = profesor.nombre_completo ?? clase.profesor_nombre;
            res = await guardaClase(session.user.token, data, accion);
            if (res.status) {
              if (accion === "Alta") {
                const nuevaClase = { currentID, ...data };
                setClases([...clases, nuevaClase]);
                if (!bajas) {
                  setClasesFiltrados([...clasesFiltrados, nuevaClase]);
                }
              } else if (accion === "Eliminar" || accion === "Editar") {
                const index = clases.findIndex(
                  (c) => c.grupo === data.grupo && c.materia === data.materia
                );
                if (index !== -1) {
                  if (accion === "Eliminar") {
                    const cFiltrados = clases.filter(
                      (c) => c.grupo !== data.grupo || c.materia !== data.materia
                    );
                    setClases(cFiltrados);
                    setClasesFiltrados(cFiltrados);
                  } else {
                    if (bajas) {
                      const cFiltrados = clases.filter(
                        (c) => c.grupo !== data.grupo || c.materia !== data.materia
                      );
                      setClases(cFiltrados);
                      setClasesFiltrados(cFiltrados);
                    } else {
                      const cActualizadas = clases.map((c) =>
                        c.grupo === data.grupo && c.materia === data.materia
                          ? { ...c, ...data }
                          : c
                      );
                      setClases(cActualizadas);
                      setClasesFiltrados(cActualizadas);
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
                await fetchClasesStatus(inactiveActive, busqueda);
            }
            setVGrado(null);
            setVMateria(null);
            setVProfesor(null);
            setisLoadingButton(false);
        } else {
            showSwal("Error", "Complete todos los campos requeridos", "error", "my_modal_3");
            setVProfesor(isProfesorValid);
            setVMateria(isMateriaValid);
            setVGrado(isGradoValid);  
        }
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
        event.preventDefault;
        setBusqueda((estadoPrevio) => ({
          ...estadoPrevio,
          [event.target.id]: event.target.value,
        }));
    };

    const handleReactivar = async (evt, claser) => {
        evt.preventDefault();
        const confirmed = await confirmSwal(
          "¿Desea reactivar esta Clase?",
          "La clase será reactivada y volverá a estar activa.",
          "warning",
          "Sí, reactivar",
          "Cancelar"
        );

        if (confirmed) {
          const res = await guardaClase(session.user.token, { 
            ...claser, 
            baja: ""
          }, "Editar");
          
          if (res.status) {
            const cActualizadas = clases.map((c) =>
                c.grupo === claser.grupo && c.materia === claser.materia
                  ? { ...c, baja: "" }
                  : c
            );
            setClases(cActualizadas);
            setClasesFiltrados(cActualizadas);
      
            showSwal("Reactivado", "La clase ha sido reactivada correctamente.", "success");
            setReloadPage((prev) => !prev);
          } else {
            showSwal("Error", "No se pudo reactivar la clase.", "error");
          }
        }
    };

    const tableAction = (evt, fclases, accion) => {
        evt.preventDefault();
        setClase(fclases);
        setAccion(accion);
        setCurrentId(fclases.numero);
        if (accion === "Reactivar") {
            handleReactivar(evt, fclases);
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
        fetchClasesStatus,
        setReloadPage,
        setisLoadingButton,
        tableAction,
        register,
        setGrado,
        setMateria,
        setProfesor,
        status,
        session,
        isLoadingButton,
        isLoading,
        accion,
        permissions,
        active,
        inactive,
        busqueda,
        clasesFiltrados,
        titulo,
        reload_page,
        isDisabled,
        errors,
        inactiveActive,
        clase,
        contador,
        isDisabledBusca,
        vGrado, 
        vMateria, 
        vProfesor,
    };

};
