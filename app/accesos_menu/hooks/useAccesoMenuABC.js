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
  // guardaSubMenu,
  // updateSubMenu,
} from "@/app/utils/api/sub_menus/sub_menus";
import {
  useEscapeWarningModal,
  validateBeforeSave,
} from "@/app/utils/globalfn";

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
  // const [reload_page, setReloadPage] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setisLoading(true);
      const { token, permissions } = session.user;
      const es_admin = session.user.es_admin;
      const menuSeleccionado = Number(localStorage.getItem("puntoMenu"));
      const data = await getMenus(token, bajas);
      const dataMenu = await getmenu(token, false);
      const subMenu = await getSubMenusApi(token, false);
      setSubMenus(subMenu);
      setMenusSel(dataMenu);
      setMenus(data);
      setMenusFiltrados(data);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload_page, status, bajas]);

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
    if (accion === "Eliminar" || accion === "Ver") {
      setIsDisabled(true);
    }
    if (accion === "Alta" || accion === "Editar") {
      setIsDisabled(false);
    }
    setTitulo(
      accion === "Alta"
        ? `Nuevo Menu: ${currentID}`
        : accion === "Editar"
        ? `Editar Menu: ${currentID}`
        : accion === "Eliminar"
        ? `Eliminar Menu: ${currentID}`
        : `Ver Menu: ${currentID}`
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

  useEffect(() => {
    menuRef.current = menus;
  }, [menus]);

  const Buscar = useCallback(() => {
    const { tb_id, tb_desc } = busqueda;
    if (tb_id === "" && tb_desc === "") {
      setMenusFiltrados(menuRef.current);
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
  }, [busqueda]);

  const debouncedBuscar = useMemo(() => debounce(Buscar, 500), [Buscar]);

  useEffect(() => {
    debouncedBuscar();
    return () => {
      clearTimeout(debouncedBuscar);
    };
  }, [busqueda, debouncedBuscar]);

  const Alta = async (event) => {
    setCurrentId("");
    const { token } = session.user;
    reset({
      numero: "",
      ruta: "",
      descripcion: "",
      icono: "",
      menu: "",
      sub_menu: "",
    });
    let siguienteId = await siguiente(token);
    siguienteId = Number(siguienteId) + 1;
    setCurrentId(siguienteId);
    setMenu({ numero: siguienteId });
    setModal(!openModal);
    setAccion("Alta");
    showModal(true);
    document.getElementById("descripcion").focus();
  };

  // const saveSubMenu = async (token, data) => {
  //   let res = null;
  //   if (data.sub_menu) {
  //     accion === "Alta"
  //       ? (res = await guardaSubMenu(token, data))
  //       : (res = await updateSubMenu(token, data, accion));
  //     setReloadPage(!reload_page);
  //   }
  // };

  const onSubmitModal = handleSubmit(async (data) => {
    if (!validateBeforeSave("sub_menu", "my_modal_3")) {
      return;
    }
    data.numero = currentID;
    let res = null;
    setisLoadingButton(true);
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
        return;
      }
    }
    res = await guardaMenu(session.user.token, accion, data);
    // await saveSubMenu(session.user.token, data);
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
      setisLoadingButton(false);
    } else {
      showModal(false);
      const confirmed = await confirmSwal(
        res.alert_title,
        res.alert_text,
        res.alert_icon,
        "Aceptar",
        "Cancelar"
      );
      if (!confirmed) {
        showModal(true);
        setisLoadingButton(false);
        return;
      } else {
        showModal(true);
        setisLoadingButton(false);
        return;
      }
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

  const limpiarBusqueda = (evt) => {
    evt.preventDefault();
    setBusqueda({ tb_id: "", tb_desc: "" });
  };

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
    setBusqueda((estadoPrevio) => ({
      ...estadoPrevio,
      [event.target.id]: event.target.value,
    }));
  };

  const tableAction = (evt, menu, accion) => {
    evt.preventDefault();
    setMenu(menu);
    setAccion(accion);
    setCurrentId(menu.numero);
    showModal(true);
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
  };
};
