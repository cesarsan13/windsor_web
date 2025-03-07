"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Acciones from "@/app/cambio_numero_alumno/components/Acciones";
import { useSession } from "next-auth/react";
import BuscarCat from "../components/BuscarCat";
import Inputs from "@/app/cambio_numero_alumno/components/Inputs";
import { cambiarIdAlumno } from "@/app/utils/api/cambio_numero_alumno/cambio_numero_alumno";
import { showSwal, confirmSwal } from "@/app/utils/alerts";
import { permissionsComponents } from "../utils/globalfn";
function Cambio_Numero_Alumno() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setisLoading] = useState(false);
  const [permissions, setPermissions] = useState({});
  let [alumno, setAlumnoIni] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      numero_nuevo: 0,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const { token, permissions } = session.user;
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

  const onSubmit = handleSubmit(async (data) => {
    let { token, permissions } = session.user;
    if (!alumno.numero) {
      showSwal("Error", "Debe seleccionar un alumno para continuar.", "error");
      return;
    }
    if (data.numero_nuevo <= 0) {
      showSwal(
        "Error",
        "El número nuevo no puede ser menor o igual a cero.",
        "error"
      );
      return;
    }
    data.numero_ant = alumno.numero;
    const confirmed = await confirmSwal(
      "¿Desea Continuar?",
      "Se cambiara el numero del alumno por el ingresado.",
      "warning",
      "Aceptar",
      "Cancelar"
    );
    setisLoading(true);
    if (!confirmed) {
      setisLoading(false);
      return;
    }
    const res = await cambiarIdAlumno(token, data);
    if (res.status) {
      showSwal(res.alert_title, res.alert_text, res.alert_icon);
      setisLoading(false);
      home();
    } else {
      showSwal(res.alert_title, res.alert_text, res.alert_icon);
      setisLoading(false);
    }
  });

  const home = () => {
    router.push("/");
  };

  if (status === "loading") {
    return (
      <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  return (
    <>
      <div className="flex flex-col justify-start items-start bg-base-200 shadow-xl rounded-xl dark:bg-slate-700 h-full max-[420px]:w-full w-11/12">
        <div className="w-full py-3">
          <div className="flex flex-col justify-start p-3 max-[600px]:p-0">
            <div className="flex flex-wrap items-start md:items-center mx-auto">
              <div className="order-2 md:order-1 flex justify-between w-full md:w-auto mb-0">
                <Acciones
                  Alta={onSubmit}
                  home={home}
                  animateLoading={isLoading}
                  permiso_alta={permissions.altas}
                />
              </div>
              <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 mx-5">
                Cambio de Número Alumno.
              </h1>
            </div>
          </div>
        </div>
        <div className="w-full py-3 flex flex-col gap-y-4">
          <div className="max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4 min-[1300px]:w-1/3 min-[1920px]:w-1/4 w-1/2 mx-auto ">
            <div className="flex flex-col max-[499px]:gap-1 gap-4">
              <div className="lg:w-fit md:w-fit">
                <BuscarCat
                  table="alumnos"
                  itemData={[]}
                  fieldsToShow={["numero", "nombre_completo"]}
                  nameInput={["numero", "nombre_completo"]}
                  titulo={"Alumno Numero Anterior: "}
                  setItem={setAlumnoIni}
                  token={session.user.token}
                  modalId="modal_alumnos1"
                  inputWidths={{ first: "100px", second: "300px" }}
                />
              </div>
              <div className="lg:w-fit md:w-fit">
                <Inputs
                  dataType={"int"}
                  name={"numero_nuevo"}
                  tamañolabel={"w-96"}
                  className={"w-auto text-right"}
                  Titulo={"Numero Nuevo del Alumno: "}
                  type={"text"}
                  requerido={true}
                  errors={errors}
                  register={register}
                  message={"Cambio Numero Requerido"}
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

export default Cambio_Numero_Alumno;
