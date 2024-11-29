"use client";
import { getConfiguracion, siguienteConfiguracion, createConfiguracion, updateConfiguracion } from "@/app/utils/api/propietario/propietario";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import TablaConfiguracion from "./TablaConfiguracion";
import Acciones from "./AccionesConfig";
import ModalConfiguracion from "@/app/propietario/components/modalConfiguracion";
import { useForm } from "react-hook-form";
import { showSwal } from "@/app/utils/alerts";

function ModalTablaConfiguracion({
}){
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setisLoading] = useState(false);
  const [datasConfiguracion, setDatasConfiguracion] = useState([]);
  const [dataConfiguracion, setDataConfiguracion] = useState({});
  const [dataConfiguracionFiltrados, setDataConfiguracionFiltrados] = useState(null);
  const [isLoadingAlta, setIsLoadingAlta] = useState(false);
  const [accion, setAccion] = useState("");
  const [currentID, setCurrentId] = useState("");
  const [isLoadingButton, setisLoadingButton] = useState(false);
  const [openModal, setModal] = useState(false);


  useEffect(() => {
    if (status === "loading" || !session) {
      return;
    }
    setisLoading(true);
    const fetchData = async () => {
      const {token} = session.user;
      const data = await getConfiguracion(token);
      setDatasConfiguracion(data);
      //setDataConfiguracion(data);
      setDataConfiguracionFiltrados(data);
      setisLoading(false);
    };
    fetchData();
    
  },[session, status])

  const {
    register,
    handleSubmit,
    reset,
    formState: {errors},
  }= useForm({
    defaultValues: {
      numero_configuracion: dataConfiguracion.numero_configuracion,
      descripcion_configuracion: dataConfiguracion.descripcion_configuracion,
      valor_configuracion: dataConfiguracion.valor_configuracion,
      texto_configuracion: dataConfiguracion.texto_configuracion,
    },
  });

  useEffect(() => {
   reset({
     numero_configuracion: dataConfiguracion.numero_configuracion,
     descripcion_configuracion: dataConfiguracion.descripcion_configuracion,
     valor_configuracion: dataConfiguracion.valor_configuracion,
     texto_configuracion: dataConfiguracion.texto_configuracion,
   });
  }, [dataConfiguracion, reset]);

  const Alta = async (event) => {
    setCurrentId("");
    reset({
      numero_configuracion: "",
      descripcion_configuracion: "",
      valor_configuracion: "",
      texto_configuracion: "",
    });
    let idSig = await siguienteConfiguracion(session.user.token);
    idSig = Number(idSig) + 1;
    setCurrentId(idSig);
    setDataConfiguracion({numero_configuracion: idSig});
    setModal(!openModal);
    setAccion("Alta");
    showModal(true);
  };

  const showModal = (show) => {
    show
      ? document.getElementById("modal_Configuracion").showModal()
      : document.getElementById("modal_Configuracion").close();
  };

  

  const onSubmitModal = handleSubmit(async (data) => {
    setisLoadingButton(true);
    data.id = currentID;
    const {token} = session.user;
    let res = null;
    if(accion === "Alta"){
      res = await createConfiguracion(token, data);
    } else if (accion === "Editar"){
      res = await updateConfiguracion(token, data);
    }
    if(res.status){
      if (accion === "Alta") {
        const nuevaConfiguracion = {...data };
        setDatasConfiguracion([...datasConfiguracion, nuevaConfiguracion]);
        setDataConfiguracionFiltrados([...dataConfiguracionFiltrados, nuevaConfiguracion]);
      } else 
        if (accion === "Editar") {
          const cActualizadas = datasConfiguracion.map((c) =>
            c.numero_configuracion === currentID ? { ...c, ...data } : c
          );
          setDatasConfiguracion(cActualizadas);
          setDataConfiguracionFiltrados(cActualizadas);
        }
      showSwal(res.alert_title, res.alert_text, res.alert_icon, "modal_Tabla_Configuracion");
      showModal(false);
    } else {
      showSwal(res.alert_title, res.alert_text, "error", "modal_Configuracion");
    }
      setisLoadingButton(false);
  });

    return(
        <>
        <ModalConfiguracion
          accion = {accion}
          onSubmit = {onSubmitModal}
          register = {register}
          currentID={currentID}
          errors = {errors}
          setDataConfiguracion = {setDataConfiguracion}
          isLoadingButton={isLoadingButton}
        />

          <dialog id="modal_Tabla_Configuracion" className="modal">
            <div className="modal-box w-full max-w-7xl bg-base-200">
              <div className="sticky -top-6 flex justify-between items-center bg-base-200 w-full h-10 z-10 mb-5">
                <h2 className="font-bold text-lg text-neutral-600 dark:text-white"> Configuracion </h2>
                  <div className=" tooltip flex space-x-2 items-center">
                    <Acciones
                      Alta = {Alta}
                    />
                    <button
                      className="btn btn-sm btn-circle btn-ghost bg-base-200 dark:bg-[#1d232a] text-neutral-600 dark:text-white"
                      onClick={(event) => {
                        event.preventDefault();
                        document.getElementById("modal_Tabla_Configuracion").close();
                      }}
                    >
                      ✕
                    </button>
                  </div>
              </div>
              <div className="flex flex-col items-center h-full">
                <TablaConfiguracion
                  session = {session}
                  isLoading = {isLoading}
                  dataConfiguracionFiltrados = {dataConfiguracionFiltrados}
                  showModal = {showModal}
                  setDataConfiguracion = {setDataConfiguracion}
                  setAccion = {setAccion}
                  setCurrentId={setCurrentId}
                />
              </div>
          </div>
        </dialog>
      </>
    );
}
export default ModalTablaConfiguracion;