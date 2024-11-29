"use client";
import { getConfiguracion } from "@/app/utils/api/propietario/propietario";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import TablaConfiguracion from "./TablaConfiguracion";
import Acciones from "./AccionesConfig";
import ModalConfiguracion from "./ModalConfiguracion";
import { useForm } from "react-hook-form";

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
      setDataConfiguracion(data);
      setDataConfiguracionFiltrados(data);
      setisLoading(false);
    };
    fetchData();
    
  },[session, status])

  const Alta = () => {
    setCurrentId("");
    reset({
      numero_configuracion: dataConfiguracion.numero_configuracion,
      descripcion_configuracion: dataConfiguracion.descripcion_configuracion,
      valor_configuracion: dataConfiguracion.valor_configuracion,
      texto_configuracion: dataConfiguracion.texto_configuracion,
    });
    setDataConfiguracion({numero_configuracion: ""});
    setModal(!openModal);
    setAccion("Alta");
    showModal(true);
  };

  const showModal = (show) => {
    show
      ? document.getElementById("modal_Configuracion").showModal()
      : document.getElementById("modal_Configuracion").close();
  };

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

  const onSubmitModal = handleSubmit(async (data) => {

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
            <div className="modal-box w-full max-w-7xl h-full bg-base-200">
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