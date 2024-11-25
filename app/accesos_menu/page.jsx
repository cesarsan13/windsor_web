"use client";
import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { showSwal, confirmSwal } from "@/app/utils/alerts";
import { useForm } from "react-hook-form";
import ModalMenu from "@/app/accesos_menu/components/modalMenu";
import TablaMenu from "@/app/accesos_menu/components/tablaMenu";
import Busqueda from "@/app/accesos_menu/components/Busqueda";
import Acciones from "@/app/accesos_menu/components/Acciones";
import {
  getMenus,
  siguiente,
  guardaMenu,
} from "@/app/utils/api/accesos_menu/accesos_menu";
import {getMenus as getmenu} from "@/app/utils/api/menus/menus"
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { debounce } from "@/app/utils/globalfn";

function Accesos_Menu() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [menus, setMenus] = useState([]);
  const [menu, setMenu] = useState({});
  const [menusFiltrados, setMenusFiltrados] = useState([]);
  const [bajas, setBajas] = useState(false);
  const [openModal, setModal] = useState(false);
  const [accion, setAccion] = useState("");
  const [animateLoading, setAnimateLoading] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [currentID, setCurrentId] = useState("");
  const [busqueda, setBusqueda] = useState({ tb_id: "", tb_desc: "" });
  const [menussel,setMenusSel] = useState([])

  useEffect(() => {
    if (status === "loading" || !session) {
      return;
    }
    const fetchData = async () => {
      setisLoading(true);
      const { token } = session.user;
      const data = await getMenus(token, bajas);
      const dataMenu = await getmenu(token,false)
      setMenusSel(dataMenu)
      setMenus(data);
      setMenusFiltrados(data);
      setisLoading(false);
    };
    fetchData();
  }, [session, status, bajas]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
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
    reset({
      numero: menu.numero,
      ruta: menu.ruta,
      descripcion: menu.descripcion,
      icono: menu.icono,
      menu: menu.menu,
    });
  }, [menu, reset]);

  const Buscar = useCallback(() => {
    const { tb_id, tb_desc } = busqueda;
    if (tb_id === "" && tb_desc === "") {
      setMenusFiltrados(menus);
      return;
    }
    const infoFiltrada = menus.filter((menu) => {
      const coincideNumero = tb_id
        ? menu["numero"].toString().includes(tb_id)
        : true;
      const coincideNombre = tb_desc
        ? menu["descripcion"]
          .toString()
          .toLowerCase()
          .includes(tb_desc.toLowerCase())
        : true;
      return (
        coincideNumero &&
        coincideNombre
      );
    });
    setMenusFiltrados(infoFiltrada);
  }, [busqueda, menus]);

  useEffect(() => {
    const debouncedBuscar = debounce(Buscar, 500);
    debouncedBuscar();
    return () => {
      clearTimeout(debouncedBuscar);
    };
  }, [busqueda, Buscar]);

  const Alta = async (event) => {
    setCurrentId("");
    const { token } = session.user;
    reset({
      numero: "",
      ruta: "",
      descripcion: "",
      icono: "",
      menu: "",
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

  const onSubmitModal = handleSubmit(async (data) => {
    event.preventDefault;
    data.numero = currentID;
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
              const cFiltrados = menus.filter(
                (c) => c.numero !== data.numero
              );
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
        return;
      } else {
        showModal(true);
        return;
      }
    }
  });
  const limpiarBusqueda = (evt) => {
    evt.preventDefault();
    setBusqueda({ tb_id: "", tb_desc: "" });
  };
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
  const tableAction = (evt, menu, accion) => {
    setMenu(menu);
    setAccion(accion);
    setCurrentId(menu.numero);
    showModal(true);
  };

  if (status === "loading") {
    return (
      <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  return (
    <>
      <ModalMenu
        accion={accion}
        onSubmit={onSubmitModal}
        currentID={currentID}
        errors={errors}
        register={register}
        setMenu={setMenu}
        menusSel={menussel}
      />
      <div className="container h-[80vh] w-full max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y-hidden">
        <div className="flex flex-col justify-start p-3">
          <div className="flex flex-wrap md:flex-nowrap items-start md:items-center">
            <div className="order-2 md:order-1 flex justify-around w-full md:w-auto md:justify-start mb-0 md:mb-0">
              <Acciones
                Buscar={Buscar}
                Alta={Alta}
                home={home}
                isLoading={animateLoading}
              />
            </div>

            <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
              Accesos Menu.
            </h1>
          </div>
        </div>
        <div className="flex flex-col items-center h-full">
          <div className="w-full max-w-4xl">
            <Busqueda
              setBajas={setBajas}
              limpiarBusqueda={limpiarBusqueda}
              Buscar={Buscar}
              handleBusquedaChange={handleBusquedaChange}
              busqueda={busqueda}
            />
            <TablaMenu
              isLoading={isLoading}
              menusFiltrados={menusFiltrados}
              tableAction={tableAction}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Accesos_Menu;
