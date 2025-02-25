import { useCallback, useRef, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { inactiveActiveBaja } from "@/app/utils/GlobalApis";
import { debounce, permissionsComponents } from "@/app/utils/globalfn";
import { showSwal, confirmSwal, showSwalConfirm } from "@/app/utils/alerts";
import {
    getFormasPago,
    guardaFormaPAgo,
} from "@/app/utils/api/formapago/formapago";

export const useFormaPagoABC = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [formasPago, setFormasPago] = useState([]);
    const [formaPago, setFormaPago] = useState({});
    const [formaPagosFiltrados, setFormaPagosFiltrados] = useState(null);
    const [inactiveActive, setInactiveActive] = useState([]);
    const [bajas, setBajas] = useState(false);
    const [openModal, setModal] = useState(false);
    const [accion, setAccion] = useState("");
    const [isLoading, setisLoading] = useState(false);
    const [isLoadingButton, setisLoadingButton] = useState(false);
    const [currentID, setCurrentId] = useState("");
    const formasPagoRef = useRef(formasPago);
    const [permissions, setPermissions] = useState({});
    const [titulo, setTitulo] = useState("");
    const [isDisabled, setIsDisabled] = useState(true);
    const [reload_page, setReloadPage] = useState(false);
    const [active, setActive] = useState(false);
    const [inactive, setInactive] = useState(false);
    const [busqueda, setBusqueda] = useState({
        tb_id:"",
        tb_desc: ""
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
          numero: formaPago.numero,
          descripcion: formaPago.descripcion,
          comision: formaPago.comision,
          aplicacion: formaPago.aplicacion,
          cue_banco: formaPago.cue_banco,
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            setisLoading(true);
            const { token, permissions } = session.user;
            const es_admin = session.user?.es_admin || false; // Asegúrate de que exista
            const menu_seleccionado = Number(localStorage.getItem("puntoMenu"));
            const busqueda = limpiarBusqueda();
            const data = await getFormasPago(token, bajas);
            const res = await inactiveActiveBaja(session?.user.token, "tipo_cobro");            
            setFormasPago(data);
            setFormaPagosFiltrados(data);
            setInactiveActive(res.data);
            const permisos = permissionsComponents(
                es_admin, 
                permissions, 
                session.user.id, 
                menu_seleccionado
            );
            await fetchFormaPagoStatus(false, res.data, busqueda);
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
        formasPagoRef.current = formasPago;
    }, [formasPago]);

    const Buscar = useCallback(async () => {
        const { tb_id, tb_desc } = busqueda;
        if (tb_id === "" && tb_desc === "") {
          setFormaPagosFiltrados(formasPagoRef.current);
          await fetchFormaPagoStatus(false, inactiveActive, busqueda);
          return;
        }
        const infoFiltrada = formasPagoRef.current.filter((formapago) => {
          const coincideId = tb_id
            ? formapago["numero"].toString().includes(tb_id)
            : true;
          const coincideDescripcion = tb_desc
            ? formapago.descripcion.toLowerCase().includes(tb_desc.toLowerCase())
            : true;
          return coincideId && coincideDescripcion;
        });
        setFormaPagosFiltrados(infoFiltrada);
        await fetchFormaPagoStatus(false, inactiveActive, busqueda);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [busqueda]);

    const debouncedBuscar = useMemo(() => debounce(Buscar, 500), [Buscar]);

    const fetchFormaPagoStatus = async (
        showMesssage,
        inactiveActive,
        busqueda
    ) => {
        const { tb_id, tb_desc } = busqueda;
        let infoFiltrada = [];
        let active = 0;
        let inactive = 0;

        if(tb_id || tb_desc){
            infoFiltrada = formasPagoRef.current.filter((formapago) => {
                const coincideId = tb_id
                  ? formapago["numero"].toString().includes(tb_id)
                  : true;
                const coincideDescripcion = tb_desc
                  ? formapago.descripcion.toLowerCase().includes(tb_desc.toLowerCase())
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
                "Estado de las Formas de Pago",
                `Formas de Pago activas: ${active}\nFormas de Pago inactivas: ${inactive}`,
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
            ? `Nueva Forma de Pago`
            : accion === "Editar"
            ? `Editar Forma de Pago: ${currentID}`
            : accion === "Eliminar"
            ? `Eliminar Forma de Pago: ${currentID}`
            : `Ver Forma de Pago: ${currentID}`
        );
    }, [accion, currentID]);

    useEffect(() => {
        reset({
          numero: formaPago.numero,
          descripcion: formaPago.descripcion,
          comision: formaPago.comision,
          aplicacion: formaPago.aplicacion,
          cue_banco: formaPago.cue_banco,
        });
    }, [formaPago, reset]);

    const limpiarBusqueda = () => {
        const search = {
            tb_id: "", 
            tb_desc: "" 
        };
        setBusqueda({ tb_id: "", tb_desc: "" });
        return search;
    };

    const Alta = async () => {
        setCurrentId("");
        reset({
          numero: "",
          descripcion: "",
          comision: "",
          aplicacion: "",
          cue_banco: "",
        });
        setFormaPago({ numero: "" });
        setModal(!openModal);
        setAccion("Alta");
        showModal(true);
        document.getElementById("descripcion").focus();
    };

    const validateBeforeSave = () => {
      const lastInput = document.querySelector("input[name='cue_banco']");
      if (lastInput && lastInput.value.trim() === "") {
      showSwal("Error", "Complete todos los campos requeridos", "error", "my_modal_3");
        return false;
      }
      return true;
  };

    const onSubmitModal = handleSubmit(async (data) => {
        event.preventDefault;
        if (!validateBeforeSave()) return;
        setisLoadingButton(true);
        accion === "Alta" ? (data.numero = "") : (data.numero = currentID);
        let res = null;
        if (accion === "Eliminar") {
          showModal(false);
          const confirmed = await confirmSwal(
            "¿Desea Continuar?",
            "Se eliminara la forma de pago seleccionada",
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
        res = await guardaFormaPAgo(session.user.token, data, accion);
        if (res.status) {
          if (accion === "Alta") {
            data.numero = res.data;
            setCurrentId(data.numero);
            const nuevaFormaPago = { currentID, ...data };
            setFormasPago([...formasPago, nuevaFormaPago]);
            if (!bajas) {
              setFormaPagosFiltrados([...formaPagosFiltrados, nuevaFormaPago]);
            }
          }
          if (accion === "Eliminar" || accion === "Editar") {
            const index = formasPago.findIndex((fp) => fp.numero === data.numero);
            if (index !== -1) {
              if (accion === "Eliminar") {
                const fpFiltrados = formasPago.filter(
                  (fp) => fp.numero !== data.numero
                );
                setFormasPago(fpFiltrados);
                setFormaPagosFiltrados(fpFiltrados);
              } else {
                if (bajas) {
                  const fpFiltrados = formasPago.filter(
                    (fp) => fp.numero !== data.numero
                  );
                  setFormasPago(fpFiltrados);
                  setFormaPagosFiltrados(fpFiltrados);
                } else {
                  const fpActualizadas = formasPago.map((fp) =>
                    fp.numero === currentID ? { ...fp, ...data } : fp
                  );
                  setFormasPago(fpActualizadas);
                  setFormaPagosFiltrados(fpActualizadas);
                }
              }
            }
          }
          showSwal(res.alert_title, res.alert_text, res.alert_icon);
          showModal(false);
        }else{
          showSwal(res.alert_title, res.alert_text, res.alert_icon,"my_modal_3");
        }
        if (accion === "Alta" || accion === "Eliminar") {
            setReloadPage(!reload_page);
            await fetchFormaPagoStatus(false, inactiveActive, busqueda);
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

    const tableAction = (evt, formaPago, accion) => {
        evt.preventDefault();
        setFormaPago(formaPago);
        setAccion(accion);
        setCurrentId(formaPago.numero);
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
        fetchFormaPagoStatus,
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
        formaPagosFiltrados,
        titulo,
        reload_page,
        isDisabled,
        errors,
        inactiveActive,
    };
};
