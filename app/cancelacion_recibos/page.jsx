"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Acciones from "@/app/cancelacion_recibos/components/Acciones";
import { useSession } from "next-auth/react";
import Inputs from "@/app/cancelacion_recibos/components/Inputs";
import { procesoCartera } from "@/app/utils/api/cancelacion_recibo/cancelacion_recibo";
import { showSwal, confirmSwal } from "@/app/utils/alerts";
import { format_Fecha_String, permissionsComponents } from "../utils/globalfn";

function Cancelacion_Recibo() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [isLoading, setisLoading] = useState(false);
    const [permissions, setPermissions] = useState({});
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const date = `${yyyy}-${mm}-${dd}`;
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            fecha: date,
            recibo: 0,
        },
    });

    useEffect(()=>{
        if (status === "loading" || !session) {
            return;
          }
        let {permissions}=session.user
        const es_admin = session.user.es_admin;
        const menuSeleccionado = Number(localStorage.getItem("puntoMenu"));
        const permisos = permissionsComponents(es_admin,permissions,session.user.id,menuSeleccionado)
        setPermissions(permisos)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[session])

    const Proceso = handleSubmit(async (data) => {
        const { token } = session.user;
        setisLoading(true);
        data.recibo = parseInt(data.recibo);
        if (data.recibo === 0) {
            showSwal(
                "Error",
                "Número de recibo invalido.",
                "error"
            );
            setisLoading(false);
            return;
        }
        const year = data.fecha.substring(0, 4);
        const mes = data.fecha.substring(5, 7).padStart(2, '0');
        const dia = data.fecha.substring(8, 10);
        const formatdate = `${year}/${mes}/${dia}`;
        data.fecha = formatdate;
        const res = await procesoCartera(token, data);
        if (res.status) {
            showSwal(res.alert_title, res.alert_text, res.alert_icon);
        } else {
            showSwal(res.alert_title, res.alert_text, res.alert_icon);
        }
        setisLoading(false);
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
                    <div className="flex flex-col justify-start p-3 max-[600px]:p-0">
                        <div className="flex flex-wrap items-start md:items-center mx-auto">
                            <div className="order-2 md:order-1 flex justify-between w-full md:w-auto mb-0">
                                <Acciones
                                    isLoading={isLoading}
                                    Bproceso={Proceso}
                                    home={home}
                                    permiso_alta={permissions.altas}
                                />
                            </div>
                            <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 mx-5">
                            Cancelación de Recibo.
                            </h1>
                        </div>
                    </div>
                </div>
                <div className=" max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4 min-[1300px]:w-1/3 min-[1920px]:w-1/4 w-1/2 mx-auto items-center">
                    <div className="col-span-full md:col-span-full lg:col-span-full">
                        <div className="w-full items-center">
                            <div className="flex items-center">
                                <div className="pr-1">
                                    <Inputs
                                        dataType={"int"}
                                        name={"recibo"}
                                        tamañolabel={"w-full"}
                                        className={"w-[50%] px-2 py-2 text-right"}
                                        Titulo={"Recibo: "}
                                        type={"text"}
                                        requerido={true}
                                        errors={errors}
                                        register={register}
                                        message={"Recibo Requerido"}
                                        isDisabled={false}
                                        maxLenght={7}
                                    />
                                </div>
                                <div>
                                    <Inputs
                                        dataType={"string"}
                                        name={"fecha"}
                                        tamañolabel={"w-full"}
                                        className={"w-[50%] px-2 py-2 text-left"}
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );


}

export default Cancelacion_Recibo;
