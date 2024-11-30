"use client";
import React, { useEffect, useRef, useState } from "react";
import Acciones from "./components/Acciones";
import BuscarCat from "../components/BuscarCat";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import TablaAccesosUsuario from "./components/TablaAccesosUsuario";
import {
  getAccesosUsuarios,
  guardaAccesosUsuarios,
} from "../utils/api/accesos_usuarios/accesos_usuarios";
import ModalAccesosUsuarios from "./components/ModalAccesosUsuarios";
import { showSwal } from "../utils/alerts";

function Accesos_Usuarios() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [accesoUsuario, setAccesoUsuario] = useState({});
  const [usuario, setUsuario] = useState({});
  const [accion, setAccion] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [accesosUsuarios, setAccesosUsuarios] = useState([]);
  const [accesosUsuariosFiltrados, setAccesosUsuariosFiltrados] = useState([]);
  const [openModal, setModal] = useState(false);
  const [currentID, setCurrentId] = useState("");
  const accesosUsuariosRef = useRef(accesosUsuarios);
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
    formState: { errors },
  } = useForm({
    defaultValues: {
      id_usuario: accesoUsuario.id_usuario,
      id_punto_menu: accesoUsuario.id_punto_menu,
      t_a: accesoUsuario.t_a,
      altas: accesoUsuario.altas,
      bajas: accesoUsuario.bajas,
      cambios: accesoUsuario.cambios,
      impresion: accesoUsuario.impresion,
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
      impresion: accesoUsuario.impresion,
    });
  }, [accesoUsuario, reset]);
  if (status === "loading") {
    return (
      <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
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
    event.preventDefault();
    data.id_punto_menu = currentID;
    data.id_usuario = usuario.id;
    let res = null;
    res = await guardaAccesosUsuarios(session.user.token, data);
    if (res.status) {
      const accUsuarioActualizados = accesosUsuarios.map((c) =>
        c.id_punto_menu === currentID ? { ...c, ...data } : c
      );
      setAccesosUsuarios(accUsuarioActualizados);
      setAccesosUsuariosFiltrados(accUsuarioActualizados);
      showSwal(res.alert_title, res.alert_text, res.alert_icon);
      showModal(false);
    }
  });
  return (
    <>
      <ModalAccesosUsuarios
        accesoUsuario={accesoUsuario}
        accion={accion}
        errors={errors}
        register={register}
        session={session}
        onSubmit={onSubmitModal}
      />
      <div className="container h-[80vh] w-full max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y-hidden">
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
