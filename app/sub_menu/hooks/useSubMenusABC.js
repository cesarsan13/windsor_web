import { confirmSwal, showSwal, showSwalAndWait } from "@/app/utils/alerts";
import {
  getSubMenusApi,
  saveSubMenuApi,
  updateSubMenuApi,
} from "@/app/utils/api/sub_menus/sub_menus";
import {
  debounce,
  permissionsComponents,
  validateBeforeSave,
} from "@/app/utils/globalfn";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { inactiveActiveBaja } from "@/app/utils/GlobalApis";

export const useSubMenusABC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [subMenus, setSubMenus] = useState([]);
  const [subMenusFiltered, setSubMenusFiltered] = useState([]);
  const [subMenu, setSubMenu] = useState({});
  const [menu, setMenu] = useState({});
  const [title, setTitle] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [currentAction, setCurrentAction] = useState("");
  const [permissions, setPermissions] = useState({});
  const [searching, setSearching] = useState({ tb_id: "", tb_desc: "" });
  const subMenuRef = useRef(subMenus);
  const [reloadFullPage, setReloadFullPage] = useState(false);
  const [active, setActive] = useState(false);
  const [inactive, setInactive] = useState(false);
  const [inactiveActive, setInactiveActive] = useState([]);
  const [bajas, setBajas] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
  } = useForm({
    defaultValues: {
      numero: subMenu.numero || 0,
      id_acceso: subMenu.id_acceso || 0,
      descripcion: subMenu.descripcion || "",
      menu_descripcion: subMenu.menu_descripcion || "",
      menu: subMenu.menu || "",
      menu_ruta: subMenu.menu_ruta || "",
    },
  });

  const actionTitle = {
    Alta: { titlePrefix: "Agregar  Sub Menú", isDisable: false },
    Editar: { titlePrefix: "Editar Sub Menú", isDisable: false },
    Eliminar: { titlePrefix: "Eliminar Sub Menú", isDisable: true },
    Ver: { titlePrefix: "Ver Sub Menú", isDisable: true },
  };

  const insertSubMenu = async (token, data) => {
    let res = await saveSubMenuApi(token, data, currentAction);
    if (res.status) {
      const newMenu = {
        numero: res.data.numero,
        id_acceso: data.id_acceso,
        descripcion: data.descripcion,
        menu_descripcion: menu.descripcion || "",
        menu: menu.menu || "",
        menu_ruta: menu.ruta || "",
      };
      setSubMenu([...subMenus, newMenu]);
      if (!inactive) {
        setSubMenusFiltered([...subMenusFiltered, newMenu]);
      }
    }
    return { ...res, delete: true };
  };

  const updateSubMenu = async (token, data) => {
    let res = await updateSubMenuApi(token, data, currentAction);
    if (res.status) {
      const newNumero = res.data.numero;
      const index = subMenus.findIndex(
        (c) => c.numero === data.numero && c.id_acceso === data.id_acceso
      );
      if (index !== -1) {
        let dataFiltered = [];
        inactive === true
          ? (dataFiltered = subMenus.filter(
              (sub) =>
                sub.numero !== data.numero || sub.id_acceso !== data.id_acceso
            ))
          : (dataFiltered = subMenus.map((sub) =>
              sub.numero === data.numero && sub.id_acceso === data.id_acceso
                ? { ...sub, ...data, numero: newNumero }
                : sub
            ));
        setSubMenus(dataFiltered);
        setSubMenusFiltered(dataFiltered);
      }
    }
    return { ...res, delete: true };
  };

  const deleteSubMenu = async (token, data) => {
    showModal(false);
    const confirmed = await confirmSwal(
      "¿Desea Continuar?",
      "Se eliminara el sub menú seleccionado.",
      "warning",
      "Aceptar",
      "Cancelar"
    );
    if (!confirmed) {
      showModal(true);
      return { delete: false };
    }
    let res = await updateSubMenuApi(token, data, currentAction);
    if (res.status) {
      const dataFiltered = subMenus.filter(
        (c) => !(c.numero === data.numero && c.id_acceso === data.id_acceso)
      );
      setSubMenus(dataFiltered);
      setSubMenusFiltered(dataFiltered);
    }
    return { ...res, delete: true };
  };

  const actionsApi = {
    Alta: insertSubMenu,
    Editar: updateSubMenu,
    Eliminar: deleteSubMenu,
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { token, permissions, id, es_admin } = session.user;
      const selectedMenu = Number(localStorage.getItem("selectedMenu"));
      const res = await inactiveActiveBaja(session?.user.token, "sub_menus");
      const busqueda = clearSearch();
      await fetchSubMenuStatus(res.data, busqueda);
      setInactiveActive(res.data);
      const [subMenus, componentPermissions] = await Promise.all([
        getSubMenusApi(token, bajas),
        permissionsComponents(es_admin, permissions, id, selectedMenu),
      ]);
      setSubMenus(subMenus);
      setSubMenusFiltered(subMenus);
      setPermissions(componentPermissions);
      setLoading(false);
    };
    if (status === "loading" && !session) {
      return;
    }
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, bajas]);

  useEffect(() => {
    reset({
      numero: subMenu.numero || 0,
      id_acceso: subMenu.id_acceso || 0,
      descripcion: subMenu.descripcion || "",
      menu_descripcion: subMenu.menu_descripcion || "",
      menu: subMenu.menu || "",
      menu_ruta: subMenu.menu_ruta || "",
    });
  }, [subMenu, reset]);

  useEffect(() => {
    subMenuRef.current = subMenus;
  }, [subMenus]);

  const Search = useCallback( async () => {
    const { tb_id, tb_desc } = searching;
    if (tb_id === "" && tb_desc === "") {
      setSubMenusFiltered(subMenuRef.current);
      await fetchSubMenuStatus(inactiveActive, searching)
      return;
    }
    const filteredInfo = subMenuRef.current.filter((menu) => {
      const matchesNumber = tb_id
        ? menu["numero"].toString().includes(tb_id)
        : true;
      const matchesName = tb_desc
        ? menu["descripcion"]
            .toString()
            .toLowerCase()
            .includes(tb_desc.toLowerCase())
        : true;
      return matchesNumber && matchesName;
    });
    setSubMenusFiltered(filteredInfo);
    await fetchSubMenuStatus(inactiveActive, searching)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searching]);

  const debouncedSearch = useMemo(() => debounce(Search, 500), [Search]);

  const fetchSubMenuStatus = async (
    inactiveActive,
    searching
  ) => {
    const { tb_id, tb_desc } = searching;
    let infoFiltrada = [];
    let active = 0;
    let inactive = 0;

    if (tb_id || tb_desc ) {
      infoFiltrada = inactiveActive.filter((menu) => {
        const matchesNumber = tb_id
          ? menu["numero"].toString().includes(tb_id)
          : true;
        const matchesName = tb_desc
          ? menu["descripcion"]
              .toString()
              .toLowerCase()
              .includes(tb_desc.toLowerCase())
          : true;
        return matchesNumber && matchesName;
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
    debouncedSearch();
    return () => {
      clearTimeout(debouncedSearch);
    };
  }, [searching, debouncedSearch]);

  useEffect(() => {
    const debouncedSearch = debounce(Search, 500);
    debouncedSearch();
    return () => {
      clearTimeout(debouncedSearch);
    };
  }, [searching, Search]);

  useEffect(() => {
    if(reloadFullPage === true){
      setTimeout(() => {
        window.location.reload();
      }, 2505);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadFullPage]);

  const onSubmitModal = handleSubmit(async (data) => {
    try {
      const { token } = session.user;
      setIsLoadingButton(true);
      data.id_acceso = menu.numero || data.id_acceso;
      const executeAction = actionsApi[currentAction];
      const res = executeAction
        ? await executeAction(token, data)
        : { status: false };
      setReloadFullPage(!reloadFullPage);
      setIsLoadingButton(false);
      if (!res.delete) {
        return;
      }
      showModal(false);
      const showAlert = res.status ? showSwal : showSwalAndWait;
      await showAlert(res.alert_title, res.alert_text, res.alert_icon);
      setReloadFullPage(!reloadFullPage);
      if (!res.status) {
        showModal(true);
      }
    } catch (error) {
      setIsLoadingButton(false);
      showSwal("Error", "Ha ocurrido un error inesperado.", "error");
    }
  },
  async (errors) => {
    await trigger();
    if (Object.keys(errors).length > 0) {
      showSwal("Error", "Complete todos los campos requeridos", "error", "my_modal_3");
    }
  } 
);

  const addSubMenu = () => {
    reset({
      numero: "",
      id_acceso: "",
      descripcion: "",
      menu_descripcion: "",
      menu: "",
      menu_ruta: "",
    });
    setSubMenu({ numero: "" });
    setCurrentAction("Alta");
    setTitle("Add Sub Menu");
    setIsDisabled(false);
    showModal(true);
    document.getElementById("descripcion").focus();
  };

  const handleReactivar = async (evt, submenur) => {
    evt.preventDefault();
    const confirmed = await confirmSwal(
      "¿Desea reactivar este Sub Menu?",
      "El Sub Menu será reactivado y volverá a estar activo.",
      "warning",
      "Sí, reactivar",
      "Cancelar"
    );
  
    if (confirmed) {
      const res = await updateSubMenuApi(session.user.token, { 
        ...submenur, 
        baja: ""
      }, "Editar");
      
      if (res.status) {
        const dataFiltered = subMenus.map((c) => 
          c.numero === subMenus.numero ? {...c, baja:""} : c
        );
        setSubMenus(dataFiltered);
        setSubMenusFiltered(dataFiltered);
      
        showSwal("Reactivado", "El Sub Menu ha sido reactivado correctamente.", "success");
        setReloadFullPage(!reloadFullPage);
      } else {
        showSwal("Error", "No se pudo reactivar el Sub Menu.", "error");
      }
    }
  };

  const tableAction = (evt, row, action) => {
    evt.preventDefault();
    setCurrentAction(action);
    setSubMenu(row);
    const config = actionTitle[action];
    if (config) {
      setTitle(`${config.titlePrefix} ${row.numero}, Acceso ${row.id_acceso}`);
      setIsDisabled(config.isDisable);
    }
    if (action === "Reactivar") {
      handleReactivar(evt, row);
      
    } else {
      showModal(true);
    }
  };

  const showModal = (show) => {
    show
      ? document.getElementById("my_modal_3").showModal()
      : document.getElementById("my_modal_3").close();
  };

  const Home = () => {
    router.push("/");
  };

  const clearSearch = () => {
    const search = { tb_id: "", tb_desc: "" };
    setSearching({ tb_id: "", tb_desc: "" });
    return search;
  };

  const handleSearchingChange = (event) => {
    setSearching((statePrev) => ({
      ...statePrev,
      [event.target.id]: event.target.value,
    }));
  };

  return {
    onSubmitModal,
    tableAction,
    addSubMenu,
    register,
    clearSearch,
    handleSearchingChange,
    Search,
    Home,
    setMenu,
    errors,
    session,
    status,
    isLoading,
    subMenusFiltered,
    permissions,
    isDisabled,
    currentAction,
    title,
    isLoadingButton,
    searching,
    subMenu,
    active,
    inactive,
    inactiveActive,
    setBajas
  };
};
