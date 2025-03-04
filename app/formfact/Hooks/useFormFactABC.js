import { useCallback, useRef, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { inactiveActiveBaja } from "@/app/utils/GlobalApis";
import { debounce, permissionsComponents } from "@/app/utils/globalfn";
import { getPropertyData } from "@/app/utils/api/formfact/formfact";
import { showSwal, confirmSwal, showSwalConfirm } from "@/app/utils/alerts";
import {
  getFacturasFormato,
  getFormFact,
  guardaFormFact,
} from "@/app/utils/api/formfact/formfact";
import { useEscapeWarningModal, validateBeforeSave } from "@/app/utils/globalfn";

export const useFormFactABC = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [formFacts, setFormFacts] = useState([]); //formasPago
    const [formFact, setFormFact] = useState({}); //formaPago
    const [formFactsFiltrados, setFormFactsFiltrados] = useState(null);
    const [inactiveActive, setInactiveActive] = useState([]);
    const [bajas, setBajas] = useState(false);
    const [openModal, setModal] = useState(false);
    const [accion, setAccion] = useState("");
    const [isLoading, setisLoading] = useState(false);
    const [isLoadingButton, setisLoadingButton] = useState(false);
    const [currentID, setCurrentId] = useState("");
    const formFactsRef = useRef(formFacts);
    const [permissions, setPermissions] = useState({});
    const [titulo, setTitulo] = useState("");
    const [isDisabled, setIsDisabled] = useState(true);
    const [reload_page, setReloadPage] = useState(false);
    const [active, setActive] = useState(false);
    const [inactive, setInactive] = useState(false);
    const [busqueda, setBusqueda] = useState({ 
        tb_id: "", 
        tb_desc: "" 
    });
    const [formato, setFormato] = useState("");
    const [showSheet, setShowSheet] = useState(false);
    const [labels, setLabels] = useState([]);
    const [propertyData, setPropertyData] = useState({});

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        trigger,
      } = useForm({
        defaultValues: {
          numero_forma: formFact.numero_forma,
          nombre_forma: formFact.nombre_forma,
          longitud: formFact.longitud,
        },
    });

      useEffect(() => {
        const fetchData = async () => {
          setisLoading(true);
          let { token, permissions } = session.user;
          const es_admin = session.user?.es_admin || false; // Asegúrate de que exista
          const menuSeleccionado = Number(localStorage.getItem("puntoMenu"));
          const busqueda = limpiarBusqueda();
          const data = await getFormFact(token, bajas);
          const res = await inactiveActiveBaja(session?.user.token, "facturas_formas");
          setFormFacts(data);
          setFormFactsFiltrados(data);
          setInactiveActive(res.data);
          const permisos = permissionsComponents(
            es_admin,
            permissions,
            session.user.id,
            menuSeleccionado
          );
          await fetchFormFactStatus(false, res.data, busqueda);
          setPermissions(permisos);
          setisLoading(false);
        };
        if (status === "loading" || !session) {
          return;
        }
        fetchData();
        setFormato("Facturas");
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, bajas, reload_page]);

    useEffect(() => {
        formFactsRef.current = formFacts;
    }, [formFacts]);

    const Buscar = useCallback(async() => {
        const { tb_id, tb_desc } = busqueda;
        if (tb_id === "" && tb_desc === "") {
          setFormFactsFiltrados(formFactsRef.current);
          await fetchFormFactStatus(false, inactiveActive, busqueda);
          return;
        }
        const infoFiltrada = formFactsRef.current.filter((formFact) => {
          const coincideId = tb_id
            ? formFact["numero_forma"].toString().includes(tb_id)
            : true;
          const coincideDescripcion = tb_desc
            ? formFact["nombre_forma"]
                .toString()
                .toLowerCase()
                .includes(tb_desc.toLowerCase())
            : true;
          return coincideId && coincideDescripcion;
        });
        setFormFactsFiltrados(infoFiltrada);
        await fetchFormFactStatus(false, inactiveActive, busqueda);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [busqueda]);

    const debouncedBuscar = useMemo(() => debounce(Buscar, 500), [Buscar]);
    
    const fetchFormFactStatus = async (
        showMesssage,
        inactiveActive,
        busqueda
    ) => {
        const { tb_id, tb_desc } = busqueda;
        let infoFiltrada = [];
        let active = 0;
        let inactive = 0;
        if(tb_id || tb_desc) { 
            infoFiltrada = inactiveActive.filter((formFact) => {
                const coincideId = tb_id
                    ? formFact["numero_forma"].toString().includes(tb_id)
                    : true;
                const coincideDescripcion = tb_desc
                    ? formFact["nombre_forma"]
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
        if(showMesssage){
            showSwalConfirm(
                "Estado de las Formas Facturas",
                `Formas activas: ${active}\nFormas inactivas: ${inactive}`,
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
            ? `Nueva Factura`
            : accion === "Editar"
            ? `Editar Factura: ${currentID}`
            : accion === "Eliminar"
            ? `Eliminar Factura: ${currentID}`
            : `Ver Factura: ${currentID}`
            ? `Reactivar Horario: ${currentID}`
            : accion == "Reactivar"
        );
    }, [accion, currentID]);

    useEffect(() => {
        reset({
          numero_forma: formFact.numero_forma,
          nombre_forma: formFact.nombre_forma,
          longitud: formFact.longitud,
        });
    }, [formFact, reset]);

    const limpiarBusqueda = () => {
        const search = { tb_id: "", tb_desc: "" };
        setBusqueda({ tb_id: "", tb_desc: "" });
        return search;
    };

    const Alta = async () => {
        setCurrentId("");
        reset({
          numero_forma: "",
          nombre_forma: "",
          longitud: "",
        });
        setFormFact({ numero_forma: "" });
        setModal(!openModal);
        setAccion("Alta");
        showModal(true);
        document.getElementById("nombre_forma").focus();
    };

    const onSubmitModal = handleSubmit(async (data) => {
        event.preventDefault;
        setisLoadingButton(true);
        accion === "Alta" ? (data.numero_forma = "") : (data.numero_forma = currentID);
        let res = null;
        if (accion === "Eliminar") {
          showModal(false);
          const confirmed = await confirmSwal(
            "¿Desea Continuar?",
            "Se eliminara el forma factura seleccionado",
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
        res = await guardaFormFact(session.user.token, data, accion);
        if (res.status) {
          if (accion === "Alta") {
            data.numero_forma = res.data;
            setCurrentId(data.numero_forma);
            const nuevaFormFact = { currentID, ...data };
            setFormFacts([...formFacts, nuevaFormFact]);
            if (!bajas) {
              setFormFactsFiltrados([...formFactsFiltrados, nuevaFormFact]);
            }
          }
          if (accion === "Eliminar" || accion === "Editar") {
            const index = formFacts.findIndex(
              (c) => c.numero_forma === data.numero_forma
            );
            if (index !== -1) {
              if (accion === "Eliminar") {
                const formFiltrados = formFacts.filter(
                  (c) => c.numero_forma !== data.numero_forma
                );
                setFormFacts(formFiltrados);
                setFormFactsFiltrados(formFiltrados);
              } else {
                if (bajas) {
                  const formFiltrados = formFacts.filter(
                    (c) => c.numero_forma !== data.numero_forma
                  );
                  setFormFacts(formFiltrados);
                  setFormFactsFiltrados(formFiltrados);
                } else {
                  const formActualizadas = formFacts.map((c) =>
                    c.numero_forma === currentID ? { ...c, ...data } : c
                  );
                  setFormFacts(formActualizadas);
                  setFormFactsFiltrados(formActualizadas);
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
            await fetchFormFactStatus(false, inactiveActive, busqueda);
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
        event.preventDefault;
        setBusqueda((estadoPrevio) => ({
          ...estadoPrevio,
          [event.target.id]: event.target.value,
        }));
    };

    const fetchFacturasFormato = async (id) => {
        const { token } = session.user;
        const facturas = await getFacturasFormato(token, id);
        setLabels(facturas);
    };

    const handleReactivar = async (evt, formfactr) => {
        evt.preventDefault();
        const confirmed = await confirmSwal(
          "¿Desea reactivar esta Forma Factura?",
          "La Forma Factura será reactivado y volverá a estar activo.",
          "warning",
          "Sí, reactivar",
          "Cancelar"
        );
      
        if (confirmed) {
          const res = await guardaFormFact(session.user.token, { 
            ...formfactr, 
            baja: ""
          }, "Editar");
      
          if (res.status) {
            const updatedFormFact = formFacts.map((c) =>
              c.numero === formfactr.numero ? { ...c, baja: "" } : c
            );
            setFormFacts(updatedFormFact);
            setFormFactsFiltrados(updatedFormFact);
      
            showSwal("Reactivado", "La Forma Factura ha sido reactivada correctamente.", "success");
            setReloadPage((prev) => !prev);
          } else {
            showSwal("Error", "No se pudo reactivar la Forma Factura.", "error");
          }
        }
    };

    const tableAction = (evt, formFact, accion) => {
        evt.preventDefault();
        setFormFact(formFact);
        setAccion(accion);
        setCurrentId(formFact.numero_forma);
        if (accion === "ActualizaFormato") {
          fetchFacturasFormato(formFact.numero_forma);
          setShowSheet(true);
        } else if (accion === "Reactivar"){
          handleReactivar(evt, formFact);
        } else {
          showModal(true);
        }
    };

    useEffect(() => {
        if (formato === "") {
          return;
        }
        const data = getPropertyData(formato);
        setPropertyData(data);
    }, [formato]);



    return{
        onSubmitModal,
        Buscar,
        Alta,
        home,
        setBajas,
        limpiarBusqueda,
        handleBusquedaChange,
        fetchFormFactStatus,
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
        formFactsFiltrados,
        titulo,
        reload_page,
        isDisabled,
        errors,
        inactiveActive,
        showSheet,
        labels,
        propertyData,
        formato,
        setFormato,
        setLabels,
        setShowSheet,
        currentID
    };
};