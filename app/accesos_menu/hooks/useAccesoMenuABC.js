import { useCallback, useRef, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { debounce, permissionsComponents } from "@/app/utils/globalfn";
import {
  getMenus,
  siguiente,
  guardaMenu,
} from "@/app/utils/api/accesos_menu/accesos_menu";
import { showSwal, confirmSwal } from "@/app/utils/alerts";
import { getMenus as getmenu } from "@/app/utils/api/menus/menus";
import {
  getSubMenusApi,
} from "@/app/utils/api/sub_menus/sub_menus";
import {
  useEscapeWarningModal,
  validateBeforeSave,
} from "@/app/utils/globalfn";
import { inactiveActiveBaja } from "@/app/utils/GlobalApis";

export const useAccesoMenuABC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [menus, setMenus] = useState([]);
  const [menu, setMenu] = useState({});
  const [subMenu, setSubMenus] = useState(null);
  const [menusFiltrados, setMenusFiltrados] = useState(null);
  const [bajas, setBajas] = useState(false);
  const [openModal, setModal] = useState(false);
  const [accion, setAccion] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [currentID, setCurrentId] = useState("");
  const [busqueda, setBusqueda] = useState({ tb_id: "", tb_desc: "" });
  const [menussel, setMenusSel] = useState([]);
  const menuRef = useRef(menus);
  const [permissions, setPermissions] = useState({});
  const [titulo, setTitulo] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoadingButton, setisLoadingButton] = useState(false);
  const [inactiveActive, setInactiveActive] = useState([]);
  const [reload_page, setReloadPage] = useState(false);
  const [active, setActive] = useState(false);
  const [inactive, setInactive] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    trigger,
  } = useForm({
    defaultValues: {
      numero: menu.numero,
      ruta: menu.ruta,
      descripcion: menu.descripcion,
      icono: menu.icono,
      menu: menu.menu,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setisLoading(true);
      const { token, permissions } = session.user;
      const es_admin = session.user.es_admin;
      const menuSeleccionado = Number(localStorage.getItem("puntoMenu"));
      const busqueda = limpiarBusqueda();
      const data = await getMenus(token, bajas);
      const dataMenu = await getmenu(token, false);
      const subMenu = await getSubMenusApi(token, false);
      const res = await inactiveActiveBaja(session?.user.token, "accesos_menu");
      setSubMenus(subMenu);
      setMenusSel(dataMenu);
      setMenus(data);
      setMenusFiltrados(data);
      setInactiveActive(res.data);
      const permisos = permissionsComponents(
        es_admin,
        permissions,
        session.user.id,
        menuSeleccionado
      );
      await fetchAccesoMenuStatus(res.data, busqueda);
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
    menuRef.current = menus;
  }, [menus]);

  const Buscar = useCallback(async () => {
    const { tb_id, tb_desc } = busqueda;
    if (tb_id === "" && tb_desc === "") {
      setMenusFiltrados(menuRef.current);
      await fetchAccesoMenuStatus(inactiveActive, busqueda);
      return;
    }
    const infoFiltrada = menuRef.current.filter((menu) => {
      const coincideNumero = tb_id
        ? menu["numero"].toString().includes(tb_id)
        : true;
      const coincideNombre = tb_desc
        ? menu["descripcion"]
            .toString()
            .toLowerCase()
            .includes(tb_desc.toLowerCase())
        : true;
      return coincideNumero && coincideNombre;
    });
    setMenusFiltrados(infoFiltrada);
    await fetchAccesoMenuStatus(inactiveActive, busqueda);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busqueda]);

  const debouncedBuscar = useMemo(() => debounce(Buscar, 500), [Buscar]);

  const fetchAccesoMenuStatus = async (
    inactiveActive,
    busqueda
  ) => {
    const { tb_id, tb_desc } = busqueda;
    let infoFiltrada = [];
    let active = 0;
    let inactive = 0;
    if(tb_id || tb_desc){
      infoFiltrada = inactiveActive.filter((menu) => {
        const coincideID = tb_id
          ? menu["numero"].toString().includes(tb_id)
          : true;
        const coincidedesc = tb_desc
          ? menu["descripcion"]
            .toString()
            .toLowerCase()
            .includes(tb_desc.toLowerCase())
          : true;
        return coincideID && coincidedesc;
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
        ? `Nuevo Menu`
        : accion === "Editar"
        ? `Editar Menu: ${currentID}`
        : accion === "Eliminar"
        ? `Eliminar Menu: ${currentID}`
        : `Ver Menu: ${currentID}`
        ? `Reactivar Profesor: ${currentID}`
        : accion === "Reactivar"
    );
  }, [accion, currentID]);

  useEffect(() => {
    const submenus =
      subMenu?.filter((sub) => sub.id_acceso === menu.numero) || [];
    const submenuDescripcion =
      submenus.length > 0
        ? submenus.map((sub) => sub.descripcion).join(", ")
        : "";
    reset({
      numero: menu.numero,
      ruta: menu.ruta,
      descripcion: menu.descripcion,
      icono: menu.icono,
      menu: menu.menu,
      sub_menu: submenuDescripcion,
    });
  }, [menu, reset, subMenu]);

  const limpiarBusqueda = () => {
    const search = { tb_id: "", tb_desc: "" };
    setBusqueda({ tb_id: "", tb_desc: "" });
    return search;
  };

  const Alta = async () => {
    setCurrentId("");
    reset({
      numero: "",
      ruta: "",
      descripcion: "",
      icono: "",
      menu: "",
      sub_menu: "",
    });
    setMenu({ numero: "" });
    setModal(!openModal);
    setAccion("Alta");
    showModal(true);
    document.getElementById("descripcion").focus();
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
        "Se eliminara el menu seleccionado.",
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
    res = await guardaMenu(session.user.token, accion, data);
    if (res.status) {
      if (accion === "Alta") {
        const nuevoMenu = { currentID, ...data };
        setMenus([...menus, nuevoMenu]);
        if (!bajas) {
          setMenusFiltrados([...menusFiltrados, nuevoMenu]);
        }
      }
      if (accion === "Eliminar" || accion === "Editar") {
        const index = menus.findIndex((c) => c.numero === data.numero);
        if (index !== -1) {
          if (accion === "Eliminar") {
            const cFiltrados = menus.filter((c) => c.numero !== data.numero);
            setMenus(cFiltrados);
            setMenusFiltrados(cFiltrados);
          } else {
            if (bajas) {
              const cFiltrados = menus.filter((c) => c.numero !== data.numero);
              setMenus(cFiltrados);
              setMenusFiltrados(cFiltrados);
            } else {
              const cActualizadas = menus.map((c) =>
                c.numero === currentID ? { ...c, ...data } : c
              );
              setMenus(cActualizadas);
              setMenusFiltrados(cActualizadas);
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
      await fetchAccesoMenuStatus(inactiveActive, busqueda);
    };
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

  const handleReactivar = async (evt, MenuAccesor) => {
    evt.preventDefault();
    const confirmed = await confirmSwal(
      "¿Desea reactivar este Acceso del Menu?",
      "El Acceso del Menu será reactivado y volverá a estar activo.",
      "warning",
      "Sí, reactivar",
      "Cancelar"
    );
  
    if (confirmed) {
      const res = await guardaMenu(session.user.token, "Editar", { 
        ...MenuAccesor,
        baja: ""
      })
  
      if (res.status) {
        const cActualizadas = menus.map((c) =>
          c.numero === menus.numero ? { ...c, baja: "" } : c
        );
        setMenus(cActualizadas);
        setMenusFiltrados(cActualizadas);

        showSwal("Reactivado", "El Acceso del Menu ha sido reactivado correctamente.", "success");
        setReloadPage((prev) => !prev);
      } else {
        showSwal("Error", "No se pudo reactivar el Acceso del Menu.", "error");
      }
    }
  };

  const tableAction = (evt, menu, accion) => {
    evt.preventDefault();
    setMenu(menu);
    setAccion(accion);
    setCurrentId(menu.numero);
    if (accion === "Reactivar") {
      handleReactivar(evt, menu);
      
    } else {
      showModal(true);
    }
  };

  return {
    Alta,
    onSubmitModal,
    limpiarBusqueda,
    handleBusquedaChange,
    setBajas,
    home,
    Buscar,
    register,
    tableAction,
    session,
    status,
    subMenu,
    menussel,
    errors,
    menusFiltrados,
    permissions,
    busqueda,
    isLoading,
    accion,
    isDisabled,
    titulo,
    isLoadingButton,
    active,
    inactive,
  };
};
