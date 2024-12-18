"use client";
import React, {useCallback, useEffect, useState, useRef, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { debounce } from "@/app/utils/globalfn";
import { useRouter } from "next/navigation";
import Acciones from "@/app/proyectos/components/Acciones";
import Busqueda from "@/app/proyectos/components/Busqueda";
import TablaProyectos from "@/app/proyectos/components/TablaProyectos";
import ModalProyectos from "./components/ModalProyectos";

function Proyectos(){
    const router = useRouter();
    const { data: session, status } = useSession();
    const [busqueda, setBusqueda] = useState({
      nombre: "",
      host: "",
    });
    const [accion, setAccion] = useState("");
    const [currentID, setCurrentId] = useState(0);
    const [basesDeDatos, setBasesDeDatos] = useState({});
    const [basesDeDatosS, setBasesDeDatosS] = useState([]);
    const [basesDeDatosFiltrados, setBasesDeDatosFiltrados] = useState([]);
    const [isLoading, setisLoading] = useState(false);
    const [isLoadingButton, setisLoadingButton] = useState(false);
    const BDRef = useRef(basesDeDatosS);
    const [openModal, setModal] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
      } = useForm({
    defaultValues: {
        id:basesDeDatos.id,
        nombre:basesDeDatos.nombre,
        host:basesDeDatos.host,
        port:basesDeDatos.port,
        database:basesDeDatos.database,
        username:basesDeDatos.username,
        password:basesDeDatos.password,
        clave_propietario:basesDeDatos.clave_propietario,
        proyecto:basesDeDatos.proyecto,
    },});

    useEffect(() => {
        reset({
            id:basesDeDatos.id,
            nombre:basesDeDatos.nombre,
            host:basesDeDatos.host,
            port:basesDeDatos.port,
            database:basesDeDatos.database,
            username:basesDeDatos.username,
            password:basesDeDatos.password,
            clave_propietario:basesDeDatos.clave_propietario,
            proyecto:basesDeDatos.proyecto,
        })
    }, [basesDeDatos, reset]);

    useEffect(() => {
        if (status === "loading" || !session) {
          return;
        }
        //const fetchProyectos = async () => {
        //    try {
        //        setisLoading(true);
        //        const { token } = session.user;
        //        const data = {};  //aqui va la funcion para la busqueda
//
        //        setBasesDeDatosS(data);
        //        setBasesDeDatosFiltrados(data);
        //    } catch (error) {
        //        setError(error.message);
        //    } finally {
        //        setisLoading(false);
        //    } 
        //};
        //fetchProyectos();
    }, [session, status]);


    const Alta = async (event) => {
        setCurrentId("");
        const { token } = session.user;
        reset({
            id:"",
            nombre:"",
            host:"",
            port:"",
            database:"",
            username:"",
            password:"",
            clave_propietario:"",
            proyecto:"",
        })
        setBasesDeDatos({id:""})
        setModal(!openModal);
        setAccion("Alta");
        showModal(true);
        document.getElementById("nombre").focus();
    };

    useEffect(() => {
        BDRef.current = basesDeDatosS
      }, [basesDeDatosS])

    const Buscar = useCallback(() =>  {

         const {nombre, host} = busqueda
         if(nombre === "" && host === ""){
                setBasesDeDatosFiltrados(BDRef.current)
                return;
         }
         const infoFiltrada = BDRef.current.filter((proyecto) =>{
             const coincideNombre = nombre
                 ? proyecto["nombre"].toString().toLowerCase().includes(nombre.toLocaleLowerCase())
                 : true;
             const coincideHost = host
                 ? proyecto["host"].toString().toLowerCase().includes(host.toLocaleLowerCase())
                 : true;
             return coincideNombre && coincideHost
         })
         setBasesDeDatosFiltrados(infoFiltrada);
     }, [busqueda]);

     const debouncedBuscar = useMemo(() => debounce(Buscar, 500), [Buscar]);

     useEffect(() => {
       debouncedBuscar();
       return () => {
         clearTimeout(debouncedBuscar);
       };
     }, [busqueda, debouncedBuscar]);
 
     const limpiarBusqueda = (evt) => {}
       //evt.preventDefault;
       //setBusqueda({ nombre: "", host: "" });
     ;
 
     const handleBusquedaChange = (event) => {
        //event.preventDefault;
       //setBusqueda((estadoPrevio) => ({
       //  ...estadoPrevio,
       //  [event.target.id]: event.target.value,
       //}));
     };

     const onSubmit = handleSubmit(async (data) => {
        event.preventDefault();
        setisLoadingButton(true);
        const dataj = JSON.stringify(data);
        accion === "Alta" ? (data.id = "") : (data.id = currentID);
        let res = null;
        if (accion === "Eliminar") {
          const confirmed = await confirmSwalTarget(
            "¿Desea Continuar?",
            "Se eliminara el Proyecto seleccionado",
            "warning",
            "Aceptar",
            "Cancelar",
            "modal_rpoyectos"
          );
          if (!confirmed) {
            showModal(true);
            setisLoadingButton(false);
            return;  
          }
        }

        res = {} //aqui va la funcion de la ruta
        if (res.satus) {
            if (accion === "Alta") {
                data.id = res.data;
                setCurrentId(data.id);
                const nuevoproyecto = { currentID, ...data };
                  setBasesDeDatosS([...basesDeDatosS, nuevoproyecto]);
            }
            if (accion === "Eliminar" || accion === "Editar") {
                const index = basesDeDatosS.findIndex((proyecto) => proyecto.id === data.id);
                if (index !== -1) {
                    if (accion === "Eliminar") {
                        const BDFiltrados = basesDeDatosS.filter((p) => p.id !== data.id);
                        setBasesDeDatosS(BDFiltrados);
                        setBasesDeDatosFiltrados(BDFiltrados);
                    } else {
                        const BDActualizados = basesDeDatosS.map((p) =>
                        p.id === currentID ? { ...p, ...data } : p);
                        setBasesDeDatosS(BDActualizados);
                        setBasesDeDatosFiltrados(BDActualizados);
                    }
                }
            }
            showSwal(res.alert_title, res.alert_text, res.alert_icon);
            showModal(false);
        } else {
          showSwal(res.alert_title, res.alert_text, res.alert_icon, "modal_proyectos");
        }
        setisLoadingButton(false);
    }); 

    const home = () => {
      router.push("/");
    };

    const showModal = (show) => {
      show
        ? document.getElementById("modal_proyectos").showModal()
        : document.getElementById("modal_proyectos").close();
    };

    if (status === "loading") {
        return (
          <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
        );
      }
    return(
        <>  
            <ModalProyectos
                accion = {accion}
                onSubmit = {onSubmit}
                currentID = {currentID}
                register = {register}
                errors = {errors}
                setBasesDeDatos = {setBasesDeDatos}
                isLoadingButton = {isLoadingButton}
            ></ModalProyectos>

            <div className="container h-[80vh] w-full max-w-screen-xl bg-base-200 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y-hidden">
                <div className="flex flex-col justify-start p-3">
                    <div className="flex flex-wrap md:flex-nowrap items-start md:items-center">
                        <div className="order-2 md:order-1 flex justify-around w-full md:w-auto md:justify-start mb-0 md:mb-0">
                            <Acciones
                                Buscar = {Buscar}
                                Alta = {Alta}
                                home = {home}
                            ></Acciones>
                        </div>
                        <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
                            Proyectos
                        </h1>
                    </div>
                </div>
                <div className="flex flex-col items-center h-full">
                    <div className="w-full max-w-4xl">

                        <Busqueda
                            limpiarBusqueda={limpiarBusqueda}
                            evtBuscar={Buscar}
                            busqueda={busqueda}
                            handleBusquedaChange={handleBusquedaChange}
                        ></Busqueda>
                        
                        {status === "loading" ||
                        (!session ? (
                          <></>
                        ) : (
                            <TablaProyectos
                                basesDeDatosFiltrados = {basesDeDatosFiltrados}
                                isLoading = {isLoading}
                                session = {session}
                                showModal = {showModal}
                                setBasesDeDatos = {setBasesDeDatos}
                                setAccion = {setAccion}
                                setCurrentId = {setCurrentId}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
export default Proyectos;