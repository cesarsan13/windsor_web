"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Acciones from "@/app/adicion_productos_cartera/components/Acciones";
import { useSession } from "next-auth/react";
import BuscarCat from "../components/BuscarCat";
import Inputs from "@/app/adicion_productos_cartera/components/Inputs";
import {
  actualizarCartera,
  procesoCartera,
} from "@/app/utils/api/adicion_productos_cartera/adicion_productos_cartera";
import { showSwal } from "@/app/utils/alerts";
import { permissionsComponents } from "../utils/globalfn";

function Adicion_Productos_Cartera() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [articulo, setArticulos] = useState("");
  const [cond_ant, setCondAnt] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [isLoading2, setisLoading2] = useState(false);
  const [permissions, setPermissions] = useState({});
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const date = `${yyyy}-${mm}-${dd}`;

  useEffect(() => {
    const fetchData = async () => {
      const { permissions } = session.user;
      const es_admin = session.user.es_admin;
      const menu_seleccionado = Number(localStorage.getItem("puntoMenu"));
      const permisos = permissionsComponents(
        es_admin,
        permissions,
        session.user.id,
        menu_seleccionado
      );
      setPermissions(permisos);
    };
    if (status === "loading" || !session) {
      return;
    }
    fetchData();
  }, [status]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fecha: date,
      periodo: 0,
      cond_1: 0,
    },
  });
  const ActRef = handleSubmit(async (data) => {
    const { token } = session.user;
    setisLoading(true);
    if (articulo.cond_1 === 0 || articulo.numero === undefined) {
      showSwal("Error: Generacion Cobranza", "Condicion Invalida.", "error");
      setisLoading(false);
      return;
    } else {
      const res = await actualizarCartera(token);
      if (res.status) {
        showSwal(res.alert_title, res.alert_text, res.alert_icon);
        setCondAnt(res.data);
      } else {
        showSwal(res.alert_title, res.alert_text, res.alert_icon);
      }
      setisLoading(false);
    }
  });

  const onSubmitProceso = handleSubmit(async (data) => {
    const { token } = session.user;
    setisLoading2(true);
    if (articulo.cond_1 === 0) {
      showSwal("Error: Generacion Cobranza", "Condicion Invalida.", "error");
      setisLoading2(false);
      return;
    }
    if (data.periodo === 0) {
      showSwal(
        "Error: Generacion Cobranza",
        "Numero de periodo en 0.",
        "error"
      );
      setisLoading2(false);
      return;
    }
    data.cond_ant = cond_ant;
    data.cond_1 = articulo.cond_1;
    const res = await procesoCartera(token, data);
    if (res.status) {
      showSwal(res.alert_title, res.alert_text, res.alert_icon);
      setisLoading2(false);
    } else {
      showSwal(res.alert_title, res.alert_text, res.alert_icon);
      setisLoading2(false);
    }
  });

  // useEffect(() => {
  //     cond_1 = articulo.cond_1;
  //   }, [articulo]);
  useEffect(() => {
    reset({
      cond_1: articulo.cond_1 || 0,
      fecha: date,
      periodo: 0,
    });
  }, [articulo, date, reset]);

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
        <div className="w-full p-3">
          <div className="flex flex-col justify-start p-3 max-[600px]:p-0">
            <div className="flex flex-wrap items-start md:items-center mx-auto">
              <div className="order-2 md:order-1 flex justify-between w-full md:w-auto mb-0">
                <Acciones
                  isLoadingRef={isLoading}
                  isLoadingProc={isLoading2}
                  BRef={ActRef}
                  Bproceso={onSubmitProceso}
                  home={home}
                  permiso_alta={permissions.altas}
                />
              </div>
              <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
                Proceso de Adición a Cobranza.
              </h1>
            </div>
          </div>
        </div>
        <div className="flex flex-col  items-center h-full w-full">
          <div className="w-full max-w-2xl">
            <div class="min-[639px]:flex min-[639px]:space-x-4">
              <BuscarCat
                table="productos_cond"
                itemData={[]}
                fieldsToShow={["numero", "descripcion"]}
                nameInput={["numero", "descripcion"]}
                titulo={"Articulos: "}
                setItem={setArticulos}
                token={session.user.token}
                modalId="modal_articulos1"
                alignRight={"text-right"}
                inputWidths={{
                  contdef: "150px",
                  first: "70px",
                  second: "120px",
                }}
              />
              <Inputs
                dataType={"int"}
                name={"cond_1"}
                tamañolabel={""}
                className={"w-2/6 text-right"}
                Titulo={"Cond 1: "}
                type={"text"}
                requerido={false}
                errors={errors}
                register={register}
                message={"Cond 1 Requerida"}
                isDisabled={true}
                maxLenght={7}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mt-4">
              <div className="md:col-span-1">
                <Inputs
                  dataType={"string"}
                  name={"fecha"}
                  tamañolabel={"w-full"}
                  className={"w-4/5"}
                  Titulo={"Fecha: "}
                  type={"date"}
                  requerido={true}
                  errors={errors}
                  register={register}
                  message={"Fecha Requerido"}
                  isDisabled={false}
                  maxLenght={7}
                />
              </div>
              <div className="md:col-span-1">
                <Inputs
                  dataType={"int"}
                  name={"periodo"}
                  tamañolabel={""}
                  className={"w-2/5 text-right"}
                  Titulo={"Periodo: "}
                  type={"text"}
                  requerido={true}
                  errors={errors}
                  register={register}
                  message={"Periodo Requerido"}
                  isDisabled={false}
                  maxLenght={7}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Adicion_Productos_Cartera;
