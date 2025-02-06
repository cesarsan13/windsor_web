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
    };
    fetchData();
  }, [session, status]);  
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
    <div className="flex flex-col justify-start items-start bg-base-200 shadow-xl rounded-xl dark:bg-slate-700 h-full max-[420px]:w-full w-11/12">
        <div className="w-full py-3">
          {/* Fila de la cabecera de la pagina */}
          <div className="flex flex-col justify-start p-3 max-[600px]:p-0">
            <div className="flex flex-wrap items-start md:items-center mx-auto">
              <div className="order-2 md:order-1 flex justify-between w-full md:w-auto mb-0">
                <Acciones
                  Alta={onSubmit}
                  home={home}
                  permiso_alta={permissions.altas}
                />
              </div>
              <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 mx-5">
                Cambio de Ciclo Escolar.
              </h1>
            </div>
          </div>
        </div>
        <div className="w-full py-3 flex flex-col gap-y-4">
          <div className=" max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4 min-[1300px]:w-1/3 min-[1920px]:w-1/4 w-1/2 mx-auto space-y-4">
            <div className="flex flex-row max-[499px]:gap-1 gap-4">
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
          </div>
        </div>
      </div>
    </>
  );
}

export default Cambio_Ciclo_Escolar;
