"use client";
import React, { useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { showSwal, confirmSwal, showSwalConfirm } from "../utils/alerts";
import {
  debounce,
  permissionsComponents,
  chunkArray,
  validateString,
} from "@/app/utils/globalfn";
import {
  getAplicaciones,
  guardaEjecutables,
} from "../utils/api/aplicaciones_ejecutables/aplicaciones_ejecutables";
import TablaAplicaciones from "./components/tablaAplicaciones";
import ModalAplicaciones from "./components/ModalAplicaciones";
import Busqueda from "./components/Busqueda";
import Acciones from "./components/acciones";
import { useForm } from "react-hook-form";

function Aplicaciones_Ejecutables() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [animateLoading, setAnimateLoading] = useState(false);
  const [permissions, setPermissions] = useState({});
  const [bajas, setBajas] = useState(false);
  const [reload_page, setReloadPage] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [formasAplicaciones, setFormasAplicaciones] = useState([]);
  const [formaAplicaciones, setFormaAplicaciones] = useState({});
  const [formaAplicacionesFiltrados, setFormaAplicacionesFiltrados] =
    useState(null);
  const [busqueda, setBusqueda] = useState({
    tb_numero: "",
    tb_descripcion: "",
  });
  const [accion, setAccion] = useState("");
  const [currentID, setCurrentId] = useState("");
  const [isLoadingButton, setisLoadingButton] = useState(false);
  const aplicacionesRef = useRef(formasAplicaciones);
  const [openModal, setModal] = useState(false);

  useEffect(() => {
    aplicacionesRef.current = formasAplicaciones; // Actualiza el ref cuando alumnos cambia
  }, [formasAplicaciones]);

  const Buscar = useCallback(() => {
    const { tb_numero, tb_descripcion } = busqueda;

    if (tb_numero === "" && tb_descripcion === "") {
      setFormaAplicacionesFiltrados(aplicacionesRef.current);
      return;
    }
    const infoFiltrada = aplicacionesRef.current.filter((formaAplicaciones) => {
      const coincideID = tb_numero
        ? formaAplicaciones["numero"].toString().includes(tb_numero)
        : true;
      const coincideDesc = tb_descripcion
        ? formaAplicaciones["descripcion"]
            .toString()
            .toLowerCase()
            .includes(tb_descripcion.toLowerCase())
        : true;
      return coincideID && coincideDesc;
    });
    setFormaAplicacionesFiltrados(infoFiltrada);
  }, [busqueda]);

  const debouncedBuscar = useMemo(() => debounce(Buscar, 500), [Buscar]);

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
    const fetchData = async () => {
      setisLoading(true);
      let { token, permissions } = session.user;
      const es_admin = session.user?.es_admin || false; // Asegúrate de que exista
      const menuSeleccionado = Number(localStorage.getItem("puntoMenu"));
      limpiarBusqueda();
      const data = await getAplicaciones(token, bajas);
      setFormasAplicaciones(data);
      setFormaAplicacionesFiltrados(data);
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
  }, [status, bajas]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      numero: formaAplicaciones.numero,
      descripcion: formaAplicaciones.descripcion,
      ruta_archivo: formaAplicaciones.ruta_archivo,
      icono: formaAplicaciones.icono,
    },
  });
  useEffect(() => {
    reset({
      numero: formaAplicaciones.numero,
      descripcion: formaAplicaciones.descripcion,
      ruta_archivo: formaAplicaciones.ruta_archivo,
      icono: formaAplicaciones.icono,
    });
  }, [formaAplicaciones, reset]);

  const Alta = async (event) => {
    setCurrentId("");
    const { token } = session.user;
    reset({
      numero: "",
      descripcion: "",
      ruta_archivo: "",
      icono: "",
    });
    setFormaAplicaciones({ numero: "" });
    setModal(!openModal);
    setAccion("Alta");
    showModal(true);
    document.getElementById("descripcion").focus();
  };

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

  const showModal = (show) => {
    show
      ? document.getElementById("my_modal_Apl").showModal()
      : document.getElementById("my_modal_Apl").close();
  };

  const limpiarBusqueda = (evt) => {
    setBusqueda({ tb_id: "", tb_desc: "" });
  };

  const onSubmitModal = handleSubmit(async (data) => {
    event.preventDefault();
    setisLoadingButton(true);
    const dataj = JSON.stringify(data);
    accion === "Alta" ? (data.numero = "") : (data.numero = currentID);
    let res = null;
    if (accion === "Eliminar") {
      showModal(false);
      const confirmed = await confirmSwal(
        "¿Desea Continuar?",
        "Se eliminara el Ejecutable seleccionado",
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

    res = await guardaEjecutables(session.user.token, data, accion);

    if (res.status) {
      if (accion === "Alta") {
        data.numero = res.data;
        setCurrentId(data.numero);
        const nuevaFormaAplicaciones = { currentID, ...data };
        setFormasAplicaciones([...formasAplicaciones, nuevaFormaAplicaciones]);
        if (!bajas) {
          setFormaAplicacionesFiltrados([
            ...formaAplicacionesFiltrados,
            nuevaFormaAplicaciones,
          ]);
        }
      }
      if (accion === "Eliminar" || accion === "Editar") {
        const index = formasAplicaciones.findIndex(
          (fp) => fp.numero === data.numero
        );
        if (index !== -1) {
          if (accion === "Eliminar") {
            const fpFiltrados = formasAplicaciones.filter(
              (fp) => fp.numero !== data.numero
            );
            setFormasAplicaciones(fpFiltrados);
            setFormaAplicacionesFiltrados(fpFiltrados);
          } else {
            if (bajas) {
              const fpFiltrados = formasAplicaciones.filter(
                (fp) => fp.numero !== data.numero
              );
              setFormasAplicaciones(fpFiltrados);
              setFormaAplicacionesFiltrados(fpFiltrados);
            } else {
              const fpActualizadas = formasAplicaciones.map((fp) =>
                fp.numero === currentID ? { ...fp, ...data } : fp
              );
              setFormasAplicaciones(fpActualizadas);
              setFormaAplicacionesFiltrados(fpActualizadas);
            }
          }
        }
      }
      showSwal(res.alert_title, res.alert_text, res.alert_icon);
      showModal(false);
    } else {
      showSwal(res.alert_title, res.alert_text, res.alert_icon, "my_modal_Apl");
    }
    setisLoadingButton(false);
  });

  if (status === "loading") {
    return (
      <div className="container skeleton w-full max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  return (
    <>
      <ModalAplicaciones
        accion={accion}
        onSubmit={onSubmitModal}
        currentID={currentID}
        errors={errors}
        register={register}
        setFormaAplicaciones={setFormaAplicaciones}
        formaAplicaciones={formaAplicaciones}
        isLoadingButton={isLoadingButton}
      />
      <div className="container h-[80vh] w-full max-w-screen-xl bg-base-200 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y-hidden">
        <div className="flex flex-col justify-start p-3">
          <div className="flex flex-wrap md:flex-nowrap items-start md:items-center">
            <div className="order-2 md:order-1 flex justify-around w-full md:w-auto md:justify-start mb-0 md:mb-0">
              <Acciones
                Buscar={Buscar}
                Alta={Alta}
                home={home}
                animateLoading={animateLoading}
                permiso_alta={permissions.altas}
              />
            </div>
            <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
              Ejecutables .EXE
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
            {status === "loading" ||
              (!session ? (
                <></>
              ) : (
                <TablaAplicaciones
                  isLoading={isLoading}
                  session={session}
                  formaAplicacionesFiltrados={formaAplicacionesFiltrados}
                  showModal={showModal}
                  setFormaAplicaciones={setFormaAplicaciones}
                  setAccion={setAccion}
                  setCurrentId={setCurrentId}
                  permiso_cambio={permissions.cambios}
                  permiso_baja={permissions.bajas}
                />
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
export default Aplicaciones_Ejecutables;
