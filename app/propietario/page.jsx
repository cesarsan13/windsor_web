"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { showSwal } from "@/app/utils/alerts";
import Acciones from "@/app/propietario/components/Acciones";
import Inputs from "./components/Inputs";
import { getPropietario, updatePropietario } from "../utils/api/propietario/propietario";
import ModalTablaConfiguracion from "./components/modalTablaConfiguracion";
import Loading from "../components/loading";

function Propietario() {
    const router = useRouter();
    const { data: session, status } = useSession();

    const [propietarioInfo, setPropietarioInfo] = useState([]);
    const [isLoading, setisLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
      } = useForm({
        defaultValues: {
            nombre_I: propietarioInfo.nombre_I,
            cve_Seguridad_I: propietarioInfo.cve_Seguridad_I,
            max_Busqueda_I: propietarioInfo.max_Busqueda_I,
            numero_Recibo_I: propietarioInfo.numero_Recibo_I,
            numero_Factura_I: propietarioInfo.numero_Factura_I,
            cve_Bonificacion_I: propietarioInfo.cve_Bonificacion_I,
        },
    });

    useEffect(() => {
        if (status === "loading" || !session) {
            return;
        }
        setisLoading(true);
        const fetchData = async () => {
            const {token} = session.user;
            const data = await getPropietario(token);
            setPropietarioInfo(data[0]);
        reset({
            nombre_I: data[0].nombre,
            cve_Seguridad_I: data[0].clave_seguridad,
            max_Busqueda_I: data[0].busqueda_max,
            numero_Recibo_I: data[0].con_recibos,
            numero_Factura_I: data[0].con_facturas,
            cve_Bonificacion_I: data[0].clave_bonificacion,
        });
        setisLoading(false);
        };
        
        fetchData();
    },[reset, session, status]);

    

    const Guardar = handleSubmit(async (data) => {
        let res = null;
        res = await updatePropietario(session.user.token, data);
        if(res.status){
            showSwal(res.alert_title, res.alert_text, res.alert_icon);
        } else {
            showSwal(res.alert_title, res.alert_text, res.alert_icon);
        }
        
    });

    const Configuracion = (show) => {
        show
          ? document.getElementById("modal_Tabla_Configuracion").showModal()
          : document.getElementById("modal_Tabla_Configuracion").close();
        };
    
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
            <ModalTablaConfiguracion/>
            
            <div className="flex flex-col justify-start items-start bg-base-200 shadow-xl rounded-xl dark:bg-slate-700 h-full max-[420px]:w-full w-11/12">
                <div className="w-full py-3">
                    <div className="flex flex-col justify-start p-3 max-[600px]:p-0">
                        <div className="flex flex-wrap items-start md:items-center mx-auto">  
                            <div className="order-2 md:order-1 flex justify-between w-full md:w-auto mb-0">
                            <Acciones
                                  home={home}
                                  Configuracion={Configuracion}
                                  Guardar={Guardar}
                                  //isLoadingFind={isLoadingFind}
                                  //isLoadingPDF={isLoadingPDF}
                                />
                            </div>
                            <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
                                Propietario
                            </h1>
                        </div>
                    </div>
                </div>
                <div className="w-full py-3 flex flex-col gap-y-4">
                    <div className="flex flex-col items-center h-full">
                        {!isLoading ? (
                        <div className="w-full max-w-xl">
                            <div className="lg:w-6/6 md:w-6/6 xs:w-4/6">
                                <Inputs
                                    dataType={"string"}
                                    name={"nombre_I"}
                                    tamañolabel={""}
                                    className={"rounded grow w-full md:w-1/2"}
                                    Titulo={"Nombre: "}
                                    type={"text"}
                                    requerido={true}
                                    isNumero={false}
                                    errors={errors}
                                    register={register}
                                    message={"Nombre requerido"}
                                    maxLenght={50}
                                />
                            </div>
                            <div className="lg:w-4/6 md:w-5/6 xs:w-4/6">
                                <Inputs
                                    dataType={"string"}
                                    name={"cve_Seguridad_I"}
                                    tamañolabel={""}
                                    className={"rounded grow w-full md:w-1/2"}
                                    Titulo={"Cve de Seguridad: "}
                                    type={"text"}
                                    requerido={true}
                                    isNumero={false}
                                    errors={errors}
                                    register={register}
                                    message={"Cve de Seguridad requerido"}
                                    maxLenght={10}
                                />
                            </div>
                            <div className="lg:w-4/6 md:w-4/6 xs:w-4/6">
                                <Inputs
                                    dataType={"int"}
                                    name={"max_Busqueda_I"}
                                    tamañolabel={""}
                                    className={"rounded grow w-full md:w-1/2 text-right"}
                                    Titulo={"Máximo Búsqueda: "}
                                    type={"text"}
                                    requerido={true}
                                    isNumero={true}
                                    errors={errors}
                                    register={register}
                                    message={"Máximo Búsqueda requerido"}
                                    maxLenght={11}
                                />
                            </div>
                            <div className="lg:w-3/6 md:w-4/6 xs:w-4/6">
                                <Inputs
                                    dataType={"int"}
                                    name={"numero_Recibo_I"}
                                    tamañolabel={""}
                                    className={"rounded grow w-full md:w-1/2 text-right"}
                                    Titulo={"Número Recibo: "}
                                    type={"text"}
                                    requerido={true}
                                    isNumero={true}
                                    errors={errors}
                                    register={register}
                                    message={"Número Recibo requerido"}
                                    maxLenght={11}
                                />
                            </div>
                            <div className="lg:w-3/6 md:w-4/6 xs:w-4/6">
                                <Inputs
                                    dataType={"int"}
                                    name={"numero_Factura_I"}
                                    tamañolabel={""}
                                    className={"rounded grow w-full md:w-1/2 text-right"}
                                    Titulo={"Número Factura: "}
                                    type={"text"}
                                    requerido={true}
                                    isNumero={true}
                                    errors={errors}
                                    register={register}
                                    message={"Número Factura requerido"}
                                    maxLenght={11}
                                />
                            </div>
                            <div className="lg:w-3/6 md:w-4/6 xs:w-4/6">
                                <Inputs
                                    dataType={"int"}
                                    name={"cve_Bonificacion_I"}
                                    tamañolabel={""}
                                    className={"rounded grow w-full md:w-1/2 xs:w-2/3 text-right"}
                                    Titulo={"Cve Bonificacion: "}
                                    type={"text"}
                                    requerido={true}
                                    isNumero={true}
                                    errors={errors}
                                    register={register}
                                    message={"Cve Bonificacion requerido"}
                                    maxLenght={10}
                                />
                            </div>
                        </div>
                        ):(
                            <Loading></Loading>
                        )}
                    </div>
                </div>
            </div> 
        </>
    )
}
export default Propietario;
