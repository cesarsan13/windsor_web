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

export const useSubMenusABC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [subMenus, setSubMenus] = useState([]);
  const [subMenusFiltered, setSubMenusFiltered] = useState([]);
  const [subMenu, setSubMenu] = useState({});
  const [menu, setMenu] = useState({});
  const [inactive, setInactive] = useState(false);
  const [title, setTitle] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [currentAction, setCurrentAction] = useState("");
  const [permissions, setPermissions] = useState({});
  const [searching, setSearching] = useState({ tb_id: "", tb_desc: "" });
  const subMenuRef = useRef(subMenus);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
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
    const res = await saveSubMenuApi(token, data, currentAction);
    const resData = res.data;
    const newMenu = { resData, ...data };
    setSubMenu([...subMenus, newMenu]);
    if (!inactive) {
      setSubMenusFiltered([...subMenusFiltered, newMenu]);
    }
    return { ...res, delete: true };
  };

  const updateSubMenu = async (token, data) => {
    const res = await updateSubMenuApi(token, data, currentAction);
    const index = subMenus.findIndex(
      (c) => c.numero === data.numero && c.id_acceso === data.id_acceso
    );
    if (index !== -1) {
      let dataFiltered = [];
      inactive === true
        ? (dataFiltered = subMenus.filter(
            (sub) =>
              sub.numero !== data.numero && sub.id_acceso !== data.id_acceso
          ))
        : (dataFiltered = subMenus.map((sub) =>
            sub.numero === data.numero && sub.id_acceso === data.id_acceso
              ? { ...sub, ...data }
              : sub
          ));
      setSubMenus(dataFiltered);
      setSubMenusFiltered(dataFiltered);
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
    const dataFiltered = subMenus.filter(
      (c) => !(c.numero === data.numero && c.id_acceso === data.id_acceso)
    );
    setSubMenus(dataFiltered);
    setSubMenusFiltered(dataFiltered);
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
      const [subMenus, componentPermissions] = await Promise.all([
        getSubMenusApi(token, inactive),
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
  }, [status, inactive]);

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

  const Search = useCallback(() => {
    const { tb_id, tb_desc } = searching;
    if (tb_id === "" && tb_desc === "") {
      setSubMenusFiltered(subMenuRef.current);
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
  }, [searching]);

  const debouncedSearch = useMemo(() => debounce(Search, 500), [Search]);

  useEffect(() => {
    debouncedSearch();
    return () => {
      clearTimeout(debouncedSearch);
    };
  }, [searching, debouncedSearch]);

  const onSubmitModal = handleSubmit(async (data) => {
    const { token } = session.user;
    if (!validateBeforeSave("sub_menu", "my_modal_3")) {
      return;
    }
    setIsLoadingButton(true);
    data.id_acceso = menu.numero || data.id_acceso;
    const executeAction = actionsApi[currentAction];
    const res = executeAction
      ? await executeAction(token, data)
      : { status: false };
    setIsLoadingButton(false);
    if (!res.delete) {
      return;
    }
    const showAlert = res.status ? showSwal : showSwalAndWait;
    await showAlert(res.alert_title, res.alert_text, res.alert_icon);
    if (!res.status) {
      showModal(true);
    }
  });

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

  const tableAction = (evt, row, action) => {
    evt.preventDefault();
    setCurrentAction(action);
    setSubMenu(row);
    const config = actionTitle[action];
    if (config) {
      setTitle(`${config.titlePrefix} ${row.numero}, Acceso ${row.id_acceso}`);
      setIsDisabled(config.isDisable);
    }
    showModal(true);
  };

  const showModal = (show) => {
    show
      ? document.getElementById("my_modal_3").showModal()
      : document.getElementById("my_modal_3").close();
  };

  const Home = () => {
    router.push("/");
  };

  const clearSearch = (evt) => {
    evt.preventDefault();
    setSearching({ tb_id: "", tb_desc: "" });
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
    setInactive,
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
  };
};
