"use client";
import React, { useEffect, useState } from "react";
import Acciones from "./components/Acciones";
import BuscarCat from "../components/BuscarCat";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import TablaAccesosUsuario from "./components/TablaAccesosUsuario";
import {
  getAccesosUsuarios,
  guardaAccesosUsuarios,
  actualizaTodos,
} from "../utils/api/accesos_usuarios/accesos_usuarios";
import ModalAccesosUsuarios from "./components/ModalAccesosUsuarios";
import { confirmSwal, showSwal } from "../utils/alerts";

function Accesos_Usuarios() {
  const { data: session, status } = useSession();
  const [accesoUsuario, setAccesoUsuario] = useState({});
  const [usuario, setUsuario] = useState({});
  const [accion, setAccion] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [accesosUsuarios, setAccesosUsuarios] = useState([]);
  const [accesosUsuariosFiltrados, setAccesosUsuariosFiltrados] = useState([]);
  const [currentID, setCurrentId] = useState("");

  useEffect(() => {
    if (status === "loading" || !session || !usuario.id) {
      return;
    }
    const fetchData = async () => {
      setisLoading(true);
      const { token } = session.user;
      const data = await getAccesosUsuarios(token, usuario);
      setAccesosUsuarios(data);
      setAccesosUsuariosFiltrados(data);
      setisLoading(false);
    };
    fetchData();
  }, [session, status, usuario]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id_usuario: accesoUsuario.id_usuario,
      id_punto_menu: accesoUsuario.id_punto_menu,
      t_a: accesoUsuario.t_a,
      altas: accesoUsuario.altas,
      bajas: accesoUsuario.bajas,
      cambios: accesoUsuario.cambios,
      impresion: accesoUsuario.impresion
    },
  });

  useEffect(() => {
    reset({
      id_usuario: accesoUsuario.id_usuario,
      id_punto_menu: accesoUsuario.id_punto_menu,
      t_a: accesoUsuario.t_a,
      altas: accesoUsuario.altas,
      bajas: accesoUsuario.bajas,
      cambios: accesoUsuario.cambios,
      impresion: accesoUsuario.impresion
    });
  }, [accesoUsuario, reset]);

  if (status === "loading") {
    return (
      <div className="container skeleton w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  const showModal = (show) => {
    show
      ? document.getElementById("my_modal_3").showModal()
      : document.getElementById("my_modal_3").close();
  };
  const tableAction = (evt, accesoUsuario, accion) => {
    setAccesoUsuario(accesoUsuario);
    setAccion(accion);
    setCurrentId(accesoUsuario.id_punto_menu);
    showModal(true);
  };
  const onSubmitModal = handleSubmit(async (data) => {
    data.id_punto_menu = currentID;
    data.id_usuario = usuario.id;


    let res = null;
    res = await guardaAccesosUsuarios(session.user.token, data);
    if (res.status) {
      data.t_a = data.t_a === true ? 1 : 0 || data.t_a === 1 ? 1 : 0;
      data.altas = data.altas === true ? 1 : 0 || data.altas === 1 ? 1 : 0;
      data.bajas = data.bajas === true ? 1 : 0 || data.bajas === 1 ? 1 : 0;
      data.cambios = data.cambios === true ? 1 : 0 || data.cambios === 1 ? 1 : 0;
      data.impresion = data.impresion === true ? 1 : 0 || data.impresion === 1 ? 1 : 0;

      const accUsuarioActualizados = accesosUsuarios.map((c) =>
        c.id_punto_menu === currentID ? { ...c, ...data } : c
      );
      setAccesosUsuarios(accUsuarioActualizados);
      setAccesosUsuariosFiltrados(accUsuarioActualizados);
      showSwal(res.alert_title, res.alert_text, res.alert_icon);
      showModal(false);
    }
  });

  const TodosSiNo = async (event) => {
    event.preventDefault();
    if (!usuario.id) {
      showSwal("Error", "Seleccione un Usuario", "error");
      return;
    }
    const { name } = event.target;
    const confirmed = await confirmSwal(
      "¿Desea continuar?",
      `se ${name === "si" ? " habilitaran " : " deshabilitaran "
      } todos los permisos`,
      "info",
      "Continuar",
      "Cancelar"
    );
    if (!confirmed) {
      return;
    }
    let res = null;
    const data = {};
    data.name = name;
    data.id_usuario = usuario.id;
    res = await actualizaTodos(session.user.token, data);
    if (res.status) {
      const flag = name === "si" ? true : false;
      const accUsuarioActualizados = accesosUsuarios.map((c) => ({
        ...c,
        t_a: flag ? 1 : 0,
        altas: flag ? 1 : 0,
        bajas: flag ? 1 : 0,
        cambios: flag ? 1 : 0,
        impresion: flag ? 1 : 0,
      }));
      setAccesosUsuarios(accUsuarioActualizados);
      setAccesosUsuariosFiltrados(accUsuarioActualizados);
      showSwal(res.alert_title, res.alert_text, res.alert_icon);
      showModal(false);
    }
  };

  return (
    <>
      <ModalAccesosUsuarios
        accion={accion}
        errors={errors}
        register={register}
        onSubmit={onSubmitModal}
        setValue={setValue}
        watch={watch}
      />
      <div className="container h-[80vh] w-full max-w-screen-xl bg-base-200 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y-hidden">
        <div className="flex flex-col justify-start p-3">
          <div className="flex flex-wrap md:flex-nowrap items-start md:items-center">
            <div className="order-2 md:order-1 flex justify-around w-full md:w-auto md:justify-start mb-0 md:mb-0">
              <Acciones />
            </div>
            <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
              Accesos Usuarios.
            </h1>
          </div>
        </div>
        <div className="flex flex-col items-center h-full">
          <div className="w-full max-w-4xl">
            <BuscarCat
              nameInput={["id", "name"]}
              fieldsToShow={["id", "nombre"]}
              table={"usuarios"}
              token={session.user.token}
              modalId={"modal_usuarios"}
              setItem={setUsuario}
              titulo={"Usuarios"}
              alignRight
            />
            <div className="flex flex-row space-x-4 mt-4">
              <button
                className="btn btn-sm btn-success w-24"
                name="si"
                onClick={(evt) => TodosSiNo(evt)}
              >
                Todos Si
              </button>
              <button
                className="btn btn-sm btn-error w-24"
                name="no"
                onClick={(evt) => TodosSiNo(evt)}
              >
                Todos No
              </button>
            </div>
            <TablaAccesosUsuario
              accesosUsuarioFiltrados={accesosUsuariosFiltrados}
              isLoading={isLoading}
              tableAction={tableAction}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Accesos_Usuarios;
