"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Acciones from "@/app/cambio_ciclo_escolar/components/Acciones";
import { useSession } from "next-auth/react";
import BuscarCat from "../components/BuscarCat";
import Inputs from "@/app/cambio_ciclo_escolar/components/Inputs";
import {
  cambiarCicloEscolar,
  getCicloEscolar,
} from "@/app/utils/api/cambio_ciclo_escolar/cambio_ciclo_escolar";
import { showSwal, confirmSwal } from "@/app/utils/alerts";
import { permissionsComponents } from "../utils/globalfn";

function Cambio_Ciclo_Escolar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const date = new Date();
  const year = date.getFullYear();
  const [cicloEscolar, setCicloEscolar] = useState("");
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    if (status === "loading" || !session) {
      return;
    }
    const fetchData = async () => {
      const { token, permissions } = session.user;
      const es_admin = session.user.es_admin;
      const data = await getCicloEscolar(token);
      setCicloEscolar(data.ciclo_escolar);
      const menu_seleccionado = Number(localStorage.getItem("puntoMenu"));
      const permisos = permissionsComponents(
        es_admin,
        permissions,
        session.user.id,
        menu_seleccionado
      );
      setPermissions(permisos);
      console.log(data);
    };
    fetchData();
  }, [session, status]);
  console.log("ciclo escolar:", cicloEscolar);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nuevo_ciclo: cicloEscolar,
    },
  });
  useEffect(() => {
    reset({
      nuevo_ciclo: cicloEscolar,
    });
  }, [cicloEscolar, reset]);
  const onSubmit = handleSubmit(async (data) => {
    const { token } = session.user;
    const confirmed = await confirmSwal(
      "¿Desea Continuar?",
      "Se cambiara el ciclo escolar por el ingresado.",
      "warning",
      "Aceptar",
      "Cancelar"
    );
    if (!confirmed) {
      return;
    }
    const res = await cambiarCicloEscolar(token, data);
    if (res.status) {
      showSwal(res.alert_title, res.alert_text, res.alert_icon);
      home();
    } else {
      showSwal(res.alert_title, res.alert_text, res.alert_icon);
    }
  });

  const home = () => {
    router.push("/");
  };

  if (status === "loading") {
    return (
      <div className="container skeleton w-full max-w-screen-xl shadow-xl rounded-xl"></div>
    );
  }
  return (
    <>
      <div className="container h-[80vh] w-full max-w-screen-xl bg-base-200 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y-hidden">
        <div className="flex flex-col justify-start p-3">
          <div className="flex flex-wrap md:flex-nowrap items-start md:items-center">
            <div className="order-2 md:order-1 flex justify-around w-full md:w-auto md:justify-start mb-0 md:mb-0">
              <Acciones
                Alta={onSubmit}
                home={home}
                permiso_alta={permissions.altas}
              />
            </div>

            <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
              Cambio de Ciclo Escolar.
            </h1>
          </div>
        </div>
        <div className="flex flex-col items-center h-full">
          <div className="w-full max-w-4xl">
            <form onSubmit={onSubmit}>
              <div className="flex flex-col h-[calc(100%)] md:w-1/3 md:-ml-20">
                <Inputs
                  dataType={"int"}
                  name={"nuevo_ciclo"}
                  tamañolabel={""}
                  className={"text-right w-1/3"}
                  Titulo={"Nuevo Ciclo: "}
                  type={"text"}
                  requerido={true}
                  errors={errors}
                  register={register}
                  message={"Nuevo Ciclo Requerido"}
                  isDisabled={false}
                  maxLenght={7}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Cambio_Ciclo_Escolar;
